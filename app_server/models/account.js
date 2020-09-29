const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    // password doesn't need to be specified. It's implicit when using passport
    username: { 
      type: String
    },
    first_name: { 
      type: String,
      required: 'First name is required'
    },
    last_name: { 
      type: String,
      required: 'Last name is required'
    },
    email: {
      type: String,
      required: 'Email is required',
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Enter a valid email address']
    },
    expertise: { 
      type: [String],
      required: 'At least one expertise is required'
    },
    mobile: { 
      type: String,
      match: [/^\d{10}$/, 'Enter a valid mobile number']
    },
    education: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);