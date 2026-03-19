# Product Requirements Document (PRD) - Todo App Upgrade MVP

## 1. Overview

We are upgrading the existing Todo app so tasks are easier to plan and triage while keeping the solution simple and teachable for the lab. The current app only supports a title and completion status. This PRD defines an MVP that adds optional due dates, simple priority levels, and task filters without introducing backend changes or external storage.

The MVP should preserve the lightweight nature of the app while giving users a practical way to identify what needs attention now. Scope has been intentionally narrowed so the team can focus on core task metadata, filtering behavior, and basic validation using local storage only.

## 2. MVP Scope

- Add a `dueDate` field to each task.
- Store `dueDate` as an optional ISO date string in `YYYY-MM-DD` format.
- Add a `priority` field to each task.
- Restrict `priority` to `P1`, `P2`, or `P3`.
- Default `priority` to `P3` when a new task does not specify one.
- Keep `title` as a required field.
- Ignore invalid `dueDate` values and treat them as absent.
- Provide three task filters: `All`, `Today`, and `Overdue`.
- In `All`, show both completed and incomplete tasks.
- In `Today`, show only incomplete tasks due today.
- In `Overdue`, show only incomplete tasks with due dates earlier than today.
- Keep persistence local only using the app's existing local storage approach.
- Make no backend changes as part of this work.

## 3. Post-MVP Scope

- Visually highlight overdue tasks so they stand out in the UI.
- Add sorting behavior with the following order: overdue tasks first, then priority from `P1` to `P3`, then due date ascending, then tasks without due dates last.
- Add visual priority badges or color-coding for `P1`, `P2`, and `P3`.

## 4. Out of Scope

- Notifications or reminder features.
- Recurring tasks.
- Multi-user collaboration or sharing.
- Keyboard navigation enhancements or additional accessibility features beyond the current baseline.
- External storage or syncing outside local storage.
- Any new backend service, API, or database changes.