import Radiometer from './controllers/radiometer';

import '../styles/index.scss';

const radiometer = new Radiometer();

document.getElementById('start-btn').addEventListener(
  'click',
  (event) => {
    if (radiometer.isRunning) return;
    document
      .getElementById('audio-start-btn')
      .cloneNode(true)
      .play();
    radiometer.start();
    event.target.classList.toggle('active-btn');
  },
  false
);

document.getElementById('reset-btn').addEventListener(
  'click',
  () => {
    // document.getElementById('audio-reset-btn').cloneNode(true).play();;
    radiometer.reset();
  },
  false
);

document.getElementById('knob').addEventListener(
  'click',
  () => {
    radiometer.rotateKnob();
  },
  false
);

Object.values(document.getElementById('control-panel').children).forEach((elem) => {
  elem.addEventListener(
    'click',
    () => {
      if (radiometer.isRunning) return;
      const drug = document.getElementById('drug');
      const plate = document.getElementById('plate');
      // drug.style.display = 'none';
      // plate.style.display = 'none';
			drug.style.top = '0px';
			plate.style.top = '0px';
      document
        .getElementById('audio-switch-type')
        .cloneNode(true)
        .play();
      document.querySelector(`[data-type='${radiometer.type}']`).classList.toggle('active-panel-btn');
      radiometer.type = elem.dataset.type;
      document.querySelector(`[data-type='${radiometer.type}']`).classList.toggle('active-panel-btn');

      switch (radiometer.type) {
        case 'field':
          break;
        case 'drug':
					drug.style.display = 'block';
					drug.style.top = '175px';
          break;
        case 'lead':
					plate.style.display = 'block';
					plate.style.top = '150px';
					plate.style.backgroundColor = '#90939f';
					drug.style.display = 'block';
					drug.style.top = '175px';
          break;
        case 'steel':
					plate.style.display = 'block';
					plate.style.top = '150px';
					plate.style.backgroundColor = '#a8aeb1';
					drug.style.display = 'block';
					drug.style.top = '175px';
          break;
        case 'aluminum':
					plate.style.display = 'block';
					plate.style.top = '150px';
					plate.style.backgroundColor = '#c0c0c0';
					drug.style.display = 'block';
					drug.style.top = '175px';
          break;
        default:
      }
    },
    false
  );
});
