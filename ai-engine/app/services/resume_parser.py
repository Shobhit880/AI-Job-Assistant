import re
from typing import List

from app.schemas import ResumeData
from app.services.openai_client import json_completion


COMMON_SKILLS = [
    "Python",
    "Node.js",
    "Express",
    "MongoDB",
    "Flutter",
    "Dart",
    "FastAPI",
    "React",
    "TypeScript",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Playwright",
]


def _find_email(text: str) -> str:
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else ""


def _find_phone(text: str) -> str:
    match = re.search(r"(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})", text)
    return match.group(0) if match else ""


def _find_name(text: str) -> str:
    first_line = next((line.strip() for line in text.splitlines() if line.strip()), "Unknown Candidate")
    return first_line[:80]


def _extract_skills(text: str) -> List[str]:
    lowered = text.lower()
    return [skill for skill in COMMON_SKILLS if skill.lower() in lowered]


def parse_resume_text(text: str) -> ResumeData:
    system_prompt = (
        "Extract resume data into valid JSON with keys: "
        "name, email, phone, skills, education, projects, experience, resumeSummary, suggestions."
    )
    user_prompt = f"Resume text:\n{text[:12000]}"
    parsed = json_completion(system_prompt, user_prompt)

    if parsed:
        return ResumeData(**parsed)

    skills = _extract_skills(text)
    suggestions = [
        "Add quantified impact metrics to recent roles.",
        "Include a stronger professional summary tailored to target roles.",
    ]
    summary = (
        "Candidate with experience across software delivery, collaborative problem solving, "
        "and product-oriented engineering."
    )

    return ResumeData(
        name=_find_name(text),
        email=_find_email(text),
        phone=_find_phone(text),
        skills=skills,
        education=[],
        projects=[],
        experience=[],
        resumeSummary=summary,
        suggestions=suggestions,
    )
