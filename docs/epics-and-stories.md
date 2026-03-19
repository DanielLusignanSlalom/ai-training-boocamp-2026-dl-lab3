# Epics and Stories - Todo App Upgrade

## Implementation Context

- The PRD defines local-only persistence and no backend changes.
- The current implementation persists tasks through the existing Express API in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) and renders them in the React frontend in [packages/frontend/src/App.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/App.js), [packages/frontend/src/TaskForm.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskForm.js), and [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js).
- The technical requirements below are therefore derived from the PRD but constrained to the current codebase. They assume the work will extend the existing frontend and backend implementation rather than introduce a separate storage path.

## MVP Epics

- Epic: Task Metadata Management
  - Story: Add due date input to task create and edit flows
    - Acceptance Criteria:
      - The task form includes a due date field when creating a task.
      - The due date field remains optional.
      - A saved due date uses ISO `YYYY-MM-DD` format.
      - Editing an existing task pre-populates the due date field when a due date exists.
      - Clearing the due date in edit mode saves the task without a due date.
    - Technical Requirements:
      - Extend the existing form state in [packages/frontend/src/TaskForm.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskForm.js) to keep using the current `due_date` payload shape expected by the API.
      - Preserve and reuse the current date normalization logic already present in [packages/frontend/src/TaskForm.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskForm.js).
      - Continue submitting create and edit operations through the existing `handleSave` flow in [packages/frontend/src/App.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/App.js).
      - Ensure the backend create and update handlers in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) accept an optional due date value.

  - Story: Add priority selection to task create and edit flows
    - Acceptance Criteria:
      - The task form includes a priority field when creating a task.
      - The priority field supports only `P1`, `P2`, and `P3`.
      - Editing an existing task pre-populates the saved priority.
      - A task can be saved successfully with any allowed priority value.
    - Technical Requirements:
      - Add priority form state and UI controls in [packages/frontend/src/TaskForm.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskForm.js) using the existing MUI component approach.
      - Update the request payload built in [packages/frontend/src/App.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/App.js) to include priority on both POST and PUT operations.
      - Extend the task schema in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) to store a priority column compatible with `P1`, `P2`, and `P3`.
      - Return priority consistently from GET, POST, PUT, and PATCH responses so [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js) can render it without extra transformation.

  - Story: Default task priority to P3
    - Acceptance Criteria:
      - A newly created task defaults to `P3` when the user does not actively change the priority value.
      - The saved task response includes `P3` as the priority when no other value is provided.
      - The edit flow preserves the existing saved priority instead of resetting it to `P3`.
    - Technical Requirements:
      - Initialize the frontend priority control in [packages/frontend/src/TaskForm.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskForm.js) to `P3` for new tasks only.
      - Enforce a backend default in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) so API callers also receive `P3` when priority is omitted.
      - Cover the default behavior in backend tests in [packages/backend/__tests__/tasks.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/__tests__/tasks.test.js) and frontend interaction tests in [packages/frontend/src/__tests__/App.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/__tests__/App.test.js).

  - Story: Enforce task field validation rules
    - Acceptance Criteria:
      - A task cannot be saved without a title.
      - Empty or whitespace-only titles are rejected.
      - Invalid due date values are ignored and treated as if no due date was supplied.
      - Priority values outside `P1`, `P2`, and `P3` are rejected.
    - Technical Requirements:
      - Keep the existing title validation behavior in [packages/frontend/src/TaskForm.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskForm.js) and [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) as the baseline.
      - Add backend request validation in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) for priority enum values and due date format handling.
      - Normalize invalid due date input to `null` before insert and update operations in the backend so filtering logic can treat it as absent.
      - Add regression coverage for invalid title, invalid priority, and invalid due date cases in [packages/backend/__tests__/tasks.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/__tests__/tasks.test.js).

