#!/bin/bash

# Script to create a new page with all necessary files
# Usage: ./create-page.sh <parent-directory> <file-name>
# Example: ./create-page.sh user profile

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if correct number of arguments provided
if [ "$#" -ne 2 ]; then
    echo -e "${RED}Error: Invalid number of arguments${NC}"
    echo "Usage: $0 <parent-directory> <file-name>"
    echo "Example: $0 user profile"
    exit 1
fi

PARENT_DIR=$1
FILE_NAME=$2

# Function to convert camelCase to kebab-case
to_kebab_case() {
    echo "$1" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]'
}

# Convert file name to kebab-case for views
KEBAB_FILE_NAME=$(to_kebab_case "$FILE_NAME")

# Define file paths
HANDLER_PATH="server/routes/${PARENT_DIR}/handlers/${FILE_NAME}.ts"
HANDLER_TEST_PATH="server/routes/${PARENT_DIR}/handlers/${FILE_NAME}.test.ts"
ROUTE_INDEX_PATH="server/routes/${PARENT_DIR}/index.ts"
VIEW_PATH="server/views/pages/${PARENT_DIR}/${KEBAB_FILE_NAME}.njk"
TEST_PATH="integration_tests/pages/${PARENT_DIR}/${FILE_NAME}Page.ts"

echo -e "${YELLOW}Creating new page: ${PARENT_DIR}/${FILE_NAME}${NC}"
echo ""

# Create directories if they don't exist
echo "Creating directories..."
mkdir -p "server/routes/${PARENT_DIR}/handlers"
mkdir -p "server/views/pages/${PARENT_DIR}"
mkdir -p "integration_tests/pages/${PARENT_DIR}"

# Create handler file
echo -e "${GREEN}✓${NC} Creating handler: ${HANDLER_PATH}"
# Capitalize first letter for class name
CLASS_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${FILE_NAME:0:1})${FILE_NAME:1}"
cat > "$HANDLER_PATH" << 'EOF'
import { Request, Response } from 'express';

export default class CLASS_NAMEHandler {
  constructor() {}

  GET = async (req: Request, res: Response) => {
    return res.render('pages/PARENT_DIR/VIEW_NAME', {});
  }

  POST = async (req: Request, res: Response) => {
    // TODO: Implement POST logic
    return res.redirect('');
  }
}
EOF

# Replace placeholders in handler
sed -i '' "s|CLASS_NAME|${CLASS_NAME}|g" "$HANDLER_PATH"
sed -i '' "s|PARENT_DIR|${PARENT_DIR}|g" "$HANDLER_PATH"
sed -i '' "s|VIEW_NAME|${KEBAB_FILE_NAME}|g" "$HANDLER_PATH"

# Create handler test file
echo -e "${GREEN}✓${NC} Creating handler test: ${HANDLER_TEST_PATH}"
cat > "$HANDLER_TEST_PATH" << 'EOF'
import { Request, Response } from 'express';
import CLASS_NAMEHandler from './FILE_NAME';

describe('CLASS_NAMEHandler', () => {
  let handler: CLASS_NAMEHandler;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    handler = new CLASS_NAMEHandler();
    req = {};
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };
  });

  describe('GET', () => {
    it('should render the correct view', async () => {
      await handler.GET(req as Request, res as Response);
      
      expect(res.render).toHaveBeenCalledWith('pages/PARENT_DIR/VIEW_NAME', {});
    });
  });

  describe('POST', () => {
    it('should redirect after processing', async () => {
      await handler.POST(req as Request, res as Response);
      
      expect(res.redirect).toHaveBeenCalled();
    });
  });

  // TODO: Add more test cases
});
EOF

# Replace placeholders in handler test
sed -i '' "s|CLASS_NAME|${CLASS_NAME}|g" "$HANDLER_TEST_PATH"
sed -i '' "s|FILE_NAME|${FILE_NAME}|g" "$HANDLER_TEST_PATH"
sed -i '' "s|PARENT_DIR|${PARENT_DIR}|g" "$HANDLER_TEST_PATH"
sed -i '' "s|VIEW_NAME|${KEBAB_FILE_NAME}|g" "$HANDLER_TEST_PATH"

# Create view file
echo -e "${GREEN}✓${NC} Creating view: ${VIEW_PATH}"
cat > "$VIEW_PATH" << 'EOF'
{% extends "layout.njk" %}

{% set pageTitle = applicationName + " - Page name" %}
{% set mainClasses = "govuk-body" %}

{% block content %}
  {# TODO: Add page content #}
{% endblock %}
EOF

# Create integration test file
echo -e "${GREEN}✓${NC} Creating test: ${TEST_PATH}"
cat > "$TEST_PATH" << 'EOF'
import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class CLASS_NAMEPage extends AbstractPage {
  readonly header: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1', { hasText: 'Page header' })
  }
}
EOF

# Replace placeholders in test
sed -i '' "s|CLASS_NAME|${CLASS_NAME}|g" "$TEST_PATH"

# Handle route index file
if [ -f "$ROUTE_INDEX_PATH" ]; then
    echo -e "${GREEN}✓${NC} Updating existing route index: ${ROUTE_INDEX_PATH}"
    
    # Check if import already exists
    if grep -q "import ${CLASS_NAME}Handler from './handlers/${FILE_NAME}'" "$ROUTE_INDEX_PATH"; then
        echo -e "${YELLOW}  Import already exists, skipping...${NC}"
    else
        # Add import after the last import statement
        sed -i '' "/^import.*from '.\/handlers\//a\\
