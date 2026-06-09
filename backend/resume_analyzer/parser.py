import os
import re
import pdfplumber
from docx import Document


def extract_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        return _extract_from_pdf(file_path)
    elif ext == '.docx':
        return _extract_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported format: {ext}")


def _extract_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    if not text.strip():
        raise ValueError("Could not extract text from PDF. Ensure it is text-based, not scanned.")
    return text.strip()


def _extract_from_docx(file_path):
    doc = Document(file_path)
    text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    if not text.strip():
        raise ValueError("Could not extract text from DOCX. File appears empty.")
    return text.strip()


def extract_contact_info(text):
    contact = {"email": None, "phone": None, "linkedin": None, "github": None}

    email_match = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    if email_match:
        contact["email"] = email_match[0]

    phone_match = re.findall(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if phone_match:
        contact["phone"] = phone_match[0]

    linkedin_match = re.findall(r'(?:linkedin\.com/in/|linkedin:\s*)([a-zA-Z0-9_-]+)', text, re.IGNORECASE)
    if linkedin_match:
        contact["linkedin"] = linkedin_match[0]

    github_match = re.findall(r'(?:github\.com/|github:\s*)([a-zA-Z0-9_-]+)', text, re.IGNORECASE)
    if github_match:
        contact["github"] = github_match[0]

    return contact


def extract_sections(text):
    from .skill_database import EXPECTED_SECTIONS

    sections_found = {}
    all_headings = []
    heading_to_section = {}
    for section_key, headings in EXPECTED_SECTIONS.items():
        for heading in headings:
            all_headings.append(heading)
            heading_to_section[heading.lower()] = section_key

    all_headings.sort(key=len, reverse=True)
    heading_pattern = r'(?:^|\n)\s*(?:[#*\-•|]*)?\s*(' + '|'.join(re.escape(h) for h in all_headings) + r')\s*[:\-|]*\s*(?:\n|$)'
    matches = list(re.finditer(heading_pattern, text, re.IGNORECASE | re.MULTILINE))

    for i, match in enumerate(matches):
        heading = match.group(1).strip().lower()
        section_key = heading_to_section.get(heading, heading)
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        content = text[start:end].strip()
        if content:
            sections_found[section_key] = content

    return sections_found


def get_word_count(text):
    return len(text.split())
