const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileExtension = path.extname(file.originalname);
        const convertedExtension = fileExtension.toLowerCase();

        const fileName = `${hash.toString("hex")}-${file.originalname.replace(
          fileExtension,
          convertedExtension
        )}`;


        cb(null, fileName);
      });
    }
  }),
  s3: multerS3({
    s3: new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_QUADRO,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_QUADRO,
      region: process.env.AWS_DEFAULT_REGION_QUADRO
    }),
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(0, (err, hash) => {
        if (err) cb(err);

        const fileExtension = path.extname(file.originalname);
        const fileName = `${hash.toString("hex")}-${file.originalname.replace(
          fileExtension,
          fileExtension.toLowerCase()
        )}`;

        cb(null, fileName);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
      "application/pdf"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
};
