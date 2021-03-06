const express = require('express');
const router = express.Router();

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

module.exports = function (passport) {
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    router.get('/account', ensureAuthenticated, function (req, res) {
        res.json({user: req.user});
    });


// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
    router.get('/github',
        passport.authenticate('github', {scope: ['user:email']}),
        function (req, res) {
            // The request will be redirected to GitHub for authentication, so this
            // function will not be called.
        });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
    router.get('/github/callback',
        passport.authenticate('github', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('http://localhost:4200');
        });

    return router;
};
