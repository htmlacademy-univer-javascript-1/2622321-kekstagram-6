import { isEscapeKey } from './utils.js';
import { resetScaleAndEffects } from './scale-and-effects.js';
import { sendData } from './api.js';
import { showMessage } from './messages.js';

const uploadFormElement = document.querySelector('.img-upload__form');
const fileInputElement = uploadFormElement.querySelector('.img-upload__input');
const overlayElement = uploadFormElement.querySelector('.img-upload__overlay');
const cancelButtonElement = uploadFormElement.querySelector('.img-upload__cancel');
const hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionInputElement = uploadFormElement.querySelector('.text__description');
const previewImageElement = uploadFormElement.querySelector('.img-upload__preview img');
const effectsPreviewElements = document.querySelectorAll('.effects__preview');
const submitButtonElement = uploadFormElement.querySelector('.img-upload__submit');
const uploadStartElement = document.querySelector('.img-upload__start');
const uploadFileInputElement = uploadStartElement ? uploadStartElement.querySelector('input[type=file]') : null;

const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAGS = 5;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

let pristine;

const normalizeHashtags = (value) => {
  if (!value.trim()) {
    return [];
  }
  return value.trim().split(/\s+/).filter((tag) => tag.length > 0);
};

const hasValidHashtagFormat = (value) => {
  const tags = normalizeHashtags(value);
  if (tags.length === 0) {
    return true;
  }
  return tags.every((tag) => HASHTAG_PATTERN.test(tag));
};

const hasValidHashtagCount = (value) => {
  const tags = normalizeHashtags(value);
  return tags.length <= MAX_HASHTAGS;
};

const hasUniqueHashtags = (value) => {
  const tags = normalizeHashtags(value).map((tag) => tag.toLowerCase());
  return tags.length === new Set(tags).size;
};

const validateCommentLength = (value) => value.length <= MAX_COMMENT_LENGTH;

const getHashtagFormatErrorMessage = () =>
  'Хэш-тег должен начинаться с #, содержать только буквы и цифры и быть не длиннее 20 символов';

const getHashtagCountErrorMessage = () =>
  'Нельзя указать больше пяти хэш-тегов';

const getHashtagUniqueErrorMessage = () =>
  'Хэш-теги не должны повторяться';

const getCommentLengthErrorMessage = () =>
  'Комментарий не может быть длиннее 140 символов';

const initValidation = () => {
  pristine = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--error',
    successClass: 'img-upload__field-wrapper--success',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'span',
    errorTextClass: 'img-upload__error'
  });

  pristine.addValidator(
    hashtagsInputElement,
    hasValidHashtagFormat,
    getHashtagFormatErrorMessage,
    1,
    true
  );

  pristine.addValidator(
    hashtagsInputElement,
    hasValidHashtagCount,
    getHashtagCountErrorMessage,
    2,
    true
  );

  pristine.addValidator(
    hashtagsInputElement,
    hasUniqueHashtags,
    getHashtagUniqueErrorMessage,
    3,
    true
  );

  pristine.addValidator(
    descriptionInputElement,
    validateCommentLength,
    getCommentLengthErrorMessage
  );
};

const setPreviewImage = (file) => {
  const reader = new FileReader();

  reader.onload = (evt) => {
    const imageUrl = evt.target.result;
    previewImageElement.src = imageUrl;

    effectsPreviewElements.forEach((preview) => {
      preview.style.backgroundImage = `url(${imageUrl})`;
    });
  };

  reader.readAsDataURL(file);
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    const isFocused = document.activeElement === hashtagsInputElement ||
      document.activeElement === descriptionInputElement;

    if (!isFocused) {
      evt.preventDefault();
      closeUploadForm();
    }
  }
}

const blockSubmitButton = () => {
  submitButtonElement.disabled = true;
  submitButtonElement.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButtonElement.disabled = false;
  submitButtonElement.textContent = 'Опубликовать';
};

function closeUploadForm() {
  overlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadFormElement.reset();
  fileInputElement.value = '';

  if (uploadFileInputElement) {
    uploadFileInputElement.value = '';
  }

  previewImageElement.src = 'img/upload-default-image.jpg';

  effectsPreviewElements.forEach((preview) => {
    preview.style.backgroundImage = '';
  });

  resetScaleAndEffects();

  if (pristine) {
    pristine.reset();
  }

  document.removeEventListener('keydown', onDocumentKeydown);
}

const openUploadForm = (file) => {
  if (file) {
    setPreviewImage(file);
  }

  overlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  initValidation();
  hashtagsInputElement.focus();
};

const onTextFieldKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const onFileInputChange = () => {
  if (fileInputElement.files.length > 0) {
    const file = fileInputElement.files[0];
    openUploadForm(file);
  }
};

const onCancelButtonClick = () => {
  closeUploadForm();
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  blockSubmitButton();

  try {
    const formData = new FormData(evt.target);
    await sendData(formData);
    closeUploadForm();
    showMessage('success');
  } catch (error) {
    showMessage('error');
  } finally {
    unblockSubmitButton();
  }
};

const initUploadForm = () => {
  fileInputElement.addEventListener('change', onFileInputChange);
  cancelButtonElement.addEventListener('click', onCancelButtonClick);
  uploadFormElement.addEventListener('submit', onFormSubmit);
  hashtagsInputElement.addEventListener('keydown', onTextFieldKeydown);
  descriptionInputElement.addEventListener('keydown', onTextFieldKeydown);
};

export { initUploadForm };
