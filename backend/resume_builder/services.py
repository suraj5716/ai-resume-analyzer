import re


def generate_bullet_points(experience_text):
    sentences = re.split(r'[.;\n]', experience_text)
    bullets = []
    for s in sentences:
        s = s.strip()
        if len(s) > 15:
            bullets.append(s)
    if not bullets:
        bullets = [f"Experienced in {experience_text[:80]}"]
    return bullets[:8]


def optimize_resume_content(content, context=""):
    words = content.split()
    if len(words) < 5:
        return content
    optimized = " ".join(words)
    return optimized


def get_career_recommendations(skills, experience_years=0):
    recommendations = {
        "suggested_roles": [],
        "suggested_skills": [],
        "suggested_certifications": [],
    }
    return recommendations
