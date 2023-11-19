/* eslint-disable import/no-cycle */
import { submitData } from './offers-data';
import { resetMainMarkerPosition } from './map';
import { setDragAndDrop } from './drag-and-drop-data';


const FLOAT_SYMBOLS_COUNT = 5;
const IMAGES_FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const IMAGES_COUNT = 6;

const offerForm = document.querySelector('.ad-form');
const filtersForm = document.querySelector('.map__filters');
const addressInput = offerForm.querySelector('#address');
const body = document.querySelector('body');

const successPopup = document.querySelector('#success').content.querySelector('.success');
const errorPopup = document.querySelector('#error').content.querySelector('.error');

const placeTypesSelect = offerForm.querySelector('#type');
const priceInput = offerForm.querySelector('#price');

const checkInInput = offerForm.querySelector('#timein');
const checkOutInput = offerForm.querySelector('#timeout');
const timeFieldset = offerForm.querySelector('.ad-form__element--time');

const roomsNumberSelect = offerForm.querySelector('#room_number');
const guestsCapacitySelect = offerForm.querySelector('#capacity');

const offerAvatarFileInput = offerForm.querySelector('#avatar');
const offerPhotoFileInput = offerForm.querySelector('#images');
const photosContainer = offerForm.querySelector('.ad-form__photo');
const avatarContainer = offerForm.querySelector('.ad-form-header__preview');
const photosDropZone = offerForm.querySelector('.ad-form__drop-zone');
const avatarDropZone = offerForm.querySelector('.ad-form-header__drop-zone');


function removePopup(evt, popupSelector, handler) {
  if (evt.key === 'Escape') {
    popupSelector.remove();
    body.removeEventListener('keydown', handler);
  }
}

function setOfferAddressCoordinates(latitude, longitude) {
  addressInput.value = `${latitude.toFixed(FLOAT_SYMBOLS_COUNT)}, ${longitude.toFixed(FLOAT_SYMBOLS_COUNT)}`;
}

function clearImageContainer(imageContainer) {
  while (imageContainer.hasChildNodes()) {
    imageContainer.removeChild(imageContainer.lastChild);
  }
}

// price of place type dependencies

const placesMinPrice = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000,

  getMatchedValue(placeType) {
    if (placeType) {
      for (const key of Object.keys(this)) {
        if (key === placeType) return this[key];
      }
    }
    return null;
  },
};

placeTypesSelect.addEventListener('change', () => {
  priceInput.setAttribute('min', placesMinPrice.getMatchedValue(placeTypesSelect.value));
  priceInput.setAttribute('placeholder', placesMinPrice.getMatchedValue(placeTypesSelect.value));
});

priceInput.addEventListener('change', () => {
  priceInput.reportValidity();
});


// chekin and checkout dependencies

timeFieldset.addEventListener('input', evt => {
  if (evt.target.matches('#timein')) {
    checkOutInput.value = checkInInput.value;
  }
  if (evt.target.matches('#timeout')) {
    checkInInput.value = checkOutInput.value;
  }
});


// rooms and guests dependencies

function checkGuestsCapacityValidaton() {
  const isGuestsCountDoesNotMatchRooms = (
    +guestsCapacitySelect.value > +roomsNumberSelect.value
    && +guestsCapacitySelect.value !== 0
  );
  const isNotForGuests = (+roomsNumberSelect.value === 100 && +guestsCapacitySelect.value !== 0);
  const isNotEnoughRooms = +roomsNumberSelect.value !== 100 && +guestsCapacitySelect.value === 0;

  if (isNotForGuests) {
    guestsCapacitySelect.setCustomValidity('Допустимо: не для гостей');
  } else if (isNotEnoughRooms) {
    roomsNumberSelect.setCustomValidity('Допустимое количество комнат не менее 100');
  } else if (isGuestsCountDoesNotMatchRooms) {
    guestsCapacitySelect.setCustomValidity(`Допустимо: число гостей не более ${roomsNumberSelect.value}`);
  } else {
    guestsCapacitySelect.setCustomValidity('');
    roomsNumberSelect.setCustomValidity('');
  }

  guestsCapacitySelect.reportValidity();
  roomsNumberSelect.reportValidity();
}

