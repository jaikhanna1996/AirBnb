const mongoose = require('mongoose')




const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 0 },
  photoUrl: String,
  description : String
});


module.exports = mongoose.model('Home', homeSchema);



