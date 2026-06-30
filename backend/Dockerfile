# MediChain backend
FROM node:20-alpine

WORKDIR /app

# Install only production deps first (better layer caching).
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

# Drop privileges.
RUN addgroup -S app && adduser -S app -G app \
    && chmod +x docker-entrypoint.sh \
    && chown -R app:app /app
USER app

ENV NODE_ENV=production
EXPOSE 5050

ENTRYPOINT ["./docker-entrypoint.sh"]
