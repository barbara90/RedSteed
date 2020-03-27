const net = require('net');
const dbConfig = require('./db-config/db-config.js');
const mongoose = require('mongoose');
const TCPModel = require('./db-config/createDB.js').TCPModel;

const port = 3330;
const server = net.createServer();
mongoose.Promise = global.Promise;


server.on('close', () => {
    console.log('Server is closed!');
});

server.on('connection', (socket) => {
  server.getConnections((error,count) => {
      console.log('Number of concurrent connections to the server : ' + count);
    });
  socket.setEncoding('utf8');
  socket.setTimeout(800000, () => {
      console.log('Socket timed out!');
  });

  mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
    }).then(() => {
        console.log('Successfully connected to the database');
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
  });

socket.on('data', (chunk) => {
  const data = JSON.parse(chunk.toString());
    if (data.guid && data.datetime) {
      socket.write(JSON.stringify(createResponse()));
      let requestData = new TCPModel(data).save((err) => {});
    } else {
      socket.end(err);
      console.error(err);
    }
});

  setTimeout(() => {
    let isdestroyed = socket.destroyed;
    console.log('Socket destroyed:' + isdestroyed);
    socket.destroy();
  },1200000);
});

server.maxConnections = 10;
server.listen(port);

server.on('listening',() => {
  console.log('Server is listening on ' + port);
});

server.on('error', (error) => {
  console.log('Error: ' + error);
});

setTimeout(() => {
  server.close();
  console.log('Server is closed after timeout!');
},5000000);

const createResponse = () => {
  return {
    'status': 'ok',
    'error': null
  }
};
