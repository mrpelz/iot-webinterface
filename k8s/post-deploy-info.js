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
      DOMAIN: domain,
      IOT_MONOLITH_VERSION: iotMonolithVersion,
      NAMESPACE: namespace,
      RANCHER_CLUSTER: rancherCluster,
    } = process.env;
    if (
      !domain ||
      !namespace ||
      !iotMonolithVersion ||
      !projectUrl ||
      !rancherCluster ||
      !tagMessage ||
      !version
    ) {
      return;
    }

    console.info({
      CI_COMMIT_TAG: version,
      CI_COMMIT_TAG_MESSAGE: tagMessage,
      CI_PROJECT_URL: projectUrl,
      DOMAIN: domain,
      IOT_MONOLITH_VERSION: iotMonolithVersion,
      NAMESPACE: namespace,
      RANCHER_CLUSTER: rancherCluster,
    });

    const iotMonolithNamespace = `iot-iot-monolith-${iotMonolithVersion}`;

    const [body, headline] = getProcessedBody(`
      ## Prerelease Deployed on k8s / \`${rancherCluster}\`

      Release based on [tag "${version}"](${projectUrl}/-/tags/${version}) has been deployed to [namespace "${namespace}" on cluster \`${rancherCluster}\`](https://rancher.lan.wurstsalat.cloud/dashboard/c/${rancherCluster}/explorer/apps.deployment/${namespace}/iot-webinterface).

      [visit live deployment](https://${namespace}.${domain})

      ### API-Info

      This prerelease is set up to proxy \`/api\` to \`iot-monolith@${iotMonolithVersion}\`.
        * version \`latest\` is a special case, with [the proxy upstream pointing to \`prod\`](http://${iotMonolithNamespace}.rancher-iot.lan.wurstsalat.cloud).
        * other versions utilize k8s [namespace "${iotMonolithNamespace}" on same cluster \`${rancherCluster}\` as prerelease](https://rancher.lan.wurstsalat.cloud/dashboard/c/${rancherCluster}/explorer/apps.deployment/${iotMonolithNamespace}/iot-monolith) as [the upstream](http://${iotMonolithNamespace}.${domain}).

      [\`/__proxy-api-hostname\`](https://${namespace}.${domain}/__proxy-api-hostname)
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
