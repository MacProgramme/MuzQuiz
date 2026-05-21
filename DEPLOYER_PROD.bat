@echo off
echo.
echo ========================================
echo   MUZQUIZ - Deployer sur muzquiz.fr
echo ========================================
echo.

cd /d "%~dp0"

git config user.email "antoine.gegedu27@gmail.com"
git config user.name "MacProgramme"

echo [1/4] Sauvegarde de dev en cours...
git add .
for /f "tokens=1-3 delims=/" %%a in ("%date%") do set DATESTR=%%c-%%b-%%a
for /f "tokens=1-2 delims=:" %%a in ("%time%") do set TIMESTR=%%a%%b
git commit -m "update: deploiement prod %DATESTR% %TIMESTR%" 2>nul || echo Rien a commiter.

echo.
echo [2/4] Push de dev vers GitHub...
git push --set-upstream origin dev

echo.
echo [3/4] Merge dev dans main...
git checkout main
git merge dev --no-edit
git push origin main

echo.
echo [4/4] Retour sur dev...
git checkout dev

echo.
echo ========================================
echo   DONE ! www.muzquiz.fr sera mis a jour
echo   dans 1-2 minutes sur Vercel.
echo ========================================
echo.
pause
