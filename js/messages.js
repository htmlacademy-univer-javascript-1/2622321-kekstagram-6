import { isEscapeKey } from './utils.js';

const showMessage = (type, text = '') => {
  const templateElement = document.querySelector(`#${type}`).content.querySelector(`.${type}`);
  const messageElement = templateElement.cloneNode(true);

  messageElement.style.zIndex = '1000';

  if (text && messageElement.querySelector(`.${type}__title`)) {
    messageElement.querySelector(`.${type}__title`).textContent = text;
  }

  const buttonElement = messageElement.querySelector(`.${type}__button`);

  function hideMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
  }

  function onDocumentClick(evt) {
    if (evt.target.closest(`.${type}__inner`)) {
      return;
    }
    hideMessage();
  }

  function onDocumentKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      hideMessage();
    }
  }

  if (buttonElement) {
    buttonElement.addEventListener('click', hideMessage);
  }

  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onDocumentClick);
  document.body.append(messageElement);

  if (buttonElement && type === 'error') {
    buttonElement.focus();
  }
};

export { showMessage };
