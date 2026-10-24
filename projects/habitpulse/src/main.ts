import './styles.css';

type Habit = { id: string; name: string; completedDays: boolean[] };

const storageKey = 'habitpulse-habits';
const initialHabits: Habit[] = [
  { id: 'read', name: 'Read for 15 minutes', completedDays: [true, true, false, false, false, false, false] },
  { id: 'walk', name: 'Take a mindful walk', completedDays: [true, false, true, false, false, false, false] },
  { id: 'water', name: 'Drink 6 glasses of water', completedDays: [true, true, true, false, false, false, false] }
];

const $ = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

let habits: Habit[] = JSON.parse(localStorage.getItem(storageKey) ?? 'null') ?? initialHabits;
const list = $('#habit-list');
const template = $('#habit-template') as HTMLTemplateElement;

function save(): void { localStorage.setItem(storageKey, JSON.stringify(habits)); }

function updateOverview(): void {
  const total = habits.length * 7;
  const completed = habits.reduce((sum, habit) => sum + habit.completedDays.filter(Boolean).length, 0);
  const score = total ? Math.round((completed / total) * 100) : 0;
  $('#weekly-score').textContent = `${score}%`;
  $('#progress-bar').setAttribute('style', `width: ${score}%`);
  $('#score-message').textContent = score >= 70 ? 'You are building real momentum.' : score ? 'Small actions add up. Keep going.' : 'Start with one check-in today.';
  $('#empty-state').toggleAttribute('hidden', habits.length > 0);
}

function render(): void {
  list.innerHTML = '';
  habits.forEach((habit) => {
    const row = template.content.cloneNode(true) as DocumentFragment;
    row.querySelector<HTMLElement>('.habit-name')!.textContent = habit.name;
    const grid = row.querySelector<HTMLDivElement>('.check-grid')!;
    habit.completedDays.forEach((checked, day) => {
      const button = document.createElement('button');
      button.className = `day-check${checked ? ' checked' : ''}`;
      button.type = 'button';
      button.ariaLabel = `${habit.name}, day ${day + 1}`;
      button.addEventListener('click', () => { habit.completedDays[day] = !habit.completedDays[day]; save(); render(); });
      grid.append(button);
    });
    row.querySelector<HTMLButtonElement>('.remove')!.addEventListener('click', () => { habits = habits.filter((item) => item.id !== habit.id); save(); render(); });
    list.append(row);
  });
  updateOverview();
}

$('#habit-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#habit-input') as HTMLInputElement;
  habits.unshift({ id: crypto.randomUUID(), name: input.value.trim(), completedDays: Array(7).fill(false) });
  input.value = ''; save(); render();
});

$('#reset').addEventListener('click', () => { habits = habits.map((habit) => ({ ...habit, completedDays: Array(7).fill(false) })); save(); render(); });
$('#today').textContent = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date());
render();
