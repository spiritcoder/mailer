import { Request, Response } from 'express';
import { createResponse, generateToken } from '../utils/index';
import { userRepository } from '../infra/repositories/index';
import { BadRequestError } from '../errors';

export async function commonTokenResponse(existingUser: any, req: Request, res: Response, message: string) {
  let token = generateToken({
    email: existingUser.email,
    id: existingUser._id,
    type: existingUser.user_type,
    user_level: existingUser.user_level,
  });

  // We should not tell our users our internal password hash.
  delete existingUser.password;

  //set a session with the token generated
  req.session = { jwt: token };

  let data = ({
    status: 200,
    success: true,
    token: token,
    // user: existingUser,
  });


  createResponse(res, 200, message, data);

}