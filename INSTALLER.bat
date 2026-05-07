@echo off
echo.
echo ========================================
echo   BUZZY - Installation automatique
echo ========================================
echo.

:: Vérifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERREUR] Node.js n'est pas installe !
  echo.
  echo Telecharge et installe Node.js depuis :
  echo https://nodejs.org
  echo.
  echo Puis relance ce script.
  pause
  exit /b 1
)

echo [OK] Node.js detecte :
node --version

echo.
echo [1/3] Installation des dependances npm...
call npm install
call npm install autoprefixer --save-dev
if %errorlevel% neq 0 (
  echo [ERREUR] npm install a echoue.
  pause
  exit /b 1
)

echo.
echo [2/3] Verification du fichier .env.local...
if not exist ".env.local" (
  echo [INFO] Creation du fichier .env.local depuis l'exemple...
  copy ".env.local.example" ".env.local"
  echo.
  echo !! IMPORTANT !!
  echo Ouvre le fichier .env.local dans un editeur de texte
  echo et remplace les valeurs par tes cles Supabase.
  echo.
  echo Trouve-les dans : Supabase ^> Settings ^> API
  echo.
  pause
)

echo.
echo [3/3] Lancement du serveur de developpement...
echo.
echo Le site sera accessible sur : http://localhost:3000
echo Appuie sur CTRL+C pour arreter le serveur.
echo.
call npm run dev

pause
