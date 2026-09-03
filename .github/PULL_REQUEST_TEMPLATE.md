## Description

<Provide a clear, high-level summary of the changes introduced by this pull request. Explain the problem being solved and how your code resolves it.>

## Linked Issue

Closes #

## Type of Change

Please select the option that best describes your changes:

- [ ] fix (non-breaking change which fixes an issue)
- [ ] feat (non-breaking change which adds functionality)
- [ ] feat/fix (fix or feature that would cause existing functionality to not work as expected)
- [ ] refactor (code cleanup, formatting, performance improvement, no functional changes)
- [ ] docs (updates to README, inline comments, or wikis)
- [ ] style (updates styles and designs)
- [ ] test (adds/changes system tests)

## Testing and Verification Plan

<Describe how you tested these changes. Provide explicit, step-by-step instructions so a reviewer can replicate your test cases locally.>

**Example Setup Steps:**

1. Ensure your main branch is up to date

```bash
git pull origin main
```

2. Ensure your git sees this branch

```bash
git fetch --all
```

3. Switch to this branch:

```bash
git checkout <your-branch-name>
```

3. Pull the latest changes in case there were late pushes:

```bash
git pull origin <your-branch-name>
```

4. Wait for the dependencies to install first

```bash
# You should be in the root branch: /BuyBuyIn
npm install
```

## Test Cases Checklist

Specify the exact scenarios a reviewer must test and verify.

- [ ] Test Case 1: [Describe the setup, action, and expected outcome]
- [ ] Test Case 2: [Describe the setup, action, and expected outcome]

## Pre-Merge Checklist (PLEASE MAKE SURE EVERYTHING IS FOLLOWED)

Before submitting this pull request, please verify that you have completed the following steps:

- [ ] My branch is up-to-date with the main target branch (merge or rebase locally to resolve conflicts first).
- [ ] I have self-reviewed my code for clean syntax, formatting, and redundant code (no commented-out blocks or temporary log/print statements left behind).
- [ ] I have verified that all local changes work as expected using the Testing Plan above.
- [ ] I have added inline comments to explain complex or non-obvious code logic.
- [ ] If this PR introduces UI changes, I have attached screenshots or a short screen recording demonstrating the new look and behavior.
