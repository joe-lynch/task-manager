var expect  = require("chai").expect;
var mongoose = require('mongoose');
var request = require("request");
var Account = require("../models/account.js");

describe("Route Tests", function() {
  //var url = 'http://localhost:3000'
  var url = 'https://agilewebproject-doable.herokuapp.com'
  
  this.timeout(10000); // allow for slow responses to exceed 2000ms limit
  
  before(function(done) {
    //var dbURI = 'mongodb://localhost/doable';
    var dbURI = 'mongodb://agilewebproject:awp@ds237707.mlab.com:37707/doable'; 
    
    db = mongoose.connect(dbURI);
    done();
  });
    
  after(function(done) {
    Account.remove({ email: 'jason@doable.com'}, function() {
      mongoose.connection.close();
      done();
    });
  });

  describe("POST /register", function() {
    it("Create an account using valid details", function (done) {
      request.post({ 
        url: url.concat('/register'),
        form: { 
          email: 'jason@doable.com',
          password: 'secret',
          fname: 'Jason',
          lname: 'Seotis',
          mobile: '0400000000',
          education: 'Masters',
          expertise: 'Database',
          expertise: 'Application',
        }
      }, function (err, response, body) {
        expect(response.statusCode).to.equal(302)
        done();
      })
    });
    
    it("Attempt to create an account using an already existing email address in system", function (done) {
      request.post({ 
        url: url.concat('/register'),
        form: { 
          email: 'jason@doable.com',
          password: 'secret',
          fname: 'Jason',
          lname: 'Seotis',
          mobile: '0400000000',
          education: 'Masters',
          expertise: 'Database',
          expertise: 'Application',
        }
      }, function (err, response, body) {
        expect(response.statusCode).to.equal(400)
        done();
      })
    });
    
    it("Attempt to create an account using an invalid mobile number", function (done) {
      request.post({ 
        url: url.concat('/register'),
        form: { 
          email: 'jason_new@doable.com',
          password: 'secret',
          fname: 'Jason',
          lname: 'Seotis',
          mobile: '04xxxx',
          education: 'Masters',
          expertise: 'Database',
          expertise: 'Application',
        }
      }, function (err, response, body) {
        expect(response.statusCode).to.equal(400)
        done();
      })
    });

    it("Attempt to create an account with no password", function (done) {
      request.post({ 
        url: url.concat('/register'),
        form: { 
          email: 'jason_new@doable.com',
          fname: 'Jason',
          lname: 'Seotis',
          mobile: '04xxxx',
          education: 'Masters',
          expertise: 'Database',
          expertise: 'Application',
        }
      }, function (err, response, body) {
        expect(response.statusCode).to.equal(400)
        done();
      })
    });   
  });
  
  describe("POST /login", function() {
    it("Login to a valid account", function (done) {
      request.post({ 
        url: url.concat('/login'),
        form: { 
          email: 'jason@doable.com',
          password: 'secret'
        }
      }, function (err, response, body) {
        expect(response.body).to.match(/\/project/)
        done();
      })
    });
    
    it("Attempt to login to an account using an incorrect password", function (done) {
      request.post({ 
        url: url.concat('/login'),
        form: { 
          email: 'jason@doable.com',
          password: 'wrongsecret'
        }
      }, function (err, response, body) {
        expect(response.body).to.match(/\/login/)
        done();
      })
    });
  });
});
