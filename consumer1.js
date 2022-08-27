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

  const queue = 'clients'
  const enterprise = 'Facebook'

  try {
    const conn = await amqp.connect(rabbitSettings);
    console.log('Connection created...')

    // crear canal
    const channel = await conn.createChannel();
    console.log('Channel created...')

    // crear cola
    const res = await channel.assertQueue(queue);
    console.log('Queue created...')

    // recibimos los mensajes
    console.log(`Waiting for messages from ${enterprise}`)
    // consume necesita el nombre de la cola y ua funcion anonima
    
    channel.consume(queue, (message) => {
      // recibimos en formato buffer, necesita parseo
      let employee = JSON.parse(message.content.toString())
      console.log(`Received employee ${employee.name}`)
      console.log(employee)

      channel.ack(message);
      // if(employee.enterprise === enterprise){
      //   console.log(`Deleted message from queue...\n`)
      // }
      // else {
      //   console.log(`That message is not for me I wont delete it...`)
        
      // }
    })

  } catch (err) {
    console.log(`Error -> ${err}`)
  }
}