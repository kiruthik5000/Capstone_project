import joblib
import numpy as np
import os
import logging
import sys
import warnings
warnings.filterwarnings("ignore")
import pandas as pd

# Ensure Backend and its parent are in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)
if os.path.join(BASE_DIR, "Backend") not in sys.path:
    sys.path.append(os.path.join(BASE_DIR, "Backend"))
if os.path.join(BASE_DIR, "Backend", "Utils") not in sys.path:
    sys.path.append(os.path.join(BASE_DIR, "Backend", "Utils"))

try:
    from Backend.Utils.data_feeder import DataFeeder
except ImportError:
    try:
        from Utils.data_feeder import DataFeeder
    except ImportError:
        # Fallback for direct script execution
        from Utils.data_feeder import DataFeeder

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AttackClassifier:
    def __init__(self, model_path: str = None):
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), "Models", "classifier.pkl")

        self.model = self.load_model(model_path)
        # Assuming these are the correct mapping for your model
        self.LABELS = {0: "Unknown", 1: "Bot", 2: "DDos", 3: "Dos", 4: "Infiltration", 5: "PortScan", 6: "Web Attack"}

    def load_model(self, model_path):
        try:
            if not os.path.exists(model_path):
                logger.error(f"Model file not found at {model_path}")
                return None

            model = joblib.load(model_path)
            logger.info("✅ Attack Classifier model loaded successfully")
            return model
        except Exception as e:
            logger.error(f"❌ Error loading model: {e}")
            return None

    def predict(self, data: list, threshold: float = 0.6) -> str:
        try:
            row = np.array(data).reshape(1, -1)
            pred = self.model.predict(row)
            return self.LABELS.get(pred[0], "Unknown")
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return f"Error: {str(e)}"

if __name__ == '__main__':
    ac = AttackClassifier()

    # ✅ Print what classes the model actually knows
    print("Model classes:", ac.model.classes_)
    print("Expected features:", ac.model.n_features_in_)
    print("Your LABELS map:", ac.LABELS)

    df = DataFeeder()
    X, y = df.load_unseen_data(size=20)

    for i in range(len(X)):
        print(f"actual: {y[i]} ---> predicted: {ac.predict([X[i]])}")



