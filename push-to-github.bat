@echo off
echo ========================================================
echo   Globe 1 - Push to GitHub Helper
echo ========================================================
echo.
echo This script will push your clean Globe 1 server to:
echo https://github.com/kbro1989/rsc-globe1-pure.git
echo.
echo 1. Make sure you have created the empty repo 'rsc-globe1-pure' on GitHub.
echo 2. Press any key to start the push.
echo.
pause

echo.
echo Adding remote origin...
git remote add origin https://github.com/kbro1989/rsc-globe1-pure.git

echo.
echo Pushing to main branch...
git push -u origin main

echo.
echo ========================================================
echo   Done! Now go to Cloudflare Dashboard and connect this repo.
echo ========================================================
pause
