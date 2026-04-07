import matplotlib.pyplot as plt
import base64
from io import BytesIO
import pandas as pd
import numpy as np
import random
np.random.seed(42)
from data_feeder import DataFeeder

def normalize_labels(df: pd.DataFrame, label_column: str) -> pd.DataFrame:
    df = df.copy()
    df[label_column] = df[label_column].astype(str).str.upper()

    df["binary_label"] = df[label_column].apply(
        lambda x: "normal" if x == "BENIGN" else "attack"
    )

    return df
def stratified_sample(df, label_column, strategy, total_samples, random_state=42):
    """
    Sample a dataframe based on strategy.

    Parameters:
        df             : Input DataFrame
        label_column   : Column name containing 'attack'/'normal' labels
        strategy       : 'attack', 'normal', or 'random'
        total_samples  : Total number of rows to return
        random_state   : For reproducibility
    """

    df = normalize_labels(df, label_column)

    if strategy == 'attack':
        attack_count = int(total_samples * 0.60)
        normal_count = total_samples - attack_count

    elif strategy == 'normal':
        normal_count = int(total_samples * 0.80)
        attack_count = total_samples - normal_count

    elif strategy == 'random':
        return df.sample(n=min(total_samples, len(df)), random_state=random_state).reset_index(drop=True)

    else:
        raise ValueError(f"Unknown strategy '{strategy}'")

    attack_df = df[df["binary_label"] == "attack"].sample(
        n=min(attack_count, len(df[df["binary_label"] == "attack"])),
        random_state=random_state
    )

    normal_df = df[df["binary_label"] == "normal"].sample(
        n=min(normal_count, len(df[df["binary_label"] == "normal"])),
        random_state=random_state
    )

    result = pd.concat([attack_df, normal_df]).sample(frac=1, random_state=random_state)
    return result.reset_index(drop=True)

def get_summary(data: pd.DataFrame) -> dict:
    labels = data["Label"].astype(str).str.upper()

    benign = (labels == "BENIGN").sum()
    attack = (labels != "BENIGN").sum()

    return {
        "total": len(data),
        "benign": int(benign),
        "attack": int(attack)
    }
def add_percentages(dist: dict, total: int):
    if total == 0:
        return {k: {"count": v, "percentage": 0.0} for k, v in dist.items()}
    return {
        k: {
            "count": v,
            "percentage": round((v / total) * 100, 2)
        }
        for k, v in dist.items()
    }
def get_attack_distribution(df: pd.DataFrame) -> dict:
    labels = df["Label"].astype(str).str.upper()

    attack_dist = labels[labels != "BENIGN"].value_counts().to_dict()

    return {k: int(v) for k, v in attack_dist.items()}
def get_stats(df: pd.DataFrame) -> dict:
    feature_cols = ["Fwd Packet Length Max", "Bwd Packet Length Min", "min_seg_size_forward", "Fwd Packet Length Max","Fwd Header Length.1"]
    features = {}

    for c in feature_cols:
        mean_val = df[c].mean()
        std_val = df[c].std()

        # Handle NaN values which are not JSON serializable by default in some encoders
        features[c] = {
            "mean": float(mean_val) if not pd.isna(mean_val) else 0.0,
            "std": float(std_val) if not pd.isna(std_val) else 0.0
        }

    return features
def fig_to_base64():
    buf = BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode()
    plt.close()
    return img_str
def plot_attack_distribution(df):
    labels = df["Label"].astype(str).str.upper()
    attack_counts = labels[labels != "BENIGN"].value_counts()

    plt.figure()
    attack_counts.plot(kind="bar")
    plt.title("Attack Distribution")
    plt.xlabel("Attack Type")
    plt.ylabel("Count")

    return fig_to_base64()

def plot_feature_histogram():
    with open(r"E:\PROJECT py\Capstone-project\Backend\Images\feature_importance.png", "rb") as f:
        encode = base64.b64encode(f.read())
        return encode.decode("utf-8")
def plot_loss():
    with open(r"E:\PROJECT py\Capstone-project\Backend\Images\loss_image.png", "rb") as f:
        encode = base64.b64encode(f.read())
        return encode.decode("utf-8")

def plot_correlation_heatmap(df):
    numeric_df = df.select_dtypes(include=["number"])

    corr = numeric_df.corr()

    plt.figure(figsize=(8,6))
    plt.imshow(corr, aspect='auto')
    plt.colorbar()
    plt.title("Correlation Heatmap")

    plt.xticks(range(len(corr.columns)), corr.columns, rotation=90)
    plt.yticks(range(len(corr.columns)), corr.columns)

    return fig_to_base64()
def get_plots(df: pd.DataFrame) -> dict:
    return {
        "attack_distribution": plot_attack_distribution(df),
        "feature_importance": plot_feature_histogram(),
    }
def load_df(size: int, type: str) -> pd.DataFrame:
    df = DataFeeder()
    data = df.load_csv("un_seen_df.csv")

    data = stratified_sample(
        df=data,
        label_column="Label",  # ✅ FIXED
        strategy=type.strip(),
        total_samples=size,
    )
    return data
def perform_analysis(data: pd.DataFrame) -> dict:


    summary = get_summary(data)
    attack_distribution = get_attack_distribution(data)
    attack_distribution = add_percentages(attack_distribution, summary["attack"])

    features = get_stats(data)
    plots = get_plots(data)
    return {
        "summary": summary,
        "attack_distribution": attack_distribution,
        "features": features,
        "plots": plots
    }

if __name__ == '__main__':
    data = load_df(10, "attack")
    print(perform_analysis(data))