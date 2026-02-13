from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_disease, analyze_xray_image
import io
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ML Service is Running", "model": "Mock-v1"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        if not data or 'symptoms' not in data:
            return jsonify({"error": "No symptoms provided"}), 400
            
        symptoms = data['symptoms']
        result = predict_disease(symptoms)
        
        return jsonify({
            "success": True,
            "data": result
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze-xray', methods=['POST'])
def predict_xray():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400
            
        file = request.files['image']
        img_bytes = file.read()
        
        # Verify it's an image
        try:
            Image.open(io.BytesIO(img_bytes)).verify()
        except:
            return jsonify({"error": "Invalid image file"}), 400

        result = analyze_xray_image(img_bytes)
        
        return jsonify({
            "success": true,
            "data": result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 ML Service running on http://127.0.0.1:5001")
    app.run(debug=True, port=5001)
