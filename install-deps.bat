@echo off
echo Installing Music Manager dependencies...

REM Install i18n packages
npm install i18next@^23.7.6
npm install react-i18next@^13.5.0
npm install i18next-browser-languagedetector@^7.2.0

REM Install Tailwind CSS if not already installed
npm install -D tailwindcss@^3.3.0
npm install -D postcss@^8.4.31
npm install -D autoprefixer@^10.4.16

echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Uncomment i18n imports in src/i18n/index.ts
echo 2. Run: npm start
echo.
pause
