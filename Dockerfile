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
if [ $IOT_MONOLITH_VERSION = "latest" ]; then \
  sed -e "s#{PACKAGE_SPEC}#${PACKAGE_SPEC}#g" \
      -e "s#{IOT_MONOLITH_SCHEMA}#https#g" \
      -e "s#{IOT_MONOLITH_HOSTNAME}#iot-iot-monolith-latest.rancher-iot.lan.wurstsalat.cloud#g" "nginx_template.conf" >"nginx.conf"; else \
  sed -e "s#{PACKAGE_SPEC}#${PACKAGE_SPEC}#g" \
      -e "s#{IOT_MONOLITH_SCHEMA}#http#g" \
      -e "s#{IOT_MONOLITH_HOSTNAME}#iot-monolith-http.iot-iot-monolith-${IOT_MONOLITH_VERSION}.svc.cluster.local#g" "nginx_template.conf" >"nginx.conf"; fi && \
rm "${PACKAGE_BUNDLE}"

FROM nginx:stable

COPY --from=build /home/node/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /home/node/dist /usr/share/nginx/html
