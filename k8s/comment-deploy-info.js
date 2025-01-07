#!/usr/bin/env node --experimental-modules
/* eslint-disable no-console */

/**
 * @typedef {object} MergeRequest
 * @property {string} target_branch - The target branch of the merge request.
 * @property {string} state - The state of the merge request (e.g., "opened").
 * @property {number} iid - The internal ID of the merge request.
 */

/**
 * @typedef {object} CommentObject
 * @property {number} id - The ID of the comment.
 * @property {string} body - The content of the comment.
 * @property {{ username: string }} author - The author of the comment.
 */

/**
 * @typedef {object} PipelineUser
 * @property {{ username: string }} user - The user object containing the username of the pipeline trigger user.
 */

/**
 * Type guard for validating a merge request object.
 * @param {any} obj - The object to validate.
 * @returns {obj is MergeRequest} - Whether the object is a valid MergeRequest.
 */
const isMergeRequest = (obj) =>
  obj &&
  typeof obj.target_branch === 'string' &&
  typeof obj.state === 'string' &&
  typeof obj.iid === 'number';

/**
 * Type guard for validating a comment object.
 * @param {any} obj - The object to validate.
 * @returns {obj is CommentObject} - Whether the object is a valid Comment.
 */
const isComment = (obj) =>
  obj &&
  typeof obj.id === 'number' &&
  typeof obj.body === 'string' &&
  obj.author &&
  typeof obj.author.username === 'string';

/**
 * Type guard for validating a pipeline user object.
 * @param {any} obj - The object to validate.
 * @returns {obj is PipelineUser} - Whether the object is a valid PipelineUser.
 */
const isPipelineUser = (obj) =>
  obj && obj.user && typeof obj.user.username === 'string';

(async () => {
  try {
    // Validate environment variables
    const {
      CI_API_V4_URL: apiUrl,
      CI_JOB_TOKEN: token,
      CI_PROJECT_ID: projectId,
      CI_COMMIT_REF_SLUG: refSlug,
      CI_PIPELINE_ID: pipelineId,
      COMMENT_BODY: commentBody,
    } = process.env;

    if (
      !apiUrl ||
      !token ||
      !projectId ||
      !refSlug ||
      !pipelineId ||
      !commentBody
    ) {
      console.error('Error: Missing required environment variables.');
      process.exit(1);
    }

    /**
     * Normalize branch name to match CI_COMMIT_REF_SLUG format.
     * @param {string} branchName - The branch name to normalize.
     * @returns {string} The normalized branch name.
     */
    const normalizeBranchName = (branchName) =>
      branchName.replaceAll(/[/._]/g, '-');

    /**
     * Make a request to the GitLab API.
     * @param {string} endpoint - API endpoint to call.
     * @param {RequestInit} [init={}] - Request options (e.g., method, headers, body).
     * @returns {Promise<any>} The JSON response from the API.
     * @throws Will throw an error if the response status is not OK.
     */
    const fetchGitLabAPI = async (endpoint, init = {}) => {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        headers: {
          'PRIVATE-TOKEN': token,
          'content-type': 'application/json',
          ...init.headers,
        },
        ...init,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${errorData}`,
        );
      }

      return response.json();
    };

    /**
     * Fetch open merge requests for the project.
     * @returns {Promise<MergeRequest[]>} List of open merge requests.
     */
    const fetchMergeRequests = async () => {
      const data = await fetchGitLabAPI(
        `/projects/${projectId}/merge_requests?state=opened&scope=all&order_by=updated_at&sort=desc`,
      );
      return Array.isArray(data) &&
        data.every((element) => isMergeRequest(element))
        ? data
        : [];
    };

    /**
     * Fetch the username of the pipeline trigger user.
     * @returns {Promise<string>} The username of the pipeline trigger user.
     */
    const fetchPipelineUser = async () => {
      const data = await fetchGitLabAPI(
        `/projects/${projectId}/pipelines/${pipelineId}`,
      );
      if (!isPipelineUser(data)) {
        throw new Error('Invalid pipeline user data');
      }
      return data.user.username;
    };

    /**
     * Fetch comments for a specific merge request.
     * @param {number} mrId - Merge request ID.
     * @returns {Promise<CommentObject[]>} List of comments for the merge request.
     */
    const fetchComments = async (mrId) => {
      const data = await fetchGitLabAPI(
        `/projects/${projectId}/merge_requests/${mrId}/notes`,
      );
      return Array.isArray(data) && data.every((element) => isComment(element))
        ? data
        : [];
    };

    /**
     * Delete a comment from a merge request.
     * @param {number} mrId - Merge request ID.
     * @param {number} commentId - Comment ID to delete.
     * @returns {Promise<void>}
     */
    const deleteComment = async (mrId, commentId) => {
      await fetchGitLabAPI(
        `/projects/${projectId}/merge_requests/${mrId}/notes/${commentId}`,
        { method: 'DELETE' },
      );
      console.log(`Deleted comment with ID: ${commentId}`);
    };

    /**
     * Post a new comment on a merge request.
     * @param {number} mrId - Merge request ID.
     * @param {string} body - The body of the comment.
     * @returns {Promise<void>}
     */
    const postComment = async (mrId, body) => {
      await fetchGitLabAPI(
        `/projects/${projectId}/merge_requests/${mrId}/notes`,
        { body: JSON.stringify({ body }), method: 'POST' },
      );
      console.log('Comment posted successfully.');
    };

    const commentHeadline = commentBody.split('\n').at(0) ?? '';

    // Fetch merge requests and pipeline user
    const [mergeRequests, pipelineUser] = await Promise.all([
      fetchMergeRequests(),
      fetchPipelineUser(),
    ]);

    // Find the matching merge request
    const matchingMR = mergeRequests.find(
      (mr) =>
        normalizeBranchName(mr.target_branch) === refSlug &&
        mr.state === 'opened',
    );

    if (!matchingMR) {
      console.log(`No matching merge request found for branch '${refSlug}'.`);
      return;
    }

    console.log(
      `Found merge request for branch '${refSlug}': ${matchingMR.iid}`,
    );

    // Fetch and delete matching comments
    const comments = await fetchComments(matchingMR.iid);
    const matchingComments = comments.filter(
      (comment) =>
        comment.body.startsWith(commentHeadline) &&
        comment.author.username === pipelineUser,
    );

    await Promise.all(
      matchingComments.map((comment) =>
        deleteComment(matchingMR.iid, comment.id),
      ),
    );

    // Post the new comment
    await postComment(matchingMR.iid, commentBody);
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
})();
