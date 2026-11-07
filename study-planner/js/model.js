// MODEL: holds all data, changes it, saves it. Never touches the DOM or imports a view.

const STORAGE_KEY = 'study-planner-v1';
const FILTERS = ['all', 'pending', 'done'];
const PAGES = ['add', 'tasks', 'progress'];

export const state = {
  tasks: [], // { id, subject, title, dueDate: 'YYYY-MM-DD', hours, done }
  filter: 'all', // 'all' | 'pending' | 'done'
  editingId: null, // id of the task being edited, or null
  page: 'add', // which screen is showing: 'add' | 'tasks' | 'progress' (not saved)
};

/* ---------- localStorage ---------- */

const persist = function () {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks: state.tasks, filter: state.filter })
    );
  } catch (err) {
    console.error('Could not save to localStorage:', err);
  }
};

export const loadState = function () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    state.tasks = Array.isArray(saved.tasks) ? saved.tasks : [];
    state.filter = FILTERS.includes(saved.filter) ? saved.filter : 'all';
  } catch (err) {
    console.error('Could not read saved data, starting fresh:', err);
    state.tasks = [];
    state.filter = 'all';
  }
};

/* ---------- date helpers ---------- */

const toDateString = function (date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const daysBetween = function (fromStr, toStr) {
  const [fy, fm, fd] = fromStr.split('-').map(Number);
  const [ty, tm, td] = toStr.split('-').map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000);
};

/* ---------- validation ---------- */

// Returns an error message string, or null if the data is valid.
export const validateTask = function (data) {
  const subject = String(data.subject ?? '').trim();
  const title = String(data.title ?? '').trim();
  const dueDate = String(data.dueDate ?? '').trim();
  const hoursRaw = String(data.hours ?? '').trim();
  const hours = Number(hoursRaw);

  
if (!subject) return 'Please enter a subject.';
if (!title) return 'Please describe what you need to study or finish.';
if (!dueDate) return 'Please pick a due date.';

// Check if the due date is in the past
const today = toDateString(new Date());

if (dueDate < today) {
  return 'Due date cannot be in the past.';
}

if (!hoursRaw || Number.isNaN(hours) || hours <= 0)
  return 'Estimated hours must be a number greater than 0.';
if (hours > 100) return 'Estimated hours cannot be more than 100.';

  if (hours > 100) return 'Estimated hours cannot be more than 100.';
  return null;
};

const cleanTaskData = function (data) {
  return {
    subject: String(data.subject).trim(),
    title: String(data.title).trim(),
    dueDate: String(data.dueDate).trim(),
    hours: Number(data.hours),
  };
};

/* ---------- functions that change state ---------- */

export const addTask = function (data) {
  const task = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    ...cleanTaskData(data),
    done: false,
  };
  state.tasks.push(task);
  persist();
  return task;
};

export const updateTask = function (id, data) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return null;
  Object.assign(task, cleanTaskData(data));
  persist();
  return task;
};

export const deleteTask = function (id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  if (state.editingId === id) state.editingId = null;
  persist();
};

export const toggleDone = function (id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  persist();
};

export const clearCompleted = function () {
  state.tasks = state.tasks.filter(t => !t.done);
  if (!state.tasks.some(t => t.id === state.editingId)) state.editingId = null;
  persist();
};

export const setFilter = function (filter) {
  state.filter = FILTERS.includes(filter) ? filter : 'all';
  persist();
};

export const setEditing = function (id) {
  state.editingId = id;
};

export const setPage = function (page) {
  state.page = PAGES.includes(page) ? page : 'add';
};

/* ---------- functions that read state ---------- */

export const getEditingTask = function () {
  return state.tasks.find(t => t.id === state.editingId) ?? null;
};

// Tasks for the current filter, soonest due date first, each flagged if overdue.
export const getVisibleTasks = function (today = toDateString(new Date())) {
  return state.tasks
    .filter(t => {
      if (state.filter === 'pending') return !t.done;
      if (state.filter === 'done') return t.done;
      return true;
    })
    .map(t => ({ ...t, overdue: !t.done && t.dueDate < today }))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
};

// Derived values: these recompute every time the tasks change.
export const getStats = function (today = toDateString(new Date())) {
  const tasks = state.tasks;
  const pending = tasks.filter(t => !t.done);
  const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
  const doneHours = tasks.filter(t => t.done).reduce((sum, t) => sum + t.hours, 0);
  const remainingHours = totalHours - doneHours;
  const progress = totalHours > 0 ? Math.round((doneHours / totalHours) * 100) : 0;
  const overdueCount = pending.filter(t => t.dueDate < today).length;

  // Hours per day needed to finish everything pending by the last due date.
  let daysLeft = 0;
  let hoursPerDay = 0;
  if (pending.length > 0) {
    const lastDue = pending.map(t => t.dueDate).sort().at(-1);
    daysLeft = Math.max(1, daysBetween(today, lastDue) + 1);
    hoursPerDay = Math.round((remainingHours / daysLeft) * 10) / 10;
  }

  return {
    taskCount: tasks.length,
    doneCount: tasks.length - pending.length,
    totalHours,
    doneHours,
    remainingHours,
    progress,
    overdueCount,
    daysLeft,
    hoursPerDay,
  };
};
