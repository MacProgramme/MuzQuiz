@echo off
echo.
echo ========================================
echo   MUZQUIZ - Mise a jour GitHub
echo ========================================
echo.

cd /d "%~dp0"

git config user.email "antoine.gegedu27@gmail.com"
git config user.name "MacProgramme"

echo [1/3] Ajout des modifications...
git add .

echo.
echo [2/3] Commit...
git commit -m "fix: logo moustache, reveal QCM pour tous, animation 5s"

echo.
echo [3/3] Push vers GitHub...
git push

echo.
echo ========================================
echo   DONE ! Vercel va se mettre a jour
echo   automatiquement dans 1-2 minutes.
echo ========================================
echo.
pause
