import { Request, Response } from 'express';
import { userRepository } from '../infra/repositories/index';
import { NotFoundError, BadRequestError, DataNotSavedError } from '../errors/index'
import { createResponse, Password, ShortCode } from '../utils/index';

class PasswordResetService {

  initiatepasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body
    const existingUser = await userRepository.findOne({ email })

    if (!existingUser) {
       throw new BadRequestError("Invalid Email");
    }

    const shortcode = await ShortCode();
    const updateUser = await userRepository.updateQuery(existingUser._id, { authCode: shortcode});

    if (updateUser == null) throw new DataNotSavedError("An error occured updating the details");
    
   //send initiate password reset email
    let emailNotification = {
      type: "email",
      emailBody: {
        emailType: "passwordReset",
        body: {
          name: existingUser.firstName,
          email: req.body.email,
          authCode: shortcode,
        }
      }
    };

    return createResponse(res, 200, "Check your email for an Authorization Code", null);
  }

  finalizePasswordReset = async (req: Request, res: Response) => {
    const { token, email, password } = req.body;
    const existingUser = await userRepository.findOne({ email })
      
    if (!existingUser) throw new BadRequestError("Invalid Credentials");

    if(existingUser.authCode === token){
      let hashPassword = await Password.toHash(password);
      const updateUser = await userRepository.updateQuery(existingUser._id, { password: hashPassword });
      if (updateUser == null) throw new DataNotSavedError("An error occured updating the details");
    }
   
    //send finalize password reset email
    let emailNotification = {
      type: "email",
      emailBody: {
        emailType: "passwordConfirmation",
        body: {
          email: req.body.email,
        }
      }
    };

    return createResponse(res, 200, "Password succeessfully changed", null);
  }

  changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword, userId } = req.body;
    const existingUser = await userRepository.findOne({ _id: userId });

    if (!existingUser) throw new BadRequestError("Invalid Credentials");

    const passwordMatch = await Password.compare(
      existingUser.password, oldPassword
    )

    if (!passwordMatch) throw new BadRequestError("Old Password does not match");

    let hashPassword = await Password.toHash(newPassword);

    const updateUser = await userRepository.updateQuery(existingUser._id, { password: hashPassword });
    if (updateUser == null) throw new DataNotSavedError("An error occured updating the details");

    //send password reset email
    let emailNotification = {
      type: "email",
      emailBody: {
        emailType: "passwordConfirmation",
        body: {
          email: req.body.email,
        }
      }
    };

    return createResponse(res, 200, "Password succeessfully changed", null);
  }
}

export const passwordResetController = new PasswordResetService();

