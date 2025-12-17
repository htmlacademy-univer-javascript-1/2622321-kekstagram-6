import { getData } from './api.js';
import { renderThumbnails } from './thumbnails.js';
import { initUploadForm } from './upload-form.js';
import { initScaleAndEffects } from './scale-and-effects.js';
import { showMessage } from './messages.js';

const pictureContainerElement = document.querySelector('.pictures');

const loadAndRenderPhotos = async () => {
  try {
    const photos = await getData();
    renderThumbnails(photos, pictureContainerElement);
  } catch (error) {
    showMessage('error', error.message);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadAndRenderPhotos();

  if (typeof Pristine !== 'undefined') {
    initUploadForm();
  }

  if (typeof noUiSlider !== 'undefined') {
    initScaleAndEffects();
  }
});
