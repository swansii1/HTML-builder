const fs = require('fs');
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log('Ошибка!');
  } else {
    files.forEach((item) => {
      if (item.isFile()) {
        const pathFile = path.join(pathFolder, item.name);

        fs.stat(pathFile, (err, stat) => {
          if (err) {
            console.log('Ошибка!');
          } else {
            const name = path.basename(pathFile, path.extname(pathFile));
            const extension = path.extname(pathFile);
            console.log(
              `${name} - ${extension.slice(1)} - ${stat.size / 1024} kB`,
            );
          }
        });
      }
    });
  }
});
