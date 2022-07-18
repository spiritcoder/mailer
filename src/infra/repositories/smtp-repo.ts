import { SMTP } from '../../models/index';
import { IBaseRepository } from '../interfaces/index';

class SMTPRepositoryClass implements IBaseRepository {

 async create(query: any) {
    return SMTP.create(query);
  }

  async findOneById(id: any) {
    return SMTP.findById(id);
  }

  async findOne(query: any) {
    return SMTP.findOne(query);
  }

  async queryOne(query: any) {
    return SMTP.findOne(query);
  }

  async updateOne(id: any, update: any) {
    return SMTP.findByIdAndUpdate(id, update);
  }

  async updateQuery(id: any, query: any) {
    return SMTP.updateMany(
      { _id: id },
      { $set: query },
      { multi: true, new: true }
    );
  }

  async queryMore(query: any) {
    return SMTP.find(query);
  }

  async deleteOne(query: any) {
    return SMTP.deleteOne(query);
  }

  async deleteById(id: any) {
    return SMTP.deleteOne({ _id: id });
  }

  async countQuery(query: any) {
    return SMTP.countDocuments(query);
  }
}

export const SMTPRepository = new SMTPRepositoryClass();
