/* eslint unused: false */

// This is the width of the game board.
// The width and height of the playing area is this minus 2.
const rhombusWidth = 11;

const five = {
  rhombusWidth: rhombusWidth,
  width: Math.floor(rhombusWidth * 1.5),
  height: rhombusWidth,
  orientation: 'pointy-topped',
  layout: 'even-r'
};

export default five;
