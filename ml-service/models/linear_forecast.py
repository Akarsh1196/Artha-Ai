import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def forecast_savings(history: list, months_to_predict: int = 6) -> list:
    if len(history) < 3:
        # Not enough data to train a linear model reliably
        return []
        
    df = pd.DataFrame([h.model_dump() for h in history])
    
    X = df[['month_index']]
    y = df['savings']
    
    model = LinearRegression()
    model.fit(X, y)
    
    # Calculate standard deviation of residuals for confidence bands
    predictions = model.predict(X)
    residuals = y - predictions
    std_dev = np.std(residuals)
    
    last_month_index = int(X['month_index'].max())
    
    future_X = pd.DataFrame({'month_index': range(last_month_index + 1, last_month_index + 1 + months_to_predict)})
    future_predictions = model.predict(future_X)
    
    results = []
    for i, pred in enumerate(future_predictions):
        results.append({
            "month_index": int(future_X.iloc[i]['month_index']),
            "predicted_savings": float(pred),
            "confidence_low": float(pred - std_dev),
            "confidence_high": float(pred + std_dev)
        })
        
    return results
