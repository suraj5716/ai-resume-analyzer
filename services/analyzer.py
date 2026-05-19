import re
import string
from collections import Counter

import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from services.skill_database import (
    SKILL_DATABASE,
    ACTION_VERBS,
    EXPECTED_SECTIONS,
    get_all_skills_flat,
    get_all_action_verbs_flat,
    normalize_skill,
)
from services.parser import extract_contact_info, extract_sections, get_word_count

# load spacy — download if missing
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("spaCy model not found, downloading en_core_web_sm...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


def analyze_resume(resume_text, job_description):
    """
    Run the full analysis pipeline on a resume against a given job description.
    Returns a dict with scores, keyword breakdowns, skills, formatting checks,
    and improvement suggestions.
    """

    contact_info = extract_contact_info(resume_text)
    sections_found = extract_sections(resume_text)
    word_count = get_word_count(resume_text)

    # run each scoring dimension
    keyword_score, keyword_data = _score_keyword_match(resume_text, job_description)
    skills_score, skills_data = _score_skills_match(resume_text, job_description)
    formatting_score, formatting_data = _score_ats_formatting(resume_text, contact_info, sections_found, word_count)
    section_score, section_data = _score_section_completeness(sections_found)
    impact_score, impact_data = _score_impact_language(resume_text)

    # weighted overall score
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

    # label + color for the overall score
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
            "keyword_match": {
                "score": round(keyword_score),
                "weight": "30%",
                "label": "Keyword Match",
                "icon": "🔑"
            },
            "skills_match": {
                "score": round(skills_score),
                "weight": "25%",
                "label": "Skills Match",
                "icon": "🎯"
            },
            "ats_formatting": {
                "score": round(formatting_score),
                "weight": "20%",
                "label": "ATS Formatting",
                "icon": "📋"
            },
            "section_completeness": {
                "score": round(section_score),
                "weight": "15%",
                "label": "Section Completeness",
                "icon": "📄"
            },
            "impact_language": {
                "score": round(impact_score),
                "weight": "10%",
                "label": "Impact Language",
                "icon": "✍️"
            },
        },
        "keyword_analysis": keyword_data,
        "skills_analysis": skills_data,
        "formatting_analysis": formatting_data,
        "section_analysis": section_data,
        "impact_analysis": impact_data,
        "suggestions": suggestions,
        "contact_info": contact_info,
        "sections_found": list(sections_found.keys()),
        "stats": {
            "word_count": word_count,
            "sections_detected": len(sections_found),
        }
    }


# --- keyword match scoring (30% weight) ---

def _score_keyword_match(resume_text, job_description):
    """
    Combine TF-IDF cosine similarity with direct keyword overlap
    to figure out how well the resume matches the JD's language.
    """
    # tfidf similarity
    try:
        vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2)
        )
        tfidf_matrix = vectorizer.fit_transform([resume_text.lower(), job_description.lower()])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        tfidf_score = similarity * 100
    except Exception:
        tfidf_score = 0

    # pull meaningful words out of the job description via spacy
    jd_doc = nlp(job_description.lower())
    resume_doc = nlp(resume_text.lower())

    jd_keywords = set()
    for token in jd_doc:
        if (token.pos_ in ("NOUN", "PROPN", "ADJ") and
                not token.is_stop and
                len(token.text) > 2 and
                token.text not in string.punctuation):
            jd_keywords.add(token.lemma_)

    # also grab noun chunks
    for chunk in jd_doc.noun_chunks:
        chunk_text = chunk.text.strip()
        if len(chunk_text) > 2:
            jd_keywords.add(chunk_text)

    # see which ones actually appear in the resume
    resume_text_lower = resume_text.lower()
    matched_keywords = set()
    missing_keywords = set()

    for keyword in jd_keywords:
        if keyword in resume_text_lower:
            matched_keywords.add(keyword)
        else:
            missing_keywords.add(keyword)

    keyword_ratio = len(matched_keywords) / len(jd_keywords) if jd_keywords else 0

    # blend tfidf and keyword ratio (60/40 split)
    final_score = (tfidf_score * 0.6) + (keyword_ratio * 100 * 0.4)
    final_score = max(0, min(100, final_score))

    keyword_data = {
        "tfidf_score": round(tfidf_score, 1),
        "keyword_ratio": round(keyword_ratio * 100, 1),
        "matched_keywords": sorted(list(matched_keywords))[:30],
        "missing_keywords": sorted(list(missing_keywords))[:20],
        "total_jd_keywords": len(jd_keywords),
        "total_matched": len(matched_keywords),
        "total_missing": len(missing_keywords),
    }

    return final_score, keyword_data


