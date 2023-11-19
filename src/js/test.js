import '../scss/style.scss';
import userJson from '../assets/asset.json';

import './modules/revolve-btn';

import contentTest2 from '../img/content-test-2.webp';


const ROTATE_DELAY = 200;
const ROTATE_DEGREE = '360deg';

const imgWrapper = document.querySelector('.img-item_js-img');
const testBtn = document.querySelector('.test__btn-rotate');


const imgJS = new Image();
imgJS.src = contentTest2;
imgJS.classList.add('img-item__content');

imgWrapper.append(imgJS);


testBtn.addEventListener('click', e => {
  e.target.style.setProperty('--_deg', ROTATE_DEGREE);
  setTimeout(() => (e.target.textContent = userJson.user.name), ROTATE_DELAY);
});
