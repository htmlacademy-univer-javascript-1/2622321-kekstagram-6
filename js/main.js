import { generatePhotos } from './photos.js';
import { renderThumbnails } from './thumbnails.js';
import { initUploadForm } from './upload-form.js';

const photos = generatePhotos();
const pictureContainerElement = document.querySelector('.pictures');
renderThumbnails(photos, pictureContainerElement);

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Pristine !== 'undefined') {
    initUploadForm();
  }
});

export { photos };
