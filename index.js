const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-writer').createObjectCsvWriter;

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

// Create CSV file with headers
const csvFilePath = path.join(__dirname, `log_${Date.now()}.csv`);
const csvWriter = csv({
  path: csvFilePath,
  header: [
    {id: 'timestamp', title: 'TIMESTAMP'},
    {id: 'method', title: 'METHOD'},
    {id: 'path', title: 'PATH'},
    {id: 'ip', title: 'IP'},
    {id: 'headers', title: 'HEADERS'}
  ]
});

// Write CSV headers
csvWriter.writeRecords([]).then(() => console.log('CSV file created'));

// Middleware to log requests
app.use((req, res, next) => {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
    headers: JSON.stringify(req.headers)
  };

  // Log to console
  console.log(`${logData.timestamp} - ${logData.method} ${logData.path} - ${logData.ip}`);
  console.log('Headers:', logData.headers);

  // Log to CSV
  csvWriter.writeRecords([logData]).then(() => {
    console.log('Log written to CSV');
  });

  next();
});

// Catch-all route
app.all('*', (req, res) => {
  res.status(200).send('Request logged');
});

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
