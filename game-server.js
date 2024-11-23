const zmq = require("zeromq");
const [,, min, max] = process.argv;

if (!min || !max) {
  console.error("Укажите диапазон, например: node game-client 1 100");
  process.exit(1);
}

const sock = new zmq.Request();
const targetNumber = Math.floor(Math.random() * (max - min + 1)) + parseInt(min);

(async function() {
  await sock.connect("tcp://127.0.0.1:3000");
  console.log(`Загаданное число: ${targetNumber}`);

 
  await sock.send(JSON.stringify({ range: `${min}-${max}` }));

  while (true) {
    const [msg] = await sock.receive();
    const serverMessage = JSON.parse(msg.toString());
    
    
    console.log("Сервер:", serverMessage);

    if (serverMessage.answer < targetNumber) {
      await sock.send(JSON.stringify({ hint: "more" }));
    } else if (serverMessage.answer > targetNumber) {
      await sock.send(JSON.stringify({ hint: "less" }));
    } else {
      console.log("Угадано! Игра завершена.");
      break;
    }
  }
})();
