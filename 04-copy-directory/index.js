const fs = require('fs');
const path = require('path');

const copyFolder = path.join(__dirname, 'copy-files');
const pathFolderCopy = path.join(__dirname, 'files');

function copyDir(src, dest) {
  fs.rm(dest, { recursive: true, force: true }, (err) => {
    if (err) {
      console.log('Ошибка при обновлении/удалении папки:', err);
      return;
    }

    fs.mkdir(dest, (err) => {
      if (err) {
        console.log('Ошибка при создании папки:', err);
        return;
      }

      fs.readdir(src, (err, files) => {
        if (err) {
          console.log('Ошибка при чтении папки:', err);
          return;
        }

        files.forEach((file) => {
          const srcFile = path.join(src, file);
          const destFile = path.join(dest, file);

          fs.copyFile(srcFile, destFile, (err) => {
            if (err) {
              console.log(`Ошибка при копировании файла ${file}:`, err);
            } else {
              console.log(`Скопирован файл: ${srcFile} в ${destFile}`);
            }
          });
        });
      });
    });
  });
}

copyDir(pathFolderCopy, copyFolder);
