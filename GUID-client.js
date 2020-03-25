const net = require('net');
const datetime = require('node-datetime');

const client = new net.Socket();

client.connect({
  port: 3330
});

client.on('connect',() => {
  console.log('Client: connection established with server');

  //writing data to the server
  setInterval(() => {
      client.write(createData());
  }, 5000);
});

client.setEncoding('utf8');

client.on('data',function(data){
  console.log('Data from server:' + data);
});

client.on('error', (error) => {
  console.log('Error: ' + error);
});

const createData = () => {
  return {
    'guid': '63d8da48­8ec8­4394­aa2b­e5d81132ddc6',
    'datetime': datetime.create().format('Y-m-d H:M:S')
  }  
};
