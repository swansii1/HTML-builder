const fs = require('fs');
const path = require('path');

const copyFolder = path.join(__dirname, 'copy-files');
const pathFolderCopy = path.join(__dirname, 'files');

fs.mkdir(copyFolder, { recursive: true }, (err) => {
  if (err) {
    console.log('Ошибка!');
  } else {
    console.log('Папка создана!\n');

    copyDir(pathFolderCopy, copyFolder);
  }
});

function copyDir(src, destDir) {
  fs.readdir(src, (err, files) => {
    if (err) {
      console.log('Ошибка');
      return;
    }

    files.forEach((item) => {
      const srcFile = path.join(src, item);
      const desFile = path.join(destDir, item);

      fs.copyFile(srcFile, desFile, (err) => {
        if (err) {
          console.log('Ошибка при копировании!');
        } else {
          console.log(`Скопирован:\n ${srcFile}\nв\n ${desFile}!`);
        }
      });
    });
  });
}
