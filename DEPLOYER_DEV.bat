@echo off
echo.
echo ========================================
echo   MUZQUIZ - Deploy DEV (preview)
echo   muzquiz.fr NE SERA PAS mis a jour
echo ========================================
echo.

cd /d "%~dp0"

git config user.email "antoine.gegedu27@gmail.com"
git config user.name "MacProgramme"

:: Nettoyage des fichiers de verrou git si bloques
if exist ".git\index.lock" (
    echo [!] Suppression du verrou index.lock...
    del /f ".git\index.lock"
)
if exist ".git\HEAD.lock" (
    echo [!] Suppression du verrou HEAD.lock...
    del /f ".git\HEAD.lock"
)

echo [1/3] Ajout des modifications...
git add .

echo.
echo [2/3] Commit...
for /f "tokens=1-3 delims=/" %%a in ("%date%") do set DATESTR=%%c-%%b-%%a
for /f "tokens=1-2 delims=:" %%a in ("%time%") do set TIMESTR=%%a%%b
git commit -m "update: dev %DATESTR% %TIMESTR%" 2>nul || echo Rien a commiter.

echo.
echo [3/3] Deploy vers Vercel (preview dev)...
vercel --yes

echo.
echo ========================================
echo   DONE ! Deploye en preview Vercel.
echo   muzquiz.fr N'EST PAS touche.
echo   Pour deployer sur muzquiz.fr : DEPLOYER_PROD.bat
echo ========================================
echo.
pause
