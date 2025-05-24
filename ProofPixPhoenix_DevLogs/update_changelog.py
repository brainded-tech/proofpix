#!/usr/bin/env python3
"""
ProofPix Changelog Update Helper
Helps automate changelog updates and version tracking
"""

import os
import sys
from datetime import datetime

# Use relative path from the script location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CHANGELOG_PATH = os.path.join(SCRIPT_DIR, "CHANGELOG.md")

def read_changelog():
    """Read the current changelog content"""
    try:
        with open(CHANGELOG_PATH, 'r') as f:
            return f.read()
    except FileNotFoundError:
        print(f"❌ Changelog not found at {CHANGELOG_PATH}")
        return None

def write_changelog(content):
    """Write updated changelog content"""
    try:
        with open(CHANGELOG_PATH, 'w') as f:
            f.write(content)
        print(f"✅ Changelog updated at {CHANGELOG_PATH}")
        return True
    except Exception as e:
        print(f"❌ Error writing changelog: {e}")
        return False

def add_new_version(version, description):
    """Add a new version entry to the changelog"""
    content = read_changelog()
    if not content:
        return False
    
    today = datetime.now().strftime("%B %d, %Y")
    new_entry = f"""
### v{version} - {today} - {description}

#### 🎨 **User Interface Changes**
- TBD

#### ⚡ **Feature Changes**
- TBD

#### 🛠️ **Technical Improvements**
- TBD

#### 🐛 **Bug Fixes**
- TBD

---

"""
    
    # Find the position to insert the new version (after "## Version History")
    lines = content.split('\n')
    insert_pos = None
    
    for i, line in enumerate(lines):
        if line.strip() == "## Version History":
            insert_pos = i + 2  # After the header and empty line
            break
    
    if insert_pos is None:
        print("❌ Could not find 'Version History' section in changelog")
        return False
    
    # Insert the new version entry
    lines.insert(insert_pos, new_entry.strip())
    updated_content = '\n'.join(lines)
    
    return write_changelog(updated_content)

def update_last_modified():
    """Update the 'Last Updated' date in the changelog"""
    content = read_changelog()
    if not content:
        return False
    
    today = datetime.now().strftime("%Y-%m-%d")
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        if line.startswith("**Last Updated:**"):
            lines[i] = f"**Last Updated:** {today}"
            break
    
    updated_content = '\n'.join(lines)
    return write_changelog(updated_content)

def add_change_entry(version, category, change):
    """Add a specific change entry to an existing version"""
    content = read_changelog()
    if not content:
        return False
    
    lines = content.split('\n')
    version_found = False
    category_found = False
    
    for i, line in enumerate(lines):
        # Find the version section
        if f"### v{version}" in line:
            version_found = True
            continue
        
        # If we're in the right version, find the category
        if version_found and f"#### {category}" in line:
            category_found = True
            # Find the next line that starts with "- " or insert after "- TBD"
            for j in range(i + 1, len(lines)):
                if lines[j].strip() == "- TBD":
                    lines[j] = f"- {change}"
                    break
                elif lines[j].startswith("#### ") or lines[j].strip() == "---":
                    # Insert before next category or end of version
                    lines.insert(j, f"- {change}")
                    break
            break
    
    if not version_found:
        print(f"❌ Version v{version} not found in changelog")
        return False
    
    if not category_found:
        print(f"❌ Category '{category}' not found in version v{version}")
        return False
    
    updated_content = '\n'.join(lines)
    return write_changelog(updated_content)

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print("""
ProofPix Changelog Helper

Usage:
  python3 update_changelog.py new <version> <description>
  python3 update_changelog.py add <version> <category> <change>
  python3 update_changelog.py update

Examples:
  python3 update_changelog.py new "1.4.0" "New Features & Bug Fixes"
  python3 update_changelog.py add "1.4.0" "🎨 **User Interface Changes**" "Added dark mode toggle"
  python3 update_changelog.py update  # Updates last modified date

Categories:
  - 🎨 **User Interface Changes**
  - ⚡ **Feature Changes**
  - 🛠️ **Technical Improvements**
  - 🐛 **Bug Fixes**
        """)
        return
    
    command = sys.argv[1]
    
    if command == "new":
        if len(sys.argv) < 4:
            print("❌ Usage: python3 update_changelog.py new <version> <description>")
            return
        version = sys.argv[2]
        description = sys.argv[3]
        if add_new_version(version, description):
            update_last_modified()
    
    elif command == "add":
        if len(sys.argv) < 5:
            print("❌ Usage: python3 update_changelog.py add <version> <category> <change>")
            return
        version = sys.argv[2]
        category = sys.argv[3]
        change = " ".join(sys.argv[4:])  # Join all remaining args as change description
        if add_change_entry(version, category, change):
            update_last_modified()
    
    elif command == "update":
        update_last_modified()
    
    else:
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main() 