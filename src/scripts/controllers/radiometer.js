import getRandom from '../helpers/get-random-int';

export default class Radiometer {
  constructor(minutes) {
    this.imp = {
      first: [],
      second: [],
      lead: [],
      steel: [],
      aluminum: []
    };

    this.impAverage = {
      first: null,
      second: null,
      lead: null,
      steel: null,
      aluminum: null
    };

    this.display = '0000';

    this.minutes = minutes || 1;

    Object.values(document.getElementsByClassName('lamp'))[this.minutes - 1].classList.toggle('active-lamp');

    const knob = document.getElementById('knob');
    switch (this.minutes) {
      case 1:
        knob.style.transform = 'rotate(-40deg)';
        break;
      case 2:
        knob.style.transform = 'rotate(-25deg)';
        break;
      case 3:
        knob.style.transform = 'rotate(0deg)';
        break;
      case 4:
        knob.style.transform = 'rotate(25deg)';
        break;
      case 5:
        knob.style.transform = 'rotate(40deg)';
        break;
      default:
    }
  }

  rotateKnob() {
    Object.values(document.getElementsByClassName('lamp'))[this.minutes - 1].classList.toggle('active-lamp');
    this.minutes = this.minutes === 5 ? (this.minutes = 1) : (this.minutes += 1);
    Object.values(document.getElementsByClassName('lamp'))[this.minutes - 1].classList.toggle('active-lamp');

    const knob = document.getElementById('knob');
    switch (this.minutes) {
      case 1:
        knob.style.transform = 'rotate(-40deg)';
        break;
      case 2:
        knob.style.transform = 'rotate(-25deg)';
        break;
      case 3:
        knob.style.transform = 'rotate(0deg)';
        break;
      case 4:
        knob.style.transform = 'rotate(25deg)';
        break;
      case 5:
        knob.style.transform = 'rotate(40deg)';
        break;
      default:
    }
  }

  generateImps() {
    for (let i = 0; i < this.minutes; i += 1) {
      this.imp.first.push(getRandom(13, 17));
      this.imp.second.push(getRandom(18, 22));
      this.imp.lead.push(getRandom(17, 21));
      this.imp.steel.push(getRandom(15, 19));
      this.imp.aluminum.push(getRandom(16, 20));
    }
  }

  calculateAverages() {
    Object.entries(this.imp).forEach(([key, value]) => {
      this.impAverage[key] = value.reduce((acc, currVal) => acc + currVal) / this.minutes;
      this.impAverage[key] = this.impAverage[key].toFixed(3);
    });

    this.changeDisplay(
      this.imp.first.reduce((acc, currVal) => acc + currVal)
    );
  }

  // This is so bad! But im tired af and wand to sleep :(
  changeDisplay(total) {
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
  }

  reset() {
    this.imp = {
      first: [],
      second: [],
      lead: [],
      steel: [],
      aluminum: []
    };

    this.impAverage = {
      first: null,
      second: null,
      lead: null,
      steel: null,
      aluminum: null
    };

    this.display = '0000';
  }

  draw(table) {
    table.style.display = 'none';

    Object.values(document.getElementsByClassName('temp-row')).forEach((elem) => {
      elem.parentNode.removeChild(elem);
    });

		const dial = document.getElementById('dial');

    if (!this.imp.first.length) {
      const row = table.rows[table.rows.length - 1];
      row.cells[1].innerHTML = '';
      row.cells[2].innerHTML = '';
      row.cells[3].innerHTML = '';
      row.cells[5].innerHTML = '';
      row.cells[7].innerHTML = '';
      table.style.display = 'table';
			dial.innerHTML = "0000";
      return;
    }

		dial.innerHTML = this.display;

    for (let i = 0; i < this.minutes; i += 1) {
      const row = table.insertRow(3 + i);
      row.classList.add('temp-row');
      let cell = row.insertCell();
      cell.innerHTML = i + 1;
      cell = row.insertCell();
      cell.innerHTML = this.imp.first[i];
      cell = row.insertCell();
      cell.innerHTML = this.imp.second[i];
      cell = row.insertCell();
      cell.innerHTML = this.imp.lead[i];
      if (!i) {
        cell = row.insertCell();
        cell.innerHTML = '4.6';
        cell.rowSpan = `${this.minutes}`;
      }
      cell = row.insertCell();
      cell.innerHTML = this.imp.steel[i];
      if (!i) {
        cell = row.insertCell();
        cell.innerHTML = '5.9';
        cell.rowSpan = `${this.minutes}`;
      }
      cell = row.insertCell();
      cell.innerHTML = this.imp.aluminum[i];
      if (!i) {
        cell = row.insertCell();
        cell.innerHTML = '5.9';
        cell.rowSpan = `${this.minutes}`;
      }
    }

    const row = table.rows[table.rows.length - 1];
    row.cells[1].innerHTML = this.impAverage.first;
    row.cells[2].innerHTML = this.impAverage.second;
    row.cells[3].innerHTML = this.impAverage.lead;
    row.cells[5].innerHTML = this.impAverage.steel;
    row.cells[7].innerHTML = this.impAverage.aluminum;

    table.style.display = 'table';
  }

  start() {
    this.reset();
    this.generateImps();
    this.calculateAverages();
  }
}
