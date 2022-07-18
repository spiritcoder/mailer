import mongoose, { Date } from "mongoose";
const Schema = mongoose.Schema;

//an interface the descibes the properties needed to create a user
interface MailListAttr {
  mailListName: string;
  userId: string;
  mailListPath: string;
  isActive: boolean;
  subscriberCount: number;

}

//an interface that describes the properties that a user model has
interface MailListModel extends mongoose.Model<MailListDoc> {
  build(attrs: MailListAttr): MailListDoc;
}

//an interface that describes the properties a user document has
export interface MailListDoc extends mongoose.Document {

  mailListName: string;
  userId: string;
  mailListPath: string;
  isActive: boolean;
  subscriberCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const mailListSchema = new Schema(
  {
    mailListName: {
      type: String,
      default: null
    },
    mailListPath: {
      type: String,
      lowercase: true,
      trim: true,
    },
    subscriberCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

mailListSchema.statics.build = (attrs: MailListAttr) => {
  return new MailList(attrs);
};

const MailList = mongoose.model<MailListDoc, MailListModel>("MailList", mailListSchema);
export { MailList };
