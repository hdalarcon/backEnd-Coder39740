import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = async (password) =>
{
    return await bcrypt.hash(password, 10)
}

export const isValidPassword = async (password, passwordHash) =>
{
    return await bcrypt.compare(password, passwordHash);
}

export const generateToken = async (user) =>
{
    return jwt.sign({ user: { ...user, password: undefined } }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
}
