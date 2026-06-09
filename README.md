# AI Resume Analyzer & Builder

A modern, AI-powered SaaS platform for resume analysis, optimization, and building professional resumes.

## Tech Stack

- **Frontend**: React.js + Vite, Tailwind CSS v4, Framer Motion, Chart.js, React Router
- **Backend**: Django 5, Django REST Framework, JWT Authentication
- **Database**: SQLite (dev) / PostgreSQL (production)
- **AI**: NLP-based ATS scoring engine, TF-IDF keyword matching, spaCy integration

## Features

### Resume Analyzer
- ATS compatibility scoring (5 dimensions)
- Keyword matching against job descriptions
- Skills gap analysis
- Formatting and section completeness checks
- Actionable AI improvement suggestions

### Resume Builder
- Multi-section resume builder (experience, education, skills, projects, certifications)
- Live preview
- AI-generated bullet points
- ATS-optimized content

### Templates
- 10+ premium templates (Modern, Minimal, Executive, Creative, Dark, etc.)
- Category filtering
- Color customization ready

### Dashboard
- Analysis history with score tracking
- Usage statistics
- Account management
- Score history charts

### Auth & Payments
- JWT-based authentication
- Free/Pro/Premium subscription tiers
- User profile management

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Create Admin

```bash
python manage.py createsuperuser
```

Visit:
- Frontend: http://localhost:3000
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register/` | User registration |
| `POST /api/auth/login/` | User login |
| `GET /api/auth/me/` | Current user |
| `POST /api/analyzer/upload/` | Upload & analyze resume |
| `POST /api/analyzer/analyze-text/` | Analyze resume text |
| `GET /api/analyzer/analyses/` | List analyses |
| `POST /api/builder/create/` | Create resume |
| `GET /api/templates/` | List templates |
| `GET /api/dashboard/stats/` | Dashboard stats |
| `GET /api/payments/plans/` | Subscription plans |

## Project Structure

```
├── backend/
│   ├── authentication/     # User auth & JWT
│   ├── resume_analyzer/    # Analysis engine
│   ├── resume_builder/     # Resume builder
│   ├── templates_app/      # Template management
│   ├── dashboard/          # User dashboard
│   ├── payments/           # Subscription plans
│   └── contact/            # Contact form
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── ...
│   └── ...
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Deployment

### Docker

```bash
docker-compose up --build
```

### Manual

```bash
# Build frontend
cd frontend && npm run build

# Collect static files
cd backend && python manage.py collectstatic

# Run with gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```
