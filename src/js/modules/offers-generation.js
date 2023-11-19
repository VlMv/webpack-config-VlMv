const cardContent = document.querySelector('#card').content;
const offerNode = cardContent.querySelector('.popup');


async function checkIfFileExists(urlToFile) {
  let authentication;

  await fetch(urlToFile, { method: 'HEAD', mode: 'no-cors' })
    .then(response => {
      if (response.ok) {
        authentication = true;
      } else {
        authentication = false;
      }
    });

  return authentication;
}

function addTextElementIfDataExists(element, data) {
  data
    ? element.textContent = data
    : element.remove();
}

function setOfferTypeContent(offerDataType, offerType) {
  if (!offerDataType) {
    offerType.remove();
    return;
  }

  const residePlaceTypes = {
    flat: 'Квартира',
    bungalow: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец',

    getMatchedType(dataType) {
      if (dataType) {
        for (const type in this) {
          if (type === dataType) return this[type];
        }
      }
      return null;
    },
  };

  offerType.textContent = residePlaceTypes.getMatchedType(offerDataType);
}

function getWordEnding(numeral, endings) {
  const stringedNumeral = `${numeral}`;

  const isLastNumberZeroOrFrom5To9 = stringedNumeral.match(/[0]+$|[5-9]+$/);
  const isLastNumberOne = stringedNumeral.match(/[1]+$/);
  const isLastNumberFrom2To4 = stringedNumeral.match(/[2-4]+$/);
  const isNumeralFrom10To20 = (numeral > 10) && (numeral < 20);

  if (isLastNumberZeroOrFrom5To9 || isNumeralFrom10To20) return endings[0];
  if (isLastNumberOne) return endings[1];
  if (isLastNumberFrom2To4) return endings[2];
  return null;
}


function setGuestsCapacityContent(resideRooms, resideGuests, guestsCapacity, wordsEndings) {
  if (!resideRooms || !resideGuests) {
    guestsCapacity.remove();
    return;
  }

  const numberOfRooms = `${resideRooms} комнат${getWordEnding(resideRooms, wordsEndings.roomWord)}`;
  const numberOfGuests = `${resideGuests} гост${getWordEnding(resideGuests, wordsEndings.guestWord)}`;

  guestsCapacity.textContent = `${numberOfRooms} для ${numberOfGuests}`;
}


function setFeatures(resideFeatures, features) {
  if (!resideFeatures || resideFeatures.length === 0) {
    features.remove();
    return;
  }
  const templateOfferFeatures = features.querySelectorAll('.popup__feature');

  for (const templateOfferFeature of templateOfferFeatures) {
    const templateFeatureClass = templateOfferFeature.getAttribute('class');
    const resideFeature = resideFeatures.find(feature => templateFeatureClass.includes(`popup__feature--${feature}`));

    if (resideFeature === undefined) {
      features.removeChild(templateOfferFeature);
    }
  }
}


async function setPhotos(residePhotos, photos) {
  if (!residePhotos || residePhotos.length === 0) {
    photos.remove();
    return;
  }

  const templateOfferPhoto = photos.querySelector('.popup__photo');
  templateOfferPhoto.remove();

  residePhotos
    .filter(async photoUrl => { await checkIfFileExists(photoUrl); })
    .forEach((photoUrl, i) => {
      const offerPhoto = templateOfferPhoto.cloneNode();

      offerPhoto.src = photoUrl;
      const altContent = offerPhoto.getAttribute('alt');
      offerPhoto.setAttribute('alt', `${altContent} ${i}`);

      photos.appendChild(offerPhoto);
    });
}


async function setAvatar(offerAuthorAvatarURL, authorAvatar) {
  const isImgExists = await checkIfFileExists(offerAuthorAvatarURL);

  isImgExists
    ? authorAvatar.src = offerAuthorAvatarURL
    : authorAvatar.remove();
}


async function generateOffer(offerData, offerDataAuthor) {
  const offer = offerNode.cloneNode(true);
  const price = offer.querySelector('.popup__text--price');
  const type = offer.querySelector('.popup__type');
  const guestsCapacity = offer.querySelector('.popup__text--capacity');
  const checkinChekoutTime = offer.querySelector('.popup__text--time');
  const features = offer.querySelector('.popup__features');
  const photos = offer.querySelector('.popup__photos');
  const authorAvatar = offer.querySelector('.popup__avatar');

  const wordsEndings = {
    roomWord: ['', 'а', 'ы'],
    guestWord: ['ей', 'я', 'ей'],
  };

  const offerTextElementsData = {
    title: {
      selector: offer.querySelector('.popup__title'),
      data: offerData.title,
    },
    address: {
      selector: offer.querySelector('.popup__text--address'),
      data: offerData.address,
    },
    description: {
      selector: offer.querySelector('.popup__description'),
      data: offerData.description,
    },
  };

  for (const element in offerTextElementsData) {
    if (Object.hasOwn(offerTextElementsData, element)) {
      addTextElementIfDataExists(
        offerTextElementsData[element].selector,
        offerTextElementsData[element].data
      );
    }
  }

  offerData.price
    ? price.querySelector('span').previousSibling.replaceData(0, 4, offerData.price)
    : price.remove();

  (offerData.checkin && offerData.checkout)
    ? checkinChekoutTime.textContent = `Заезд после ${offerData.checkin}, выезд до ${offerData.checkout}`
    : checkinChekoutTime.remove();

  setOfferTypeContent(offerData.type, type);

  setGuestsCapacityContent(offerData.rooms, offerData.guests, guestsCapacity, wordsEndings);

  setFeatures(offerData.features, features);

  await setPhotos(offerData.photos, photos);

  await setAvatar(offerDataAuthor.avatar, authorAvatar);

  return offer;
}


async function generateOffers(offersData) {
  const offers = new Map();

  for (let i = 0; i < offersData.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const offer = await generateOffer(offersData[i].offer, offersData[i].author);

    offers.set(offersData[i].location, offer);
  }

  return offers;
}

export { generateOffers };
