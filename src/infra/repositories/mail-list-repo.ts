import { MailList } from '../../models/index';
import { IBaseRepository } from '../interfaces/index';

class MailListRepository implements IBaseRepository {

 async create(query: any) {
    return MailList.create(query);
  }

  async findOneById(id: any) {
    return MailList.findById(id);
  }

  async findOne(query: any) {
    return MailList.findOne(query);
  }

  async queryOne(query: any) {
    return MailList.findOne(query);
  }

  async updateOne(id: any, update: any) {
    return MailList.findByIdAndUpdate(id, update);
  }

  async updateQuery(id: any, query: any) {
    return MailList.updateMany(
      { _id: id },
      { $set: query },
      { multi: true, new: true }
    );
  }

  async queryMore(query: any) {
    return MailList.find(query);
  }

  async deleteOne(query: any) {
    return MailList.deleteOne(query);
  }

  async deleteById(id: any) {
    return MailList.deleteOne({ _id: id });
  }

  async countQuery(query: any) {
    return MailList.countDocuments(query);
  }
}

export const mailListRepository = new MailListRepository();
