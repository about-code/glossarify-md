#!/bin/sh

echo "npm test" > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
