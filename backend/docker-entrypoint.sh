#!/bin/sh
set -e

# In the Docker stack the blockchain service writes a deployment manifest to a
# shared volume. Pick up the contract address, deployer key and ABI from it so
# the backend is configured automatically. (No-op for cloud/standalone runs.)
DEPLOYMENT_FILE="${DEPLOYMENT_FILE:-/shared/deployment.json}"

if [ "${WAIT_FOR_CHAIN:-false}" = "true" ]; then
  echo "Waiting for blockchain deployment manifest at ${DEPLOYMENT_FILE}..."
  i=0
  while [ ! -f "$DEPLOYMENT_FILE" ] && [ "$i" -lt 60 ]; do
    sleep 2
    i=$((i + 1))
  done
fi

if [ -f "$DEPLOYMENT_FILE" ]; then
  export CONTRACT_ADDRESS="$(node -e "console.log(require('$DEPLOYMENT_FILE').contractAddress)")"
  export PRIVATE_KEY="$(node -e "console.log(require('$DEPLOYMENT_FILE').privateKey)")"
  export CONTRACT_ABI_PATH="$(dirname "$DEPLOYMENT_FILE")/ReportValidator.json"
  echo "Loaded contract ${CONTRACT_ADDRESS} from deployment manifest."
fi

# Apply DB schema (idempotent).
echo "Running database migration..."
node db/migrate.js || echo "Migration skipped/failed (continuing)."

exec node index.js
