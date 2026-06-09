import re
import string
from collections import Counter

from .skill_database import (
    SKILL_DATABASE, ACTION_VERBS, EXPECTED_SECTIONS,
    get_all_skills_flat, get_all_action_verbs_flat, normalize_skill,
)
from .parser import extract_contact_info, extract_sections, get_word_count


def analyze_resume(resume_text, job_description):
    contact_info = extract_contact_info(resume_text)
    sections_found = extract_sections(resume_text)
    word_count = get_word_count(resume_text)

    keyword_score, keyword_data = _score_keyword_match(resume_text, job_description)
    skills_score, skills_data = _score_skills_match(resume_text, job_description)
    formatting_score, formatting_data = _score_ats_formatting(resume_text, contact_info, sections_found, word_count)
    section_score, section_data = _score_section_completeness(sections_found)
    impact_score, impact_data = _score_impact_language(resume_text)

    overall_score = round(
        keyword_score * 0.30 +
        skills_score * 0.25 +
        formatting_score * 0.20 +
        section_score * 0.15 +
        impact_score * 0.10
    )
    overall_score = max(0, min(100, overall_score))

    suggestions = _generate_suggestions(
        keyword_data, skills_data, formatting_data,
        section_data, impact_data, overall_score
    )

    if overall_score >= 80:
        score_label = "Excellent"
        score_color = "#00e676"
    elif overall_score >= 60:
        score_label = "Good"
        score_color = "#ffea00"
    elif overall_score >= 40:
        score_label = "Needs Improvement"
        score_color = "#ff9100"
    else:
        score_label = "Poor Match"
        score_color = "#ff1744"

    return {
        "overall_score": overall_score,
        "score_label": score_label,
        "score_color": score_color,
        "dimension_scores": {
            "keyword_match": {"score": round(keyword_score), "weight": "30%", "label": "Keyword Match", "icon": "🔑"},
            "skills_match": {"score": round(skills_score), "weight": "25%", "label": "Skills Match", "icon": "🎯"},
            "ats_formatting": {"score": round(formatting_score), "weight": "20%", "label": "ATS Formatting", "icon": "📋"},
            "section_completeness": {"score": round(section_score), "weight": "15%", "label": "Section Completeness", "icon": "📄"},
            "impact_language": {"score": round(impact_score), "weight": "10%", "label": "Impact Language", "icon": "✍️"},
        },
        "keyword_analysis": keyword_data,
        "skills_analysis": skills_data,
        "formatting_analysis": formatting_data,
        "section_analysis": section_data,
        "impact_analysis": impact_data,
        "suggestions": suggestions,
        "contact_info": contact_info,
        "sections_found": list(sections_found.keys()),
        "stats": {"word_count": word_count, "sections_detected": len(sections_found)},
    }


