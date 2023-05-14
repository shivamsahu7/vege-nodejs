const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'hi'], // Add more locales as needed
    directory: path.join(__dirname, '../locales'),
    defaultLocale: 'en'
});

module.exports = i18n;