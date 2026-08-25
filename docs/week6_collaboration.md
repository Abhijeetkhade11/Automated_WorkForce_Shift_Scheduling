# Week 6: Git Collaboration, Merge Conflict, and Tagging Log

This log documents the branch management, merge conflict resolution, and release baseline tagging for the Workforce Shift Scheduling System.

---

## 1. Branch Strategy and MVP Completion
During Week 6, we completed the core database structures and REST controller mappings on the feature branch:
- **Feature Branch:** `feature/US-02-shift-management`
- **Goal:** Added entities and REST mappings for shift creation, booking requests, and cancellation approvals.
- **Integration:** Switched to the `dev` branch and executed a non-fast-forward merge:
  ```bash
  git checkout dev
  git merge --no-ff feature/US-02-shift-management -m "Merge pull request #2 from feature/US-02-shift-management"
  ```

---

## 2. Git Merge Conflict Simulation & Resolution

To demonstrate version control conflict resolution, we simulated parallel development in the backlog section of `README.md`.

### Step 1: Create Backlog Branch and Modify Status
We created branch `feature/backlog-update` and edited the Week 6 status line to:
```markdown
| **Week 6** | **MVP Completion and Git Collaboration** | 🔄 Conflict Testing |
```
Committed on `feature/backlog-update` with hash `df18e11`.

### Step 2: Modify Mainline Branch
We switched to `dev` and edited the same line in `README.md` to:
```markdown
| **Week 6** | **MVP Completion and Git Collaboration** | 🔄 Mainline Integration |
```
Committed on `dev` with hash `27205aa`.

### Step 3: Trigger Merge Conflict
We merged `feature/backlog-update` into `dev`, generating the conflict:
```
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

### Conflicted Block Markers (in README.md)
```markdown
<<<<<<< HEAD
| **Week 6** | **MVP Completion and Git Collaboration** | 🔄 Mainline Integration |
=======
| **Week 6** | **MVP Completion and Git Collaboration** | 🔄 Conflict Testing |
>>>>>>> feature/backlog-update
```

### Step 4: Resolve and Commit
We resolved the conflict in favor of marking the milestone as completed:
```markdown
| **Week 6** | **MVP Completion and Git Collaboration** | ✅ Completed |
```
Staged and committed the merge:
```bash
git add README.md
git commit -m "chore: resolve merge conflict on README.md and mark Week 6 as completed"
```

---

## 3. Release Tagging
With all MVP code completed and conflict testing resolved, the `dev` branch was merged into `main` and tagged as our final release baseline:
- **Release Version:** `v1.0.0-MVP`
- **Target Branch:** `main`
- **Release Commit Message:** `Merge branch 'dev' into main (Release v1.0.0-MVP)`
- **Command:** `git tag -a v1.0.0-MVP -m "Release v1.0.0-MVP containing the complete scheduling system MVP"`
