@echo off
echo.
echo ========================================
echo   MUZQUIZ - Push vers GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Initialisation Git...
git init
git branch -M main

echo.
echo [2/4] Ajout de tous les fichiers...
git add .

echo.
echo [2b/4] Configuration identite Git...
git config user.email "antoine.gegedu27@gmail.com"
git config user.name "MacProgramme"

echo.
echo [3/4] Commit...
git commit -m "feat: MuzQuiz MVP - quiz en temps reel avec buzzers"

echo.
echo [4/4] Connexion au repo GitHub et push...
git remote remove origin 2>nul
git remote add origin https://github.com/MacProgramme/MuzQuiz.git
git push -u origin main

echo.
echo ========================================
echo   DONE ! Code envoye sur GitHub.
echo   Va maintenant sur vercel.com
echo ========================================
echo.
pause
