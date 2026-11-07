import View from './View.js';

// Add / edit form. Renders validation errors passed in by the controller.
class FormView extends View {
  constructor() {
    super('.task-form-container');
  }

  // data = { task } where task is null (add mode) or a task object (edit mode)
  _generateMarkup() {
    const task = this._data?.task ?? null;
    const v = key => (task ? this._escape(task[key]) : '');
    return `
      <form class="task-form" novalidate>
        <h2>${task ? 'Edit task' : 'Add a task'}</h2>
        <label for="subject">Subject</label>
<input
  type="text"
  id="subject"
  name="subject"
  placeholder="e.g. Web Systems"
  value="${v('subject')}"
/>
        <label>What to do
          <input type="text" name="title" placeholder="e.g. Review MVC notes" value="${v('title')}" />
        </label>
        <div class="form-row">
          <label>Due date
            <input type="date" name="dueDate" value="${v('dueDate')}" />
          </label>
          <label>Estimated hours
            <input type="number" name="hours" step="0.5" min="0" placeholder="2" value="${v('hours')}" />
          </label>
        </div>
        <p class="form-error" role="alert" hidden></p>
        <div class="form-success" hidden>
          <p class="form-success__text"></p>
          <button type="button" class="btn btn--primary" data-action="view-tasks">View my tasks</button>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn--primary">${task ? 'Save changes' : 'Add task'}</button>
          ${task ? '<button type="button" class="btn btn--ghost" data-action="cancel">Cancel</button>' : ''}
        </div>
      </form>`;
  }

  // Overrides the base method: show the message inside the form so typed values stay.
  renderError(message) {
    const el = this._parentElement.querySelector('.form-error');
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }

  // Shows "Task added!" and the button that leads to the list.
  renderSuccess(message) {
    const box = this._parentElement.querySelector('.form-success');
    if (!box) return;
    box.querySelector('.form-success__text').textContent = message;
    box.hidden = false;
  }

  clearSuccess() {
    const box = this._parentElement.querySelector('.form-success');
    if (box) box.hidden = true;
  }

  /* ----- handlers the controller subscribes to ----- */

  addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const form = e.target.closest('.task-form');
      if (!form) return;
      handler(Object.fromEntries(new FormData(form)));
    });
  }

  addHandlerCancel(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('[data-action="cancel"]')) handler();
    });
  }

  addHandlerViewTasks(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('[data-action="view-tasks"]')) handler();
    });
  }
}

export default new FormView();
