# MediChain local Hardhat chain (development / docker-compose only)
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .

# Compile so the ABI/artifacts are baked into the image.
RUN npx hardhat compile

RUN chmod +x docker-entrypoint.sh

EXPOSE 8545
ENTRYPOINT ["./docker-entrypoint.sh"]
