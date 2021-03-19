import getRandom from '../helpers/get-random-int';

export default class Radiometer {
  constructor() {
    this.imp = {
      field: [],
      drug: [],
      lead: [],
      steel: [],
      aluminum: []
    };
    this.minutes = 1;
    this.isRunning = false;
    this.type = 'field';
    this.intervals = [];
    this.timeouts = [];
    this.datePast = new Date();
    this.dateNow = new Date();

    this.updateDisplay(0);
    this.rotateKnob(1);
    this.resetLamps();

    document.querySelector(`[data-type='${this.type}']`).classList.toggle('active-panel-btn');
  }

  setDate(datePast, dateNow) {
    this.datePast = datePast;
    this.dateNow = dateNow;
  }

  setTimer() {
    const timer = document.getElementById('timer');
    const delta = Math.abs(this.dateNow - this.datePast) / 1000;
    const minutes = Math.floor(delta / 60) % 60;
    const seconds = Math.floor(delta % 60);

    timer.innerHTML = `${minutes}:${seconds.toString().length < 2 ? `0${seconds}` : seconds}`;
  }

  resetLamps(position) {
    const lamps = Object.values(document.getElementsByClassName('lamp'));
    lamps
      .filter((lamp) => lamp.classList.contains('active-lamp'))
      .forEach((lamp) => lamp.classList.toggle('active-lamp'));
    lamps.filter((_, i) => i < (position || this.minutes)).forEach((lamp) => lamp.classList.toggle('active-lamp'));
  }

  rotateKnob(position) {
    if (!this.isRunning && !position) {
      document
        .getElementById('audio-rotate-knob-right')
        .cloneNode(true)
        .play();
      this.minutes = this.minutes === 5 ? (this.minutes = 1) : (this.minutes += 1);
      this.resetLamps();
    }

    if (position) {
      document
        .getElementById('audio-rotate-knob-left')
        .cloneNode(true)
        .play();
    }

    const knob = document.getElementById('knob');
    switch (position || this.minutes) {
      case 1:
        if (position) this.resetLamps(position);
        knob.style.transform = 'rotate(-40deg)';
        break;
      case 2:
        if (position) this.resetLamps(position);
        knob.style.transform = 'rotate(-25deg)';
        break;
      case 3:
        if (position) this.resetLamps(position);
        knob.style.transform = 'rotate(0deg)';
        break;
      case 4:
        if (position) this.resetLamps(position);
        knob.style.transform = 'rotate(25deg)';
        break;
      case 5:
        if (position) this.resetLamps(position);
        knob.style.transform = 'rotate(40deg)';
        break;
      default:
    }
  }

  runTimer(currentMinute, imps) {
		const generatedImps = this.generateImps();
    this.setTimer();
    let currentImps = imps || 0;
    this.intervals.push(
      setInterval(() => {
        currentImps += 1;
        this.updateDisplay(currentImps);
      }, Math.floor(60000 / generatedImps))
    );

    let secondsPassed = 0;
    this.intervals.push(
      setInterval(() => {
        this.setDate(new Date(), this.dateNow);
        this.setTimer();
        secondsPassed += 1;
        return secondsPassed % 2
          ? document
              .getElementById('audio-tick-2')
              .cloneNode(true)
              .play()
          : document
              .getElementById('audio-tick-1')
              .cloneNode(true)
              .play();
      }, 1000)
    );

    this.intervals.push(
      setInterval(() => {
        Object.values(document.getElementsByClassName('lamp'))[currentMinute - 1].classList.toggle('active-lamp');
      }, 1000)
    );

    this.timeouts.push(
      setTimeout(() => {
        this.intervals.forEach((interval) => clearInterval(interval));
        this.intervals = [];
        this.setTimer();
				this.imp[this.type].push(generatedImps);
        this.updateDisplay((imps || 0) + generatedImps);
        this.draw();
        if (currentMinute - 1 > 0) {
          this.rotateKnob(currentMinute - 1);
          this.runTimer(currentMinute - 1, (imps || 0) + generatedImps);
          return;
        }
        document
          .getElementById('audio-loop-end')
          .cloneNode(true)
          .play();
        this.rotateKnob(this.minutes);
        this.isRunning = false;
        document.getElementById('start-btn').classList.toggle('active-btn');
      }, 60000)
    );
  }

  generateImps() {
    switch (this.type) {
      case 'field':
				return getRandom(13, 17);
      case 'drug':
				return getRandom(18, 22);
      case 'lead':
				return getRandom(17, 21);
      case 'steel':
				return getRandom(15, 19);
      case 'aluminum':
				return getRandom(16, 20);
      default:
    }
  }

  // This is so bad! But im tired af and wand to sleep :(
  updateDisplay(total) {
    const totalLength = total.toString().length;
    switch (totalLength) {
      case 1:
        this.display = `000${total}`;
        break;
      case 2:
        this.display = `00${total}`;
        break;
      case 3:
        this.display = `0${total}`;
        break;
      case 4:
        this.display = total.toString();
        break;
      default:
        this.display = '0000';
    }

    document.getElementById('dial').innerHTML = this.display;
  }

  reset() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts = [];
    this.setDate(new Date(), new Date());
    this.setTimer();

    this.minutes = 1;
    this.isRunning = false;
    document.getElementById('start-btn').classList.remove('active-btn');
    this.updateDisplay(0);
    this.rotateKnob(1);
  }

  clearTable() {
    if (this.isRunning) {
      return;
    }
    this.imp = {
      field: [],
      drug: [],
      lead: [],
      steel: [],
      aluminum: []
    };
    this.draw();
  }

  draw() {
    const table = document.getElementById('table');
    table.style.display = 'none';

    Object.values(document.getElementsByClassName('temp-row')).forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });

    const maxLength = Object.values(this.imp)
      .map((arr) => arr.length)
      .reduce((max, length) => (length > max ? length : max));

    for (let i = 0; i < maxLength; i += 1) {
      const row = table.insertRow(3 + i);
      row.classList.add('temp-row');
      let cell = row.insertCell();
      cell.innerHTML = i + 1;
      cell = row.insertCell();
      cell.innerHTML = this.imp.field[i] || ' ';
      cell = row.insertCell();
      cell.innerHTML = this.imp.drug[i] || ' ';
      cell = row.insertCell();
      cell.innerHTML = this.imp.lead[i] || ' ';
      if (!i) {
        cell = row.insertCell();
        cell.innerHTML = '4.6';
        cell.rowSpan = `${maxLength}`;
      }
      cell = row.insertCell();
      cell.innerHTML = this.imp.steel[i] || ' ';
      if (!i) {
        cell = row.insertCell();
        cell.innerHTML = '5.9';
        cell.rowSpan = `${maxLength}`;
      }
      cell = row.insertCell();
      cell.innerHTML = this.imp.aluminum[i] || ' ';
      if (!i) {
        cell = row.insertCell();
        cell.innerHTML = '5.9';
        cell.rowSpan = `${maxLength}`;
      }
    }

    table.style.display = 'table';
  }

  start() {
    this.isRunning = true;
    this.setDate(new Date(), new Date(new Date().getTime() + this.minutes * 60000));
    this.runTimer(this.minutes);
  }
}