# --- skills match scoring (25% weight) ---

def _score_skills_match(resume_text, job_description):
    """Compare skills found in the resume vs what the job description asks for."""
    all_skills = get_all_skills_flat()
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()

    # find skills in resume
    resume_skills = set()
    for skill in all_skills:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, resume_lower):
            resume_skills.add(normalize_skill(skill))

    # find skills in JD
    jd_skills = set()
    for skill in all_skills:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, jd_lower):
            jd_skills.add(normalize_skill(skill))

    matched_skills = resume_skills & jd_skills
    missing_skills = jd_skills - resume_skills
    extra_skills = resume_skills - jd_skills

    if jd_skills:
        skills_score = (len(matched_skills) / len(jd_skills)) * 100
    else:
        skills_score = min(100, len(resume_skills) * 5)

    skills_score = max(0, min(100, skills_score))

    def categorize_skills(skills_set):
        categorized = {}
        for skill in skills_set:
            for category, category_skills in SKILL_DATABASE.items():
                normalized_category_skills = {normalize_skill(s) for s in category_skills}
                if skill in normalized_category_skills:
                    cat_label = category.replace('_', ' ').title()
                    if cat_label not in categorized:
                        categorized[cat_label] = []
                    categorized[cat_label].append(skill)
                    break
        return categorized

    skills_data = {
        "matched_skills": sorted(list(matched_skills)),
        "missing_skills": sorted(list(missing_skills)),
        "extra_skills": sorted(list(extra_skills)),
        "total_resume_skills": len(resume_skills),
        "total_jd_skills": len(jd_skills),
        "total_matched": len(matched_skills),
        "matched_categorized": categorize_skills(matched_skills),
        "missing_categorized": categorize_skills(missing_skills),
    }

    return skills_score, skills_data


# --- ATS formatting checks (20% weight) ---

