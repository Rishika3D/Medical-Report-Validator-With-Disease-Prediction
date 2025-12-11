# 🏥 Medical Report Validator & Disease Prediction System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v14+-green.svg)
![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)
![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-lightgrey.svg)

A decentralized application (DApp) designed to combat medical fraud and provide early disease detection. This project combines **Blockchain technology** for immutable report validation and **Machine Learning** for analyzing patient health data.

---

## 📖 Overview

### 1. Medical Report Validator (Blockchain)
In the current healthcare system, physical reports can be easily forged. This system solves that by:
* **Hashing** the medical report.
* Storing the **Hash** on the Ethereum Blockchain.
* Allowing third parties (insurers, doctors) to verify report authenticity by comparing the uploaded document's hash against the blockchain record.

### 2. Disease Prediction (Machine Learning)
Uses historical medical datasets to predict the likelihood of diseases based on user input parameters.
* **Heart & Blood Analysis:** Analyzing ECG and blood test results.
* **Pancreatic Health:** Detection of pancreatic disorders.

---

## 🚀 Key Features

* **Immutable Records:** Once a report hash is stored on the blockchain, it cannot be altered.
* **Fraud Detection:** Instantly flags if a medical report has been tampered with (even a single pixel change).
* **Predictive Analytics:** ML models (Random Forest/Decision Trees) to assess health risks.
* **Secure Database:** SQL integration for managing user profiles and non-critical metadata.
* **User Dashboard:** Interface for patients to upload reports and for doctors/validators to verify them.

---

## 🛠️ Tech Stack

### Frontend & Backend
* **Node.js & Express:** Server-side logic and API handling.
* **HTML/CSS/JavaScript:** User interface.
* **Web3.js:** To interact with the Ethereum blockchain.

### Machine Learning
* **Python:** Core programming language for ML.
* **Jupyter Notebooks:** For data cleaning, analysis, and model training (`.ipynb` files).
* **Libraries:** Pandas, NumPy, Scikit-learn, Matplotlib.

### Database & Blockchain
* **MySQL:** For storing user credentials and query logs.
* **Solidity:** Smart Contract development.
* **Ganache/Testnet:** Local blockchain for testing transactions.

---

## 📂 Project Structure

```bash
├── backend/            # Server-side controllers and routes
├── ECGandBlood.ipynb   # ML training for Heart/Blood disease
├── pancreas.ipynb      # ML training for Pancreatic disease
├── Final.ipynb         # Consolidated model testing and results
├── queries.sql         # Database schema and initial tables
├── package.json        # Node.js dependencies
└── README.md           # Documentation