FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm install
COPY . .
RUN npm run build
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S creemy && adduser -S creemy -G creemy
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm install --omit=dev --workspace=@creemy/api
COPY --from=build /app/apps/api/dist apps/api/dist
USER creemy
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD node -e "fetch('http://127.0.0.1:4000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","apps/api/dist/server.js"]
