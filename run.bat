@echo off
cd /d %~dp0
echo ================================================
echo   Tilawat - Quran Recitation App
echo   Chrome me kholein:  http://localhost:3000
echo   Band karne ke liye: Ctrl + C
echo ================================================
node node_modules\next\dist\bin\next dev
pause
