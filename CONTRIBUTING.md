## Overview

This document consists of the steps and guidelines on how to contribute to this repository. For a guide in how to contribute/use storybook, refer to [» STORYBOOK_GUIDE.md](/docs/STORYBOOK_GUIDE.md).

---

## Important Note

Rather than just looking at the repository, use the designated github project for [» BuyBuyIn Kanban Board](https://github.com/users/Brenedict/projects/5) so that this guide will make sense.

---

## How to Contribute to this repository?

### 1. Tasks and Issues Creation

- [» What do Backlog, Todo, In Progress, In Review and Done mean?](#knowledge-base)
- All issues must first be reviewed from **🟢 Backlog** to **🔵 Todo** before anyone can start working on them!
- Designated people must first review the backlogs for issues.
- Do not do tasks/issues that are within the **🟢 Backlog** column. You can only start working on tasks in the **🔵 Todo** column
- Who can create issues? Anyone (created issues must first go to **🟢 Backlog**)

---

### 2. Issue Assignment & Board Alignment:

- Don’t immediately start writing code! Pick a task to work on from the **🟢 Ready**.
- Assign Yourself: You assign your GitHub username to the issue so two developers don't accidentally work on the same thing. It is also **good courtesy** to message in the group chat about taking an issue.
- After assigning yourself, move the task to **🟡 In Progress**. This allows you to notify the team that you have started working on that task

---

### 3. Branch Naming & Automation:

- How to begin coding on your task? **First you must create your very own branch** so that you don’t mess with the Main branch.
- **NEVER DIRECTLY PUSH ON THE MAIN BRANCH**
- **Not familiar** with conventional branch/commit naming types? Check the [» Knowledge Base Section](#knowledge-base) below
- Branch naming format is shown below.

```bash
# Format:
<type>/#<issue-number>-<short-description>
```

```bash
# Example Issue From Github:
[FEAT] Add proper styles to index.css #6

# Example Corresponding Branch Name:
feat/#6-css-themes
```

---

### 4. Writing Commits

- When you finish a task or a subtask, the usual git workflow is:

```bash
# Example:
git add <file/files>
git commit -m “<type>(optional scope): <description>”
```

---

### 5. Pushing Changes

- When you finish a task/issue, you push your branch to the repository.

```bash
# Example: This is your branch name
feat/#42-user-authentication

# Example: This is how you push your branch
git push origin feat/#42-user-authentication
```

---

### 6. Pull Request Semantics & Linking

- When you successfully push, you should be prompted with this
  ![Pull Request Prompt](image.png)
- Create your own new pull request where: `base: development` and `compare: <your-branch>`.
  ![Pull Request Prompt](image.png)
- You should see a template for your PR that you can fill up. Remove all placeholder texts enclosed in angle brackets `< >`.

```markdown
# Example placeholder text to remove from the PR template

<Provide a clear, high-level summary of the changes introduced by this pull request. Explain the problem being solved and how your code resolves it.>
```

- Link the issue you worked on in your PR. When an issue is linked to a PR, when a PR is approved the issue closes automatically.

```markdown
# Example the issue you worked on is '[FEAT] Add proper styles to index.css #6'

Closes #6
```

- Make sure to tick the necessary checkboxes.

```markdown
# Example

- [x] Ticked Checkbox
- [ ] Unticked Checkbox
```

---

### 7. Crucial Final Steps in PR

- You should be able to ticked all checkboxes at the very bottom of the PR template. This are the crucial checklist items in every PR.

```markdown
- [ ] My branch is up-to-date with the main target branch (merge or rebase locally to resolve conflicts first).
- [ ] I have self-reviewed my code for clean syntax, formatting, and redundant code (no commented-out blocks or temporary log/print statements left behind).
- [ ] I have verified that all local changes work as expected using the Testing Plan above.
- [ ] I have added inline comments to explain complex or non-obvious code logic.
- [ ] If this PR introduces UI changes, I have attached screenshots or a short screen recording demonstrating the new look and behavior.
```

- Your Issue should now be in the **🟣 In Review** column after creating your PR.

---

<!-- TODO: Add documentation on how the workflow for reviewing a PR -->

## Knowledge Base

_**Table 1.** Branch and Commit Type Conventions_

| Branch/Commit Type | Description                                                                                                          |
| :----------------- | :------------------------------------------------------------------------------------------------------------------- |
| feat               | A branch/commit about adding a new feature to the system. You will **most likely** be using this the most            |
| fix                | A branch/commit about rewriting code to fix bugs in the system.                                                      |
| docs               | A branch/commit that mainly concerns adding documentations (e.g. README.md, screenshots, adding comments to code)    |
| refactor           | A branch/commit about rewriting code, but keeping the same logic. Usually for optimization or better code structure. |
| style              | A branch/commit about adding and updating styles of system (e.g. adding CSS).                                        |
| test               | A branch/commit that concerns adding/revising tests cases.                                                           |

---

_**Table 2.** Github Project Columns_

| Kanban Column  | Description                                                                                                                                                                                                                            |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟢 Backlog     | • This is where all future ideas, feature requests, and bug reports live.<br>• Nobody is working on these tasks yet.<br>• Backlog tasks are potential task only (don’t start working on them yet unless they are in the Todo” column). |
| 🔵 Todo        | • These are tasks that have been approved and explained.<br>• These are the tasks that you can start assigning yourself on.                                                                                                            |
| 🟡 In Progress | • A team member has claimed this task and is actively writing code or working on it right now.                                                                                                                                         |
| 🟣 In Review   | • The code is finished!<br>• The student who built it has opened a Pull Request (PR).<br>• People need to review their work and make sure there are no bugs.                                                                           |
| 🟠 Done        | • The code was reviewed, approved, and merged into the main project. The task is completely finished.                                                                                                                                  |
