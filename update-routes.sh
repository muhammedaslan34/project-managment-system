#!/bin/bash

# Update teams/[id]/route.ts
# Update calendar/events/[id]/route.ts
# Update notifications/[id]/read/route.ts
# Update teams/[id]/members/route.ts

echo "Updating dynamic route files for Next.js 16..."

# List of files to update
files=(
  "app/api/teams/[id]/route.ts"
  "app/api/calendar/events/[id]/route.ts"
  "app/api/notifications/[id]/read/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file"
  fi
done

echo "Done!"
