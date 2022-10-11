const express = require('express');
const app = require('./app')
const path = require('path')
const port = process.env.PORT || 5000


// Serve static files....
app.use(express.static(__dirname + '/client/dist/promissory'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/client/dist/promissory/index.html'));
});
process.on('uncaughtException', function (err) {
  console.log('UNCAUGHT EXCEPTION - keeping process alive:', err); 
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})