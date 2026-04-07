import os
import sys
import logging
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure Backend and its parent are in sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)
if os.path.join(BASE_DIR, "Utils") not in sys.path:
    sys.path.append(os.path.join(BASE_DIR, "Utils"))

try:
    from full_detection import monitor_simulation
    from attack_classifier import AttackClassifier
    from anomoly_classifier import AnomalyClassifier
    from Utils.utils import generate_ip
    from Utils.data_feeder import DataFeeder
    from Utils.eda_util import perform_analysis, load_df
except ImportError as e:
    logging.error(f"Import error: {e}")
    # Fallback or re-raise
    raise

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global models
models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML models
    logger.info("🚀 Loading classifiers...")
    try:
        models["attack_clf"] = AttackClassifier()
        models["anomaly_clf"] = AnomalyClassifier()
        logger.info("✅ Models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Error initializing classifiers: {e}")
        models["attack_clf"] = None
        models["anomaly_clf"] = None
    yield
    # Clean up the ML models and release the resources
    models.clear()
    logger.info("🧹 Cleaned up models")

app = FastAPI(
    title="Network Intrusion Detection System API",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class TrafficData(BaseModel):
    ip: str = "0.0.0.0"
    values: list = [0] * 78


class SimulationParams(BaseModel):
    size: int = 20
    network_name: str = "sample network"
    distribution: str = "normal"

class MonitorResponse(BaseModel):
    ip: List[str]
    anomaly_predicted: List[str]
    anomaly_score: List[float]
    attack_classified: List[str]
    status: str = "success"

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"status": "online", "message": "NIDS API is working"}

@app.post("/test")
async def check():
    return {"message": "API working successfully"}

@app.post("/classify")
async def classify_attack(traffic: TrafficData):
    attack_clf = models.get("attack_clf")
    if attack_clf is None:
        raise HTTPException(status_code=500, detail="Attack classifier not initialized")

    try:
        res = attack_clf.predict(traffic.values)
        return {"label": res, "status": "success"}
    except Exception as e:
        logger.error(f"Classification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# @app.post("/detect-anomaly", response_model=MonitorResponse)
# async def monitor_simulation(params: SimulationParams):
#     anomaly_clf = models.get("anomaly_clf")
#     attack_clf = models.get("attack_clf")
#
#     if not anomaly_clf or not attack_clf:
#         raise HTTPException(status_code=500, detail="Classifiers not fully initialized")
#
#     try:
#         feeder = DataFeeder()
#         # Load sample data for simulation
#         X, y = feeder.load_unseen_data(size=params.size)
#
#         ips = [generate_ip() for _ in range(len(X))]
#
#         response = {
#             "ip": ips,
#             "anomaly_predicted": [],
#             "anomaly_score": [],
#             "attack_classified": [],
#             "status": "success"
#         }
#
#         for i in range(len(X)):
#             # 1. Detect Anomaly
#             anomaly_res = anomaly_clf.predict(X[i])
#             response["anomaly_predicted"].append(anomaly_res["label"])
#             response["anomaly_score"].append(anomaly_res["score"])
#
#             # 2. If anomaly, classify attack type
#             if anomaly_res["label"] == "Benign":
#                 response["attack_classified"].append("None")
#             else:
#                 attack_type = attack_clf.predict(X[i])
#                 response["attack_classified"].append(attack_type)
#
#         return response
#     except Exception as e:
#         logger.error(f"Simulation error: {e}")
#         raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_data")
async def analyze_traffic(data_specification: SimulationParams):
    """
    Single traffic sample analysis: Detect anomaly, then classify if needed.

    """
    try:
        data = load_df(
            size=data_specification.size,
            type=data_specification.distribution
        )
        eda = perform_analysis(data=data)
        detect_anomaly = monitor_simulation(
            anomaly_clf=models.get("anomaly_clf"),
            attack_clf=models.get("attack_clf"),
            df = data,
            logger=logger
        )

        return {
            "Eda_analysis": eda,
            "anomlay_results": detect_anomaly
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    res = analyze_traffic(
        SimulationParams(
            size=10,
            network_name="new",
            distribution="attack"
        )
    )
    print(res.get("anomaly_results"))


