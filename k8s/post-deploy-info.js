#!/usr/bin/env -S node --experimental-modules
/* eslint-disable no-console */

import {
  fetchMergeRequests,
  fetchPipelineUser,
  getEnvironment,
  getFetchGitlab,
  getProcessedBody,
  getSlug,
  replaceComments,
  // @ts-ignore
} from '@mrpelz/boilerplate-common/scripts/ci/utils.js';

(async () => {
  try {
    const environment = getEnvironment();
    const fetchGitlab = getFetchGitlab(environment);

    const {
      CI_COMMIT_TAG_MESSAGE: tagMessage,
      CI_COMMIT_TAG: version,
      CI_PROJECT_URL: projectUrl,
      IOT_MONOLITH_VERSION: iotMonolithVersion,
      NAMESPACE: namespace,
    } = process.env;
    if (
      !namespace ||
      !iotMonolithVersion ||
      !projectUrl ||
      !tagMessage ||
      !version
    ) {
      return;
    }

    console.info({
      CI_COMMIT_TAG: version,
      CI_COMMIT_TAG_MESSAGE: tagMessage,
      CI_PROJECT_URL: projectUrl,
      IOT_MONOLITH_VERSION: iotMonolithVersion,
      NAMESPACE: namespace,
    });

    const iotMonolithNamespace = `iot-iot-monolith-${iotMonolithVersion}`;

    const [body, headline] = getProcessedBody(`
      ## Prerelease Deployed on k8s

      Release based on [tag "${version}"](${projectUrl}/-/tags/${version}) has been deployed to [namespace "${namespace}"](https://rancher.lan.wurstsalat.cloud/dashboard/c/local/explorer/apps.deployment/${namespace}/iot-webinterface).

      [visit live deployment](https://${namespace}.rancher.lan.wurstsalat.cloud)

      ### API-Info

      This prerelease is set up to proxy \`/api\` to \`iot-monolith@${iotMonolithVersion}\` deployment in k8s [namespace "${iotMonolithNamespace}"](https://rancher.lan.wurstsalat.cloud/dashboard/c/local/explorer/apps.deployment/${iotMonolithNamespace}/iot-monolith).

      [visit \`/api\`](https://${iotMonolithNamespace}.rancher.lan.wurstsalat.cloud/api)
    `);

    const [projectMergeRequests, pipelineUsername] = await Promise.all([
      fetchMergeRequests(fetchGitlab, environment.projectId),
      fetchPipelineUser(
        fetchGitlab,
        environment.projectId,
        environment.pipelineId,
      ),
    ]);

    const matchingMergeRequests = projectMergeRequests.filter(
      // @ts-ignore
      ({ source_branch }) => getSlug(source_branch) === tagMessage,
    );

    console.info(
      `Found ${matchingMergeRequests.length} matching merge request(s).`,
    );

    await Promise.all(
      // @ts-ignore
      matchingMergeRequests.map(async (matchingMergeRequest) =>
        replaceComments(
          fetchGitlab,
          environment.projectId,
          pipelineUsername,
          matchingMergeRequest.iid,
          headline,
          body,
        ),
      ),
    );
  } catch (error) {
    console.error(new Error('Error.', { cause: error }));
    process.exit(1);
  }
})();
