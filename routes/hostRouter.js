const path = require('path');
const homesController = require('../controllers/homes');

const express = require("express");
const hostRouter = express.Router();
const rootDirectory = require('../utils/pathUtil');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })


hostRouter.get("/add-home", homesController.getAddHome);
hostRouter.post("/add-home", upload.single('document'), homesController.postAddHome);

exports.hostRouter = hostRouter;
