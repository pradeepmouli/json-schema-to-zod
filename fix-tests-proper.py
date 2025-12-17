#!/usr/bin/env python3
"""
Add .text() calls to parser test files properly.
Find patterns like:
  parseXxx(
    args
  ),
).toBe(

And transform to:
  parseXxx(
    args
  ).text(),
).toBe(
"""

import re
from pathlib import Path

def fix_test_file(filepath):
    """Add .text() to parser function calls before toBe/toEqual."""
    content = filepath.read_text()
    original = content

    # Pattern: closing paren followed by ), and then ).toBe or ).toEqual
    # We want to add .text() after the first ) and before the ),

    # Strategy: Find expect( ... parseXxx(...) ... ).toBe
    # and add .text() before the last ), that's before ).toBe

    # Simpler approach: replace ),<whitespace>).toBe with ).text(),<whitespace>).toBe
    # But only if it's inside an expect() block

    # Even simpler: Just replace ),\n    ).toBe with ).text(),\n    ).toBe
    # This pattern is consistent across test files

    content = re.sub(
        r'\),\s+\)\.toBe\(',
        r').text(),\n    ).toBe(',
        content
    )

    content = re.sub(
        r'\),\s+\)\.toEqual\(',
        r').text(),\n    ).toEqual(',
        content
    )

    if content != original:
        filepath.write_text(content)
        print(f"✓ Updated {filepath.name}")
        return True
    else:
        print(f"- No changes for {filepath.name}")
        return False

def main():
    test_dir = Path("test/parsers")
    updated = 0

    for test_file in sorted(test_dir.glob("*.test.ts")):
        if fix_test_file(test_file):
            updated += 1

    print(f"\nUpdated {updated} test files")

if __name__ == "__main__":
    main()
