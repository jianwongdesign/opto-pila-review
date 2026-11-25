for (const planner of document.querySelectorAll('.visit-planner')) {
  const topics = planner.querySelectorAll('.planner-topics article');
  const layout = planner.querySelector('.planner-layout');
  if (!layout || !topics.length) continue;

  const sheet = document.createElement('aside');
  sheet.className = 'planner-sheet';
  sheet.setAttribute('aria-label', 'Your visit list');
  sheet.innerHTML = `
    <h3>Your visit list</h3>
    <p class="planner-status" role="status"></p>
    <ol></ol>
    <a class="planner-save" download="OsteoMotion-visit-questions.txt" hidden>Save question list</a>
  `;
  const list = sheet.querySelector('ol');
  const status = sheet.querySelector('.planner-status');
  const save = sheet.querySelector('.planner-save');
  const selected = new Set();

  function updateList() {
    const questions = Array.from(topics)
      .filter(topic => selected.has(topic))
      .map(topic => topic.querySelector('.planner-question').textContent.trim());
    list.replaceChildren(...questions.map(question => {
      const item = document.createElement('li');
      item.textContent = question;
      return item;
    }));
    const total = questions.length;
    status.textContent = total
      ? total + (total === 1 ? ' question selected' : ' questions selected')
      : 'Select the questions you want to take with you.';
    list.hidden = save.hidden = total === 0;
    if (total) {
      const lines = questions.map((question, index) => (index + 1) + '. ' + question);
      save.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(['OsteoMotion — My visit questions', '', ...lines].join('\n'));
    } else {
      save.removeAttribute('href');
    }
  }

  for (const topic of topics) {
    const question = topic.querySelector('.planner-question');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('aria-label', question.textContent.trim());
    label.className = 'planner-choice';
    label.append(checkbox, question.textContent.trim());
    question.replaceChildren(label);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selected.add(topic);
      else selected.delete(topic);
      updateList();
    });
  }
  updateList();
  layout.append(sheet);
}
