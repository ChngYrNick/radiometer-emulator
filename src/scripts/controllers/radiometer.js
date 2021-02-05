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

    this.updateDisplay(0);
    this.rotateKnob(1);
    this.resetLamps();
    document.querySelector(`[data-type='${this.type}']`).classList.toggle('active-panel-btn');
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

  runTimer(currentMinute) {
    this.generateImps();
    let currentImps = 0;
    this.intervals.push(
      setInterval(() => {
        currentImps += 1;
        this.updateDisplay(currentImps);
      }, Math.floor(60000 / this.imp[this.type][this.imp[this.type].length - 1]))
    );

    let secondsPassed = 0;
    this.intervals.push(
      setInterval(() => {
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
        this.draw();
        this.updateDisplay(0);
        if (currentMinute - 1 > 0) {
          this.rotateKnob(currentMinute - 1);
          this.runTimer(currentMinute - 1);
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
    if (this.imp[this.type].length >= this.minutes) {
      this.imp[this.type] = [];
    }

    switch (this.type) {
      case 'field':
        this.imp[this.type].push(getRandom(13, 17));
        break;
      case 'drug':
        this.imp[this.type].push(getRandom(18, 22));
        break;
      case 'lead':
        this.imp[this.type].push(getRandom(17, 21));
        break;
      case 'steel':
        this.imp[this.type].push(getRandom(15, 19));
        break;
      case 'aluminum':
        this.imp[this.type].push(getRandom(16, 20));
        break;
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
    this.imp = {
      field: [],
      drug: [],
      lead: [],
      steel: [],
      aluminum: []
    };
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts = [];

    this.minutes = 1;
    this.isRunning = false;
    document.getElementById('start-btn').classList.remove('active-btn');
    this.updateDisplay(0);
    this.rotateKnob(1);
    this.draw();
  }

  draw() {
    const table = document.getElementById('table');
    table.style.display = 'none';

    Object.values(document.getElementsByClassName('temp-row')).forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });

    if (!this.imp.field.length) {
      table.style.display = 'table';
      return;
    }

    for (let i = 0; i < this.minutes; i += 1) {
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
        cell.rowSpan = `${this.minutes}`;
      }
      cell = row.insertCell();
      cell.innerHTML = this.imp.steel[i] || ' ';
      if (!i) {
        cell = row.insertCell();
        cell.innerHTML = '5.9';
        cell.rowSpan = `${this.minutes}`;
      }
      cell = row.insertCell();
      cell.innerHTML = this.imp.aluminum[i] || ' ';
      if (!i) {
        cell = row.insertCell();
        cell.innerHTML = '5.9';
        cell.rowSpan = `${this.minutes}`;
      }
    }

    table.style.display = 'table';
  }

  start() {
    this.isRunning = true;
    this.runTimer(this.minutes);
  }
}
