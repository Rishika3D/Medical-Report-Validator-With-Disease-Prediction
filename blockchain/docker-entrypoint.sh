#!/bin/sh
set -e

# Start a Hardhat JSON-RPC node, wait for it, deploy the contract, export the
# manifest, then keep the node in the foreground.
echo "Starting Hardhat node on 0.0.0.0:8545..."
npx hardhat node --hostname 0.0.0.0 > /tmp/hardhat-node.log 2>&1 &
NODE_PID=$!

echo "Waiting for RPC..."
i=0
until nc -z localhost 8545 2>/dev/null; do
  sleep 1
  i=$((i + 1))
  if [ "$i" -ge 60 ]; then
    echo "Hardhat node failed to start" >&2
    cat /tmp/hardhat-node.log >&2
    exit 1
  fi
done
sleep 2

echo "Deploying ReportValidator..."
npx hardhat run scripts/deploy-and-export.js --network localhost

echo "Chain ready. Streaming node logs."
tail -f /tmp/hardhat-node.log &
wait "$NODE_PID"
