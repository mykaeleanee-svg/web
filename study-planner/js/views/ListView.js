import View from './View.js';

// Task list with filter buttons. Edit, delete and done-checkbox all use event delegation.
class ListView extends View {
  constructor() {
    super('.task-list-container');
  }

  // data = { tasks, filter, totalCount }
  _generateMarkup() {
    const { tasks, filter, totalCount } = this._data;
    const filters = [
      ['all', 'All'],
      ['pending', 'To do'],
      ['done', 'Done'],
    ];
    const bar = filters
      .map(
        ([key, label]) =>
          `<button type="button" class="chip ${key === filter ? 'chip--active' : ''}" data-filter="${key}">${label}</button>`
      )
      .join('');

    let body;
    if (tasks.length > 0) {
      body = `<ul class="task-list">${tasks.map(t => this._generateTaskMarkup(t)).join('')}</ul>`;
    } else if (totalCount === 0) {
      body = '<p class="empty">No tasks yet. Add your first one in the Add task tab.</p>';
    } else {
      body = '<p class="empty">Nothing here for this filter.</p>';
    }

    return `
      <div class="list-header">
        <h2>Your tasks</h2>
        <div class="filters">${bar}</div>
      </div>
      ${body}`;
  }

  _generateTaskMarkup(task) {
    const classes = ['task'];
    if (task.done) classes.push('task--done');
    if (task.overdue) classes.push('task--overdue');
    return `
      <li class="${classes.join(' ')}" data-id="${this._escape(task.id)}">
        <input type="checkbox" class="task__check" ${task.done ? 'checked' : ''}
               aria-label="Mark ${this._escape(task.title)} as done" />
        <div class="task__body">
          <p class="task__title">${this._escape(task.title)}</p>
          <p class="task__meta">
            <span class="tag">${this._escape(task.subject)}</span>
            Due ${this._formatDate(task.dueDate)} · ${this._formatHours(task.hours)} h
            ${task.overdue ? '<span class="badge">Overdue</span>' : ''}
          </p>
        </div>
        <div class="task__actions">
          <button type="button" class="btn btn--small" data-action="edit">Edit</button>
          <button type="button" class="btn btn--small btn--danger" data-action="delete">Delete</button>
        </div>
      </li>`;
  }

  _formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  _idFrom(el) {
    return el.closest('.task')?.dataset.id;
  }

  /* ----- handlers the controller subscribes to ----- */

  addHandlerToggle(handler) {
    this._parentElement.addEventListener('change', e => {
      if (!e.target.classList.contains('task__check')) return;
      handler(this._idFrom(e.target));
    });
  }

  addHandlerEdit(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="edit"]');
      if (btn) handler(this._idFrom(btn));
    });
  }

  addHandlerDelete(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('[data-action="delete"]');
      if (btn) handler(this._idFrom(btn));
    });
  }

  addHandlerFilter(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('[data-filter]');
      if (btn) handler(btn.dataset.filter);
    });
  }
}

export default new ListView();
