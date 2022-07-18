import mongoose, { Date } from "mongoose";
const Schema = mongoose.Schema;

//an interface the descibes the properties needed to create a user
interface MailLogAttr {
  templateId: string;
  userId: string;
  emailsToSend: [[string]];
  emailSubject: string;
  senderMail: string;

}

//an interface that describes the properties that a user model has
interface MailLogModel extends mongoose.Model<MailLogDoc> {
  build(attrs: MailLogAttr): MailLogDoc;
}

//an interface that describes the properties a user document has
export interface MailLogDoc extends mongoose.Document {

  templateId: string;
  userId: string;
  emailsToSend: [[string]];
  emailSubject: string;
  senderMail: string;

  createdAt: Date;
  updatedAt: Date;
}

const mailLogSchema = new Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
    },
    emailsToSend: {
      type: [[String]],
      default: null
    },
    emailSubject: {
      type: String,
      default: null
    },
    senderMail: {
      type: String,
      default: null,
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

mailLogSchema.statics.build = (attrs: MailLogAttr) => {
  return new MailLog(attrs);
};

const MailLog = mongoose.model<MailLogDoc, MailLogModel>("MailLog", mailLogSchema);
export { MailLog };
