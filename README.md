# 🏥 Medical Report Validator & Disease Prediction System

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v14%2B-green)
![Python](https://img.shields.io/badge/Python-3.8%2B-yellow)
![Blockchain](https://img.shields.io/badge/Solidity-Ethereum-lightgrey)

A hybrid Decentralized Application (DApp) that combines **Blockchain technology** for immutable medical record validation and **Machine Learning** for predictive health analysis.

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide)
- [Running the Application](#-running-the-application)
- [Machine Learning Models](#-machine-learning-models)
- [Contributing](#-contributing)

---

## 🔍 Overview

This project addresses two major challenges in healthcare:
1.  **Medical Fraud:** Ensuring medical reports are authentic and haven't been tampered with. We use **Blockchain** to store a cryptographic hash of the report, creating an immutable proof of existence.
2.  **Early Diagnosis:** Using **Machine Learning** on patient data (ECG, Blood, Pancreas parameters) to predict the risk of diseases early.

---

## 🚀 Features

### ✅ Blockchain Validator
* **Tamper-Proof:** Reports are hashed, and the hash is stored on the Ethereum blockchain.
* **Verification:** Patients or doctors can upload a document to verify if it matches the original record on the blockchain.
* **Decentralized:** Removes reliance on a single central authority for verification.

### 🧠 Disease Prediction (ML)
* **ECG & Blood Analysis:** Predicts heart and blood-related issues based on clinical data.
* **Pancreatic Health:** Analyzes specific biomarkers to detect pancreatic diseases.
* **Data Visualization:** Insightful plots and metrics available in the Jupyter Notebooks.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Blockchain** | Solidity (Smart Contracts), Web3.js |
| **Database** | MySQL (Relational Data) |
| **ML/Data Science** | Python, Pandas, Scikit-Learn, Jupyter |

---

## 📂 Project Structure

```bash
├── backend/            # Backend logic, API routes, and controllers
├── ECGandBlood.ipynb   # ML Model: Heart & Blood disease analysis
├── pancreas.ipynb      # ML Model: Pancreas disease prediction
├── Final.ipynb         # Consolidated ML experiments and results
├── queries.sql         # SQL Database schema and table creation scripts
├── package.json        # Node.js dependencies and scripts
├── .gitignore          # Files to ignore in Git
└── README.md           # Project Documentation