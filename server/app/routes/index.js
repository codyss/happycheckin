
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/tessel', require('./tessel'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});