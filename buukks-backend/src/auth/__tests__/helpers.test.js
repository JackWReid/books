/* eslint-disable */
import { genSaltSync, hashSync } from 'bcryptjs';
import { comparePasswords } from '../helpers';

const passwordHash = hashSync('password', genSaltSync());

describe('comparePasswords helper', () => {
  it('return true for matching passwords', () => {
    expect(comparePasswords('password', passwordHash)).toBe(true);
  });

  it('return false for non-matching passwords', () => {
    expect(comparePasswords('password2', passwordHash)).toBe(false);
  });
});
