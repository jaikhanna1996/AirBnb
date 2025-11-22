const Home = require('../models/homes');

// GET: Render Add Home Page
exports.getAddHome = (req, res) => {
  res.render('addHome', { activeTab: 'host', isLoggedIn: req.isLoggedIn });
};

// POST: Add a new home
exports.postAddHome = async (req, res) => {
  try {
    const homeData = {
      houseName: req.body.houseName,
      price: req.body.price,
      location: req.body.location,
      rating: req.body.rating,
      photoUrl: req.body.photoUrl,
      description: req.body.description,
      document: req.file ? '/uploads/' + req.file.filename : null
    };

    await Home.create(homeData);
    console.log('🏠 Home added successfully');
    res.render('homeAdded', { activeTab: 'host', isLoggedIn: req.isLoggedIn });
  } catch (err) {
    console.error('❌ Error inserting home:', err);
    res.status(500).render('404', { message: 'Failed to add property', activeTab: 'host' });
  }
};

// GET: Home Page
exports.getHome = (req, res) => {
  res.render('home', { activeTab: 'home', isLoggedIn: req.isLoggedIn });
};

// GET: Browse all homes
exports.getBrowse = async (req, res) => {
  try {
    const homes = await Home.find();
    res.render('browse', { registeredHomes: homes, activeTab: 'browse', isLoggedIn: req.isLoggedIn });
  } catch (err) {
    console.error('❌ Error fetching homes:', err);
    res.status(500).render('404', { message: 'Failed to load properties', activeTab: 'browse' });
  }
};

// GET: Home Details by ID
exports.getHomeDetails = async (req, res) => {
  const homeId = req.params.homeId;

  try {
    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).render('404', { message: 'Property not found', activeTab: 'browse', isLoggedIn: req.isLoggedIn });
    }
    res.render('homeDetails', { home, activeTab: 'browse', isLoggedIn: req.isLoggedIn });
  } catch (err) {
    console.error('❌ Error fetching home details:', err);
    res.status(500).render('404', { message: 'Failed to load property', activeTab: 'browse', isLoggedIn: req.isLoggedIn });
  }
};

