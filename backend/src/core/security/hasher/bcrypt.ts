import bcrypt from 'bcryptjs';
import { IPasswordHasher } from './IPasswordHasher.js';

export class bcryptService implements IPasswordHasher{
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}