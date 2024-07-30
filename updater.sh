#!/bin/bash

# Variables
REPO_URL="https://github.com/mak8427/My-site.git" # Your repository URL
BRANCH="main" # The branch you want to pull

# Determine the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to the directory of your repository
cd "$SCRIPT_DIR" || exit 1

#while true; do
# Fetch all updates from the remote repository
git fetch --all

# Reset the local repository to match the remote repository
git reset --hard origin/$BRANCH

# Pull the latest changes from the remote repository
git pull origin $BRANCH

# Update submodules
git submodule update --init --force --remote

echo "Force pull and submodule update completed. Waiting for 10 seconds..."

# Wait for 10 seconds before repeating
#  sleep 10
#done
