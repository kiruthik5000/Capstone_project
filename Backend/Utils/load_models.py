import joblib
import torch
import os
from .wgan_architecture import Generator, Critic

# Constants
FEATURE_DIM = 78
Z_DIM = 64
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BASE_MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "Models")

def load_scalar():
    path = os.path.join(BASE_MODELS_DIR, "scaler.joblib")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Scaler not found at {path}")
    return joblib.load(path)

def get_threshold():
    path = os.path.join(BASE_MODELS_DIR, "threshold.txt") # Note: was thresold.txt, corrected to threshold.txt if it exists
    # Checking for both spellings just in case
    if not os.path.exists(path):
        alt_path = os.path.join(BASE_MODELS_DIR, "thresold.txt")
        if os.path.exists(alt_path):
            path = alt_path
        else:
            # If neither exists, provide a default or raise
            return 0.5 # Default threshold
    
    with open(path, 'r') as f:
        try:
            return float(f.read().strip())
        except ValueError:
            return 0.5

def load_generator():
    path = os.path.join(BASE_MODELS_DIR, "wgan_generator.pth")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Generator model not found at {path}")
        
    G = Generator(Z_DIM, FEATURE_DIM).to(DEVICE)
    G.load_state_dict(torch.load(path, map_location=DEVICE))
    G.eval()
    return G

def load_critic():
    path = os.path.join(BASE_MODELS_DIR, "wgan_critic.pth")
    if not os.path.exists(path):
        raise FileNotFoundError(f"Critic model not found at {path}")
        
    D = Critic(FEATURE_DIM).to(DEVICE)
    D.load_state_dict(torch.load(path, map_location=DEVICE))
    D.eval()
    return D

