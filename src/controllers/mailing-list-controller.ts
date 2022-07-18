import { Request, Response } from 'express';
import { mailListRepository } from '../infra/repositories/index';
import { BadRequestError, DataNotSavedError } from '../errors/index'
import { createResponse } from '../utils/index';

import * as fs from "fs";
import csv from 'async-csv';

const fsInstance = fs.promises;

class MailingListService {

  createMailingList = async (req: any, res: Response) => {
    const { userId, mailListName } = req.body;
    const mailListPath = req.file.path != null ? req.file.path: null;


    const userMailingListFound = await mailListRepository.findOne({ mailListName, userId });
    if (userMailingListFound?._id != null) throw new BadRequestError("Mailing List Already Exists");

    //count the number of subscribers
    const subscriberCount = await this.countSubscribers(mailListPath);

    const saveMailList = await mailListRepository.create({ mailListPath, mailListName, userId, subscriberCount });
    if (saveMailList == null) throw new DataNotSavedError("An error occured ssving the mailing List");
    
    return createResponse(res, 200, "Mail List Saved successfully", null);
  }

  countSubscribers = async (csvPath: fs.PathLike) => {
    const csvString = await fsInstance.readFile(csvPath, 'utf-8');
    const rows = await csv.parse(csvString);
    rows.shift();
    const data = JSON.parse(JSON.stringify(rows));
    return data.length;
  }


  updateMailingList= async (req: any, res: Response) => {
    const { mailingListId } = req.body;

    const mailListPath = req.file.path != null ? req.file.path : null;
    
    const userMailingListFound = await mailListRepository.findOne({ _id: mailingListId });
    if (userMailingListFound?._id == null) throw new BadRequestError("Mailing List Does Not Exist");

    const subscriberCount = await this.countSubscribers(mailListPath);

    const updateSMTP = await mailListRepository.updateOne(mailingListId, { ...req.body, mailListPath, subscriberCount});
    if (updateSMTP == null) throw new DataNotSavedError("An error occured updating the Mailing List");

    if (userMailingListFound.mailListPath != null && mailListPath != null) fs.unlink(userMailingListFound.mailListPath, path => {});

    return createResponse(res, 200, "Mailing List Updated", null);
  }

  getAMailingList= async (req: Request, res: Response) => {
    const mailingListId = req.params.mailingListId;

    const mailListFound = await mailListRepository.findOneById(mailingListId);
    const newResponse = {
      mailListName: mailListFound?.mailListName,
      _id: mailListFound?._id,
      createdAt: mailListFound?.createdAt,
      updatedAt: mailListFound?.updatedAt,
      subscriberCount: mailListFound?.subscriberCount,
      userId: mailListFound?.userId,
      mailList: ""
    };

    if (mailListFound != null) {
      const csvString = await fsInstance.readFile(mailListFound.mailListPath, 'utf-8');
      const rows = await csv.parse(csvString);
      rows.shift();
      const data = JSON.parse(JSON.stringify(rows));
      newResponse.mailList = data;
    }

    return createResponse(res, 200, "Found Mailing List", newResponse)
  }

  deleteMailingList = async (req: Request, res: Response) => {
    const mailingListId = req.params.mailingListId;

    const foundMailList = await mailListRepository.findOne({ _id: mailingListId });
    const mailListDeleted = await mailListRepository.deleteById(mailingListId);
    if (mailListDeleted == null) throw new DataNotSavedError("An error occured deleting the Mailing List Detail");
    
    if (foundMailList != null) await fsInstance.unlink(foundMailList?.mailListPath);
      
    return createResponse(res, 200, "Mailing List Deleted", null);
  }

  getUserMailingLists = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const allUserSMTPs = await mailListRepository.queryMore({ userId });
    var responseData = allUserSMTPs.map(function(item){
      return {mailListName : item["mailListName"], userId : item["userId"], subscriberCount: item["subscriberCount"], isActive: item['isActive'], _id: item["_id"], createdAt: item['createdAt'], updatedAt: item['updatedAt']}
    });
    return createResponse(res, 200, "Found Mailing List", responseData);
  }
}

export const mailingListController = new MailingListService();