guestsCapacitySelect.addEventListener('change', checkGuestsCapacityValidaton);
roomsNumberSelect.addEventListener('change', checkGuestsCapacityValidaton);


// images uploading validation and images thumbnails

function renderErrorImageLoadingPopup(errorText) {
  const errorNode = errorPopup.cloneNode(true);
  function removeErrorImageLoadingPopup(evt) {
    removePopup(evt, errorNode, removeErrorImageLoadingPopup);
  }

  errorNode.querySelector('.error__message').textContent = errorText;
  body.appendChild(errorNode);

  errorNode.querySelector('.error__button').addEventListener('click', () => errorNode.remove(), { once: true });
  body.addEventListener('keydown', removeErrorImageLoadingPopup);
}

function validateImageFiles(input, imageContainer) {
  // const files = input.files;
  const { files } = input;

  if (files.length > IMAGES_COUNT) {
    clearImageContainer(imageContainer);
    input.value = null;
    renderErrorImageLoadingPopup(`Добавьте не более ${IMAGES_COUNT} фотографий.`);
    return false;
  }

  if (!input.matches('[multiple]') && files.length > 1) {
    clearImageContainer(imageContainer);
    input.value = null;
    renderErrorImageLoadingPopup('Добавьте только одно изображение.');
    return false;
  }

  for (const file of files) {
    const matches = IMAGES_FILE_TYPES.some(type => file.name.endsWith(type));

    if (!matches) {
      clearImageContainer(imageContainer);
      input.value = null;
      renderErrorImageLoadingPopup('Выберите изображения формата JPG, PNG, BMP, GIF, WEBP, SVG.');
      return false;
    }
  }

  return true;
}

function renderImageThumbnails(input, imageContainer) {
  // const files = input.files;
  const { files } = input;

  clearImageContainer(imageContainer);
  for (const file of files) {
    const thumbnail = document.createElement('img');
    thumbnail.style.maxWidth = '70px';
    thumbnail.style.objectFit = 'contain';
    thumbnail.src = URL.createObjectURL(file);
    thumbnail.addEventListener('load', () => {
      URL.revokeObjectURL(thumbnail.src);
    }, { once: true });

    imageContainer.appendChild(thumbnail);
  }
}

offerPhotoFileInput.addEventListener('change', evt => {
  if (validateImageFiles(evt.target, photosContainer)) {
    renderImageThumbnails(evt.target, photosContainer);
  }
});

offerAvatarFileInput.addEventListener('change', evt => {
  if (validateImageFiles(evt.target, avatarContainer)) {
    renderImageThumbnails(evt.target, avatarContainer);
  }
});


// set droping image files

setDragAndDrop(avatarDropZone, offerAvatarFileInput);
setDragAndDrop(photosDropZone, offerPhotoFileInput);


function onSuccessSubmit() {
  function removeSuccessPopup(evt) {
    removePopup(evt, successPopup, removeSuccessPopup);
  }

  body.appendChild(successPopup);

  offerForm.reset();
  filtersForm.reset();
  clearImageContainer(avatarContainer);
  clearImageContainer(photosContainer);
  resetMainMarkerPosition();

  body.addEventListener('click', () => successPopup.remove(), { once: true });
  body.addEventListener('keydown', removeSuccessPopup);
}

function onErrorSubmit() {
  function removeErrorPopup(evt) {
    removePopup(evt, errorPopup, removeErrorPopup);
  }

  body.appendChild(errorPopup);

  errorPopup.querySelector('.error__button').addEventListener('click', () => errorPopup.remove(), { once: true });
  body.addEventListener('keydown', removeErrorPopup);
}


offerForm.addEventListener('submit', async evt => {
  evt.preventDefault();

  await submitData(new FormData(offerForm), onSuccessSubmit, onErrorSubmit);
});


export { setOfferAddressCoordinates };
