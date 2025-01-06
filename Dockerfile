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
export IOT_MONOLITH_VERSION="$(npm --silent pkg get "dependencies.@iot/iot-monolith" | sed -nr 's/^"(.+)"$/\1/p')" && \
sed -e "s#{IOT_MONOLITH_HOSTNAME}#iot-monolith.iot-iot-monolith-${IOT_MONOLITH_VERSION}.svc.cluster.local#g" "nginx_template.conf" >"nginx.conf" && \
rm "${PACKAGE_BUNDLE}"

FROM nginx:stable

COPY --from=build /home/node/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /home/node/dist /usr/share/nginx/html
