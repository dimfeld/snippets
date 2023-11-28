import { expect, test } from 'vitest';
import { updateSearchParams } from './url';

test('updateSearchParams:new', () => {
  let params = new URLSearchParams();
  updateSearchParams(params, { b: 5, a: ['a', 'b']});
  expect(params.toString()).eq('a=a&a=b&b=5');
});

test('updateSearchParams:update', () => {
  let params = new URLSearchParams('c=6&b=4');
  updateSearchParams(params, { b: 5, a: ['a', 'b'] });
  expect(params.toString()).eq('a=a&a=b&b=5&c=6');
});

test('updateSearchParams:setArray', () => {
  let params = new URLSearchParams('a=6&b=4');
  updateSearchParams(params, { a: ['a', 'b'] });
  expect(params.toString()).eq('a=a&a=b&b=4');
});

test('updateSearchParams:remove', () => {
  let params = new URLSearchParams('c=6&b=4');
  updateSearchParams(params, { b: 5, a: ['a', 'b'], c: null });
  expect(params.toString()).eq('a=a&a=b&b=5');
});
