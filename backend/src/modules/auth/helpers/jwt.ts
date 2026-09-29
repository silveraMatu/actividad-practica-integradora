import jwt from 'jsonwebtoken';
import type { IRole } from '../../../database/entities/role.js';

const SECRET = process.env.SECRET!;

export const createToken = (
  userId: string,
  role: Pick<IRole, "name">[],
): string => {
  const payload = {
    id: userId,
    role,
  };

  const token = jwt.sign(payload, SECRET, {
    expiresIn: '1h',
  });

  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Token inválido o expirado');
  }
};