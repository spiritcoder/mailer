import { Request, Response } from 'express';
import { userRepository } from '../infra/repositories/index';
import { NotFoundError, BadRequestError, DataNotSavedError } from '../errors/index'
import { createResponse, textToLowerCase, Password, commonTokenResponse, ShortCode } from '../utils/index';
class Authentication {

  signUp = async (req: Request, res: Response) => {
    const { phone, email, password, userType, firstName, lastName} = req.body

    const existingUser = await userRepository.findOne({ email })
      
    if (existingUser) throw new BadRequestError("Email already exist ");
    let verified = userType == "doctor" ? false : true;
    let lowerCaseEmail = await textToLowerCase(email);

    let hashPassword = await Password.toHash(password);
    let referralCode = await ShortCode();

    const user = {
      phone, email: lowerCaseEmail, password: hashPassword, userType, isVerified: verified, referralCode, firstName, lastName
    };

    const saveUser = await userRepository.create(user);

    console.log(saveUser);
    if (saveUser._id == null) throw new DataNotSavedError("There was a problem saving the User");
    
    await commonTokenResponse(saveUser, req, res, "Registration Successful");
  }

  logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await userRepository.findOne({ email })
    if (!existingUser) throw new BadRequestError("Invalid Credentials");

    const passwordMatch = await Password.compare(
        existingUser.password, password
    )

    if (!passwordMatch) {
        throw new BadRequestError("Invalid Credentials");
    }

    await commonTokenResponse(existingUser, req, res, "Login Successful");

  }

  signOut = async (req: Request, res: Response) => {
    return createResponse(res, 200, "Signed Out", null);
  }
}

export const authController = new Authentication();

