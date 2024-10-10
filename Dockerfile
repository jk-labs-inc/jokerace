FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY . .
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_R2_ACCOUNT_ID
ARG NEXT_PUBLIC_R2_ACCESS_KEY_ID
ARG NEXT_PUBLIC_R2_SECRET_ACCESS_KEY
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ARG NEXT_PUBLIC_MERKLE_TREES_BUCKET
ARG NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET
ARG NEXT_PUBLIC_ETHERSCAN_KEY
ARG NEXT_PUBLIC_QUICKNODE_SLUG
ARG NEXT_PUBLIC_QUICKNODE_KEY
ARG NEXT_PUBLIC_ALCHEMY_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL 
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_R2_ACCOUNT_ID=$NEXT_PUBLIC_R2_ACCOUNT_ID
ENV NEXT_PUBLIC_R2_ACCESS_KEY_ID=$NEXT_PUBLIC_R2_ACCESS_KEY_ID
ENV NEXT_PUBLIC_R2_SECRET_ACCESS_KEY=$NEXT_PUBLIC_R2_SECRET_ACCESS_KEY
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ENV NEXT_PUBLIC_MERKLE_TREES_BUCKET=$NEXT_PUBLIC_MERKLE_TREES_BUCKET
ENV NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET=$NEXT_PUBLIC_IMAGE_UPLOAD_BUCKET
ENV NEXT_PUBLIC_ETHERSCAN_KEY=$NEXT_PUBLIC_ETHERSCAN_KEY
ENV NEXT_PUBLIC_QUICKNODE_SLUG=$NEXT_PUBLIC_QUICKNODE_SLUG
ENV NEXT_PUBLIC_QUICKNODE_KEY=$NEXT_PUBLIC_QUICKNODE_KEY
ENV NEXT_PUBLIC_ALCHEMY_KEY=$NEXT_PUBLIC_ALCHEMY_KEY

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
