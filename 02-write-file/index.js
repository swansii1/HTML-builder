const fs = require('fs');
const path = require('path');
const stdin = process.stdin;

const pathFile = path.join(__dirname, 'output.txt');

fs.writeFile(pathFile, '', (err) => {
  if (err) {
    console.log('Ошибка!');
  } else {
    console.log('Привет!\nФайл создан\nВведи текст:\n');
  }
});

stdin.on('data', (input) => {
  let txt = input.toString().trim();

  if (txt.toLowerCase() === 'exit') {
    console.log('До свидания!');
    process.exit();
  }

  fs.appendFile(pathFile, txt + '\n', (err) => {
    if (err) {
      console.log('Ошибка в записи');
    } else {
      console.log('Текст записан!');
    }
  });
});

process.on('SIGINT', () => {
  console.log('До свидания!');
  process.exit();
});
