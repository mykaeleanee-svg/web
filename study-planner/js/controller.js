// CONTROLLER: the only file that imports both the model and the views.
// It wires each user action to a model change and a re-render. It builds no HTML.

import * as model from './model.js';
import formView from './views/FormView.js';
import listView from './views/ListView.js';
import summaryView from './views/SummaryView.js';
import navView from './views/NavView.js';

const renderNav = function () {
  navView.render({ page: model.state.page });
};

const renderList = function () {
  listView.render({
    tasks: model.getVisibleTasks(),
    filter: model.state.filter,
    totalCount: model.state.tasks.length,
  });
};

const renderSummary = function () {
  summaryView.render(model.getStats());
};

const renderForm = function () {
  formView.render({ task: model.getEditingTask() });
};

const controlSubmitTask = function (formData) {
  const error = model.validateTask(formData);
  if (error) return formView.renderError(error);

  const wasEditing = Boolean(model.state.editingId);
  if (wasEditing) model.updateTask(model.state.editingId, formData);
  else model.addTask(formData);

  model.setEditing(null);
  renderForm();
  renderList();
  renderSummary();

  if (wasEditing) {
    // After saving an edit, go straight back to the list.
    model.setPage('tasks');
    renderNav();
  } else {
    // After adding, stay on the form and offer a button to see the list.
    formView.renderSuccess('Task added!');
  }
};

const controlEditTask = function (id) {
  model.setEditing(id);
  model.setPage('add');
  renderNav();
  renderForm();
};

const controlCancelEdit = function () {
  model.setEditing(null);
  model.setPage('tasks');
  renderNav();
  renderForm();
};

const controlViewTasks = function () {
  formView.clearSuccess();
  model.setPage('tasks');
  renderNav();
};

const controlDeleteTask = function (id) {
  model.deleteTask(id);
  renderForm();
  renderList();
  renderSummary();
};

const controlToggleDone = function (id) {
  model.toggleDone(id);
  renderList();
  renderSummary();
};

const controlFilter = function (filter) {
  model.setFilter(filter);
  renderList();
};

const controlNavigate = function (page) {
  formView.clearSuccess();

  if (model.state.editingId) {
    model.setEditing(null);
    renderForm();
  }

  model.setPage(page);
  renderNav();
};


const controlClearCompleted = function () {
  model.clearCompleted();
  renderForm();
  renderList();
  renderSummary();
};

const init = function () {
  model.loadState();
  renderNav();
  renderForm();
  renderList();
  renderSummary();

  navView.addHandlerNavigate(controlNavigate);
  formView.addHandlerSubmit(controlSubmitTask);
  formView.addHandlerCancel(controlCancelEdit);
  formView.addHandlerViewTasks(controlViewTasks);
  listView.addHandlerEdit(controlEditTask);
  listView.addHandlerDelete(controlDeleteTask);
  listView.addHandlerToggle(controlToggleDone);
  listView.addHandlerFilter(controlFilter);
  summaryView.addHandlerClearCompleted(controlClearCompleted);
};

init();
