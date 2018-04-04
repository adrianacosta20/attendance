module.exports = function (app, database) {
    app.get('/', function (req, res) {
        if (req.user) {
            res.redirect('/get-todos');
        }
        else {
            res.render('index.ejs'); // load the index.ejs file
        }
    });
  
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
 
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/password-recovery', function (req, res) {
        res.render('password-recovery.ejs', { message: req.flash('passwordRecoveryMessage') });
    });

    app.get('/password-reset', function (req, res) {
        res.render('password-reset.ejs', { message: req.flash('passwordResetMessage') });
    });

    app.get('/update-profile', isLoggedIn, function (req, res) {
        res.render('update-profile.ejs', {
            user: req.user,
            message: req.flash('updateProfileMessage')
        });
    });

    app.get('*', function (req, res) {
        res.render('404.ejs');
    });


};

function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) {
      return next();
    } else {  
      res.redirect('/');
    }
  }