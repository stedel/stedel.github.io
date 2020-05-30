/**
 * Created by Steffen Meifort on 2017-04-09.
 */

'use strict';

const KEY_R = 82;
const KEY_L = 76;
const KEY_SPACE = 32;

const RADIAN_CHANGE = 15;
let radian = 0;

const SPRITESHEET_FRAMETIME = 200;
const SPRITESHEET_POSITIONS = [
  ['0px', '0px'],
  ['0px', '-400px'],
  ['0px', '-800px'],
  ['0px', '-1200px'],
  ['-400px', '-1200px'],
  ['-400px', '-800px'],
  ['-400px', '-400px'],
  ['-400px', '0px'],
];
const ANIMATION_SEQUENCE = [
  0,
  1,
  2,
  3,
  2,
  1,
  2,
  3,
  0,
  0,
  0,
  4,
  4,
  5,
  6,
  7,
  6,
  5,
  6,
  7,
  4,
  4,
  0,
];

let currentAnimationFrame = 0;
let spritesheetAnimationIntervalId = 0;

$(function () {
  $(document).keydown(keyPressed);
});

/**
 * Catch key event and dispatch according to keycode.
 *
 * @param key the pressed key
 */
function keyPressed(key) {
  switch (key.keyCode) {
    case KEY_L:
      rotate(true);
      break;
    case KEY_R:
      rotate(false);
      break;
    case KEY_SPACE:
      startSpriteAnimation();
      break;
  }
}

/**
 * Rotates the circle
 *
 * @param clockwise specifies, if the rotation should be clockwise or anti-clockwise
 */
function rotate(clockwise) {
  if (clockwise) {
    radian += RADIAN_CHANGE;
    if (radian >= 360) {
      radian = 0;
    }
  } else {
    radian -= RADIAN_CHANGE;
    if (radian < 0) {
      radian = 360 - RADIAN_CHANGE;
    }
  }

  updateCircle(radian);
}

/**
 * Refreshes the src attribute of the circle <img>-tag
 *
 * @param radian the radian to be displayed
 */
function updateCircle(radian) {
  $('#circle').attr('src', 'images/circle_' + radian + '.png');
}

/**
 * Starts the sprite animation if it is not running
 */
function startSpriteAnimation() {
  if (currentAnimationFrame === 0) {
    spritesheetAnimationIntervalId = setInterval(
      animateSprite,
      SPRITESHEET_FRAMETIME,
    );
  }
}

/**
 * Loops through ANIMATION_SEQUENCE and sets current display to each corresponding spritesheet position
 */
function animateSprite() {
  if (currentAnimationFrame < ANIMATION_SEQUENCE.length - 1) {
    currentAnimationFrame++;
  } else {
    currentAnimationFrame = 0;

    if (spritesheetAnimationIntervalId !== 0) {
      clearInterval(spritesheetAnimationIntervalId);
    }
  }

  const currentSpritePositionIndex = ANIMATION_SEQUENCE[currentAnimationFrame];
  updateSpriteCss(
    SPRITESHEET_POSITIONS[currentSpritePositionIndex][0],
    SPRITESHEET_POSITIONS[currentSpritePositionIndex][1],
  );
}

/**
 * Updates the top and left css attributes for the sprite <img>-tag
 *
 * @param top top offset
 * @param left left offset
 */
function updateSpriteCss(top, left) {
  $('#spritesheet').css('top', top);
  $('#spritesheet').css('left', left);
}
