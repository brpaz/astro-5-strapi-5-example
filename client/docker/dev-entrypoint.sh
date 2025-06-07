#!/usr/bin/env sh

set -eo pipefail

# Wait for the Strapi server to be ready
until nc -z strapi 1337; do
    echo "Waiting for Strapi server to be ready..."
    sleep 2
done
echo "Strapi server is ready."

#pnpm install

exec "$@"
