function setDragOverEffect(evt) {
  evt.preventDefault();

  if (!evt.target.classList.contains('active-hover')) {
    evt.target.classList.add('active-hover');
  }
}

function setDragLeaveEffect(evt) {
  evt.preventDefault();

  if (evt.target.classList.contains('active-hover')) {
    evt.target.classList.remove('active-hover');
  }
}


function setDragAndDrop(dropZone, input) {
  dropZone.addEventListener('dragover', evt => {
    setDragOverEffect(evt);
  });

  dropZone.addEventListener('dragleave', evt => {
    setDragLeaveEffect(evt);
  });

  dropZone.addEventListener('drop', evt => {
    input.files = evt.dataTransfer.files;
    input.dispatchEvent(new Event('change'));

    setDragLeaveEffect(evt);
  });
}

export { setDragAndDrop };
