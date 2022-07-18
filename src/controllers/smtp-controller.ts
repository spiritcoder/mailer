import { Request, Response } from 'express';
import { SMTPRepository } from '../infra/repositories/index';
import { NotFoundError, BadRequestError, DataNotSavedError } from '../errors/index'
import { createResponse} from '../utils/index';

class SMTPService {

  createSMTPDetails = async (req: Request, res: Response) => {
    const { host, userName, password, secure, senderMail, port, userId } = req.body;

    const userSMTPFound = await SMTPRepository.findOne({ host, userName, password, secure, senderMail, port, userId });
    if (userSMTPFound?._id != null) throw new BadRequestError("Credentials Already Exists");

    const saveSMTP = await SMTPRepository.create({ host, userName, password, secure, senderMail, port, userId });
    if (saveSMTP == null) throw new DataNotSavedError("An error occured ssving the details");
    
    return createResponse(res, 200, "SMTP Details saved successfully", null);
  }


  updateSMTPDetails = async (req: Request, res: Response) => {
    const { smtpId } = req.body;

    const updateSMTP = await SMTPRepository.updateOne(smtpId, { ...req.body });
    if (updateSMTP == null) throw new DataNotSavedError("An error occured updating the SMTP");

    return createResponse(res, 200, "SMTP Updated", null);
  }

  getAnSMTPDetail = async (req: Request, res: Response) => {
    const smtpId = req.params.smtpId;

    const smtpFound = await SMTPRepository.findOneById(smtpId)
    return createResponse(res, 200, "Found SMTP", smtpFound)
  }

  deleteSMTPDetails = async (req: Request, res: Response) => {
    const smtpId = req.params.smtpId;

    const smtpDeleted = await SMTPRepository.deleteById(smtpId);
    if (smtpDeleted == null) throw new DataNotSavedError("An error occured deleting the SMTP Detail");
    
    return createResponse(res, 200, "SMTP Deleted", null);
  }

  getUserSMTPDetails = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const allUserSMTPs = await SMTPRepository.queryMore({userId});
    return createResponse(res, 200, "Found User SMTP", allUserSMTPs);
  }
}

export const SMTPController = new SMTPService();

