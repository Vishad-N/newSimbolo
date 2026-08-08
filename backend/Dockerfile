FROM node:22-alpine AS build

WORKDIR /usr/src/app
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simbolo?schema=public"

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json

RUN npm ci

COPY backend ./backend

RUN npm run prisma:generate --workspace backend
RUN npm run build --workspace backend

FROM node:22-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV="production"
ENV PORT="3001"

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
RUN npm ci --omit=dev --workspace backend --include-workspace-root=false && npm cache clean --force

COPY --from=build --chown=nestjs:nodejs /usr/src/app/backend/prisma ./backend/prisma
COPY --from=build --chown=nestjs:nodejs /usr/src/app/backend/dist ./backend/dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma

USER nestjs

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD wget --no-verbose --tries=1 --spider "http://127.0.0.1:${PORT}/api/v1/health/live" || exit 1

CMD ["node", "backend/dist/main.js"]