def _score_ats_formatting(resume_text, contact_info, sections_found, word_count):
    """Run a bunch of formatting checks that affect ATS readability."""
    checks = []
    total_weight = 0
    passed_weight = 0

    # contact info
    weight = 3
    total_weight += weight
    has_email = contact_info.get("email") is not None
    has_phone = contact_info.get("phone") is not None
    contact_passed = has_email and has_phone
    if contact_passed:
        passed_weight += weight
    checks.append({
        "name": "Contact Information",
        "passed": contact_passed,
        "detail": "Email and phone number detected" if contact_passed
                  else "Missing email or phone number",
        "icon": "📧"
    })

    # standard headings
    weight = 3
    total_weight += weight
    standard_sections = {"experience", "education", "skills"}
    found_standard = standard_sections & set(sections_found.keys())
    headings_passed = len(found_standard) >= 2
    if headings_passed:
        passed_weight += weight
    checks.append({
        "name": "Standard Headings",
        "passed": headings_passed,
        "detail": f"Found: {', '.join(found_standard)}" if found_standard
                  else "Missing standard section headings",
        "icon": "📝"
    })

    # length
    weight = 2
    total_weight += weight
    length_passed = 200 <= word_count <= 1200
    if length_passed:
        passed_weight += weight
    checks.append({
        "name": "Resume Length",
        "passed": length_passed,
        "detail": f"{word_count} words (recommended: 300-1000)"
                  if length_passed
                  else f"{word_count} words ({'too short' if word_count < 200 else 'too long'})",
        "icon": "📏"
    })

    # special characters
    weight = 1
    total_weight += weight
    special_chars = sum(1 for c in resume_text if c in '★●■◆►▪☐☑✓✗✦✧⚡🔥💡🎯')
    special_passed = special_chars < 10
    if special_passed:
        passed_weight += weight
    checks.append({
        "name": "Clean Formatting",
        "passed": special_passed,
        "detail": "Minimal special characters" if special_passed
                  else "Too many special characters/icons",
        "icon": "✨"
    })

    # professional links
    weight = 2
    total_weight += weight
    has_links = contact_info.get("linkedin") or contact_info.get("github")
    if has_links:
        passed_weight += weight
    checks.append({
        "name": "Professional Links",
        "passed": bool(has_links),
        "detail": "LinkedIn/GitHub profile detected" if has_links
                  else "Consider adding LinkedIn or GitHub profile",
        "icon": "🔗"
    })

    # dates
    weight = 2
    total_weight += weight
    date_patterns = re.findall(
        r'(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}|'
        r'\d{1,2}/\d{4}|\d{4}\s*-\s*(?:\d{4}|present|current)',
        resume_text, re.IGNORECASE
    )
    dates_passed = len(date_patterns) >= 2
    if dates_passed:
        passed_weight += weight
    checks.append({
        "name": "Date Formatting",
        "passed": dates_passed,
        "detail": f"Found {len(date_patterns)} date entries" if dates_passed
                  else "Few or no dates found — add work/education dates",
        "icon": "📅"
    })

    formatting_score = (passed_weight / total_weight) * 100 if total_weight > 0 else 0

    formatting_data = {
        "checks": checks,
        "passed_count": sum(1 for c in checks if c["passed"]),
        "total_checks": len(checks),
    }

    return formatting_score, formatting_data


# --- section completeness (15% weight) ---

def _score_section_completeness(sections_found):
    """Check whether the resume has the must-have and nice-to-have sections."""
    essential = ["experience", "education", "skills"]
    recommended = ["summary", "projects", "certifications", "achievements"]

    essential_found = [s for s in essential if s in sections_found]
    recommended_found = [s for s in recommended if s in sections_found]
    essential_missing = [s for s in essential if s not in sections_found]
    recommended_missing = [s for s in recommended if s not in sections_found]

    # essential sections are worth 70%, recommended 30%
    essential_score = (len(essential_found) / len(essential)) * 70 if essential else 70
    recommended_score = (len(recommended_found) / len(recommended)) * 30 if recommended else 30

    section_score = essential_score + recommended_score

    section_data = {
        "essential_found": essential_found,
        "essential_missing": essential_missing,
        "recommended_found": recommended_found,
        "recommended_missing": recommended_missing,
        "total_found": len(sections_found),
    }

    return section_score, section_data


# --- impact language (10% weight) ---

def _score_impact_language(resume_text):
    """Check for strong action verbs and quantified achievements."""
    resume_lower = resume_text.lower()
    all_verbs = get_all_action_verbs_flat()

    verbs_found = set()
    for verb in all_verbs:
        pattern = r'\b' + re.escape(verb) + r'\b'
        if re.search(pattern, resume_lower):
            verbs_found.add(verb)

    # look for numbers tied to results
    quantified_pattern = r'\b\d+[%+]?\b.*?(?:increase|decrease|reduce|improve|save|grow|generate|revenue|users|clients|projects|team|members)'
    quantified_matches = re.findall(quantified_pattern, resume_lower)

    metric_patterns = re.findall(r'\$[\d,]+|\d+%|\d+\+', resume_text)

    # score: action verbs (60%) + quantified achievements (40%)
    verb_score = min(100, len(verbs_found) * 8)
    quantified_score = min(100, (len(quantified_matches) + len(metric_patterns)) * 15)

    impact_score = verb_score * 0.6 + quantified_score * 0.4

    # group found verbs by category
    verbs_by_category = {}
    for category, category_verbs in ACTION_VERBS.items():
        found_in_category = [v for v in category_verbs if v in verbs_found]
        if found_in_category:
            verbs_by_category[category.replace('_', ' ').title()] = found_in_category

    impact_data = {
        "action_verbs_found": sorted(list(verbs_found)),
        "action_verbs_count": len(verbs_found),
        "verbs_by_category": verbs_by_category,
        "quantified_achievements": len(quantified_matches) + len(metric_patterns),
        "metrics_found": metric_patterns[:10],
    }

    return impact_score, impact_data


