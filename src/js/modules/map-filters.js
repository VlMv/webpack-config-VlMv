/* eslint-disable import/no-cycle */
import { renderOffersMarkers } from './map';


const filtersForm = document.querySelector('.map__filters');
const placeTypeSelect = filtersForm.querySelector('#housing-type');
const priceSelect = filtersForm.querySelector('#housing-price');
const roomsCountSelect = filtersForm.querySelector('#housing-rooms');
const guestsCountSelect = filtersForm.querySelector('#housing-guests');
const featuresFieldset = filtersForm.querySelector('#housing-features');
const featureCheckboxes = featuresFieldset.querySelectorAll('#housing-features input[type="checkbox"]');

const filterSelects = new Map()
  .set(placeTypeSelect, 'type')
  .set(priceSelect, null)
  .set(roomsCountSelect, 'rooms')
  .set(guestsCountSelect, 'guests');

const checkboxFeaturesSet = new Set();


function filterOffersByFeature(offersData, feature, input) {
  return offersData.filter(
    offerData => String(offerData.offer[feature]) === input.value
  );
}

function filterOffersByPrice(price) {
  if (
    priceSelect.value === 'middle'
    && price >= 10000
    && price <= 50000
  ) return price;

  if (
    priceSelect.value === 'low'
    && price < 10000
  ) return price;

  if (
    priceSelect.value === 'high'
    && price > 50000
  ) return price;

  return null;
}

function filterOffersByAdditionalFeature(offersData) {
  featureCheckboxes.forEach(checkbox => {
    checkbox.checked === true
      ? checkboxFeaturesSet.add(checkbox.value)
      : checkboxFeaturesSet.delete(checkbox.value);
  });

  return offersData.filter(
    offerData => {
      const offerFeatures = offerData.offer.features;

      return Array.from(checkboxFeaturesSet).every(feature => {
        if (offerFeatures) return offerFeatures.includes(feature);
        return false;
      });
    }
  );
}


async function filterOffers(data, generateOffers) {
  let offersData = data.slice();

  filterSelects.forEach((feature, select) => {
    if (select.value !== 'any' && select !== priceSelect) {
      offersData = filterOffersByFeature(offersData, feature, select);
    }
    if (select.value !== 'any' && select === priceSelect) {
      offersData = offersData.filter(
        offerData => filterOffersByPrice(offerData.offer.price)
      );
    }
  });

  offersData = filterOffersByAdditionalFeature(offersData);

  renderOffersMarkers(await generateOffers(offersData));
}

function filterData(filterCallBack) {
  placeTypeSelect.addEventListener('input', filterCallBack);
  priceSelect.addEventListener('input', filterCallBack);
  roomsCountSelect.addEventListener('input', filterCallBack);
  guestsCountSelect.addEventListener('input', filterCallBack);
  featuresFieldset.addEventListener('input', filterCallBack);
}

export { filterData, filterOffers };
