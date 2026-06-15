# 🤝 Contributing to DoctorHub AI

Thank you for investing your time in contributing to **DoctorHub AI**! Any contribution you make is greatly appreciated. ❤️

Read our [Code of Conduct](CODE_OF_CONDUCT.md) to keep our community approachable and respectful.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/hospital-management-system.git
   cd hospital-management-system
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/awaisali022/hospital-management-system.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment variables** (see [README](README.md#-quick-start))

---

## Development Setup

```bash
# Start backend dev server (port 5000)
npm run dev:backend

# Start frontend dev server (port 5173)
npm run dev:frontend

# Type-check both workspaces
npm run type-check

# Run tests
npm test
```

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `feature/xxx` | New features |
| `fix/xxx` | Bug fixes |
| `docs/xxx` | Documentation updates |
| `refactor/xxx` | Code refactoring |
| `test/xxx` | Test additions/improvements |

Always branch from `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

---

## Commit Convention

We follow the **Conventional Commits** specification:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

### Types

| Type | Description |
|------|------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, missing semi colons, etc. |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding missing tests or correcting existing tests |
| `chore` | Build process or auxiliary tool changes |
| `perf` | Performance improvement |

### Examples

```bash
git commit -m "feat(auth): add refresh token rotation"
git commit -m "fix(appointments): resolve double-booking race condition"
git commit -m "docs(readme): update quick start section"
git commit -m "test(medical): add prescription immutability tests"
```

---

## Pull Request Process

1. **Update your branch** with the latest changes from upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure all checks pass**:
   ```bash
   npm run type-check
   npm test
   ```

3. **Write a clear PR description** using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)

4. **Request a review** from a maintainer

5. **Address review feedback** promptly

6. **Squash commits** if requested before merge

> [!IMPORTANT]
> PRs will not be merged if:
> - TypeScript type-check fails
> - Tests fail
> - New features lack corresponding tests
> - Medical/healthcare business rules are violated (see architecture docs)

---

## Coding Standards

### TypeScript
- Strict mode is **required** — no `any` types without explicit justification
- All functions must have explicit return types
- Use Zod schemas for all API input validation

### Backend
- Follow the **clean architecture** layer separation (domain → application → infrastructure → interfaces)
- Never put business logic in controllers
- Medical history and prescriptions must remain **append-only**
- Every sensitive action must produce an **audit log entry**

### Frontend
- Components must be in their feature folder (`features/xxx`)
- Use Zustand stores for global state — no prop-drilling
- All API calls go through the `lib/` API client

### Security
- Never commit secrets or credentials
- Rate-limit all public endpoints
- Validate all inputs at the HTTP boundary using Zod

---

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- A clear, descriptive title
- Steps to reproduce the behavior
- Expected vs actual behavior
- Your environment (OS, Node version, browser)
- Screenshots or logs if applicable

---

## Requesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- The problem your feature solves
- Your proposed solution
- Alternatives you've considered
- Any mockups or diagrams if applicable

---

## Questions?

Feel free to reach out: **[awais.cuvi@gmail.com](mailto:awais.cuvi@gmail.com)**

Thank you for contributing! 🎉
