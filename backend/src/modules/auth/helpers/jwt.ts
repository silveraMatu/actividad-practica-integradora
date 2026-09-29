import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET!;

export const createToken = (
  userId: string,
  role: string,
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