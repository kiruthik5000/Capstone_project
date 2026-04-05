import torch
import numpy as np
from .Utils.load_models import load_critic, load_scalar, get_threshold, DEVICE

class AnomalyClassifier:
    def __init__(self):
        self.critic = load_critic()
        self.scalar = load_scalar()
        self.threshold = get_threshold()
        
    def predict(self, data: list) -> dict:
        """
        Predicts if the traffic data is an anomaly or benign.
        High critic score = benign, low score = anomaly.
        """
        # Convert list to numpy array and reshape
        data_np = np.array(data).reshape(1, -1)
        
        # Scale data
        data_scaled = self.scalar.transform(data_np).astype(np.float32)
        
        # Convert to tensor
        data_tensor = torch.tensor(data_scaled).to(DEVICE)
        
        # Get critic score
        with torch.no_grad():
            score = self.critic(data_tensor).item()
        
        # Compare with threshold
        # WGAN Critic: higher score = more likely benign (closer to real data distribution)
        # However, the exact meaning of the score depends on how it was trained.
        # Typically, in anomaly detection with GANs, we look at the reconstruction error or the discriminator score.
        
        is_anomaly = score < self.threshold
        
        return {
            "is_anomaly": is_anomaly,
            "score": score,
            "threshold": self.threshold,
            "label": "Anomaly" if is_anomaly else "Benign"
        }

if __name__ == '__main__':
    ac = AnomalyClassifier()
    # Dummy data test (must match feature dimension, e.g., 78)
    dummy_data = [0.0] * 78
    print(ac.predict(dummy_data))
