from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import anomaly, forecast

app = FastAPI(title="ArthaAI ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(anomaly.router, prefix="/ml", tags=["Anomaly Detection"])
app.include_router(forecast.router, prefix="/ml", tags=["Savings Forecast"])

@app.get("/ml/health")
async def health_check():
    return {"status": "ok", "service": "ArthaAI ML Microservice"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
