import EmailTemplate from "email-templates";
import nodemailer from 'nodemailer';
import path from "path";
import { mailLogRepository, SMTPRepository } from "../infra/repositories";
import { mailListRepository, templateRepository} from '../infra/repositories/index';
import csv from 'async-csv';
import * as fs from "fs";

const fsInstance = fs.promises;


export async function _loadTemplate(templateId: string, context: {}) {

  let foundTemplate = await templateRepository.findOneById(templateId);
  if (foundTemplate != null) {
    let template = new EmailTemplate({
      views: {
        root: "./",
        options: {
          extension: "hbs",
        },
      },
    });
    let res: any = await template.render(foundTemplate.templateLink, context);
    return { email: res, context };
  } else {
    return null;
  }
}


export async function _sendMail(
  senderMail: string,
  userId: string,
  email: string,
  subject: string,
  text: any
) {
  let userSMTPDetails = await SMTPRepository.findOne({ userId, senderMail });
  if (userSMTPDetails != null) {
    try {
      let transporter = nodemailer.createTransport({
        host: userSMTPDetails.host,
        port: userSMTPDetails.port,
        secure: userSMTPDetails.secure,
        auth: {
          user: userSMTPDetails.userName,
          pass: userSMTPDetails.password,
        },
      });
    
      let info = await transporter.sendMail({
        from: senderMail,
        to: email,
        subject: subject,
        text: text,
        html: text
      });
    
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.trace(error);
    }
  }
 
}

export async function _loadMailList(mailListId: string) {
  const foundMailList = await mailListRepository.findOne({ _id: mailListId });
  let data: [];
  if (foundMailList != null) {
    const csvString = await fsInstance.readFile(foundMailList.mailListPath, 'utf-8');
    const rows = await csv.parse(csvString);
    rows.shift();
    data = JSON.parse(JSON.stringify(rows));
  } else {
    data = [];
  }
  return data;
}

export async function sendTemplateMail(senderMail: string, userId: string, templateId: string, mailListId: string, emailSubject: string, context: {}) {
  //check if the template has fullname and populate context with it
  let foundTemplate = await templateRepository.findOneById(templateId);
  let templateFound: string;
  foundTemplate != null ? templateFound = await fsInstance.readFile(foundTemplate.templateLink, 'utf-8') : null;

  let emailsToSend = await _loadMailList(mailListId);

  if (emailsToSend.length > 0) {
    emailsToSend.forEach(async email => {
      let newContext = {...context, fullName: ""};
      if (templateFound.includes("{{fullName}}")) {
        newContext.fullName = email[0]
      }
      //load the template for the given instance and send
      let result = await _loadTemplate(templateId, newContext);
      let body: string;
      if (result != null) {
        body = result.email;
      } 
      else {
        body = "";
      }
      await _sendMail(
        senderMail,
        userId,
        email[1],
        emailSubject,
        body
      );
    })

    //log the emailsToSend, and the details of the emails sent (userId, templateId, emailSubject, userName used to send the mail) )
    await mailLogRepository.create({ userId, templateId, emailsToSend, emailSubject, senderMail });
  }
}
