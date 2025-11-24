@echo off
cd /d C:\Users\arijk\SafeSpot\back\safespot
python manage.py shell -c "exec(open('init_admin.py').read())"
pause