def _score_keyword_match(resume_text, job_description):
    tfidf_score = 0
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        vectorizer = TfidfVectorizer(stop_words='english', max_features=5000, ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform([resume_text.lower(), job_description.lower()])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        tfidf_score = similarity * 100
    except Exception:
        pass

    jd_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', job_description.lower()))
    resume_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', resume_text.lower()))
    matched = jd_words & resume_words
    missing = jd_words - resume_words

    keyword_ratio = len(matched) / len(jd_words) if jd_words else 0
    final_score = (tfidf_score * 0.6) + (keyword_ratio * 100 * 0.4)
    final_score = max(0, min(100, final_score))

    return final_score, {
        "tfidf_score": round(tfidf_score, 1),
        "keyword_ratio": round(keyword_ratio * 100, 1),
        "matched_keywords": sorted(list(matched))[:30],
        "missing_keywords": sorted(list(missing))[:20],
        "total_jd_keywords": len(jd_words),
        "total_matched": len(matched),
        "total_missing": len(missing),
    }


def _score_skills_match(resume_text, job_description):
    all_skills = get_all_skills_flat()
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    resume_skills = set()
    for skill in all_skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', resume_lower):
            resume_skills.add(normalize_skill(skill))

    jd_skills = set()
    for skill in all_skills:
        if re.search(r'\b' + re.escape(skill) + r'\b', jd_lower):
            jd_skills.add(normalize_skill(skill))

    matched_skills = resume_skills & jd_skills
    missing_skills = jd_skills - resume_skills
    extra_skills = resume_skills - jd_skills

    if jd_skills:
        skills_score = (len(matched_skills) / len(jd_skills)) * 100
    else:
        skills_score = min(100, len(resume_skills) * 5)
    skills_score = max(0, min(100, skills_score))

    return skills_score, {
        "matched_skills": sorted(list(matched_skills)),
        "missing_skills": sorted(list(missing_skills)),
        "extra_skills": sorted(list(extra_skills)),
        "total_resume_skills": len(resume_skills),
        "total_jd_skills": len(jd_skills),
        "total_matched": len(matched_skills),
    }


def _score_ats_formatting(resume_text, contact_info, sections_found, word_count):
    checks = []
    total_weight = 0
    passed_weight = 0

    checks_config = [
        ("Contact Information", 3, contact_info.get("email") and contact_info.get("phone"),
         "Email and phone detected" if (contact_info.get("email") and contact_info.get("phone")) else "Missing email or phone", "📧"),
        ("Standard Headings", 3, len({"experience", "education", "skills"} & set(sections_found.keys())) >= 2,
         f"Found sections: {', '.join({'experience', 'education', 'skills'} & set(sections_found.keys()))}", "📝"),
        ("Resume Length", 2, 200 <= word_count <= 1200,
         f"{word_count} words ({'good' if 200 <= word_count <= 1200 else 'adjust length'})", "📏"),
        ("Clean Formatting", 1, sum(1 for c in resume_text if c in '★●■◆►▪☐☑✓✗✦✧⚡🔥💡🎯') < 10,
         "Minimal special characters", "✨"),
        ("Professional Links", 2, bool(contact_info.get("linkedin") or contact_info.get("github")),
         "LinkedIn/GitHub detected" if (contact_info.get("linkedin") or contact_info.get("github")) else "Add LinkedIn/GitHub", "🔗"),
        ("Date Formatting", 2, len(re.findall(r'(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}|\d{1,2}/\d{4}|\d{4}\s*-\s*(?:\d{4}|present|current)', resume_text, re.IGNORECASE)) >= 2,
         "Dates found", "📅"),
    ]

    for name, weight, passed, detail, icon in checks_config:
        total_weight += weight
        if passed:
            passed_weight += weight
        checks.append({"name": name, "passed": passed, "detail": detail, "icon": icon})

    formatting_score = (passed_weight / total_weight) * 100 if total_weight > 0 else 0
    return formatting_score, {"checks": checks, "passed_count": sum(1 for c in checks if c["passed"]), "total_checks": len(checks)}


def _score_section_completeness(sections_found):
    essential = ["experience", "education", "skills"]
    recommended = ["summary", "projects", "certifications", "achievements"]

    essential_found = [s for s in essential if s in sections_found]
    recommended_found = [s for s in recommended if s in sections_found]
    essential_missing = [s for s in essential if s not in sections_found]
    recommended_missing = [s for s in recommended if s not in sections_found]

    essential_score = (len(essential_found) / len(essential)) * 70 if essential else 70
    recommended_score = (len(recommended_found) / len(recommended)) * 30 if recommended else 30
    section_score = essential_score + recommended_score

    return section_score, {
        "essential_found": essential_found, "essential_missing": essential_missing,
        "recommended_found": recommended_found, "recommended_missing": recommended_missing,
        "total_found": len(sections_found),
    }


def _score_impact_language(resume_text):
    resume_lower = resume_text.lower()
    all_verbs = get_all_action_verbs_flat()

    verbs_found = set()
    for verb in all_verbs:
        if re.search(r'\b' + re.escape(verb) + r'\b', resume_lower):
            verbs_found.add(verb)

    quantified_matches = re.findall(r'\b\d+[%+]?\b.*?(?:increase|decrease|reduce|improve|save|grow|generate|revenue|users|clients|projects|team|members)|\$[\d,]+|\d+%|\d+\+', resume_lower)
    metric_patterns = re.findall(r'\$[\d,]+|\d+%|\d+\+', resume_text)

    verb_score = min(100, len(verbs_found) * 8)
    quantified_score = min(100, (len(quantified_matches) + len(metric_patterns)) * 15)
    impact_score = verb_score * 0.6 + quantified_score * 0.4

    return impact_score, {
        "action_verbs_found": sorted(list(verbs_found)),
        "action_verbs_count": len(verbs_found),
        "quantified_achievements": len(quantified_matches) + len(metric_patterns),
        "metrics_found": metric_patterns[:10],
    }


def _generate_suggestions(keyword_data, skills_data, formatting_data, section_data, impact_data, overall_score):
    suggestions = []

    if skills_data["missing_skills"]:
        top_missing = skills_data["missing_skills"][:5]
        suggestions.append({
            "priority": "high", "category": "Skills", "icon": "🎯",
            "title": "Add Missing Skills",
            "detail": f"The job description mentions skills not in your resume: <strong>{', '.join(top_missing)}</strong>. Add them if applicable."
        })

    if keyword_data["total_missing"] > keyword_data["total_matched"]:
        top_missing_kw = keyword_data["missing_keywords"][:5]
        suggestions.append({
            "priority": "high", "category": "Keywords", "icon": "🔑",
            "title": "Include More Job-Specific Keywords",
            "detail": f"Missing key terms: <strong>{', '.join(top_missing_kw)}</strong>. Weave these into your experience."
        })

    if section_data["essential_missing"]:
        missing = [s.title() for s in section_data["essential_missing"]]
        suggestions.append({
            "priority": "high", "category": "Sections", "icon": "📄",
            "title": "Add Missing Essential Sections",
            "detail": f"Missing: <strong>{', '.join(missing)}</strong>. These are expected by ATS systems."
        })

    for check in formatting_data["checks"]:
        if not check["passed"]:
            suggestions.append({
                "priority": "medium", "category": "Formatting", "icon": check["icon"],
                "title": check["name"], "detail": check["detail"]
            })

    if impact_data["action_verbs_count"] < 5:
        suggestions.append({
            "priority": "medium", "category": "Language", "icon": "✍️",
            "title": "Use Stronger Action Verbs",
            "detail": "Start bullets with powerful verbs like <strong>developed, implemented, optimized</strong>."
        })

    if impact_data["quantified_achievements"] < 3:
        suggestions.append({
            "priority": "medium", "category": "Language", "icon": "📊",
            "title": "Quantify Achievements",
            "detail": "Add metrics: <strong>'Improved performance by 40%'</strong> or <strong>'Led a team of 5'</strong>."
        })

    if section_data["recommended_missing"]:
        missing = [s.title() for s in section_data["recommended_missing"][:3]]
        suggestions.append({
            "priority": "low", "category": "Sections", "icon": "💡",
            "title": "Consider More Sections",
            "detail": f"Adding <strong>{', '.join(missing)}</strong> could strengthen your resume."
        })

    priority_order = {"high": 0, "medium": 1, "low": 2}
    suggestions.sort(key=lambda x: priority_order.get(x["priority"], 3))
    return suggestions


def analyze_without_jd(resume_text, job_title=""):
    job_desc = f"""
    Looking for a {job_title} professional with strong technical skills.
    Must have experience in relevant technologies, tools, and frameworks.
    Should demonstrate leadership, communication, and problem-solving abilities.
    Requires expertise in the field with a track record of delivering results.
    """
    return analyze_resume(resume_text, job_desc)
