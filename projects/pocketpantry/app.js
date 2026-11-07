const storageKey = 'pocketpantry-items';
const initialItems = [
  { id: 1, name: 'Avocados', category: 'Produce', price: 4.5, checked: false },
  { id: 2, name: 'Sourdough loaf', category: 'Bakery', price: 3.9, checked: false },
  { id: 3, name: 'Greek yogurt', category: 'Dairy', price: 5.2, checked: true }
];
let items = JSON.parse(localStorage.getItem(storageKey)) || initialItems;
let filter = 'all';
const $ = (selector) => document.querySelector(selector);
const list = $('#items');
const template = $('#item-template');
const save = () => localStorage.setItem(storageKey, JSON.stringify(items));

function render() {
  list.innerHTML = '';
  const visibleItems = filter === 'all' ? items : items.filter((item) => item.category === filter);
  visibleItems.forEach((item) => {
    const fragment = template.content.cloneNode(true);
    const row = fragment.querySelector('.item');
    row.classList.toggle('checked', item.checked);
    fragment.querySelector('.item-copy strong').textContent = item.name;
    fragment.querySelector('.item-copy span').textContent = item.category;
    fragment.querySelector('.price').textContent = `$${item.price.toFixed(2)}`;
    fragment.querySelector('.check').onclick = () => { item.checked = !item.checked; save(); render(); };
    fragment.querySelector('.delete').onclick = () => { items = items.filter((entry) => entry.id !== item.id); save(); render(); };
    list.append(fragment);
  });
  const checked = items.filter((item) => item.checked).length;
  const total = items.filter((item) => !item.checked).reduce((sum, item) => sum + item.price, 0);
  const progress = items.length ? Math.round((checked / items.length) * 100) : 0;
  $('#remaining').textContent = items.length - checked;
  $('#total').textContent = `$${total.toFixed(2)}`;
  $('#progress-label').textContent = `${progress}%`;
  $('#progress').style.width = `${progress}%`;
  $('#empty').hidden = visibleItems.length > 0;
}

$('#item-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = $('#item-name');
  const price = Number($('#item-price').value || 0);
  items.unshift({ id: Date.now(), name: name.value.trim(), category: $('#item-category').value, price, checked: false });
  name.value = ''; $('#item-price').value = ''; save(); render();
});
$('#filters').addEventListener('click', (event) => {
  const button = event.target.closest('button'); if (!button) return;
  filter = button.dataset.filter;
  document.querySelectorAll('.filters button').forEach((entry) => entry.classList.toggle('active', entry === button)); render();
});
$('#clear').onclick = () => { items = items.filter((item) => !item.checked); save(); render(); };
render();
