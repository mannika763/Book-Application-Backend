require('dotenv').config();

//console.log(process.env.PASSWORD)
module.exports = {
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD, 
};