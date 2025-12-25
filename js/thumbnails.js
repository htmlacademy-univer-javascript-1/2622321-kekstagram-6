import { openFullPhoto } from './big-picture.js';

const pictureTemplate = document.querySelector('#picture');

const createThumbnail = (photo) => {
  const thumbnail = pictureTemplate.content.querySelector('.picture').cloneNode(true);
  const img = thumbnail.querySelector('.picture__img');
  const likes = thumbnail.querySelector('.picture__likes');
  const comments = thumbnail.querySelector('.picture__comments');

  img.src = photo.url;
  img.alt = photo.description;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;

  thumbnail.dataset.photoId = photo.id;

  thumbnail.addEventListener('click', (evt) => {
    evt.preventDefault();
    openFullPhoto(photo);
  });

  return thumbnail;
};

const renderThumbnails = (photos, picturesContainer) => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const thumbnail = createThumbnail(photo);
    fragment.appendChild(thumbnail);
  });

  picturesContainer.appendChild(fragment);
};

export { renderThumbnails };
