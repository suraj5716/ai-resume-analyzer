import os
import re
import pdfplumber
from docx import Document


def extract_text(file_path):
    """Pull all readable text out of a PDF or DOCX file."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == '.pdf':
        return _extract_from_pdf(file_path)
    elif ext == '.docx':
        return _extract_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file format: {ext}. Please upload a PDF or DOCX file.")


def _extract_from_pdf(file_path):
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Error reading PDF file: {str(e)}")

    if not text.strip():
        raise ValueError(
            "Could not extract text from PDF. "
            "The file may be scanned/image-based. "
            "Please upload a text-based PDF."
        )
    return text.strip()


def _extract_from_docx(file_path):
    text = ""
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text += paragraph.text + "\n"
    except Exception as e:
        raise ValueError(f"Error reading DOCX file: {str(e)}")

    if not text.strip():
        raise ValueError(
            "Could not extract text from DOCX. "
            "The file appears to be empty."
        )
    return text.strip()


def extract_contact_info(text):
    """Try to grab email, phone, linkedin, and github from the resume text."""
    contact = {
        "email": None,
        "phone": None,
        "linkedin": None,
        "github": None,
    }

    # email
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    email_match = re.findall(email_pattern, text)
    if email_match:
        contact["email"] = email_match[0]

    # phone
    phone_pattern = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phone_match = re.findall(phone_pattern, text)
    if phone_match:
        contact["phone"] = phone_match[0]

    # linkedin
    linkedin_pattern = r'(?:linkedin\.com/in/|linkedin:\s*)([a-zA-Z0-9_-]+)'
    linkedin_match = re.findall(linkedin_pattern, text, re.IGNORECASE)
    if linkedin_match:
        contact["linkedin"] = linkedin_match[0]

    # github
    github_pattern = r'(?:github\.com/|github:\s*)([a-zA-Z0-9_-]+)'
    github_match = re.findall(github_pattern, text, re.IGNORECASE)
    if github_match:
        contact["github"] = github_match[0]

    return contact


def extract_sections(text):
    """Look for common resume section headings and split the text accordingly."""
    from services.skill_database import EXPECTED_SECTIONS

    sections_found = {}

    all_headings = []
    heading_to_section = {}
    for section_key, headings in EXPECTED_SECTIONS.items():
        for heading in headings:
            all_headings.append(heading)
            heading_to_section[heading.lower()] = section_key

    # longer headings should match first
    all_headings.sort(key=len, reverse=True)

    heading_pattern = r'(?:^|\n)\s*(?:[#*\-•|]*)?\s*(' + '|'.join(
        re.escape(h) for h in all_headings
    ) + r')\s*[:\-|]*\s*(?:\n|$)'

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
