const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Changelog = new Schema({

    table: { 
      type: String
    },

    timestamp: { 
      type: String
    },

    action: {
        type: String
    },
    // To be stringified
    oldValue: {
        type: String
    },
    
    newValue: {
        type: String
    },

    description: { 
        type: String
      }

});

module.exports = mongoose.model('changelog', Changelog);
