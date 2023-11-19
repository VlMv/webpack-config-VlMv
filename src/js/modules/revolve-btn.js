const revolveBtn = document.querySelector('.test__btn-revolve');

let degreeStep = 0;
revolveBtn.addEventListener('click', e => {
  degreeStep += 60;
  e.target.style.setProperty('--_deg-step', `${degreeStep}deg`);
});
