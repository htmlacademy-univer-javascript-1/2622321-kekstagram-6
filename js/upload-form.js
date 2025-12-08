import { isEscapeKey } from './utils.js';

const uploadFormElement = document.querySelector('.img-upload__form');
const fileInputElement = uploadFormElement.querySelector('.img-upload__input');
const overlayElement = uploadFormElement.querySelector('.img-upload__overlay');
const cancelButtonElement = uploadFormElement.querySelector('.img-upload__cancel');
const scaleValueElement = uploadFormElement.querySelector('.scale__control--value');
const previewImageElement = uploadFormElement.querySelector('.img-upload__preview img');
const effectRadiosElements = uploadFormElement.querySelectorAll('.effects__radio');
const effectLevelContainerElement = uploadFormElement.querySelector('.img-upload__effect-level');
const effectLevelValueElement = uploadFormElement.querySelector('.effect-level__value');
const hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionInputElement = uploadFormElement.querySelector('.text__description');
const submitButtonElement = uploadFormElement.querySelector('.img-upload__submit');

const DEFAULT_SCALE = 100;
const DEFAULT_EFFECT = 'none';
const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAGS = 5;

let pristineInstance = null;

const parseTags = (inputValue) => {
  if (!inputValue) {
    return [];
  }
  return inputValue
    .trim()
    .split(/\s+/)
    .filter(Boolean);
};

const isValidTagFormat = (tag) => {
  if (tag[0] !== '#') {
    return false;
  }
  if (tag.length === 1) {
    return false;
  }
  if (tag.length > 20) {
    return false;
  }
  return /^[a-zа-яё0-9]+$/i.test(tag.slice(1));
};

const validateHashtags = (value) => {
  const tags = parseTags(value);
  if (tags.length === 0) {
    return true;
  }

  if (tags.length > MAX_HASHTAGS) {
    validateHashtags.lastError = 'Нельзя указать больше пяти хэш-тегов.';
    return false;
  }

  for (const tag of tags) {
    if (!isValidTagFormat(tag)) {
      validateHashtags.lastError = `Неверный формат тега "${tag}". Тег должен начинаться с # и содержать только буквы и цифры, длина до 20 символов.`;
      return false;
    }
  }

  const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
  const uniqueTags = new Set(lowerCaseTags);

  if (uniqueTags.size !== lowerCaseTags.length) {
    validateHashtags.lastError = 'Один и тот же хэш-тег не может быть использован дважды.';
    return false;
  }

  return true;
};

const getHashtagsErrorMessage = () => {
  return validateHashtags.lastError || 'Неверный формат хэш-тегов.';
};

const validateDescription = (value) => value.length <= MAX_COMMENT_LENGTH;

const setScale = (percent) => {
  if (scaleValueElement) {
    scaleValueElement.value = `${percent}%`;
    previewImageElement.style.transform = `scale(${percent / 100})`;
  }
};

const setEffect = (effectName) => {
  effectRadiosElements.forEach((radioElement) => {
    radioElement.checked = (radioElement.value === effectName);
  });

  removePreviewFilter();

  if (effectLevelContainerElement) {
    if (effectName === 'none') {
      effectLevelContainerElement.classList.add('hidden');
    } else {
      effectLevelContainerElement.classList.remove('hidden');
    }
  }

  if (effectLevelValueElement) {
    effectLevelValueElement.value = '';
  }
};

const removePreviewFilter = () => {
  if (previewImageElement) {
    previewImageElement.style.filter = '';
    previewImageElement.style.webkitFilter = '';
  }
};

const initValidation = () => {
  pristineInstance = new Pristine(uploadFormElement, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'form-error-text',
  });

  pristineInstance.addValidator(
    hashtagsInputElement,
    validateHashtags,
    getHashtagsErrorMessage
  );

  pristineInstance.addValidator(
    descriptionInputElement,
    validateDescription,
    'Длина комментария не может превышать 140 символов.'
  );
};

const openUploadForm = () => {
  overlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setScale(DEFAULT_SCALE);
  setEffect(DEFAULT_EFFECT);
  hashtagsInputElement.focus();
  initValidation();
};

const closeUploadForm = () => {
  uploadFormElement.reset();
  fileInputElement.value = '';
  setScale(DEFAULT_SCALE);
  setEffect(DEFAULT_EFFECT);
  removePreviewFilter();
  overlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');

  if (pristineInstance) {
    pristineInstance.reset();
  }
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    if (overlayElement.classList.contains('hidden')) {
      return;
    }

    const isFocused = document.activeElement === hashtagsInputElement || document.activeElement === descriptionInputElement;

    if (!isFocused) {
      closeUploadForm();
    }
  }
};

const onTextFieldKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const onFileInputChange = () => {
  if (fileInputElement.files && fileInputElement.files.length > 0) {
    openUploadForm();
  }
};

const onCancelButtonClick = (evt) => {
  evt.preventDefault();
  closeUploadForm();
};

const onFormReset = () => {
  setTimeout(() => {
    fileInputElement.value = '';
    setScale(DEFAULT_SCALE);
    setEffect(DEFAULT_EFFECT);
    removePreviewFilter();
    overlayElement.classList.add('hidden');
    document.body.classList.remove('modal-open');

    if (pristineInstance) {
      pristineInstance.reset();
    }
  }, 0);
};

const onFormSubmit = (evt) => {
  if (pristineInstance) {
    const isValid = pristineInstance.validate();
    if (!isValid) {
      evt.preventDefault();
      const firstErrorElement = uploadFormElement.querySelector('.form-error-text');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
  }

  submitButtonElement.disabled = true;
};

const onEffectRadioChange = (evt) => {
  if (evt.target.value === 'none') {
    effectLevelContainerElement.classList.add('hidden');
    removePreviewFilter();
  } else {
    effectLevelContainerElement.classList.remove('hidden');
  }

  if (effectLevelValueElement) {
    effectLevelValueElement.value = '';
  }
};

const initUploadForm = () => {
  fileInputElement.addEventListener('change', onFileInputChange);
  cancelButtonElement.addEventListener('click', onCancelButtonClick);
  uploadFormElement.addEventListener('submit', onFormSubmit);
  uploadFormElement.addEventListener('reset', onFormReset);
  document.addEventListener('keydown', onDocumentKeydown);

  hashtagsInputElement.addEventListener('keydown', onTextFieldKeydown);
  descriptionInputElement.addEventListener('keydown', onTextFieldKeydown);

  effectRadiosElements.forEach((radioElement) => {
    radioElement.addEventListener('change', onEffectRadioChange);
  });
};

export { initUploadForm };
