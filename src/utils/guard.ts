import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";
import { verifyToken } from './';


export async function applyGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    throw new BadRequestError("Provide an Authorization")
  }
  try {
    const decoded = verifyToken(token);
    // console.log(decoded)
    // if (decoded == null) throw new BadRequestError("Authorization Failed");

  } catch (err) {
    throw new BadRequestError("Authorization Failed")
  }
  return next();
}