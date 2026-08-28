#!/usr/bin/env -S node --experimental-modules

import { prerelease } from 'semver';

const {
  GIT_BRANCH: gitBranch,
  PKG_NAME: pkgName,
  PKG_VERSION: pkgVersion,
} = process.env;

export let isLocal = false;
export let isPrerelease = false;
export let isProd = false;

export const slug = (() => {
  if (!pkgName || !pkgVersion) return undefined;

  const pkgName_ = pkgName.replaceAll(/(?:\W|_)/g, '-');

  if (gitBranch) {
    isLocal = true;

    if (gitBranch === 'main') return `${pkgName_}-local-main`;

    return `${pkgName_}-local-${gitBranch.replaceAll(/(?:\W|_)/g, '-')}`;
  }

  const [prereleaseName] = prerelease(pkgVersion) ?? [];
  if (prereleaseName) {
    isPrerelease = true;

    return `${pkgName_}-deploy-pre-${prereleaseName}`;
  }

  isProd = true;
  return `${pkgName_}-deploy-main`;
})();

// eslint-disable-next-line no-console
console.log(slug);
