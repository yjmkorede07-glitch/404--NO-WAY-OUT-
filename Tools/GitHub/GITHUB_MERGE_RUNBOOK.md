# 404: NO WAY OUT — GitHub Merge Runbook

This kit merges the prepared Unity production project into the **existing GitHub repository** without deleting unrelated repository content.

## Intended result
- Preserve the existing GitHub repository and its history.
- Add the cumulative Unity 6.3 LTS production project (Phase 36–54).
- Add previously unuploaded Phase 34 and Phase 35 source under `Legacy/`.
- Add GitHub Actions static validation.
- Preserve existing unrelated folders/files.
- Do not upload generated Unity folders such as `Library`, `Temp`, `Obj`, `Build`, `Builds`, `Logs`, or `UserSettings`.

## Preferred workflow
1. Clone the existing GitHub repository on the larger PC.
2. Make sure the clone is clean (`git status`).
3. Run the supplied merge script against that clone.
4. Review `git status` and `git diff`.
5. Resolve intentional root-file conflicts, especially `README.md`, `.gitignore`, and `.gitattributes`.
6. Run the repository validation workflow locally if available.
7. Commit the merge.
8. Push to `main` (or the repository's normal integration branch).
9. Only after the push succeeds, open the merged project in Unity 6.3 LTS.

## Scripts
- macOS/Linux/Git Bash: `merge_into_existing_repo.sh <prepared-project> <existing-clone>`
- Windows PowerShell: `merge_into_existing_repo.ps1 -SourceDir <prepared-project> -TargetDir <existing-clone>`

The scripts create a timestamped `.404_merge_backup_*` directory containing the pre-merge root policy files. They **do not commit or push**.

## Important
The prepared project is not itself the user's existing remote repository. A remote URL/authenticated clone is still required before an actual GitHub push can occur.
