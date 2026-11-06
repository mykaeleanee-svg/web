// Base View class. Every view extends this one.
// NOTE: if your Week 5 View class differs, keep its method names and adapt the subclasses.

export default class View {
  _parentElement;
  _data;

  constructor(selector) {
    this._parentElement = document.querySelector(selector);
  }

  render(data) {
    this._data = data;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', this._generateMarkup());
  }

  renderError(message) {
    this._clear();
    this._parentElement.insertAdjacentHTML(
      'afterbegin',
      `<p class="error" role="alert">${this._escape(message)}</p>`
    );
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _generateMarkup() {
    throw new Error('Subclasses must implement _generateMarkup()');
  }

  // Stops user text from being treated as HTML.
  _escape(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // Shows hours without ugly decimals: 2 -> "2", 2.5 -> "2.5".
  _formatHours(hours) {
    return String(Number(hours.toFixed(1)));
  }
}
