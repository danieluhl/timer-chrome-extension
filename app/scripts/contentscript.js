const SECOND = 1000;
const MINUTE = SECOND * 60;
class Timer {
  timerHtmlHandle;
  timerInterval;
  originalTime;
  currentTime;
  startTimer() {
    this.timerInterval = setInterval(this.tick.bind(this), SECOND);
  }
  stopTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }
  toggleTimer() {
    this.timerInterval ? this.stopTimer() : this.startTimer();
  }
  resetTimer(seedTime = prompt('Enter Timer Minutes') * MINUTE) {
    this.stopTimer();
    this.currentTime = this.originalTime = seedTime;
    this.tick();
  }
  refreshTimer() {
    this.stopTimer();
    this.currentTime = this.originalTime;
    this.tick();
  }
  addMinute() {
    this.currentTime = this.currentTime + MINUTE;
    this.tick();
  }
  tick() {
    const timerText = `${Math.floor(this.currentTime / MINUTE)}:${`${
      (this.currentTime % MINUTE) / SECOND
    }`.padStart(2, '0')}`;

    this.timerHtmlHandle.innerText = timerText;
    this.currentTime = this.currentTime - SECOND;

    if (this.currentTime < 0) {
      this.stopTimer();
    } else if (this.currentTime < MINUTE * 2) {
      // two minute warning
      this.timerHtmlHandle.style.color = '#f5b20a';
    } else if (this.currentTime < MINUTE) {
      // one minute warning
      this.timerHtmlHandle.style.color = '#da521f';
    }
  }
}
const duhlTimer = new Timer();

const addTimer = () => {
  const timerHtml = `
    <div draggable="true" class="duhl-timer">
      <div class="drag"></div>
      <div class="ext-timer">0:00</div>
      <button class="refreshTimer">🔂</button>
      <button class="addMinute">1️⃣</button>
      <button class="resetTimer">🆕</button>
      <button class="toggleTimer">⏯</button>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', timerHtml);
  duhlTimer.timerHtmlHandle = document.querySelector('.ext-timer');
  document
    .querySelector('.duhl-timer .refreshTimer')
    .addEventListener('click', () => duhlTimer.refreshTimer());
  document
    .querySelector('.duhl-timer .addMinute')
    .addEventListener('click', () => duhlTimer.addMinute());
  document
    .querySelector('.duhl-timer .resetTimer')
    .addEventListener('click', () => duhlTimer.resetTimer());
  document
    .querySelector('.duhl-timer .toggleTimer')
    .addEventListener('click', () => duhlTimer.toggleTimer());
  document.querySelector('.duhl-timer').addEventListener('dragend', e => {
    console.log(e);
    e.target.style.top = `${e.pageY}px`;
    e.target.style.left = `${e.pageX}px`;
  });
};

browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
  // only one timer for you!
  if (duhlTimer && duhlTimer.timerHtmlHandle) {
    return;
  }
  addTimer();
  // reflow before starting things or it gets wonky
  setTimeout(() => {
    duhlTimer.resetTimer(5 * MINUTE);
  });
});
