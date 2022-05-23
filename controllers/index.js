// import dependencies
const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const dashboardRoutes = require('./dashboard-routes');

// middleware

// path for api routes
router.use('/api', apiRoutes);
// path for homepage
router.use('/', homeRoutes);
// path for dashboard
router.use('/dashboard', dashboardRoutes);

// catch-all route
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;