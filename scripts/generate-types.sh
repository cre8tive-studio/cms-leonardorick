
#!/bin/bash

# Get the current directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Go one level up from the script's directory
cd "$SCRIPT_DIR/.."

npx sanity-codegen

# Go one level up from the script's directory
WORKSPACE_DIR="$SCRIPT_DIR/../.."

# Check if "frontend" directory exists
if [ -d "$WORKSPACE_DIR/frontend" ]; then
  # "frontend" directory exists, so copy the desired files
  cp utils/generated-schema-types.ts ../frontend/types/generated-schema-types.ts
else
  # "frontend" directory doesn't exist, display an error message
  echo "Warning: 'frontend' directory not found. copy the generated-schema-types.ts file manually later"
fi