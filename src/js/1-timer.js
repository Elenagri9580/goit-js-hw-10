'use strick';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const myInput = document.querySelector('#datetime-picker');
const strButton = document.querySelector('button[data-start]');

const dataDays = document.querySelector('span[data-days]');
const dataHours = document.querySelector('span[data-hours]');
const dataMinutes = document.querySelector('span[data-minutes]');
const dataSeconds = document.querySelector('span[data-seconds]');

strButton.addEventListener('click', start);

let userSelectedDate;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    console.log(selectedDates[0]);
    if (userSelectedDate < Date.now()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      strButton.disabled = true;
    } else {
      strButton.disabled = false;
    }
  },
};

flatpickr(myInput, options);

let isActive = false;
let intervalId = null;

function start() {
  if (isActive) {
    return;
  }

  isActive = true;
  intervalId = setInterval(() => {
    const currentTime = Date.now();
    const restTime = userSelectedDate - currentTime;
    const time = convertMs(restTime);
    updateTimer(time);
    if (restTime <= 0) {
      clearInterval(intervalId);
      const newTime = convertMs(0);
      updateTimer(newTime);
    }
  }, 1000);

  if (intervalId) {
    strButton.disabled = true;
    myInput.disabled = true;
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day)); // Remaining days
  const hours = addLeadingZero(Math.floor((ms % day) / hour)); // Remaining hours
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute)); // Remaining minutes
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  ); // Remaining seconds

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  dataDays.innerHTML = `${days}`;
  dataHours.innerHTML = `${hours}`;
  dataMinutes.innerHTML = `${minutes}`;
  dataSeconds.innerHTML = `${seconds}`;
}
