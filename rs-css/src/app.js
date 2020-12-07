import './scss/base.scss';
import Trainer from './js/trainer';

const levels = require('./assets/levels.json');

window.addEventListener('DOMContentLoaded', () => {
    const trainer = new Trainer(levels);
    document.body.appendChild(trainer.createElement());
});
