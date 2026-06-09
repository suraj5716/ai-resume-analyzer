web: gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --workers 4
release: python backend/manage.py migrate && python backend/manage.py seed_data
