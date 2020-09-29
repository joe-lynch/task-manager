const passport = require('passport');
const Account = require('../models/account');
const Project = require('../models/project');

module.exports.find_account = (req, res, next) => {
  if (req.user) {
    var query = Account.findOne({ '_id': req.user._id });
    query.exec(function (err, account) {
      if (err) {
        return res.render('index', { 
          message: err.message,
          error: err
        })
      }
      res.account = account;
      next();
    });
  }
  else {
    var no_login = new Error("You must to logged in to access your account. Please login first")
    res.status(400);
    res.render('index', {
      message: no_login.message,
      error: no_login
    });
  }
}

module.exports.find_accounts = (req, res, next) => {
  var query = Account.find();
  query.select('first_name last_name')
  query.exec(function (err, accounts) {
    if (err) {
      return res.render('index', { 
        message: err.message,
        error: err
      });
    }    
    res.accounts = accounts;
    next();
  });
}

module.exports.index = (req, res) => {
  res.render('index', { user: req.user });
}
  
module.exports.login_form = (req, res) => {
  var show_popup = 'login-popup';
  if (req.user) {
    show_popup = false;
  }

  res.render('index', {
    user: req.user,
    show_popup: show_popup
  });
};

module.exports.login = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) { 
      return next(err)
    }
    if (!user) { 
      return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {

      if (err) { 
        return next(err); 
      }
      return res.redirect('/project');
    });
  })(req, res, next);
};

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

module.exports.register = (req, res) => {
  var new_account = new Account({
    username: req.body.email,
    first_name: req.body.fname,
    last_name: req.body.lname,
    mobile: req.body.mobile,
    email: req.body.email,
    education: req.body.education,
    expertise: req.body.expertise,
  })
  
  Account.register(new_account, req.body.password, (err, account) => {
    if (err) {
      res.status(400);
      return res.render('index', { 
        message: err.message,
        error: err
      });
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/project');
    });
  });
};

module.exports.delete_account = (req, res) => {
  if (req.user) {
    Account.find({ _id: req.user._id }).remove().exec();
    res.redirect('/');
  }
  else {
    var delete_error = new Error("Account doesn't exist to delete!")
    return res.render('index', {
      message: delete_error.message,
      error: delete_error
    });    
  }
}

module.exports.update_account = (req, res) => {
  /*  Update each 'path' in the user's account document  */
  if (req.user) {
    var opts = { runValidators: true };
    Account.update({ 
      _id: req.user._id
    }, { 
      $set: { 
        first_name: req.body.fname,
        last_name: req.body.lname,
        mobile: req.body.mobile,
        education: req.body.education,
        expertise: req.body.expertise       
      }
    }
    , opts               
    , function(err, account) {
      if (err) {
        return res.render('index', {
          user: req.user,
          message: err.message,  
          error: err
        });
      }
      console.log('Updated Account');
      res.redirect('back');
    });
  }
  else {
    res.render('index', {
      user: req.user,
      show_popup: 'login-popup'
    });
  }
}

module.exports.update_email = (req, res) => {
  if (req.user) {
    // Need to validate to ensure username/email doesn't already exist
    // count() is asychronous and therefore nested DB operation
    if (req.user.username === req.body.email) {
          // username wasn't changed by user
          res.redirect('back')
    }
    else {
      Account.find({ username: req.body.email }).count((err, count) => {
        if (count > 0) {
          /* same username already exists for another user. Throw error */
          var dup_email_err = new Error('Username/email already exists')
          res.status(400);
          return res.render('index', {
            user: req.user,
            message: dup_email_err.message,
            error: dup_email_err
          });
        }

        var opts = { runValidators: true };
        Account.update({ 
          _id: req.user._id
        }, { 
          $set: { 
            username: req.body.email,
            email: req.body.email      
          }
        }
        , opts               
        , function(err, account) {
          if (err) {
            return res.render('index', {
              user: req.user,
              message : err.message,
              error : err
            });
          }
          console.log('Updated Account');
          res.redirect('/login');
        });
      });
    }
  }
}

module.exports.update_pw = (req, res) => {
  if (req.body.new_password !== req.body.rpassword) {
    return res.render('index', {
    message: "New passwords don't match. Password wasn't changed",
    user: req.user
    })
  }
  else if (req.body.password === req.body.new_password) {
    return res.render('index', {
    message: "New and old password are the same. Password wasn't changed",
    user: req.user
    });
  }
  else {
    Account.findByUsername(req.user.username).then(function(account) {
      account.setPassword(req.body.new_password, function() {
      account.save()
      console.log('Password Reset!')
      res.redirect('back');
      })  
    })   
  }
}