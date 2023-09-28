import * as bcrypt from 'bcrypt';

export function hashPassword(value: string) {
  return bcrypt.hash(value, 10);
}

export function compareHash(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}
