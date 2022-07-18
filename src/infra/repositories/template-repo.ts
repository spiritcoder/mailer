import { Template } from '../../models/index';
import { IBaseRepository } from '../interfaces/index';

class TemplateRepository implements IBaseRepository {

 async create(query: any) {
    return Template.create(query);
  }

  async findOneById(id: any) {
    return Template.findById(id);
  }

  async findOne(query: any) {
    return Template.findOne(query);
  }

  async queryOne(query: any) {
    return Template.findOne(query);
  }

  async updateOne(id: any, update: any) {
    return Template.findByIdAndUpdate(id, update);
  }

  async updateQuery(id: any, query: any) {
    return Template.updateMany(
      { _id: id },
      { $set: query },
      { multi: true, new: true }
    );
  }

  async queryMore(query: any) {
    return Template.find(query);
  }

  async deleteOne(query: any) {
    return Template.deleteOne(query);
  }

  async deleteById(id: any) {
    return Template.deleteOne({ _id: id });
  }

  async countQuery(query: any) {
    return Template.countDocuments(query);
  }
}

export const templateRepository = new TemplateRepository();
