const bigPictureElement = document.querySelector('.big-picture');
const closeButtonElement = bigPictureElement.querySelector('#picture-cancel');
const bigImageElement = bigPictureElement.querySelector('.big-picture__img img');
const likesCounterElement = bigPictureElement.querySelector('.likes-count');
const commentsCounterElement = bigPictureElement.querySelector('.comments-count');
const commentsListElement = bigPictureElement.querySelector('.social__comments');
const photoDescriptionElement = bigPictureElement.querySelector('.social__caption');
const commentCountBlockElement = bigPictureElement.querySelector('.social__comment-count');
const loadMoreButtonElement = bigPictureElement.querySelector('.comments-loader');

const COMMENTS_PER_PORTION = 5;

let currentComments = [];
let commentsShown = 0;

const createCommentElement = ({ avatar, name, message }) => {
  const commentElement = document.createElement('li');
  commentElement.className = 'social__comment';

  const avatarImg = new Image();
  avatarImg.className = 'social__picture';
  avatarImg.src = avatar;
  avatarImg.alt = name;
  avatarImg.width = 35;
  avatarImg.height = 35;

  const commentText = document.createElement('p');
  commentText.className = 'social__text';
  commentText.textContent = message;

  commentElement.append(avatarImg, commentText);
  return commentElement;
};

const showMoreComments = () => {
  const nextCommentsPortion = currentComments.slice(
    commentsShown,
    commentsShown + COMMENTS_PER_PORTION
  );

  nextCommentsPortion.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsListElement.appendChild(commentElement);
  });

  commentsShown += nextCommentsPortion.length;
  commentCountBlockElement.textContent = `${commentsShown} из ${currentComments.length} комментариев`;

  if (commentsShown >= currentComments.length) {
    loadMoreButtonElement.classList.add('hidden');
  }
};

const renderComments = (comments) => {
  commentsListElement.innerHTML = '';
  currentComments = comments;
  commentsShown = 0;

  commentCountBlockElement.classList.remove('hidden');
  loadMoreButtonElement.classList.remove('hidden');

  showMoreComments();
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    closeFullPhoto();
  }
}

const openFullPhoto = (photo) => {
  bigImageElement.src = photo.url;
  bigImageElement.alt = photo.description;
  likesCounterElement.textContent = photo.likes;
  commentsCounterElement.textContent = photo.comments.length;
  photoDescriptionElement.textContent = photo.description;

  renderComments(photo.comments);

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

function closeFullPhoto() {
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

closeButtonElement.addEventListener('click', closeFullPhoto);
loadMoreButtonElement.addEventListener('click', showMoreComments);

export { openFullPhoto };
