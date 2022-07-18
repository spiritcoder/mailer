import mongoose, { Date } from "mongoose";
const Schema = mongoose.Schema;

//an interface the descibes the properties needed to create a user
interface UserAttrs {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  userType: string;
  referralCode: string,
  isVerified: boolean;
}

//an interface that describes the properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//an interface that describes the properties a user document has
interface UserDoc extends mongoose.Document {

  firstName: string;
  lastName: string;

  email: string;
  isEmailVerified: boolean;

  phone: string;

  password: string;
  authCode: string;

  referralCode: string;

  userType: string;
  userLevel: number,
  verificationCode: string;

  isVerified: boolean;
  isBanned: boolean;
  allowUnsubscribe: boolean;

  createdAt: Date;
  updatedAt: Date;

}

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      default: null
    },
    lastName: {
      type: String,
      default: null
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      default: null
    },
    password: {
      type: String,
      default: null
    },
    authCode: {
      type: String,
      default: null
    },
    referralCode: {
      type: String,
      default: null
    },
    userType: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verificationCode: {
      type: String,
      default: null
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    allowUnsubscribe: {
      type: Boolean,
      default: true,
    },
    userLevel: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//for text search
userSchema.index({ cribmdNumber: "text", email: "text" });

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
