#!/usr/bin/env python3
"""
Add .text() calls to parser test files.
Transforms: parseXxx({...}), into parseXxx({...}).text(),
"""

import re
import sys
from pathlib import Path

def fix_test_file(filepath):
    """Add .text() to parser function calls in test files."""
    content = filepath.read_text()
    original = content

    # Pattern: parse{Name}( followed eventually by ), (closing paren + comma)
    # We want to insert .text() before the closing ),
    # This regex finds parseXxx(...), and adds .text() before the comma
    pattern = r'(parse[A-Z][a-zA-Z]*\([^)]*\))\s*(\),)'
    replacement = r'\1.text()\2'

    # First pass: simple single-line cases
    content = re.sub(pattern, replacement, content)

    # Second pass: multi-line cases (more complex)
    # Match parse functions with nested parentheses
    def add_text_before_comma(match):
        full_match = match.group(0)
        # If it already has .text(), skip it
        if '.text()' in full_match:
            return full_match
        # Otherwise add .text() before the final ),
        return full_match.replace('),', ').text(),')

    # More aggressive pattern for multi-line
    # Matches: parseXxx(\n  any content \n),
    multiline_pattern = r'(parse[A-Z][a-zA-Z]*\([^)]*\{[^}]*\}\s*\))(\s*),(\s*)\)\.toBe'

    def multiline_replace(match):
        parse_call = match.group(1)
        ws1 = match.group(2)
        ws2 = match.group(3)
        if '.text()' not in parse_call:
            return f'{parse_call}.text(){ws1},{ws2}).toBe'
        return match.group(0)

    content = re.sub(multiline_pattern, multiline_replace, content)

    if content != original:
        filepath.write_text(content)
        print(f"✓ Updated {filepath.name}")
        return True
    else:
        print(f"- No changes needed for {filepath.name}")
        return False

def main():
    test_dir = Path("test/parsers")
    if not test_dir.exists():
        print(f"Error: {test_dir} not found")
        sys.exit(1)

    test_files = list(test_dir.glob("*.test.ts"))
    updated = 0

    for test_file in sorted(test_files):
        if fix_test_file(test_file):
            updated += 1

    print(f"\nUpdated {updated}/{len(test_files)} test files")

if __name__ == "__main__":
    main()
