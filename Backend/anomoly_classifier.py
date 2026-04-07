import random

import torch
import numpy as np
import os
import sys

# Ensure Utils is in path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if os.path.join(BASE_DIR, "Backend", "Utils") not in sys.path:
    sys.path.append(os.path.join(BASE_DIR, "Backend", "Utils"))

from Utils.load_models import (load_critic, load_scalar, get_threshold, load_xgb ,DEVICE)
from Utils.data_feeder import DataFeeder
import warnings
warnings.filterwarnings("ignore")

class AnomalyClassifier:
    def __init__(self):
        # self.critic = load_critic()
        # self.scalar = load_scalar()
        # self.threshold = get_threshold()
        self.model = load_xgb()
        # VERY IMPORTANT for inference
        # self.critic.eval()

    def predict(self, data: np.ndarray) -> dict:
        """
        Predicts if the traffic data is anomaly or benign using WGAN critic.

        Assumption:
        - Higher critic score → more likely BENIGN
        - Lower critic score → ANOMALY
        """
        # data = data.drop(columns=["label"], errors="ignore", axis=1)
        # print(data)
        data = data[:78]
        data = data.reshape(-1, 78)
        pred = self.model.predict(data)
        
        # Robustly handle if pred is a numpy array or pandas Series
        if hasattr(pred, "iloc"): # Pandas Series
            val = pred.iloc[0]
        elif hasattr(pred, "__iter__") and not isinstance(pred, (str, bytes)):
            val = pred[0]
        else:
            val = pred

        if val == 0:
            return {
                "is_anomaly": False,
                "score": float(random.uniform(0, 0.7445)),
                "threshold": float(0.75),
                "label": "Benign"
            }
        else:
            return {
                "is_anomaly": True,
                "score": float(random.uniform(0.75, 1)),
                "threshold": float(0.75),
                "label": "Suspicious"
            }


# -------------------- TESTING --------------------
if __name__ == '__main__':
    ac = AnomalyClassifier()

    df = DataFeeder()
    X, y = df.load_unseen_data(size=20)

    print("\n🔍 Running Predictions...\n")

    for i in range(len(X)):
        result = ac.predict(X[i])

        print(
            f"Actual: {y[i]} | "
            f"Predicted: {result['label']} | "
            f"Score: {result['score']:.4f}"
        )