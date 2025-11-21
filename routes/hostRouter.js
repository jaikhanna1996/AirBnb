const path = require('path');
const homesController = require('../controllers/homes');

const express = require("express");
const hostRouter = express.Router();
const rootDirectory = require('../utils/pathUtil');


hostRouter.get("/add-home", homesController.getAddHome);
hostRouter.post("/add-home", homesController.postAddHome);

exports.hostRouter = hostRouter;
