import random

def predict_disease(symptoms):
    """
    Mock ML Model Logic.
    In a real scenario, this would load a .pkl model and run prediction.
    """
    diseases = ["Flu", "Cold", "COVID-19", "Pneumonia", "Healthy"]
    
    # Simple keyword matching for demo purposes
    symptoms_lower = symptoms.lower()
    if "fever" in symptoms_lower and "cough" in symptoms_lower:
        prediction = "Flu"
    elif "runny nose" in symptoms_lower:
        prediction = "Cold"
    elif "breath" in symptoms_lower:
        prediction = "COVID-19"
    else:
        prediction = random.choice(diseases)
        
    return {
        "disease": prediction,
        "confidence": round(random.uniform(0.7, 0.99), 2)
    }

def analyze_xray_image(image_bytes):
    """
    Mock X-Ray Analysis.
    Real implementation would use PyTorch/TensorFlow + CNN.
    """
    conditions = ["Normal", "Pneumonia", "Tuberculosis"]
    prediction = random.choice(conditions)
    
    return {
        "condition": prediction,
        "confidence": round(random.uniform(0.8, 0.99), 2)
    }
