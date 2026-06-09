from django.core.management.base import BaseCommand
from templates_app.models import ResumeTemplate, TemplateCategory
from payments.models import SubscriptionPlan


TEMPLATES = [
    {
        "name": "Modern Professional",
        "slug": "modern-professional",
        "description": "Clean, modern design with a professional layout perfect for corporate roles.",
        "category": "professional",
        "is_premium": False,
        "layout_data": {
            "sections": ["header", "summary", "experience", "education", "skills", "certifications"],
            "style": "modern",
            "columns": 1,
        },
        "default_colors": ["#2563eb", "#1e40af", "#f8fafc"],
        "default_fonts": ["Inter", "system-ui"],
    },
    {
        "name": "Minimal ATS Friendly",
        "slug": "minimal-ats-friendly",
        "description": "ATS-optimized minimal design that passes automated screening systems.",
        "category": "professional",
        "is_premium": False,
        "layout_data": {
            "sections": ["header", "summary", "experience", "education", "skills"],
            "style": "minimal",
            "columns": 1,
        },
        "default_colors": ["#1a1a2e", "#16213e", "#e2e8f0"],
        "default_fonts": ["Inter", "system-ui"],
    },
    {
        "name": "Corporate Executive",
        "slug": "corporate-executive",
        "description": "Executive-level design with a sophisticated color palette and refined layout.",
        "category": "executive",
        "is_premium": True,
        "layout_data": {
            "sections": ["header", "executive-summary", "experience", "education", "skills", "achievements", "certifications"],
            "style": "elegant",
            "columns": 1,
        },
        "default_colors": ["#1e293b", "#334155", "#f1f5f9"],
        "default_fonts": ["Playfair Display", "Merriweather"],
    },
    {
        "name": "Creative Designer",
        "slug": "creative-designer",
        "description": "Bold, creative layout for design professionals with unique visual elements.",
        "category": "creative",
        "is_premium": True,
        "layout_data": {
            "sections": ["header", "about", "experience", "education", "skills", "portfolio", "achievements"],
            "style": "creative",
            "columns": 2,
        },
        "default_colors": ["#7c3aed", "#ec4899", "#faf5ff"],
        "default_fonts": ["Poppins", "system-ui"],
    },
    {
        "name": "Software Engineer",
        "slug": "software-engineer",
        "description": "Tech-optimized layout highlighting projects, skills, and technical experience.",
        "category": "technical",
        "is_premium": False,
        "layout_data": {
            "sections": ["header", "summary", "technical-skills", "experience", "projects", "education", "certifications"],
            "style": "modern",
            "columns": 1,
        },
        "default_colors": ["#059669", "#047857", "#ecfdf5"],
        "default_fonts": ["JetBrains Mono", "Fira Code"],
    },
    {
        "name": "Civil Engineer",
        "slug": "civil-engineer",
        "description": "Professional layout for civil engineering with focus on projects and certifications.",
        "category": "professional",
        "is_premium": True,
        "layout_data": {
            "sections": ["header", "summary", "experience", "projects", "education", "skills", "certifications", "licenses"],
            "style": "professional",
            "columns": 1,
        },
        "default_colors": ["#d97706", "#92400e", "#fffbeb"],
        "default_fonts": ["Roboto", "system-ui"],
    },
    {
        "name": "Fresher Resume",
        "slug": "fresher-resume",
        "description": "Entry-level focused design highlighting education, internships, and projects.",
        "category": "entry-level",
        "is_premium": False,
        "layout_data": {
            "sections": ["header", "objective", "education", "internships", "projects", "skills", "certifications", "activities"],
            "style": "modern",
            "columns": 1,
        },
        "default_colors": ["#0891b2", "#0e7490", "#ecfeff"],
        "default_fonts": ["Inter", "system-ui"],
    },
    {
        "name": "Dark Theme Resume",
        "slug": "dark-theme-resume",
        "description": "Striking dark-themed design for modern professionals and tech roles.",
        "category": "creative",
        "is_premium": True,
        "layout_data": {
            "sections": ["header", "summary", "experience", "education", "skills", "projects"],
            "style": "dark",
            "columns": 1,
        },
        "default_colors": ["#0f172a", "#1e293b", "#38bdf8"],
        "default_fonts": ["Inter", "system-ui"],
    },
    {
        "name": "Elegant Sidebar Layout",
        "slug": "elegant-sidebar",
        "description": "Two-column layout with a prominent sidebar for contact and skills.",
        "category": "professional",
        "is_premium": True,
        "layout_data": {
            "sections": ["sidebar", "main-content"],
            "sidebar_sections": ["photo", "contact", "skills", "languages", "certifications"],
            "main_sections": ["summary", "experience", "education", "projects"],
            "style": "elegant",
            "columns": 2,
        },
        "default_colors": ["#be123c", "#881337", "#fff1f2"],
        "default_fonts": ["Lora", "system-ui"],
    },
    {
        "name": "International CV Format",
        "slug": "international-cv",
        "description": "Europass-inspired format with international standards compliance.",
        "category": "professional",
        "is_premium": True,
        "layout_data": {
            "sections": ["personal-info", "work-experience", "education", "skills", "languages", "certifications", "publications"],
            "style": "formal",
            "columns": 1,
        },
        "default_colors": ["#1d4ed8", "#3b82f6", "#eff6ff"],
        "default_fonts": ["Calibri", "system-ui"],
    },
]

CATEGORIES = [
    {"name": "Professional", "slug": "professional", "icon": "💼"},
    {"name": "Creative", "slug": "creative", "icon": "🎨"},
    {"name": "Technical", "slug": "technical", "icon": "⚙️"},
    {"name": "Executive", "slug": "executive", "icon": "👔"},
    {"name": "Entry Level", "slug": "entry-level", "icon": "🎓"},
]

PLANS = [
    {
        "name": "Free",
        "slug": "free",
        "price_monthly": 0,
        "price_yearly": 0,
        "credits_monthly": 10,
        "features": ["5 Resume Analyses", "Basic Templates", "ATS Score Check", "Email Support"],
    },
    {
        "name": "Pro",
        "slug": "pro",
        "price_monthly": 12.99,
        "price_yearly": 99.99,
        "credits_monthly": 100,
        "features": [
            "Unlimited Analyses", "All Templates", "AI Resume Builder",
            "ATS Optimization", "Cover Letters", "Priority Support", "Export PDF/DOCX",
        ],
    },
    {
        "name": "Premium",
        "slug": "premium",
        "price_monthly": 29.99,
        "price_yearly": 249.99,
        "credits_monthly": 500,
        "features": [
            "Everything in Pro", "AI Rewriting", "LinkedIn Optimization",
            "Multi-language Resumes", "API Access", "Dedicated Manager",
            "Team Collaboration", "White Label",
        ],
    },
]


class Command(BaseCommand):
    help = 'Seed the database with initial template and plan data'

    def handle(self, *args, **options):
        for cat_data in CATEGORIES:
            TemplateCategory.objects.get_or_create(
                slug=cat_data["slug"],
                defaults=cat_data,
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(CATEGORIES)} categories'))

        for tmpl_data in TEMPLATES:
            ResumeTemplate.objects.get_or_create(
                slug=tmpl_data["slug"],
                defaults=tmpl_data,
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(TEMPLATES)} templates'))

        for plan_data in PLANS:
            SubscriptionPlan.objects.get_or_create(
                slug=plan_data["slug"],
                defaults=plan_data,
            )
        self.stdout.write(self.style.SUCCESS(f'Created {len(PLANS)} plans'))
