import joblib
import numpy as np
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AttackClassifier:
    def __init__(self, model_path: str = None):
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), "Models", "classifier.pkl")
            
        self.model = self.load_model(model_path)
        # Assuming these are the correct mapping for your model
        self.LABELS = {0: "DDoS", 1: "DoS", 2: "PortScan", 3: "Web Attack"}
        
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

    def predict(self, data: list) -> str:
        if self.model is None:
            return "Model Not Loaded"
            
        try:
            # Prepare data: convert to numpy and reshape
            # Input is expected to be a flat list of features
            data_np = np.array(data).reshape(1, -1)
            
            # Predict
            predicted_value = self.model.predict(data_np)
            label_idx = predicted_value[0]
            
            # Return mapped label
            return self.LABELS.get(label_idx, f"Unknown Attack Type ({label_idx})")
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return f"Error: {str(e)}"

if __name__ == '__main__':
    ac = AttackClassifier()
    # Dummy test with zeros (replace with correct number of features)
    # print(ac.predict([0]*78))