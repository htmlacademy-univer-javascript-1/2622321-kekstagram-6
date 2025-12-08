export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const createId = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};
