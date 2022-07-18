import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET != undefined ? process.env.JWT_SECRET : "loremIGIDIGI";

export function generateToken(data = {}) {
  return jwt.sign(data, secret)
}

export function verifyToken(token: string) {
  return jwt.verify(token.replace("Bearer ", ""), secret);
}