FROM node:lts as build

WORKDIR /home/node
USER node

ENV NODE_ENV="production"

ARG PACKAGE_SPEC

RUN --mount="type=secret,id=.npmrc,target=/kaniko/.npmrc" \
export NPM_CONFIG_USERCONFIG="/kaniko/.npmrc" && \
export PACKAGE_BUNDLE="$(npm pack --silent "${PACKAGE_SPEC}")" && \
\
tar --strip-components=1 -xf "${PACKAGE_BUNDLE}" "package/" && \
rm "${PACKAGE_BUNDLE}"

FROM nginx:stable

COPY --from=build /home/node/dist /usr/share/nginx/html
