const storageKey = 'focusflow-tasks';
const seed = [
  { id: 1, text: 'Review the product brief', priority: 'high', done: false },
  { id: 2, text: 'Sketch the dashboard layout', priority: 'medium', done: false },
  { id: 3, text: 'Book a 20-minute focus block', priority: 'low', done: true }
];
let tasks = JSON.parse(localStorage.getItem(storageKey)) || seed;
const $ = (selector) => document.querySelector(selector);
const list = $('#task-list');
const template = $('#task-template');

function save() { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
function render() {
  list.innerHTML = '';
  tasks.forEach((task) => {
    const node = template.content.cloneNode(true);
    const row = node.querySelector('.task');
    row.classList.toggle('done', task.done);
    node.querySelector('.task-text').textContent = task.text;
    const badge = node.querySelector('.priority');
    badge.textContent = task.priority;
    badge.classList.add(task.priority);
    node.querySelector('.check').onclick = () => { task.done = !task.done; save(); render(); };
    node.querySelector('.delete').onclick = () => { tasks = tasks.filter((item) => item.id !== task.id); save(); render(); };
    list.append(node);
  });
  const done = tasks.filter((task) => task.done).length;
  const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  $('#total-count').textContent = tasks.length;
  $('#done-count').textContent = done;
  $('#progress-label').textContent = `${percent}%`;
  $('#progress-bar').style.width = `${percent}%`;
  $('#empty-state').hidden = tasks.length > 0;
}

$('#task-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#task-input');
  tasks.unshift({ id: Date.now(), text: input.value.trim(), priority: $('#priority').value, done: false });
  input.value = ''; save(); render();
});
$('#clear-done').onclick = () => { tasks = tasks.filter((task) => !task.done); save(); render(); };
$('#date').textContent = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());
render();