# --- suggestion generator ---

def _generate_suggestions(keyword_data, skills_data, formatting_data,
                          section_data, impact_data, overall_score):
    """Build a prioritized list of tips based on the analysis results."""
    suggestions = []

    # missing skills
    if skills_data["missing_skills"]:
        top_missing = skills_data["missing_skills"][:5]
        suggestions.append({
            "priority": "high",
            "category": "Skills",
            "icon": "🎯",
            "title": "Add Missing Skills",
            "detail": f"The job description mentions these skills that aren't in your resume: "
                      f"<strong>{', '.join(top_missing)}</strong>. "
                      f"Add them if you have experience with them."
        })

    # missing keywords
    if keyword_data["total_missing"] > keyword_data["total_matched"]:
        top_missing_kw = keyword_data["missing_keywords"][:5]
        suggestions.append({
            "priority": "high",
            "category": "Keywords",
            "icon": "🔑",
            "title": "Include More Job-Specific Keywords",
            "detail": f"Your resume is missing several key terms from the job description: "
                      f"<strong>{', '.join(top_missing_kw)}</strong>. "
                      f"Weave these naturally into your experience descriptions."
        })

    # missing essential sections
    if section_data["essential_missing"]:
        missing = [s.title() for s in section_data["essential_missing"]]
        suggestions.append({
            "priority": "high",
            "category": "Sections",
            "icon": "📄",
            "title": "Add Missing Essential Sections",
            "detail": f"Your resume is missing: <strong>{', '.join(missing)}</strong>. "
                      f"These sections are expected by most ATS systems and recruiters."
        })

    # formatting issues
    for check in formatting_data["checks"]:
        if not check["passed"]:
            suggestions.append({
                "priority": "medium",
                "category": "Formatting",
                "icon": check["icon"],
                "title": check["name"],
                "detail": check["detail"]
            })

    # weak action verbs
    if impact_data["action_verbs_count"] < 5:
        suggestions.append({
            "priority": "medium",
            "category": "Language",
            "icon": "✍️",
            "title": "Use Stronger Action Verbs",
            "detail": "Start bullet points with powerful action verbs like "
                      "<strong>developed, implemented, optimized, spearheaded, "
                      "achieved</strong> instead of passive language."
        })

    if impact_data["quantified_achievements"] < 3:
        suggestions.append({
            "priority": "medium",
            "category": "Language",
            "icon": "📊",
            "title": "Quantify Your Achievements",
            "detail": "Add numbers and metrics to your accomplishments. For example: "
                      "<strong>'Improved API response time by 40%'</strong> or "
                      "<strong>'Led a team of 5 developers'</strong>."
        })

    # recommended sections
    if section_data["recommended_missing"]:
        missing = [s.title() for s in section_data["recommended_missing"][:3]]
        suggestions.append({
            "priority": "low",
            "category": "Sections",
            "icon": "💡",
            "title": "Consider Adding More Sections",
            "detail": f"Adding a <strong>{', '.join(missing)}</strong> section "
                      f"could strengthen your resume."
        })

    # extra skills (positive note)
    if skills_data["extra_skills"]:
        suggestions.append({
            "priority": "low",
            "category": "Skills",
            "icon": "⭐",
            "title": "You Have Additional Relevant Skills",
            "detail": f"Your resume includes skills not in the JD: "
                      f"<strong>{', '.join(skills_data['extra_skills'][:5])}</strong>. "
                      f"These could be differentiators — keep the most relevant ones."
        })

    priority_order = {"high": 0, "medium": 1, "low": 2}
    suggestions.sort(key=lambda x: priority_order.get(x["priority"], 3))

    return suggestions
