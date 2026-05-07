from fastapi import FastAPI

from app.schemas import AtsScoreRequest, GenerateContentRequest, MatchJobsRequest, ParseResumeRequest
from app.services.content_generator import ats_score, generate_content
from app.services.job_matcher import rank_jobs
from app.services.resume_parser import parse_resume_text

app = FastAPI(title="Job Assistant AI Engine", version="1.0.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "ai-engine"}


@app.post("/parse-resume")
def parse_resume(request: ParseResumeRequest) -> dict:
    parsed = parse_resume_text(request.text)
    return parsed.model_dump()


@app.post("/match-jobs")
def match_jobs(request: MatchJobsRequest) -> dict:
    matches = rank_jobs(request.resume, request.jobs)
    return {"matches": matches}


@app.post("/generate-content")
def generate_job_content(request: GenerateContentRequest) -> dict:
    return generate_content(request.resume, request.job)


@app.post("/ats-score")
def generate_ats_score(request: AtsScoreRequest) -> dict:
    return ats_score(request.resume, request.targetRole)
