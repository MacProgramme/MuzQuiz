@echo off
echo.
echo ========================================
echo   MUZQUIZ - Deployer sur muzquiz.fr
echo ========================================
echo.

cd /d "%~dp0"

git config user.email "antoine.gegedu27@gmail.com"
git config user.name "MacProgramme"

echo [1/3] Sauvegarde et commit...
git add .
for /f "tokens=1-3 delims=/" %%a in ("%date%") do set DATESTR=%%c-%%b-%%a
for /f "tokens=1-2 delims=:" %%a in ("%time%") do set TIMESTR=%%a%%b
git commit -m "update: deploiement prod %DATESTR% %TIMESTR%" 2>nul || echo Rien a commiter.

echo.
echo [2/3] Push vers GitHub (sauvegarde)...
git push origin HEAD:main --force

echo.
echo [3/3] Deploy direct vers Vercel (production)...
vercel --prod --yes

echo.
echo ========================================
echo   DONE ! www.muzquiz.fr est mis a jour.
echo ========================================
echo.
pause
