import { getRandomInteger, createId } from './utils.js';

const NAMES = [
  'Артём', 'Мария', 'Дмитрий', 'Анна', 'Сергей',
  'Елена', 'Александр', 'Ольга', 'Иван', 'Наталья',
  'Михаил', 'Екатерина', 'Андрей', 'Юлия', 'Павел'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const generateCommentId = createId();

export const generateComment = () => {
  const messageCount = getRandomInteger(1, 2);
  const message = Array.from(
    { length: messageCount },
    () => MESSAGES[getRandomInteger(0, MESSAGES.length - 1)]
  ).join(' ');

  return {
    id: generateCommentId(),
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message,
    name: NAMES[getRandomInteger(0, NAMES.length - 1)]
  };
};
