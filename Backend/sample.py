import pandas as pd
import time
import requests
import os
import logging
from Utils.utils import generate_ip

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
API_URL = "http://localhost:8000"
DATA_DIR = os.path.join(os.path.dirname(__file__), "Data")

def clean_data_file(filename: str = "sample.csv"):
    """
    Utility to remove index column from CSV if it exists.
    """
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        logger.error(f"File {filename} not found in {DATA_DIR}")
        return
        
    df = pd.read_csv(path)
    if "index" in df.columns:
        df = df.drop(columns=["index"])
        df.to_csv(path, index=False)
        logger.info(f"✅ Removed 'index' column from {filename}")

def run_sample_test(filename: str = "sample.csv", endpoint: str = "/analyze"):
    """
    Sends data from sample.csv to the API for testing.
    """
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        logger.error(f"File {filename} not found in {DATA_DIR}")
        return

    df = pd.read_csv(path)
    # Ensure any index columns are handled
    cols_to_drop = [c for c in ["Unnamed: 0", "index"] if c in df.columns]
    if cols_to_drop:
        df = df.drop(columns=cols_to_drop)
        
    logger.info(f"🚀 Starting sample test with {len(df)} rows to {endpoint}...")

    for i, row in df.iterrows():
        # Last column is typically the Label
        features = row[:-1].tolist()
        expected_label = row[-1]
        
        request_body = {
            "timestamp": str(time.time()),
            "ip": generate_ip(),
            "values": features
        }

        try:
            response = requests.post(f"{API_URL}{endpoint}", json=request_body)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"Row {i} | Expected: {expected_label} | Result: {result}")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Connection error for row {i}: {e}")
            break
            
        # Optional: slight delay between requests
        # time.sleep(0.1)

if __name__ == '__main__':
    # run_sample_test(endpoint="/classify")
    run_sample_test(endpoint="/analyze")