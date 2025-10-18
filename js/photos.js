import { getRandomInteger } from './utils.js';
import { generateComment } from './comments.js';

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

export const photos = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
  likes: getRandomInteger(15, 200),
  comments: Array.from({ length: getRandomInteger(0, 30) }, generateComment)
}));
