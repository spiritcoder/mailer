import { Request, Response } from 'express';
import { mailLogRepository, SMTPRepository } from '../infra/repositories/index';
import { NotFoundError, BadRequestError, DataNotSavedError } from '../errors/index'
import { createResponse} from '../utils/index';
import { sendTemplateMail } from '../services/mail-service';

class EmailBroadcastService {

  sendMail = async (req: Request, res: Response) => {
    const { templateId, senderMail, context, mailListId, emailSubject, userId } = req.body;
    await sendTemplateMail(senderMail, userId, templateId, mailListId, emailSubject, context);
    return createResponse(res, 200, "Check your History for delivery status", null);
  }

  fetchUserMailLog = async (req: Request, res: Response) => {
    let foundUserMailLog = await mailLogRepository.queryMore({ userId: req.params.userId })
    return createResponse(res, 200, "Found Mailing List", foundUserMailLog) 
  }

  fetchAMailLog = async (req: Request, res: Response) => {
    let foundUserMailLog = await mailLogRepository.queryMore({ _id: req.params.mailLogId })
    return createResponse(res, 200, "Found Mailing List", foundUserMailLog) 
  }
}

export const emailBroadcastController = new EmailBroadcastService();

