FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json

RUN npm ci

COPY backend ./backend

RUN npm run prisma:generate --workspace backend
RUN npm run build --workspace backend

FROM node:22-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV="production"

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
RUN npm ci --omit=dev --workspace backend --include-workspace-root=false && npm cache clean --force

COPY --from=build /usr/src/app/backend/prisma ./backend/prisma
COPY --from=build /usr/src/app/backend/dist ./backend/dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Let Railway dynamically assign and check the port

CMD ["node", "backend/dist/main.js"]
