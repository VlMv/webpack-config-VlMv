# Webpack config
VIMv

Базовая сборка

---
## Установка/запуск
**Скачать репозиторий в папку проекта**

**Установка модулей:** npm i

**Запуск в режиме разработки:** npm run dev</br>
**Запуск релизной сборки:** npm run prod</br>
**Запуск dev севрера:** npm run start</br>

---
## Базовый конфиг для мультистраничной работы с HTML, SCSS/CSS, JS.

**HTML:** подключение и обработка нескольких страниц, минификация.

**CSS:** обработка SCSS, обработка префиксов с post-css, source-maps, коррекция стилей с StyleLint, минификация.

**JS:** ES модули, source-maps, компиляция с Babel, коррекция кода с ESlint (airbnb-base + babel-parser + коррекция правил), минификация.

**Прочий функционал:** запуск development севера, оптимизация изображений, дублирование изображений в формате .webp, копирование ассетов, сплит чанков.

---
### StyleLint
* Автоматическая коррекция и сортировка css свойств в порядок по типу свойств.

Требуется расширение **StyleLint** для VS code.

Настройка **StyleLint** в JSON settings:</br>
   ```JSON
   "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": true
   },
   "[scss]": {
      "editor.defaultFormatter": "vscode.css-language-features"
   },
   "stylelint.snippet": [
      "css",
      "less",
      "postcss",
      "scss"
   ],
   "css.validate": false,
   "less.validate": false,
   "scss.validate": false,
   "stylelint.validate": [
      "css",
      "less",
      "postcss",
      "scss"
   ],
   "stylelint.config": null,
   "editor.formatOnSave": true,
   ```

Коррекция и сортировка свойств происходит автоматически при сохранении scss файлов источника.




