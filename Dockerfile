FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY web/package.json web/package-lock.json ./web/
RUN npm --prefix web ci
COPY web ./web
RUN npm --prefix web run db:generate && npm --prefix web run build

FROM build AS migrate
CMD ["npm", "--prefix", "web", "exec", "prisma", "migrate", "deploy"]

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/web/.next/standalone ./
COPY --from=build /app/web/.next/static ./.next/static
COPY --from=build /app/web/node_modules ./node_modules
COPY --from=build /app/web/prisma ./prisma
EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node server.js"]
