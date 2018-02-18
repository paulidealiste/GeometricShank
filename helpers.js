const R = require('ramda');

const getRandomBounds = (array) => {
  let a = 1;
  let b = 1;
  while (a == b) {
    a = Math.floor(array.length * Math.random());
    b = Math.floor(array.length * Math.random());
  }
  if (a > b) {
    return [array[b], array[a]];
  } else {
    return [array[a], array[b]];
  }
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
