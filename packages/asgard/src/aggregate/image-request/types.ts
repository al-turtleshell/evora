import * as t from 'io-ts';


const isNumberOfImages = (n: unknown): n is number => 
  typeof n === 'number' && n % 4 === 0 && n > 0;

export const NumberOfImages = new t.Type<number, number, unknown>(
  'NumberOfImages',
  isNumberOfImages,
  (input, context) => isNumberOfImages(input) ? t.success(input) : t.failure(input, context),
  t.identity
);