const path = require('path');
const fs = require('fs');

const dirStyle = path.join(__dirname, 'styles');
const pathProject = path.join(__dirname, 'project-dist');
const bundlelFile = path.join(pathProject, 'bundle.css');

fs.writeFile(bundlelFile, '', (err) => {
  if (err) {
    console.log('Ошибка!');
  }
});

fs.readdir(dirStyle, { withFileTypes: true }, (err, file) => {
  if (err) {
    console.log('Ошибка чтения!');
  }

  file.forEach((item) => {
    const pathFile = path.join(dirStyle, item.name);

    if (item.isFile() && path.extname(item.name) === '.css') {
      fs.readFile(pathFile, 'utf-8', (err, data) => {
        if (err) {
          console.log('Ошибка чтения!');
        }
        fs.appendFile(bundlelFile, data + '\n', (err) => {
          if (err) {
            console.log('err');
          }
        });
      });
    }
  });
});
console.log('Файл собран!');
