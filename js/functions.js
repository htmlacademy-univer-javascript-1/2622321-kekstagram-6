const checkStringLength = (string, maxLength) => string.length <= maxLength;

checkStringLength('проверяемая строка', 20);
checkStringLength('проверяемая строка', 18);
checkStringLength('проверяемая строка', 10);

const checkPalindrome = (string) => {
  const text = string.replaceAll(' ', '').toLowerCase();
  let reversedString = '';

  for (let i = text.length - 1; i >= 0; i--) {
    reversedString += text[i];
  }

  return reversedString === text;
};

checkPalindrome('топот');
checkPalindrome('ДовОд');
checkPalindrome('Кекс');
checkPalindrome('Лёша на полке клопа нашёл');

const extractNumber = (string) => {
  string = String(string);
  let numbers = '';
  for (let i = 0; i < string.length; i++) {
    const char = string[i];

    if (char >= '0' && char <= '9') {
      numbers += char;
    }
  }

  if (numbers === '') {
    return NaN;
  }

  return parseInt(numbers, 10);
};

extractNumber('2023 год');
extractNumber('ECMAScript 2022');
extractNumber('1 кефир, 0.5 батона');
extractNumber('агент 007');
extractNumber(2023);
extractNumber(-1);
extractNumber(1.5);
