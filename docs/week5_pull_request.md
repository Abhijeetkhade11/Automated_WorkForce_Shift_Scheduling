# Week 5: Pull Request and Merge Documentation

This log records the review, approval, and merge process of the user registration and login feature into the development branch.

---

## 📋 Pull Request Details

- **PR Title:** `feat: implement user registration and login APIs (US-01)`
- **Source Branch:** `feature/US-01-user-registration`
- **Target Branch:** `dev`
- **Author:** DevOps Developer
- **Date:** August 25, 2026

### Description of Changes
- Introduced the `User` database entity mapping account parameters.
- Built the `UserRepository` interface for H2 data operations.
- Created `RegisterRequest`, `LoginRequest`, and `UserResponse` DTO validation models.
- Implemented `/api/auth/register` and `/api/auth/login` REST APIs in `AuthController.java`.
- Verified compilation and test bounds locally (`BUILD SUCCESS`).

---

## 💬 Peer Review Comments

### Reviewer 1 (Automated QA / Peer Dev)
> "Code compiles cleanly using the Maven wrapper. Endpoints validation for duplicate usernames and emails is correct. The plain-text password mapping is approved for development environment ease (matches later Selenium automation script plans). LGTM!"
- **Decision:** Approved ✅

---

## 📈 Merge Evidence

The branch was successfully merged from `feature/US-01-user-registration` to `dev` using the following git command trail:

```bash
# 1. Switch back to development branch
git checkout dev

# 2. Merge the feature changes
git merge --no-ff feature/US-01-user-registration -m "Merge pull request #1 from feature/US-01-user-registration"

# 3. Clean up the local feature branch
git branch -d feature/US-01-user-registration
```

### Git Log Snippet
```
commit [MERGE_COMMIT_ID]
Merge: [PARENT_1] [PARENT_2]
Author: DevOps Developer <dev@company.com>
Date:   Tue Aug 25 23:25:00 2026 +0530

    Merge pull request #1 from feature/US-01-user-registration
    
    feat: implement user registration and login APIs (US-01)
```
