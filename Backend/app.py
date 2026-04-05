from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from attack_classifier import AttackClassifier
from anomoly_classifier import AnomalyClassifier
from typing import List, Optional
import time

app = FastAPI(title="Network Intrusion Detection System API")

# Initialize classifiers
try:
    attack_clf = AttackClassifier()
    anomaly_clf = AnomalyClassifier()
except Exception as e:
    print(f"Error initializing classifiers: {e}")
    # In production, we might want to handle this differently
    attack_clf = None
    anomaly_clf = None

class TrafficData(BaseModel):
    timestamp: Optional[str] = str(time.time())
    ip: Optional[str] = "0.0.0.0"
    values: List[float]

@app.get("/")
def read_root():
    return {"status": "online", "message": "NIDS API is working"}

@app.post("/test")
def check():
    return {"message": "API working successfully"}

@app.post("/classify")
def classify_attack(traffic: TrafficData):
    if attack_clf is None:
        raise HTTPException(status_code=500, detail="Attack classifier not initialized")
        
    try:
        res = attack_clf.predict(traffic.values)
        return {"label": res, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-anomaly")
def detect_anomaly(traffic: TrafficData):
    if anomaly_clf is None:
        raise HTTPException(status_code=500, detail="Anomaly classifier not initialized")
        
    try:
        res = anomaly_clf.predict(traffic.values)
        return {**res, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
def analyze_traffic(traffic: TrafficData):
    """
    Complete analysis: First detect anomaly, then classify if it is an anomaly.
    """
    if anomaly_clf is None or attack_clf is None:
        raise HTTPException(status_code=500, detail="Classifiers not initialized")
        
    try:
        anomaly_res = anomaly_clf.predict(traffic.values)
        
        if anomaly_res["is_anomaly"]:
            attack_res = attack_clf.predict(traffic.values)
            return {
                "is_anomaly": True,
                "anomaly_score": anomaly_res["score"],
                "attack_type": attack_res,
                "status": "success"
            }
        else:
            return {
                "is_anomaly": False,
                "anomaly_score": anomaly_res["score"],
                "attack_type": "BENIGN",
                "status": "success"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


