import { MailLog } from '../../models/index';
import { IBaseRepository } from '../interfaces/index';

class MaillogRepositoryClass implements IBaseRepository {

 async create(query: any) {
    return MailLog.create(query);
  }

  async findOneById(id: any) {
    return MailLog.findById(id);
  }

  async findOne(query: any) {
    return MailLog.findOne(query);
  }

  async queryOne(query: any) {
    return MailLog.findOne(query);
  }

  async updateOne(id: any, update: any) {
    return MailLog.findByIdAndUpdate(id, update);
  }

  async updateQuery(id: any, query: any) {
    return MailLog.updateMany(
      { _id: id },
      { $set: query },
      { multi: true, new: true }
    );
  }

  async queryMore(query: any) {
    return MailLog.find(query).populate("templateId");
  }

  async deleteOne(query: any) {
    return MailLog.deleteOne(query);
  }

  async deleteById(id: any) {
    return MailLog.deleteOne({ _id: id });
  }

  async countQuery(query: any) {
    return MailLog.countDocuments(query);
  }
}

export const mailLogRepository = new MaillogRepositoryClass();
