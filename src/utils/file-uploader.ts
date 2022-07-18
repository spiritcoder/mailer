import path from "path";
import multer from "multer";
import { BadRequestError } from "../errors";

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads/mailingList");
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "text/csv"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return new BadRequestError("Only .csv file is allowed")
    }
  },
});
