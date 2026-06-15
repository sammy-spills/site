#!/usr/bin/env zsh

# convert-to-webp.zsh
# Batch convert all PNG, JPG, JPEG images in public/ to WebP format
# Usage: ./scripts/convert-to-webp.zsh [--quality N] [--force]
#
# Options:
#   --quality N    WebP quality (default: 80, range: 0-100)
#   --force        Re-convert files even if .webp already exists
#
# Prints each converted file pair: original -> webp

setopt extended_glob

# Parse arguments
QUALITY=80
FORCE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --quality)
      if [[ -n "$2" && "$2" =~ ^[0-9]+$ ]]; then
        QUALITY=$2
        shift 2
      else
        echo "Error: --quality requires a number (0-100)" >&2
        exit 1
      fi
      ;;
    --force)
      FORCE=true
      shift
      ;;
    *)
      echo "Error: Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

# Validate quality
if (( QUALITY < 0 || QUALITY > 100 )); then
  echo "Error: Quality must be between 0 and 100" >&2
  exit 1
fi

echo "Converting images to WebP (quality: $QUALITY)..."
echo "=============================================="

# Counters
CONVERTED=0
SKIPPED=0
ERRORS=0

# Function to convert a single file
convert_file() {
  local input_file="$1"
  local output_file="${input_file%.*}.webp"

  # Skip if output exists and --force is not set
  if [[ -f "$output_file" && "$FORCE" = false ]]; then
    echo "[SKIP] $input_file -> $output_file (already exists)"
    (( SKIPPED++ ))
    return 0
  fi

  # Convert using cwebp
  if cwebp -q "$QUALITY" "$input_file" -o "$output_file" 2>/dev/null; then
    echo "[DONE] $input_file -> $output_file"
    (( CONVERTED++ ))
    return 0
  else
    echo "[ERROR] Failed to convert: $input_file" >&2
    (( ERRORS++ ))
    return 1
  fi
}

# Find and convert all PNG, JPG, JPEG files in public/
find public -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r file; do
  convert_file "$file"
done

echo "=============================================="
echo "Conversion complete!"
echo "  Converted: $CONVERTED"
echo "  Skipped:   $SKIPPED"
if (( ERRORS > 0 )); then
  echo "  Errors:    $ERRORS"
  exit 1
fi

echo ""
echo "Next steps:"
echo "  1. Update image references in your code from .png/.jpg to .webp"
echo "  2. Consider running 'rm public/**/*.png public/**/*.jpg public/**/*.jpeg' after verifying"
