from fastapi import APIRouter
from app.schemas.schemas import AskAIRequestSchema, AskAIResponseSchema

router = APIRouter()

@router.post("", response_model=AskAIResponseSchema)
def ask_ai(req: AskAIRequestSchema):
    q_lower = req.question.lower()

    if "amdahl" in q_lower or "speedup" in q_lower:
        return AskAIResponseSchema(
            id="chat-amdahl-01",
            content="According to Lecture 3, Slide 15 of Week 1, Amdahl’s Law states that speedup is bounded by:\n\n$$S(N) = \\frac{1}{(1 - p) + \\frac{p}{N}}$$\n\nWhere $p$ represents the parallel fraction and $N$ is processor count. As $N \\to \\infty$, the maximum speedup can never exceed $\\frac{1}{1 - p}$. The serial portion becomes the primary bottleneck.",
            timestamp="12:00 PM",
            citations=[
                {
                    "documentName": "Week1_Lecture03_Amdahls_Law_and_Speedup.pdf",
                    "lectureNumber": 3,
                    "slideNumber": 15,
                    "excerptSnippet": "Slide 15: Speedup limit S = 1 / ((1 - p) + p/N). Serial fraction dictates ceiling."
                }
            ],
            isOutOfScopeWarning=False
        )

    return AskAIResponseSchema(
        id="chat-general-01",
        content=f"Grounded response for Week {req.weekNumber}: Computer architecture balances throughput, pipeline hazard mitigation, and branch prediction to optimize execution cycles.",
        timestamp="12:00 PM",
        citations=[
            {
                "documentName": f"Week{req.weekNumber}_Lecture01_Fundamentals.pdf",
                "lectureNumber": 1,
                "slideNumber": 12,
                "excerptSnippet": "Slide 12: Architectural performance balancing."
            }
        ],
        isOutOfScopeWarning=False
    )
