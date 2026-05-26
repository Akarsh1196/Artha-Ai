from fastapi import APIRouter, HTTPException
from schemas import AnomalyRequest, AnomalyResponse
from models.isolation_forest import detect_anomalies

router = APIRouter()

@router.post("/anomaly-detect", response_model=AnomalyResponse)
async def analyze_expenses(request: AnomalyRequest):
    try:
        results = detect_anomalies(request.expenses)
        return {"anomalies": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
