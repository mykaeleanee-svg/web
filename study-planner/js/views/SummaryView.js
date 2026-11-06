import View from './View.js';

// Progress summary: shows the derived values the model computes.
class SummaryView extends View {
  constructor() {
    super('.summary-container');
  }

  // data = the stats object from model.getStats()
  _generateMarkup() {
    const s = this._data;
    const planLine =
      s.daysLeft > 0
        ? `Study about <strong>${this._formatHours(s.hoursPerDay)} h/day</strong> for the next ${s.daysLeft} day${s.daysLeft === 1 ? '' : 's'} to finish on time.`
        : 'Nothing pending. Nice work!';

    return `
      <h2>Progress</h2>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.progress}">
        <div class="progress__bar" style="width: ${s.progress}%"></div>
      </div>
      <p class="progress__label">${s.progress}% of planned hours done</p>
      <dl class="stats">
        <div><dt>Tasks done</dt><dd>${s.doneCount} / ${s.taskCount}</dd></div>
        <div><dt>Hours left</dt><dd>${this._formatHours(s.remainingHours)}</dd></div>
        <div><dt>Overdue</dt><dd class="${s.overdueCount > 0 ? 'stat--alert' : ''}">${s.overdueCount}</dd></div>
      </dl>
      <p class="plan">${planLine}</p>
      <button type="button" class="btn btn--ghost btn--block" data-action="clear-completed" ${s.doneCount === 0 ? 'disabled' : ''}>
        Clear completed tasks
      </button>`;
  }

  /* ----- handler the controller subscribes to ----- */

  addHandlerClearCompleted(handler) {
    this._parentElement.addEventListener('click', e => {
      if (e.target.closest('[data-action="clear-completed"]')) handler();
    });
  }
}

export default new SummaryView();
