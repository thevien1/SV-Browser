@echo off
title SV Browser v5.0.8-stable
cd /d "%~dp0"
echo Dang khoi dong SV Browser...
node ./node_modules/electron/cli.js .
if %errorlevel% neq 0 (
    echo Co loi khi khoi dong ung dung.
    pause
)
