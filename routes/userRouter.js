const path = require('path');
const homesController = require('../controllers/homes');


const express = require("express");
const userRouter = express.Router();

const rootDirectory = require('../utils/pathUtil');

// Browse route - shows property cards
userRouter.get('/browse', homesController.getBrowse);
// Dynamic route for individual home details
userRouter.get('/browse/:homeId', homesController.getHomeDetails);
userRouter.get("/", homesController.getHome);
// Delete home
userRouter.post('/browse/delete/:homeId', homesController.deleteHome);


module.exports = userRouter;