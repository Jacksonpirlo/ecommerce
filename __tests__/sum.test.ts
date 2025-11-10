import { sum } from '@/components/atoms/Sum';

describe('sum', () => {
  it('suma números', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('maneja negativos', () => {
    expect(sum(-2, 3)).toBe(1);
  });
});
