import bcrypt from 'bcryptjs';

export const hash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};