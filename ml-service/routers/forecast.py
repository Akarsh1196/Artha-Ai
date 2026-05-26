from fastapi import APIRouter, HTTPException
from schemas import ForecastRequest, ForecastResponse
from models.linear_forecast import forecast_savings

router = APIRouter()

@router.post("/savings-forecast", response_model=ForecastResponse)
async def predict_savings(request: ForecastRequest):
    try:
        results = forecast_savings(request.history, request.months_to_predict)
        return {"forecast": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
