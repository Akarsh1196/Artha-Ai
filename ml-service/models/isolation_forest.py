import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

def detect_anomalies(expenses: list) -> list:
    if not expenses:
        return []
        
    df = pd.DataFrame([e.model_dump() for e in expenses])
    df['date'] = pd.to_datetime(df['date'])
    df['day_of_week'] = df['date'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # Categorical encoding
    df['category_encoded'] = df['category'].astype('category').cat.codes
    
    features = ['amount', 'day_of_week', 'is_weekend', 'category_encoded']
    X = df[features]
    
    # If there are very few samples, don't use high contamination or just return empty
    if len(X) < 10:
        return []
        
    model = IsolationForest(contamination=0.05, random_state=42)
    df['anomaly'] = model.fit_predict(X)
    df['score'] = model.decision_function(X)
    
    # -1 means anomaly in sklearn
    anomalies = df[df['anomaly'] == -1]
    
    results = []
    for _, row in anomalies.iterrows():
        results.append({
            "expense_id": row['id'],
            "anomaly_score": float(row['score'])
        })
        
    return results
