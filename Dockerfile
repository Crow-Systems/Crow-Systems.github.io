FROM oven/bun:1 AS build
ARG SITE_URL
ARG PUBLIC_UMAMI_HOST
ARG UMAMI_WEBSITE_ID
ARG UMAMI_RECORDER_WEBSITE_ID
ENV SITE_URL=$SITE_URL \
    PUBLIC_UMAMI_HOST=$PUBLIC_UMAMI_HOST \
    UMAMI_WEBSITE_ID=$UMAMI_WEBSITE_ID \
    UMAMI_RECORDER_WEBSITE_ID=$UMAMI_RECORDER_WEBSITE_ID
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM caddy:2.11.4-alpine
RUN adduser -D -u 1000 caddy
COPY --from=build /app/dist /srv
COPY deploy/Caddyfile /etc/caddy/Caddyfile
USER caddy
EXPOSE 80