- Epic: Task Filtering Experience
  - Story: Add filter controls for All, Today, and Overdue
    - Acceptance Criteria:
      - The task list screen exposes three filters: `All`, `Today`, and `Overdue`.
      - The `All` filter is available at initial load.
      - Selecting a filter updates the visible task list.
      - Only one filter is active at a time.
    - Technical Requirements:
      - Add filter state to either [packages/frontend/src/App.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/App.js) or [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js), keeping ownership consistent with the current refresh-based data flow.
      - Implement the filter UI with existing MUI components so it matches the established frontend patterns.
      - Pass the active filter into the task-fetching logic currently inside [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js).
      - Extend the GET `/api/tasks` handler in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) with filter-aware query handling or return enough data for a frontend-only filter strategy.

  - Story: Show completed and incomplete tasks in All view
    - Acceptance Criteria:
      - The `All` filter shows tasks regardless of completion status.
      - Completed tasks continue to appear visually distinct from incomplete tasks.
      - Switching back to `All` restores the full task set.
    - Technical Requirements:
      - Preserve the existing completed styling already implemented in [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js).
      - Ensure `All` does not add a completion-state restriction when tasks are fetched or filtered.
      - Keep the existing PATCH completion flow in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) compatible with the filtered list refresh cycle.

  - Story: Show only incomplete tasks due today in Today view
    - Acceptance Criteria:
      - The `Today` filter shows only incomplete tasks with a due date equal to the current date.
      - Completed tasks due today are excluded.
      - Tasks without a due date are excluded.
      - Tasks due on dates other than today are excluded.
    - Technical Requirements:
      - Use a single date-comparison strategy across frontend and backend to avoid timezone drift, matching the local date parsing approach already used in [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js).
      - If filtering is backend-driven, add query support in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) that compares against today using stored `YYYY-MM-DD` values.
      - If filtering is frontend-driven, ensure the fetch response includes `due_date` and `completed` for all tasks.
      - Add tests covering today-filter behavior in [packages/frontend/src/__tests__/App.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/__tests__/App.test.js).

  - Story: Show only incomplete overdue tasks in Overdue view
    - Acceptance Criteria:
      - The `Overdue` filter shows only incomplete tasks with due dates earlier than the current date.
      - Completed overdue tasks are excluded.
      - Tasks due today are excluded.
      - Tasks without a due date are excluded.
    - Technical Requirements:
      - Reuse the same filter plumbing introduced for `Today` so the view logic stays consistent.
      - Compare overdue status against normalized `YYYY-MM-DD` values rather than localized display strings.
      - Extend backend or frontend filtering logic to exclude completed and undated tasks explicitly.
      - Add tests for overdue filtering edge cases in [packages/frontend/src/__tests__/App.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/__tests__/App.test.js) and, if backend filtering is added, in [packages/backend/__tests__/tasks.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/__tests__/tasks.test.js).

- Epic: Task Data Persistence and Contract Alignment
  - Story: Persist due date and priority in the task API
    - Acceptance Criteria:
      - Creating a task saves its due date and priority when provided.
      - Updating a task saves changes to due date and priority.
      - Fetching tasks returns due date and priority for each task.
      - Existing task operations continue to work with the expanded task shape.
    - Technical Requirements:
      - Update the SQLite schema in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) to include priority while preserving current columns and endpoints.
      - Update create, list, detail, and update SQL statements in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) to read and write the new field.
      - Keep the frontend request and response contract aligned to the current snake_case API naming already used for `due_date`.
      - Expand backend API tests in [packages/backend/__tests__/tasks.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/__tests__/tasks.test.js) so the contract is enforced.

  - Story: Preserve existing task management behavior with new task fields
    - Acceptance Criteria:
      - Users can still create, edit, complete, and delete tasks after metadata changes are introduced.
      - Existing tasks without the new fields continue to render successfully.
      - The UI still loads tasks and handles empty and error states.
    - Technical Requirements:
      - Keep the current fetch and refresh flow in [packages/frontend/src/App.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/App.js) and [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js) intact while extending task rendering.
      - Avoid breaking the existing GET, POST, PUT, PATCH, and DELETE endpoints in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js).
      - Extend the existing frontend test coverage in [packages/frontend/src/__tests__/App.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/__tests__/App.test.js) rather than replacing the current scenarios.

## Post-MVP Epics

- Epic: Visual Priority and Urgency Indicators
  - Story: Highlight overdue tasks in the task list
    - Acceptance Criteria:
      - Overdue incomplete tasks are visually distinct from non-overdue tasks.
      - The overdue treatment is visible in `All` and `Overdue` views.
      - Completed tasks are not emphasized as overdue.
    - Technical Requirements:
      - Add overdue-state styling in [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js) by extending the existing per-task MUI `sx` styling.
      - Derive overdue status from stored `due_date` and `completed` fields instead of display text.
      - Keep the styling layered with the current completed-state styles so visual rules do not conflict.

  - Story: Display color-coded priority badges
    - Acceptance Criteria:
      - Each task shows its priority as a visible badge.
      - `P1`, `P2`, and `P3` use distinct visual treatments.
      - Tasks without an explicit stored priority still render as `P3`.
    - Technical Requirements:
      - Extend [packages/frontend/src/TaskList.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/frontend/src/TaskList.js) to render a MUI `Chip` or equivalent component for priority alongside the existing due date chip.
      - Centralize priority-to-color mapping in the frontend so the badge logic is consistent across list states.
      - Ensure the API responses from [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js) always return a resolved priority value.

- Epic: Task Ordering by Urgency
  - Story: Sort tasks by overdue status, priority, due date, and undated status
    - Acceptance Criteria:
      - Overdue tasks appear before non-overdue tasks.
      - Within the same overdue state, tasks are ordered by priority from `P1` to `P3`.
      - Tasks with the same overdue state and priority are ordered by ascending due date.
      - Tasks without due dates appear after dated tasks.
    - Technical Requirements:
      - Replace or extend the current SQL ordering in [packages/backend/src/app.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/src/app.js), which today sorts only by due date and creation time.
      - Define a single canonical ordering strategy in the backend so the frontend receives tasks in display order without reimplementing sort rules in multiple places.
      - Add backend tests that verify sort precedence across overdue, priority, due date, and undated combinations in [packages/backend/__tests__/tasks.test.js](/workspaces/ai-training-boocamp-2026-dl-lab3/packages/backend/__tests__/tasks.test.js).