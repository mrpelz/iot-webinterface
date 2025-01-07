#!/bin/bash

if [[ -z "$COMMENT_BODY" ]]; then
  echo "Error: COMMENT_BODY is not set."
  exit 1
fi

COMMENT_HEADLINE=$(echo "$COMMENT_BODY" | head -n 1)

response=$(curl --silent --header "PRIVATE-TOKEN: $CI_JOB_TOKEN" \
  "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests?state=opened&scope=all&order_by=updated_at&sort=desc")

matching_mr=$(echo "$response" | jq -r --arg ref "$VERSION_TAG" \
  '.[] | select(($ref == ($.target_branch | gsub("[/._]"; "-"))) and .state == "opened") | .iid' | head -n 1)

if [[ -n "$matching_mr" ]]; then
  echo "Found merge request for branch '$VERSION_TAG': $matching_mr"

  comments=$(curl --silent --header "PRIVATE-TOKEN: $CI_JOB_TOKEN" \
    "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$matching_mr/notes")

  pipeline_user=$(curl --silent --header "PRIVATE-TOKEN: $CI_JOB_TOKEN" \
    "$CI_API_V4_URL/projects/$CI_PROJECT_ID/pipelines/$CI_PIPELINE_ID" | jq -r '.user.username')

  echo "$comments" | jq -r --arg headline "$COMMENT_HEADLINE" --arg username "$pipeline_user" \
    '.[] | select(.body | startswith($headline)) | select(.author.username == $username) | .id' | while read -r comment_id; do
    echo "Deleting existing comment (ID: $comment_id)..."
    curl --silent --request DELETE --header "PRIVATE-TOKEN: $CI_JOB_TOKEN" \
      "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$matching_mr/notes/$comment_id" \
      && echo "Deleted comment with ID: $comment_id"
  done

  echo "Posting new comment to merge request $matching_mr..."
  curl --silent --request POST --header "PRIVATE-TOKEN: $CI_JOB_TOKEN" \
    --header "Content-Type: application/json" \
    --data "{\"body\": \"$COMMENT_BODY\"}" \
    "$CI_API_V4_URL/projects/$CI_PROJECT_ID/merge_requests/$matching_mr/notes" \
    && echo "Comment posted successfully."
else
  echo "No matching merge request found for branch '$VERSION_TAG'."
fi
