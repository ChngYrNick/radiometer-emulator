import Radiometer from './controllers/radiometer';

import '../styles/index.scss';

const radiometer = new Radiometer();

document.getElementById('start-btn').addEventListener('click', () => {
	const table = document.getElementById('table');
	radiometer.start();
	radiometer.draw(table);
}, false);

document.getElementById('reset-btn').addEventListener('click', () => {
	const table = document.getElementById('table');
	radiometer.reset();
	radiometer.draw(table);
}, false);

document.getElementById('knob').addEventListener('click', () => {
	radiometer.rotateKnob();
}, false);
