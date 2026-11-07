# STUDY ME

A single-page study planner built with plain JavaScript and an MVC structure on a base `View` class. No libraries, no backend; data is saved in `localStorage`.

**Features:** add / edit / delete tasks, a form with validation, a progress summary that recomputes on every change (percent done, hours left, overdue count, study hours per day needed), filters, a top menu with three screens (Add task, My tasks, Progress; still one page), a "View my tasks" button after adding a task, and data that survives a reload.

## Run it

ES modules do not work from `file://`, so use a local server:

```
npx http-server        # or the VS Code "Live Server" extension
```

## Folder structure

```
study-planner/
├── index.html
├── css/style.css
└── js/
    ├── model.js
    ├── controller.js
    └── views/
        ├── View.js          (base class)
        ├── FormView.js      (member 1)
        ├── ListView.js      (member 2)
        ├── SummaryView.js   (member 3)
        └── NavView.js       (member 3, the menu)
```

## Who owns what (suggested split for 3 members)

| Member | View | Handlers it exposes | Controller functions | Model functions |
|---|---|---|---|---|
| 1 | `FormView.js` | `addHandlerSubmit`, `addHandlerCancel`, `addHandlerViewTasks` | `controlSubmitTask`, `controlCancelEdit`, `controlViewTasks` | `validateTask`, `addTask`, `updateTask` |
| 2 | `ListView.js` | `addHandlerEdit`, `addHandlerDelete`, `addHandlerToggle`, `addHandlerFilter` | `controlEditTask`, `controlDeleteTask`, `controlToggleDone`, `controlFilter` | `deleteTask`, `toggleDone`, `setFilter`, `getVisibleTasks` |
| 3 | `SummaryView.js`, `NavView.js` | `addHandlerClearCompleted`, `addHandlerNavigate` | `controlClearCompleted`, `controlNavigate` | `getStats`, `clearCompleted`, `setPage` |

Shared: `View.js`, `model.js` (state, `loadState`), `controller.js` (`init`).

## MVC rules this code follows

- `model.js` never touches the DOM and imports no view.
- Views extend `View`, never import the model, and only build markup from the data they are given.
- `controller.js` is the only file that imports both, and it builds no HTML.

## Traced action (for Section 5 and the video): adding a task

1. User submits the form in `FormView.js`; `addHandlerSubmit` reads the fields and calls the handler.
2. `controlSubmitTask(formData)` in `controller.js` runs `model.validateTask`. On an error it calls `formView.renderError(...)` and stops.
3. Otherwise it calls `model.addTask(formData)`, which updates `state.tasks` and saves to `localStorage`.
4. The controller calls `formView.render(...)`, `listView.render(...)` and `summaryView.render(model.getStats())`.
5. Each view rebuilds its markup, and the new task and updated totals appear on screen.

## How the menu works (still a single-page app)

There is only one HTML file. `state.page` in the model is `'add'`, `'tasks'` or `'progress'`. After a task is added, `controlSubmitTask` calls `formView.renderSuccess`, which shows "Task added!" and a "View my tasks" button; clicking it runs `controlViewTasks`, which sets the page to `'tasks'`. Editing a task from the list switches to the Add task screen, and saving or cancelling goes back to the list. When the user clicks a tab, `NavView` calls `controlNavigate`, the controller calls `model.setPage` and re-renders `NavView`, and `NavView.render` sets `document.body.dataset.page`. The CSS then shows one screen and hides the other. Nothing is reloaded and no other HTML file is opened.

## Before you submit

- Check that `View.js` matches your Week 5 base class (method names, `render`, `_clear`). Adjust the views if it does not.
- Each member should make at least 5 commits under their own GitHub account (for example: build your view, then style it, fix a bug, add a test case, write your report part). Do not commit everything at once.
- Publish with GitHub Pages (Settings, Pages, deploy from `main`, root folder).
- Disclose any AI help in Section 11 of the report, and be ready to explain every line you list as yours.
