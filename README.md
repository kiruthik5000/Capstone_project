# 🚨 Next-Gen AI Firewall

### Hybrid Intrusion Detection System (IDS) using WGAN & Machine Learning

---

## 📌 Overview

The **Next-Gen AI Firewall** is an advanced **Hybrid Intrusion Detection System (IDS)** designed to detect both **known** and **zero-day cyber attacks** in network traffic.

This system leverages a **two-stage architecture**:

1. **Unsupervised anomaly detection** using **Wasserstein GAN (WGAN)**
2. **Supervised attack classification** using machine learning models

The solution is built to simulate **real-time network traffic monitoring**, providing actionable insights and high detection accuracy.

---

## 🎯 Key Objectives

* Detect **anomalous network behavior** (zero-day attacks)
* Classify **known attack types** (e.g., DoS, Probe, R2L, U2R)
* Provide a **real-time traffic monitoring interface**
* Achieve high performance using **robust evaluation metrics**
* Build a scalable and extensible IDS architecture

---

## 🧠 System Architecture

```
1. Data Collection (CIC Dataset)
        ↓
2. Data Preprocessing
        ↓
3. WGAN-based Anomaly Detection
        ↓
   ┌───────────────┬────────────────┐
   │ Normal Traffic│ Anomalous Data │
   │ (Monitoring)  │ (Further Check)│
   └───────────────┴────────────────┘
                           ↓
4. Attack Classification Model
                           ↓
5. Logging & Alert System
```

---

## ⚙️ Core Technologies

| Component               | Technology Used                           |
| ----------------------- | ----------------------------------------- |
| Programming Language    | Python                                    |
| Deep Learning Framework | TensorFlow / PyTorch                      |
| GAN Model               | Wasserstein GAN (WGAN)                    |
| ML Algorithms           | Random Forest / XGBoost / Neural Networks |
| Data Processing         | Pandas, NumPy                             |
| Visualization           | Matplotlib, Seaborn                       |
| Dataset                 | CICIDS Dataset                            |

---

## 🔍 Key Features

### ✅ Hybrid Detection Mechanism

* Combines **unsupervised + supervised learning**
* Detects both **unknown anomalies** and **known attack signatures**

### ⚡ Real-Time Traffic Simulation

* Processes unseen data samples
* Displays predictions per time interval (simulated traffic flow)

### 📊 Performance Evaluation

* Accuracy
* Precision
* Recall
* F1-Score
* ROC Curve
* Confusion Matrix
* Training vs Validation Loss

### 🧩 Modular Design

* Easily replaceable models
* Scalable pipeline for production environments

---

## 📂 Project Structure

```
IDS_Project/
│
├── data/
│   ├── raw/
│   ├── processed/
│
├── models/
│   ├── wgan/
│   ├── classifier/
│
├── src/
│   ├── data_preprocessing.py
│   ├── train_wgan.py
│   ├── anomaly_detection.py
│   ├── train_classifier.py
│   ├── attack_classification.py
│   ├── evaluation.py
│   ├── simulation.py
│
├── results/
│   ├── metrics/
│   ├── plots/
│
├── logs/
│
├── requirements.txt
├── README.md
└── main.py
```

---

## 🚀 How It Works

### 1. Data Preprocessing

* Cleans and normalizes network traffic data
* Handles missing values and feature scaling

### 2. Anomaly Detection (WGAN)

* Learns **normal traffic distribution**
* Flags deviations as **potential attacks**

### 3. Attack Classification

* Classifies anomalies into:

  * DoS
  * Probe
  * R2L
  * U2R

### 4. Monitoring System

* Simulates live traffic
* Displays:

  * Traffic status
  * Attack type (if detected)
  * Confidence scores

---

## 📊 Evaluation Metrics Explained

### 🔹 Accuracy

Overall correctness of predictions.

### 🔹 Precision

How many detected attacks are actually attacks.

### 🔹 Recall

How many real attacks were correctly detected.

### 🔹 F1-Score

Balance between precision and recall.

### 🔹 Confusion Matrix

Shows:

* True Positives
* False Positives
* True Negatives
* False Negatives

### 🔹 ROC Curve

Measures model’s ability to distinguish classes.

---

## 📈 Sample Results (Expected)

* High anomaly detection capability using WGAN
* Improved classification accuracy using hybrid approach
* Reduced false positives compared to traditional IDS

---

## 🛠 Installation

```bash
git clone https://github.com/your-repo/next-gen-ai-firewall.git
cd next-gen-ai-firewall

pip install -r requirements.txt
```

---

## ▶️ Usage

### Train Models

```bash
python src/train_wgan.py
python src/train_classifier.py
```

### Run Simulation

```bash
python src/simulation.py
```

---

## 🔐 Use Cases

* Enterprise Network Security
* Intrusion Detection Systems (IDS)
* Cybersecurity Research
* Real-time Traffic Monitoring Systems

---

## 🌍 SDG Alignment

### 🏗️ SDG 9: Industry, Innovation & Infrastructure

* Promotes resilient infrastructure through AI-driven cybersecurity

### ⚖️ SDG 16: Peace, Justice & Strong Institutions

* Enhances digital security and protects systems from cyber threats

---

## 🔮 Future Enhancements

* Deploy as a **real-time streaming system**
* Integrate with **SIEM tools**
* Add **deep learning-based traffic visualization dashboard**
* Implement **auto-response firewall actions**
* Extend to **cloud-native environments**

---

## 👨‍💻 Author

**Kiruthik V**
Machine Learning & Cybersecurity Enthusiast

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ Final Note

This project demonstrates a **production-grade hybrid IDS architecture** combining **generative models (WGAN)** with **classification techniques**, making it suitable for **modern cybersecurity challenges** including zero-day attack detection.

---
