@echo off
echo Starting PharmaGuard...

:: Start Backend
start "PharmaGuard Backend" cmd /k "cd backend && npm start"

:: Start Frontend
start "PharmaGuard Frontend" cmd /k "cd frontend && npm run dev"

echo Backend and Frontend launched in new windows!
echo backend: http://localhost:5000
echo frontend: http://localhost:3000
pause
