module.exports = function (app, passport, database) {
    require('./studentsAuthentication')(app, passport);
    require('./teachersAuthentication')(app, passport);
    require('./views')(app, database);
}