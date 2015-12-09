var express = require('express');
var router = express.Router();

router.get('/express', function(req, res, next) {
  res.render('index', { title: 'React' });
});


// router.get('/api/links', function(req, res, next) {
//    res.json({ links: links });
// });
//
// router.post('/api/links', function(req, res, next) {
//    var newLink = req.body;
//    newLink.id = Date.now();
//    links.push(newLink);
//    res.json(newLink);
// });

module.exports = router;
