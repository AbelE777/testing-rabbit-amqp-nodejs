const amqp = require('amqplib')

// parametros de coneccion
const rabbitSettings = {
  protocol: 'amqp',
  hostname: 'localhost',
  port: 5672,
  username: 'user2',
  password: 'user2',
  vhost: '/',
  authMechanism: ['PLAIN','AMQPLAIN', 'EXTERNAL']
}


connect();

async function connect(){

  const queue = 'employees'
  const newQueue = 'clients'

  const msgs = [
    {"name": "user-2 Youtube", "enterprise": 'Youtube'},
    {"name": "user-2 YT", "enterprise": 'Youtube'},
    {"name": "user-2 Facebook", "enterprise": 'Facebook'},
    {"name": "user-2 TT", "enterprise": 'Facebook'}
  ]

  try {
    const conn = await amqp.connect(rabbitSettings);
    console.log('Connection created...')

    // crear canal
    const channel = await conn.createChannel();
    console.log('Channel created...')

    // crear cola
    let res = await channel.assertQueue(queue);
    console.log('Connection created...')
    
    // con el canal enviamos un mensaje a la cola
    // enviamos en formato buffer
    for(let msg in msgs) {
      await channel.sendToQueue(queue, Buffer.from(JSON.stringify(msgs[msg])))
      console.log(`Message sent to queue ${queue}`)
    }
    
    // crear cola
    res = await channel.assertQueue(newQueue);
    console.log('Connection created...')
    
    for(let msg in msgs) {
      await channel.sendToQueue(newQueue, Buffer.from(JSON.stringify(msgs[msg])))
      console.log(`Message sent to newQueue ${newQueue}`)
    }

  } catch (err) {
    console.log(`Error -> ${err}`)
  }
}