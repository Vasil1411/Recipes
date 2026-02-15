const mongoose = require('mongoose');
require('../models/Recipe');
require('../models/User');

async function configDatabase() {
    // const connectionString = 'mongodb://localhost:27017/cooking';
    const connectionString = 'mongodb://127.0.0.1:27017/cooking';

    await mongoose.connect(connectionString);

    console.log('Database connected');
}

module.exports = { configDatabase };