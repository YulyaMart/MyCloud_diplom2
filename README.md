## Облачное хранилище My Cloud

1. Скачайте проект
   
3. Создайте файл .env в соответвии с примером "env_example"
   
5. В папке проекта создайте виртуальное окружение
    python -m venv env
   
6. Установите зависимости
    pip install -r requirements.txt
   
7. Выполните миграции
    python manage.py migrate
   
8. Создайте суперпользователя
    python manage.py createsuperuser
    
9. Запустите сервер 
    python manage.py runserver
    
10. Откройте отдельный теминал и перейдите в папку frontend
    
11. Установите зависимости
    npm i
    
12. Запустите скрипт для сборки
    npm run dev
