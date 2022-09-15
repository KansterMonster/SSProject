const mongoose = require('mongoose');
const server = '127.0.0.1:27017';
const database = 'database';

class Database {
  constructor() {
	this._connect()
  }

_connect() {
 	mongoose.connect(`mongodb://${server}/${database}`)
   	.then(testingSavingUser())
   	.catch(err => {
     	console.error('Error')
   	})
  }
}

function testingSavingUser(){
  console.log('Database connected')
}


module.exports = new Database()
