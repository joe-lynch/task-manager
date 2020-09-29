var expect  = require('chai').expect
var mongoose = require('mongoose');
var Account = require("../models/account.js");
var db;

describe('Retrieve Account Information', function() {
  
  this.timeout(10000); // allow for slow responses to exceed 2000ms limit
  
  before(function(done) {
    var dbURI = 'mongodb://agilewebproject:awp@ds237707.mlab.com:37707/doable'; 
    //var dbURI = 'mongodb://localhost/doable'; 
    db = mongoose.connect(dbURI);
    done();
  });
  
  after(function(done) {
    Account.remove({}, function() {
      mongoose.connection.close();
      done();
    })
  });
  
  beforeEach(function(done) {
    var account = new Account({
      username: 'jason@doable.com',
      email: 'jason@doable.com',   
      first_name: 'Jason',
      last_name: 'Seotis',
      mobile: '0400000000',
      education: 'Masters',
      expertise: 'Database'
    });
    
    account.save(function(err) {
      if (err) {
        console.log('Error: ' + err.message);
      }
      done();
    })    
  })
    
  it('Find email by username', function(done) {
    Account.findOne({ username: 'jason@doable.com'}, function(err, account) {
      expect(account.username).to.equal('jason@doable.com');
      done();
    });
  });
  
  it('Find first name by username', function(done) {
    Account.findOne({ username: 'jason@doable.com'}, function(err, account) {
      expect(account.first_name).to.equal('Jason');
      done();
    });
  });
  
  it('Find last name by username', function(done) {
    Account.findOne({ username: 'jason@doable.com'}, function(err, account) {
      expect(account.last_name).to.equal('Seotis');
      done();
    });
  });
  
  it('Find mobile by username', function(done) {
    Account.findOne({ username: 'jason@doable.com'}, function(err, account) {
      expect(account.mobile).to.equal('0400000000');
      done();
    });
  });
  
  it('Find education by username', function(done) {
    Account.findOne({ username: 'jason@doable.com'}, function(err, account) {
      expect(account.education).to.equal('Masters');
      done();
    });
  });
  
  it('Find expertise by username', function(done) {
    Account.findOne({ username: 'jason@doable.com'}, function(err, account) {
      expect(account.expertise).to.deep.equal(['Database'])
      done();
    });
  });
  
})
