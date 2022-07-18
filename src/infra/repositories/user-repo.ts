import { User } from '../../models/index';
import { IBaseRepository } from '../interfaces/index';

class UserRepository implements IBaseRepository {

 async create(query: any) {
    return User.create(query);
  }

  async findOneById(id: any) {
    return User.findById(id);
  }

  async findOne(query: any) {
    return User.findOne(query);
  }

  async queryOne(query: any) {
    return User.findOne(query);
  }

  async updateOne(id: any, update: any) {
    return User.findByIdAndUpdate(id, update);
  }

  async updateQuery(id: any, query: any) {
    return User.updateMany(
      { _id: id },
      { $set: query },
      { multi: true, new: true }
    );
  }

  async queryMore(query: any) {
    return User.find(query);
  }

  async deleteOne(query: any) {
    return User.deleteOne(query);
  }

  async deleteById(id: any) {
    return User.deleteOne({ _id: id });
  }

  async countQuery(query: any) {
    return User.countDocuments(query);
  }
}

export const userRepository = new UserRepository();
