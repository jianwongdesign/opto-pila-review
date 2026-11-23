const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function toggleMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => toggleMenu(menu.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    toggleMenu(false);
    menu.focus();
  }
});

const form = document.querySelector('#booking');
if (form) {
  const field = id => document.getElementById(id);
  const today = new Date();
  const localDay = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  field('date').min = localDay.toISOString().slice(0, 10);
  const selected = new URLSearchParams(location.search).get('service');
  if ([...field('service').options].some(option => option.value === selected)) {
    field('service').value = selected;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (field('entry').hidden) return;
    const details = [
      ['Session', field('service').selectedOptions[0].text],
      ['Preferred date', new Date(field('date').value + 'T12:00:00').toLocaleDateString(undefined, { dateStyle: 'long' })],
      ['Preferred time', field('time').value],
      ['Name', field('name').value],
      ['Email', field('email').value]
    ];
    field('summary').replaceChildren();
    for (const [label, value] of details) {
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      field('summary').append(term, description);
    }
    field('entry').hidden = true;
    field('review').hidden = false;
    field('review').querySelector('h2').focus();
  });
  field('edit').addEventListener('click', () => {
    field('review').hidden = true;
    field('entry').hidden = false;
    field('service').focus();
  });
  field('send').addEventListener('click', () => {
    form.hidden = true;
    field('received').hidden = false;
    field('received').querySelector('h2').focus();
  });
}
