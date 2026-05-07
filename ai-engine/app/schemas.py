from typing import List, Optional

from pydantic import BaseModel, Field


class EducationItem(BaseModel):
    institution: str
    degree: str
    year: str


class ProjectItem(BaseModel):
    name: str
    description: str
    technologies: List[str] = Field(default_factory=list)


class ExperienceItem(BaseModel):
    company: str
    title: str
    startDate: str
    endDate: str
    highlights: List[str] = Field(default_factory=list)


class ResumeData(BaseModel):
    name: str
    email: str
    phone: str
    skills: List[str] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    resumeSummary: str = ""
    suggestions: List[str] = Field(default_factory=list)


class ParseResumeRequest(BaseModel):
    text: str
    fileName: Optional[str] = None


class JobPayload(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    skills: List[str] = Field(default_factory=list)
    minYearsExperience: int = 0


class MatchJobsRequest(BaseModel):
    resume: ResumeData
    jobs: List[JobPayload]


class GenerateContentRequest(BaseModel):
    resume: ResumeData
    job: JobPayload


class AtsScoreRequest(BaseModel):
    resume: ResumeData
    targetRole: str
