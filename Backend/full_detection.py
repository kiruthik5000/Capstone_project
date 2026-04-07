import random

import pandas as pd
from Utils.data_feeder import DataFeeder
from Utils.utils import generate_ip
from fastapi import HTTPException

def monitor_simulation(
        anomaly_clf,
        attack_clf,
        df: pd.DataFrame,
        logger
):

    if not anomaly_clf or not attack_clf:
        raise HTTPException(status_code=500, detail="Classifiers not fully initialized")

    try:
        feeder = DataFeeder()
        X, y = feeder.split_features_label(df=df)
        
        # Ensure X is a numpy array for consistent row-wise indexing
        if hasattr(X, "values"):
            X = X.values

        ips = [generate_ip() for _ in range(len(X))]

        response = {
            "ip": ips,
            "anomaly_predicted": [],
            "anomaly_score": [],
            "attack_classified": [],
            "status": "success"
        }

        number_of_unknown = int(len(X) * 0.1)
        random_index = random.sample(range(len(X)), k=min(number_of_unknown, len(X)))
        for i in range(len(X)):
            # 1. Detect Anomaly
            anomaly_res = anomaly_clf.predict(X[i])
            response["anomaly_predicted"].append(anomaly_res["label"])
            response["anomaly_score"].append(anomaly_res["score"])

            # 2. If anomaly, classify attack type
            if anomaly_res["label"] == "Benign":
                response["attack_classified"].append("None")
            else:
                attack_type = attack_clf.predict(X[i])
                if i in random_index:
                    response["attack_classified"].append("Unknown")
                else:
                    response["attack_classified"].append(attack_type)

        return response
    except Exception as e:
        logger.error(f"Simulation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
