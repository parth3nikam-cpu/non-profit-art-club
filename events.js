const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  });
});

const calendarDays = document.getElementById('calendar-days');
const monthLabel = document.getElementById('month-label');
const selectedDateLabel = document.getElementById('selected-date-label');
const selectedDateStatus = document.getElementById('selected-date-status');
const today = new Date();
today.setHours(0, 0, 0, 0);

let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = new Date(today);

const sameDate = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric'
});

function selectDate(date) {
  selectedDate = new Date(date);
  selectedDateLabel.textContent = fullDateFormatter.format(selectedDate);
  selectedDateStatus.textContent = `No events on ${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(selectedDate)} yet.`;
  renderCalendar();
}

function renderCalendar() {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();

  monthLabel.textContent = monthFormatter.format(visibleMonth);
  calendarDays.replaceChildren();

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(year, month, index - firstWeekday + 1);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'calendar-day';
    button.textContent = date.getDate();
    button.setAttribute('role', 'gridcell');
    button.setAttribute('aria-label', fullDateFormatter.format(date));

    if (date.getMonth() !== month) button.classList.add('outside-month');
    if (sameDate(date, today)) button.classList.add('today');
    if (sameDate(date, selectedDate)) {
      button.classList.add('selected');
      button.setAttribute('aria-selected', 'true');
    }

    button.addEventListener('click', () => {
      if (date.getMonth() !== visibleMonth.getMonth()) {
        visibleMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      }
      selectDate(date);
    });

    calendarDays.appendChild(button);
  }
}

document.getElementById('previous-month').addEventListener('click', () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

document.getElementById('today-button').addEventListener('click', () => {
  visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  selectDate(today);
});

document.getElementById('year').textContent = new Date().getFullYear();
selectedDateLabel.textContent = fullDateFormatter.format(selectedDate);
renderCalendar();
