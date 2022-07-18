import mongoose, { Date } from "mongoose";
const Schema = mongoose.Schema;

//an interface the descibes the properties needed to create a user
interface SMTPAttrs {
  host: string;
  port: number;
  secure: boolean;
  userName: string;
  password: string;
  senderMail: string;
  userId: string;

}

//an interface that describes the properties that a user model has
interface SMTPModel extends mongoose.Model<SMTPDoc> {
  build(attrs: SMTPAttrs): SMTPDoc;
}

//an interface that describes the properties a user document has
interface SMTPDoc extends mongoose.Document {

  host: string;
  port: number;

  secure: boolean;
  userName: string;

  password: string;
  senderMail: string;
  
  userId: string;

}

const smtpSchema = new Schema(
  {
    userName: {
      type: String,
      default: null
    },
    host: {
      type: String,
      default: null
    },
    senderMail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    secure: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      default: null
    },
    port: {
      type: String,
      default: null
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

smtpSchema.statics.build = (attrs: SMTPAttrs) => {
  return new SMTP(attrs);
};

const SMTP = mongoose.model<SMTPDoc, SMTPModel>("SMTP", smtpSchema);
export { SMTP };
