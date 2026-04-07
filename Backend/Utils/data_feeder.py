import pandas as pd
import numpy as np
import os
import torch
import joblib
from typing import Tuple, Optional, Any



class DataFeeder:
    def __init__(self, data_dir: Optional[str] = None):
        if data_dir is None:
            self.data_dir = r"E:\PROJECT py\Capstone-project\Backend\Data"
            self.model_dir = r"E:\PROJECT py\Capstone-project\Backend\Models"
        else:
            self.data_dir = data_dir

    def load_csv(self, filename: str, nrows: int = None) -> pd.DataFrame:
        path = os.path.join(self.data_dir, filename)
        if not os.path.exists(path):
            print(path)
            raise FileNotFoundError(f"Data file not found at {path}")
            
        df = pd.read_csv(path)
        if nrows is not None:
            df = df.sample(nrows)
        df.columns = df.columns.str.strip()

        # Remove common index-like columns
        cols_to_drop = [col for col in ["Unnamed: 0", "index"] if col in df.columns]
        if cols_to_drop:
            df = df.drop(columns=cols_to_drop)

        # Handle infinite and NaN values
        df = df.replace([np.inf, -np.inf], np.nan)
        df = df.dropna()
        
        print(f"📂 Loaded '{filename}': {len(df):,} rows after cleaning")
        return df

    def encode_labels(self, series: pd.Series, benign_label: str = "BENIGN") -> np.ndarray:
        """
        Encode labels: BENIGN -> False (0), others -> True (1)
        """
        return np.array([
            False if str(y).strip().upper() == benign_label.upper() else True
            for y in series
        ], dtype=bool)

    def scale_data(self, X: np.ndarray, scalar: Optional[Any] = None) -> Tuple[np.ndarray, Any]:
        if scalar is None:
            scalar = joblib.load(os.path.join(self.model_dir, "scaler.joblib"))
        X_scaled = scalar.transform(X)
        return X_scaled.astype(np.float32), scalar

    def split_features_label(self, df: pd.DataFrame, label_col: str = 'Label') -> Tuple[np.ndarray, np.ndarray]:
        # Drop known label columns
        label_cols = [col for col in df.columns if col.lower() in [label_col.lower(), 'binary_label']]
        
        # Also ensure we only take numeric columns as features for ML
        X_df = df.drop(columns=label_cols)
        X = X_df.select_dtypes(include=[np.number]).values
        
        # Get labels
        actual_label_col = None
        for col in df.columns:
            if col.lower() == label_col.lower():
                actual_label_col = col
                break
        
        if actual_label_col is None:
            y = np.array([None] * len(df))
        else:
            y = df[actual_label_col].values
            
        return X, y

    def to_tensor(self, X: np.ndarray, device: torch.device) -> torch.Tensor:
        return torch.tensor(X, dtype=torch.float32).to(device)

    def load_unseen_data(
            self,
            filename: str = "un_seen_df.csv",
            size: Optional[int] = None
    ) -> Tuple[np.ndarray, np.ndarray]:

        print(f"Loading data from {filename}")

        if size is not None:
            df = self.load_csv(filename, nrows=size)
        else:
            df = self.load_csv(filename)

        X, y = self.split_features_label(df)

        return X, y

if __name__ == '__main__':
    df = DataFeeder()
    X_test, y_test, scalar = df.load_unseen_data()
    print(X_test)
