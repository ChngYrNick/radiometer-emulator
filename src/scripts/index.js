import Radiometer from './controllers/radiometer';

import '../styles/index.scss';

const radiometer = new Radiometer();

document.getElementById('start-btn').addEventListener(
  'click',
  (event) => {
    if (radiometer.isRunning) return;
    radiometer.start();
    event.target.classList.toggle('active-btn');
  },
  false
);

document.getElementById('reset-btn').addEventListener(
  'click',
  () => {
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
      document.querySelector(`[data-type='${radiometer.type}']`).classList.toggle('active-panel-btn');
      radiometer.type = elem.dataset.type;
      document.querySelector(`[data-type='${radiometer.type}']`).classList.toggle('active-panel-btn');
    },
    false
  );
});
