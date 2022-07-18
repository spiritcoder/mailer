export interface IBaseRepository {
  findOne(query: any): any;
  create(query: any): any;
  findOneById(id: any): any;
  queryOne(query: any): any;
  updateOne(id: any, update: any): any;
  updateQuery(id: any, query: any): any;
  queryMore(query: any): any;
  deleteOne(query: any): any;
  deleteById(id: any): any;
  countQuery(query: any): any
}