import ${CLASS_NAME}Handler from './handlers/${FILE_NAME}'
" "$ROUTE_INDEX_PATH"
    fi
    
    # Check if post helper function exists, if not add it
    if ! grep -q "const post = (path: string, handler: RequestHandler) => router.post" "$ROUTE_INDEX_PATH"; then
        # Add post helper after get helper
        sed -i '' "/const get = (path: string, handler: RequestHandler) => router.get/a\\
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)
" "$ROUTE_INDEX_PATH"
    fi
    
    # Check if instantiation already exists
    if grep -q "const ${FILE_NAME}Handler = new ${CLASS_NAME}Handler()" "$ROUTE_INDEX_PATH"; then
        echo -e "${YELLOW}  Handler instantiation already exists, skipping...${NC}"
    else
        # Find the last handler instantiation line and add after it
        LAST_HANDLER_LINE=$(grep -n "const.*Handler = new.*Handler()" "$ROUTE_INDEX_PATH" | tail -1 | cut -d: -f1)
        if [ -n "$LAST_HANDLER_LINE" ]; then
            # Add after the last handler instantiation
            sed -i '' "${LAST_HANDLER_LINE}a\\
  const ${FILE_NAME}Handler = new ${CLASS_NAME}Handler()
" "$ROUTE_INDEX_PATH"
        else
            # Add after the post helper definition or get helper definition
            if grep -q "const post = (path: string, handler: RequestHandler)" "$ROUTE_INDEX_PATH"; then
                sed -i '' "/const post = (path: string, handler: RequestHandler)/a\\
\\
  const ${FILE_NAME}Handler = new ${CLASS_NAME}Handler()
" "$ROUTE_INDEX_PATH"
            else
                sed -i '' "/const get = (path: string, handler: RequestHandler)/a\\
\\
  const ${FILE_NAME}Handler = new ${CLASS_NAME}Handler()
" "$ROUTE_INDEX_PATH"
            fi
        fi
    fi
    
    # Check if GET route already exists
    if grep -q "get('/${KEBAB_FILE_NAME}'" "$ROUTE_INDEX_PATH"; then
        echo -e "${YELLOW}  GET route already exists, skipping...${NC}"
    else
        # Find the last get() line and add after it
        LAST_GET_LINE=$(grep -n "^  get(" "$ROUTE_INDEX_PATH" | tail -1 | cut -d: -f1)
        if [ -n "$LAST_GET_LINE" ]; then
            sed -i '' "${LAST_GET_LINE}a\\
  get('/${KEBAB_FILE_NAME}', ${FILE_NAME}Handler.GET)
" "$ROUTE_INDEX_PATH"
        else
            # If no get() lines exist, add before return statement
            sed -i '' "/return router/i\\
  get('/${KEBAB_FILE_NAME}', ${FILE_NAME}Handler.GET)\\

" "$ROUTE_INDEX_PATH"
        fi
    fi
    
    # Check if POST route already exists
    if grep -q "post('/${KEBAB_FILE_NAME}'" "$ROUTE_INDEX_PATH"; then
        echo -e "${YELLOW}  POST route already exists, skipping...${NC}"
    else
        # Find the last post() line and add after it
        LAST_POST_LINE=$(grep -n "^  post(" "$ROUTE_INDEX_PATH" | tail -1 | cut -d: -f1)
        if [ -n "$LAST_POST_LINE" ]; then
            sed -i '' "${LAST_POST_LINE}a\\
  post('/${KEBAB_FILE_NAME}', ${FILE_NAME}Handler.POST)
" "$ROUTE_INDEX_PATH"
        else
            # If no post() lines exist, add before return statement
            sed -i '' "/return router/i\\
  post('/${KEBAB_FILE_NAME}', ${FILE_NAME}Handler.POST)\\

" "$ROUTE_INDEX_PATH"
        fi
    fi
else
    echo -e "${GREEN}✓${NC} Creating new route index: ${ROUTE_INDEX_PATH}"
    cat > "$ROUTE_INDEX_PATH" << 'EOF'
import { RequestHandler, Router } from 'express'
import CLASS_NAMEHandler from './handlers/FILE_NAME'

export default function Index(): Router {
  const router = Router({ mergeParams: true })
  const get = (path: string, handler: RequestHandler) => router.get(path, handler)
  const post = (path: string, handler: RequestHandler) => router.post(path, handler)

  const FILE_NAMEHandler = new CLASS_NAMEHandler()

  get('/ROUTE_PATH', FILE_NAMEHandler.GET)
  post('/ROUTE_PATH', FILE_NAMEHandler.POST)

  return router
}
EOF
    
    # Replace placeholders in route index
    sed -i '' "s|CLASS_NAME|${CLASS_NAME}|g" "$ROUTE_INDEX_PATH"
    sed -i '' "s|FILE_NAME|${FILE_NAME}|g" "$ROUTE_INDEX_PATH"
    sed -i '' "s|ROUTE_PATH|${KEBAB_FILE_NAME}|g" "$ROUTE_INDEX_PATH"
fi

echo ""
echo -e "${GREEN}✓ Page created successfully!${NC}"
echo ""
echo "Files created/updated:"
echo "  - ${HANDLER_PATH}"
echo "  - ${HANDLER_TEST_PATH}"
echo "  - ${VIEW_PATH}"
echo "  - ${TEST_PATH}"
echo "  - ${ROUTE_INDEX_PATH}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Implement handler logic in ${HANDLER_PATH}"
echo "  2. Add content to ${VIEW_PATH}"
echo "  3. Write tests in ${HANDLER_TEST_PATH}"
echo "  4. Write integration tests in ${TEST_PATH}"
echo "  5. Ensure route is registered in your main app"