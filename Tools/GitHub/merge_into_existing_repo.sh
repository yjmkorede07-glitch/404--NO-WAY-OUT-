#!/usr/bin/env bash
set -euo pipefail
SOURCE_DIR="${1:-}"
TARGET_DIR="${2:-}"
if [[ -z "$SOURCE_DIR" || -z "$TARGET_DIR" ]]; then
  echo "Usage: ./merge_into_existing_repo.sh <prepared-project> <existing-github-clone>"
  exit 2
fi
if [[ ! -d "$SOURCE_DIR" || ! -d "$TARGET_DIR/.git" ]]; then
  echo "Source must be the prepared project; target must be an existing Git repository clone."
  exit 2
fi
cd "$TARGET_DIR"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: target repo has uncommitted changes. Commit/stash them first."
  exit 3
fi
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP=".404_merge_backup_$STAMP"
mkdir -p "$BACKUP"
for f in README.md .gitignore .gitattributes; do
  if [[ -f "$f" ]]; then cp -a "$f" "$BACKUP/$f"; fi
done
# Copy project trees and phase history. Existing unrelated files are preserved.
rsync -a --exclude='.git/' --exclude='Library/' --exclude='Temp/' --exclude='Obj/' --exclude='Build/' --exclude='Builds/' --exclude='Logs/' --exclude='UserSettings/' "$SOURCE_DIR/Assets" ./
rsync -a "$SOURCE_DIR/Packages" ./
rsync -a "$SOURCE_DIR/ProjectSettings" ./
rsync -a "$SOURCE_DIR/Legacy" ./
rsync -a "$SOURCE_DIR/.github" ./
rsync -a "$SOURCE_DIR/Docs" ./
rsync -a "$SOURCE_DIR/Tools/GitHub" ./Tools/
# Copy project-root production files, excluding Git metadata and generated archives.
find "$SOURCE_DIR" -maxdepth 1 -type f -print0 | while IFS= read -r -d '' f; do
  b="$(basename "$f")"
  case "$b" in
    .gitignore|.gitattributes|.lfsconfig|README.md|CONTRIBUTING.md|GITHUB_SETUP.md|.env.example) cp -a "$f" "./$b" ;;
    *.zip|*.7z|*.rar) : ;;
    *) cp -a "$f" "./$b" ;;
  esac
done
# Show conflicts with the pre-merge versions and stage nothing automatically.
if ! git diff --quiet -- README.md .gitignore .gitattributes; then
  echo "NOTICE: root policy files changed. Review them before committing."
fi

git status --short
cat <<EOF
\nMerge prepared in: $TARGET_DIR\nBackup of previous root policy files: $TARGET_DIR/$BACKUP\nNo commit was created and nothing was pushed.\nReview the diff, run the repository's validation, then commit/push.\nEOF
