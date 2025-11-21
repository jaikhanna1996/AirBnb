require('dotenv').config();
const http = require("http");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const userRouter = require("./routes/userRouter");
const {hostRouter} = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const path = require('path');
// HTTP Server
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("Error: MONGODB_URI is not defined!");
  process.exit(1);
}
const server = http.createServer(app);
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);


app.set("view engine", "ejs");
app.set("views", "views");

// Middleware ordering is important
// 1. bodyParser middleware
// 2. userRouter
// 3. hostRouter
// 4. 404 handler

const rootDirectory = require('./utils/pathUtil');
const { default: mongoose } = require("mongoose");
app.use(express.static((path.join(rootDirectory, 'public'))));

const store = new MongoStore({
  uri: mongoURI,
  collection: 'sessions'
});



app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: store
}));

app.use(bodyParser.urlencoded({ extended: false })); // bodyParser middleware

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn || false;
  console.log("Logged in?", req.isLoggedIn);
  next();
});
app.use(authRouter);

app.use(userRouter);
app.use("/host", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}, hostRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});


const PORT = process.env.PORT || 3024;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB (airbnb database)');
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`✅ Server listening on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.log('❌ Error connecting to MongoDB:', err);
  });

module.exports = app;

