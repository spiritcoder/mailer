import { Request, Response } from 'express';
import { userRepository } from '../infra/repositories/index';
import { BadRequestError, DataNotSavedError } from '../errors/index'
import { createResponse, ShortCode } from '../utils/index';

class EmailVerificationService {

  initiateEmailVerification = async (req: Request, res: Response) => {
    const { email } = req.body
    const existingUser = await userRepository.findOne({ email })

    if (!existingUser) {
       throw new BadRequestError("Invalid Email");
    }

    const shortcode = await ShortCode();
    const updateUser = await userRepository.updateQuery(existingUser._id, { verificationCode: shortcode });

    if (updateUser == null) throw new DataNotSavedError("An error occured updating the details");
    
    //send initiateverification email
    let emailNotification = {
      type: "email",
      emailBody: {
        emailType: "emailVerificationMail",
        body: {
          name: existingUser.firstName,
          email: existingUser.email,
          usertype: existingUser.userType,
          userid: existingUser._id,
          verification_code: shortcode,
        }
      }
    };
         
    return createResponse(res, 200, "Check your email for verification link", null);
  }

  finalizeEmailVerification = async (req: Request, res: Response) => {
    const { verificationCode, userId } = req.body
    const existingUser = await userRepository.findOne({ _id: userId })
      
    if (!existingUser) {
        throw new BadRequestError("Invalid Credentials");
    }

    if (existingUser.verificationCode != verificationCode) throw new BadRequestError("The verification codes do not match");

    // existingUser.isEmailVerified = true;
    const updateUser = await userRepository.updateQuery(existingUser._id, { isEmailVerified: true });
    if (updateUser == null) throw new DataNotSavedError("An error occured updating the details");
    
    //send finalizesverification email
    let emailNotification = {
      type: "email",
      emailBody: {
        emailType: "emailSuccessfulVerificationMail",
        body: {
          name: existingUser.firstName,
          email: existingUser.email,
          usertype: existingUser.userType
        }
      }
    };

    return createResponse(res, 200, "Email succeessfully verified", null);
  }
}

export const emailVerificationController = new EmailVerificationService();

