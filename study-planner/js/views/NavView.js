import View from './View.js';

// Top menu that switches between the two screens.
// It is still ONE page (index.html): the menu only changes which screen is visible.
class NavView extends View {
  constructor() {
    super('.nav-container');
  }

  // data = { page } where page is 'add', 'tasks' or 'progress'
  _generateMarkup() {
    const tabs = [
      ['add', 'Add task'],
      ['tasks', 'My tasks'],
      ['progress', 'Progress'],
    ];
    return tabs
      .map(([key, label]) => {
        const active = key === this._data.page;
        return `<button type="button" class="tab ${active ? 'tab--active' : ''}"
                  data-page="${key}" ${active ? 'aria-current="page"' : ''}>${label}</button>`;
      })
      .join('');
  }

  // Also tells the page which screen to show. The CSS reads this attribute to hide the other screen.
  render(data) {
    super.render(data);
    document.body.dataset.page = data.page;
  }

  /* ----- handler the controller subscribes to ----- */

  addHandlerNavigate(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('[data-page]');
      if (btn) handler(btn.dataset.page);
    });
  }
}

export default new NavView();
