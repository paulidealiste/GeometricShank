const R = require('ramda');

const getRandomBounds = (array) => {
  let a, b;
  while (b == null || b >= array.length) {
    a = Math.floor(array.length * Math.random());
    b = a + Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
  }
  return [array[a], array[b]];
};
const mapIndexed = R.addIndex(R.map);
const characterifyString = (s) => s.split("");
const isSpace = (c, index) => c == ' ' ? index : 0;
const notZero = (n) => n != 0 && n != '0';
const spaceIndexes = R.compose(
  R.filter(notZero),
  mapIndexed(isSpace),
  characterifyString
);
const randomIndices = R.compose(
  getRandomBounds,
  spaceIndexes
);

module.exports = {
  randomIndices: randomIndices
}
