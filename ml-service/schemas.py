from pydantic import BaseModel
from typing import List, Optional

class ExpenseItem(BaseModel):
    id: str
    amount: float
    category: str
    date: str  # YYYY-MM-DD
    is_recurring: bool

class AnomalyRequest(BaseModel):
    expenses: List[ExpenseItem]

class AnomalyResult(BaseModel):
    expense_id: str
    anomaly_score: float

class AnomalyResponse(BaseModel):
    anomalies: List[AnomalyResult]

class SavingsHistoryItem(BaseModel):
    month_index: int  # e.g., 1 to N representing sequential months
    savings: float

class ForecastRequest(BaseModel):
    history: List[SavingsHistoryItem]
    months_to_predict: int = 6

class ForecastResult(BaseModel):
    month_index: int
    predicted_savings: float
    confidence_low: float
    confidence_high: float

class ForecastResponse(BaseModel):
    forecast: List[ForecastResult]
