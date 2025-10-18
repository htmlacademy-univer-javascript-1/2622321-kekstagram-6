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

const DESCRIPTIONS = [
  'Отличный день для фотографии!',
  'Закат просто волшебный',
  'Момент, который стоит запомнить',
  'Природа во всей красе',
  'Городские огни',
  'Путешествие мечты',
  'Уютный вечер',
  'Яркие эмоции',
  'Тихий момент',
  'Адреналин и скорость'
];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const createId = () => {
  let lastGeneratedId = 0;

  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const generateCommentId = createId();

const generateComment = () => {
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

const photos = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
  likes: getRandomInteger(15, 200),
  comments: Array.from({ length: getRandomInteger(0, 30) }, generateComment)
}));
