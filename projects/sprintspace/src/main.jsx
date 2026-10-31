import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const seed = [
  { id: 1, title: 'Map the user flow', tag: 'Design', status: 'todo' },
  { id: 2, title: 'Build the landing page', tag: 'Frontend', status: 'progress' },
  { id: 3, title: 'Write the handoff notes', tag: 'Content', status: 'done' }
];
const columns = [
  { key: 'todo', label: 'To do', color: 'blue' },
  { key: 'progress', label: 'In progress', color: 'orange' },
  { key: 'done', label: 'Complete', color: 'green' }
];

function App() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('sprintspace-tasks')) || seed);
  const [text, setText] = useState('');
  const [tag, setTag] = useState('Frontend');
  const persist = (next) => { setTasks(next); localStorage.setItem('sprintspace-tasks', JSON.stringify(next)); };
  const completed = useMemo(() => tasks.filter((task) => task.status === 'done').length, [tasks]);
  const addTask = (event) => { event.preventDefault(); if (!text.trim()) return; persist([{ id: Date.now(), title: text.trim(), tag, status: 'todo' }, ...tasks]); setText(''); };
  const moveTask = (id, direction) => {
    const index = columns.findIndex((column) => column.key === tasks.find((task) => task.id === id).status);
    const nextColumn = columns[index + direction];
    if (nextColumn) persist(tasks.map((task) => task.id === id ? { ...task, status: nextColumn.key } : task));
  };
  return <main className="shell">
    <header><div><p className="eyebrow">PROJECT WORKSPACE</p><h1>SprintSpace</h1><p className="lede">Make room for focused work.</p></div><div className="score"><strong>{completed}</strong><span>of {tasks.length} completed</span></div></header>
    <section className="composer"><form onSubmit={addTask}><input value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs to move forward?" maxLength="70" /><select value={tag} onChange={(e) => setTag(e.target.value)}><option>Frontend</option><option>Design</option><option>Content</option></select><button>Add task</button></form></section>
    <section className="board">{columns.map((column) => <div className="column" key={column.key}><div className="column-title"><span className={column.color}></span><h2>{column.label}</h2><b>{tasks.filter((task) => task.status === column.key).length}</b></div><div className="cards">{tasks.filter((task) => task.status === column.key).map((task) => <article className="task" key={task.id}><p>{task.title}</p><footer><em>{task.tag}</em><span><button onClick={() => moveTask(task.id, -1)} disabled={column.key === 'todo'} aria-label="Move task back">←</button><button onClick={() => moveTask(task.id, 1)} disabled={column.key === 'done'} aria-label="Move task forward">→</button></span></footer></article>)}</div></div>)}</section>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
