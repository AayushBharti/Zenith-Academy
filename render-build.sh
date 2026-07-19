#!/usr/bin/env bash
# exit on error
set -o errexit

# Install bun if not already installed
if ! command -v bun &> /dev/null
then
    echo "bun could not be found, installing..."
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
fi

# Install dependencies
bun install
