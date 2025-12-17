const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const filtersContainerElement = document.querySelector('.img-filters');
const filtersFormElement = filtersContainerElement.querySelector('.img-filters__form');

const showFilters = () => {
  filtersContainerElement.classList.remove('img-filters--inactive');
};

const getRandomPhotos = (photos) => {
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photos) =>
  [...photos].sort((a, b) => b.comments.length - a.comments.length);

const applyFilter = (photos, filterId) => {
  switch (filterId) {
    case 'filter-random':
      return getRandomPhotos(photos);
    case 'filter-discussed':
      return getDiscussedPhotos(photos);
    default:
      return photos;
  }
};

const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

let currentPhotos = [];

const onFilterChange = (callback) => {
  filtersFormElement.addEventListener('click', (evt) => {
    const target = evt.target;

    if (!target.matches('.img-filters__button')) {
      return;
    }

    const activeButtonElement = filtersFormElement.querySelector('.img-filters__button--active');
    activeButtonElement.classList.remove('img-filters__button--active');
    target.classList.add('img-filters__button--active');

    const filterId = target.id;

    const debouncedCallback = debounce(() => {
      const filteredPhotos = applyFilter(currentPhotos, filterId);
      callback(filteredPhotos);
    });

    debouncedCallback();
  });
};

const initFilters = (photos, callback) => {
  currentPhotos = photos;
  showFilters();
  onFilterChange(callback);
};

export { initFilters };
