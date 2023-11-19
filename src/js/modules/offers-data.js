function renderError(errorText) {
  const body = document.querySelector('body');
  const div = document.createElement('div');

  div.classList.add('error', 'error_data');
  div.textContent = errorText;

  body.append(div);
}


function getData() {
  const data = fetch('https://23.javascript.pages.academy/keksobooking/data')
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Ошибка загрузки данных с сервера. Попробуйте перезагрузить страницу.');
    })
    .catch(error => renderError(error));

  return data;
}


// trying another way to realise async operations

async function submitData(formData, onSuccess, onError) {
  try {
    const response = await fetch('https://23.javascript.pages.academy/keksobooking', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error();
    }
    await onSuccess();
  } catch (error) {
    await onError();
  }
}

export { getData, submitData };
