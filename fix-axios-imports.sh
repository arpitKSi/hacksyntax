#!/bin/bash

# Replace axios with apiClient in all component files
files=$(grep -rl "import axios from" components/)

for file in $files; do
    echo "Fixing $file..."
    sed -i 's/import axios from "axios"/import apiClient from "@\/lib\/api-client"/g' "$file"
    sed -i 's/axios\./apiClient./g' "$file"
    sed -i "s/axios\./apiClient./g" "$file"
done

echo "✅ Fixed all axios imports!"
