from typing import Dict, List

from app.schemas import JobPayload, ResumeData


def _tokenize(text: str) -> set[str]:
    return {token.strip(".,()").lower() for token in text.split() if token.strip()}


def _experience_years(resume: ResumeData) -> int:
    return max(len(resume.experience), 1)


def score_job_match(resume: ResumeData, job: JobPayload) -> Dict:
    resume_skills = {skill.lower() for skill in resume.skills}
    job_skills = {skill.lower() for skill in job.skills}
    skill_overlap = len(resume_skills & job_skills)
    skill_denominator = max(len(job_skills), 1)
    skill_match = round((skill_overlap / skill_denominator) * 50)

    resume_keywords = _tokenize(" ".join(resume.skills) + " " + resume.resumeSummary)
    job_keywords = _tokenize(f"{job.title} {job.description}")
    keyword_overlap = len(resume_keywords & job_keywords)
    keyword_denominator = max(len(job_keywords), 20)
    keyword_match = round(min((keyword_overlap / keyword_denominator) * 30 * 4, 30))

    candidate_years = _experience_years(resume)
    required_years = max(job.minYearsExperience, 1)
    experience_match = round(min(candidate_years / required_years, 1) * 20)

    total = max(min(skill_match + keyword_match + experience_match, 100), 0)
    return {
        "jobId": job.id,
        "score": total,
        "reason": f"Matched {skill_overlap} core skills with relevant profile language.",
        "breakdown": {
            "skillMatch": skill_match,
            "keywordMatch": keyword_match,
            "experienceMatch": experience_match,
        },
    }


def rank_jobs(resume: ResumeData, jobs: List[JobPayload]) -> List[Dict]:
    matches = [score_job_match(resume, job) for job in jobs]
    return sorted(matches, key=lambda item: item["score"], reverse=True)
