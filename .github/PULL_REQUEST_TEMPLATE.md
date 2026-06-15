## 📝 Description

<!-- Describe your changes in detail. What problem does it solve? What feature does it add? -->

Closes #<!-- issue number -->

## 🔄 Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📚 Documentation update
- [ ] ♻️ Refactor (no functional changes)
- [ ] 🧪 Tests (adding or updating tests)
- [ ] 🔒 Security fix

## 🧪 Testing

<!-- Describe how you tested your changes. -->

- [ ] TypeScript type-check passes: `npm run type-check`
- [ ] All existing tests pass: `npm test`
- [ ] New tests added for new functionality
- [ ] Manually tested the affected user flows

## 🏥 Healthcare Business Rules

<!-- If this PR touches healthcare logic, confirm the following: -->

- [ ] Medical history remains **append-only** (no mutation of existing records)
- [ ] Prescriptions remain **append-only**
- [ ] All sensitive actions produce an **audit log entry**
- [ ] AI features include the required **medical disclaimer**
- [ ] Payment verification flow is unchanged or explicitly updated

## 📸 Screenshots / Videos

<!-- If this is a UI change, add screenshots or a screen recording. -->

## 🔗 Related Issues / PRs

<!-- List any related issues or PRs. -->

## ✔️ Checklist

- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new TypeScript errors or warnings
- [ ] I have added tests that prove my fix or feature works
