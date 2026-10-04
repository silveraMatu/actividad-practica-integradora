import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/appError.js';
import { authUserPayload } from '../types/express.js';
const SECRET = process.env.SECRET!;

export const createToken = (
  userId: string,
  rol: string
): string => {
  const payload = {
    userId,
    rol,
  };

  const token = jwt.sign(payload, SECRET, {
    expiresIn: '1h',
  });

  return token;
};

export const verifyToken = (token: string): authUserPayload => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded as authUserPayload;
  } catch (err) {
    throw new UnauthorizedError('Token inválido o expirado');
  }
};