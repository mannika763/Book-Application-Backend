const express = require('express');

const bodyParser = require('body-parser');

const authRouter = require('./routes/auth')

const errorController = require('./controllers/error');

const cors = require('cors');    
const app = express();
const ports = process.env.PORT || 5000;
const fs = require('fs');


app.use(cors());
// Read the config file
fs.readFile('./config/config.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading config file: ' + err.message);
    return;
  }

  // Parse the JSON data
  const config = JSON.parse(data);

  // Use the config values
//   console.log('Database Host:', config.host);
//   console.log('Database User:', config.user);
//   console.log('Database Name:', config.database);
//   console.log('Database Password:', config.password);
});



app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  
  next();
});

 app.use('/auth', authRouter);
 
app.use(errorController.get404); 

app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));
