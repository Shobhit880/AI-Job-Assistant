from app.schemas import JobPayload, ResumeData
from app.services.openai_client import json_completion


def generate_content(resume: ResumeData, job: JobPayload) -> dict:
    system_prompt = (
        "Write concise, professional JSON with keys: coverLetter, resumeSummary, hrAnswers, matchScore."
    )
    user_prompt = (
        f"Candidate: {resume.model_dump_json()}\n"
        f"Job: {job.model_dump_json()}\n"
        "Generate tailored content for a safe-mode application assistant."
    )
    generated = json_completion(system_prompt, user_prompt)
    if generated:
        return generated

    top_skills = ", ".join(resume.skills[:4]) or "software engineering"
    cover_letter = (
        f"Dear Hiring Team,\n\n"
        f"I am excited to apply for the {job.title} role at {job.company}. "
        f"My background includes {top_skills}, and I have consistently translated business goals into reliable software delivery. "
        f"I would welcome the opportunity to bring that experience to your team in {job.location}.\n\n"
        f"Sincerely,\n{resume.name}"
    )
    summary = (
        f"{resume.name} is a product-minded engineer with experience in {top_skills}, "
        f"well-suited for {job.title} responsibilities."
    )
    hr_answers = [
        f"I am interested in {job.company} because the role aligns with my strengths in {top_skills}.",
        "I collaborate well across engineering, design, and product to deliver measurable outcomes.",
        "I am looking for a role where I can contribute quickly while continuing to grow technically.",
    ]
    return {
        "coverLetter": cover_letter,
        "resumeSummary": summary,
        "hrAnswers": hr_answers,
        "matchScore": 80,
    }


def ats_score(resume: ResumeData, target_role: str) -> dict:
    keywords = {token.lower() for token in target_role.split()}
    resume_terms = {token.lower() for token in (" ".join(resume.skills) + " " + resume.resumeSummary).split()}
    keyword_hits = len(keywords & resume_terms)
    score = min(60 + keyword_hits * 10 + min(len(resume.skills), 5) * 4, 98)
    suggestions = []

    if keyword_hits < len(keywords):
        suggestions.append(f"Add target role keywords related to {target_role}.")
    if len(resume.skills) < 6:
        suggestions.append("Include more relevant technical and domain-specific skills.")
    suggestions.append("Use action verbs and measurable outcomes in recent experience bullets.")

    return {
        "score": score,
        "suggestions": suggestions,
    }
