import mongoose, { Date } from "mongoose";
const Schema = mongoose.Schema;

//an interface the descibes the properties needed to create a user
interface TemplateAttr {
  templateName: string;
  userId: string;
  templateLink: string;
  variables: [string]

}

//an interface that describes the properties that a user model has
interface TemplateModel extends mongoose.Model<TemplateDoc> {
  build(attrs: TemplateAttr): TemplateDoc;
}

//an interface that describes the properties a user document has
export interface TemplateDoc extends mongoose.Document {

  templateName: string;
  userId: string;
  templateLink: string;
  variables: [string]

  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema(
  {
    templateName: {
      type: String,
      default: null
    },
    variables: {
      type: [String],
      default: null
    },
    templateLink: {
      type: String,
      lowercase: true,
      trim: true,
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

templateSchema.statics.build = (attrs: TemplateAttr) => {
  return new Template(attrs);
};

const Template = mongoose.model<TemplateDoc, TemplateModel>("Template", templateSchema);
export { Template };
