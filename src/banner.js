export const ALLOWED_CHARS = Object.freeze(['#', '*', '@', '%', '&', '+', '=']);

const STENCIL = [
  ' XXXXX  XXXXX  XXXXX  X   X  X   X  XXXXX  XXXXX   XXXX   X   X  X   X  XXXX   XXXX   X   X',
  ' X      X   X  X   X  XX  X  XX  X    X    X      X    X  X   X  XX  X  X   X  X   X   X X ',
  ' XXXXX  XXXXX  XXXXX  X X X  X X X    X    XXXXX  X    X  X   X  X X X  X   X  XXXXX    X  ',
  '     X  X      X   X  X  XX  X  XX    X    X      X    X  X   X  X  XX  X   X  X  X     X  ',
  ' XXXXX  X      X   X  X   X  X   X    X    X       XXXX    XXX   X   X  XXXX   X   X    X  '
].join('\n');

export function pickChar(randomFn = Math.random) {
  const rawIndex = Math.floor(randomFn() * ALLOWED_CHARS.length);
  const clampedIndex = Math.min(ALLOWED_CHARS.length - 1, Math.max(0, rawIndex));
  return ALLOWED_CHARS[clampedIndex];
}

export function renderSprintFoundry(char) {
  if (typeof char !== 'string' || char.length !== 1) {
    throw new TypeError('char must be a single-character string');
  }

  return STENCIL.replaceAll('X', char);
}
