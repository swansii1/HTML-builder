const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(projectDist, 'assets');
const outputHtmlPath = path.join(projectDist, 'index.html');
const outputCssPath = path.join(projectDist, 'style.css');

fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) {
    console.error('Ошибка создания папки');
    return;
  }
  buildHtml();
  mergeStyles();
  copyDir(assetsDir, distAssetsDir);
});

function buildHtml() {
  fs.readFile(templatePath, 'utf-8', (err, template) => {
    if (err) {
      console.error('Ошибка чтения template!');
      return;
    }
    let start = 0;
    const tags = [];
    while (start < template.length) {
      const startIndex = template.indexOf('{{', start);
      if (startIndex === -1) break;
      const endIndex = template.indexOf('}}', startIndex);
      if (endIndex === -1) break;

      const tagName = template.substring(startIndex + 2, endIndex).trim();
      tags.push({
        fullTag: template.substring(startIndex, endIndex + 2),
        tagName,
      });
      start = endIndex + 2;
    }
    const promises = tags.map(({ fullTag, tagName }) => {
      return new Promise((resolve) => {
        const componentPath = path.join(componentsDir, `${tagName}.html`);
        fs.readFile(componentPath, 'utf-8', (err, componentContent) => {
          if (err) {
            console.error('Ошибка чтения компонента');
            return resolve('');
          }
          template = template.replace(fullTag, componentContent);
          resolve();
        });
      });
    });

    Promise.all(promises).then(() => {
      fs.writeFile(outputHtmlPath, template, (err) => {
        if (err) console.error('Ошибка записи index.html');
      });
    });
  });
}

function mergeStyles() {
  fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Ошибка чтения!');
      return;
    }

    files.forEach((item) => {
      const pathFile = path.join(stylesDir, item.name);

      if (item.isFile() && path.extname(item.name) === '.css') {
        fs.readFile(pathFile, 'utf-8', (err, data) => {
          if (err) {
            console.error('Ошибка чтения!');
            return;
          }
          fs.appendFile(outputCssPath, data + '\n', (err) => {
            if (err) console.error('Ошибка записи!');
          });
        });
      }
    });
  });
}

function copyDir(src, destDir) {
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Ошибка создания папки назначения!');
      return;
    }

    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error('Ошибка чтения папки источника!');
        return;
      }

      files.forEach((item) => {
        const srcFile = path.join(src, item.name);
        const destFile = path.join(destDir, item.name);

        if (item.isDirectory()) {
          copyDir(srcFile, destFile);
        } else {
          fs.copyFile(srcFile, destFile, (err) => {
            if (err) {
              console.error(`Ошибка при копировании файла ${item.name}!`);
            } else {
              console.log(`Скопирован:\n ${srcFile}\nв\n ${destFile}!`);
            }
          });
        }
      });
    });
  });
}
