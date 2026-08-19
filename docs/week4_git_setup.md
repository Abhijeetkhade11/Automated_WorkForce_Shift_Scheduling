# Week 4: Git and GitHub Repository Setup Guidelines

This document outlines the version control branching policy, conventional commits standard, and pull request requirements for the Automated Workforce Shift Scheduling System.

---

## 1. Branch Naming Policies

To keep our repository organized and enable automated CI/CD triggers, we enforce the following branch structure:

| Branch Name | Type / Purpose | Target Parent Branch |
| :--- | :--- | :--- |
| **`main`** | Production release branch. Must always be stable. | None |
| **`dev`** | Integration branch. Active development merging. | `main` |
| **`feature/*`** | New features (e.g., `feature/US-01-user-registration`). | `dev` |
| **`bugfix/*`** | Fixing bugs found in dev/testing (e.g., `bugfix/fix-h2-console-access`). | `dev` |
| **`hotfix/*`** | Emergency production fixes. Merged to both main and dev. | `main` |

---

## 2. Commit Message Standards (Conventional Commits)
All commit messages must follow the format: `<type>: <description>` (all lowercase description, max 72 chars).

- **`feat:`** A new feature (e.g., `feat: implement user registration rest endpoint`).
- **`fix:`** A bug fix (e.g., `fix: resolve dashboard stat calculations crash`).
- **`docs:`** Documentation changes only (e.g., `docs: add branch policy guide`).
- **`style:`** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
- **`test:`** Adding missing tests or correcting existing tests.
- **`chore:`** Updating build configs, docker configurations, or packages (e.g., `chore: add maven dependency for h2`).

---

## 3. Pull Request and Merge Policies
1. **Source Update:** A feature branch must pull and rebase with `dev` before opening a Pull Request (PR) to prevent merge conflicts.
2. **Review Requirement:** Every PR must be reviewed and approved by at least one teammate (or self-reviewed for single-person projects with documented evidence) before merging.
3. **Build Status:** The Jenkins CI pipeline must successfully compile, package, and pass all automated tests (`BUILD SUCCESS`) before the merge is finalized.

---

## 4. Setup Guide: Linking to Remote GitHub Repo
Once you have created your empty GitHub repository, execute the following commands in your local powershell console within the project folder:

```powershell
# 1. Initialize local repository
git init

# 2. Add all files to staging (verified by .gitignore)
git add .

# 3. Create initial commit
git commit -m "chore: initial project skeleton with Maven and static UI"

# 4. Rename default branch to main
git branch -M main

# 5. Link to your remote GitHub repository (Replace URL with your own)
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>

# 6. Push initial code to main
git push -u origin main
```
