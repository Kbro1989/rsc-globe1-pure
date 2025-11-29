@echo off
echo ========================================================
echo   Globe 1 - Push to GitHub Helper
echo ========================================================
echo.
echo This script will help you push your clean Globe 1 server to GitHub.
echo.
echo 1. Go to https://github.com/new
echo 2. Create a new repository named 'rsc-globe1-pure'
echo 3. Copy the HTTPS URL (e.g., https://github.com/YourName/rsc-globe1-pure.git)
echo.
set /p REPO_URL="Paste your GitHub Repository URL here: "

if "%REPO_URL%"=="" goto error

echo.
echo Adding remote origin...
git remote add origin %REPO_URL%

echo.
echo Pushing to main branch...
git push -u origin main

echo.
echo ========================================================
echo   Done! Now go to Cloudflare Dashboard and connect this repo.
echo ========================================================
pause
exit

:error
echo Error: No URL provided.
pause
