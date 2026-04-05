import pandas as pd
import numpy as np
import os
import torch
from sklearn.preprocessing import StandardScaler
from typing import Tuple, Optional, Any

class DataFeeder:
    def __init__(self, data_dir: Optional[str] = None):
        if data_dir is None:
            self.data_dir = os.path.join(os.path.dirname(__file__), "..", "Data")
        else:
            self.data_dir = data_dir

    def load_csv(self, filename: str) -> pd.DataFrame:
        path = os.path.join(self.data_dir, filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"Data file not found at {path}")
            
        df = pd.read_csv(path)
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
            scalar = StandardScaler()
            X_scaled = scalar.fit_transform(X)
        else:
            X_scaled = scalar.transform(X)
        return X_scaled.astype(np.float32), scalar

    def split_features_label(self, df: pd.DataFrame, label_col: str = 'Label') -> Tuple[pd.DataFrame, pd.Series]:
        if label_col not in df.columns:
            # If label column doesn't exist, assume all columns are features
            return df, pd.Series([None] * len(df))
        return df.drop(columns=[label_col]), df[label_col]

    def to_tensor(self, X: np.ndarray, device: torch.device) -> torch.Tensor:
        return torch.tensor(X, dtype=torch.float32).to(device)

    def load_unseen_data(self, filename: str = "un_seen_df.csv", scalar: Optional[Any] = None) -> Tuple[np.ndarray, np.ndarray, Any]:
        df = self.load_csv(filename)
        X, y = self.split_features_label(df)
        
        y_encoded = self.encode_labels(y)
        X_scaled, scalar = self.scale_data(X.values, scalar)
        
        print(f"✅ Data ready: {X_scaled.shape[0]} samples, {X_scaled.shape[1]} features")
        return X_scaled, y_encoded, scalar

