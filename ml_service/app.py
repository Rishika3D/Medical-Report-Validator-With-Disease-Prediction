"""
MediChain ML service.

Thin Flask wrapper around the HuggingFace-backed model functions. Every endpoint
validates input, logs, and degrades gracefully (clearly labelled fallback) when
the upstream model is unavailable, so the rest of the platform keeps working.
"""
import io
import os
import logging

from dotenv import load_dotenv

# Load env BEFORE importing model, which reads HF_* at import time.
load_dotenv()

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

import model  # noqa: E402 - must follow load_dotenv()

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("ml_service")

app = Flask(__name__)

# Restrict CORS to the API/frontend origins when provided.
allowed = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
CORS(app, resources={r"/*": {"origins": allowed or "*"}})

MAX_IMAGE_BYTES = int(os.getenv("MAX_IMAGE_BYTES", str(10 * 1024 * 1024)))


@app.get("/health")
def health():
    return (
        jsonify(
            {
                "status": "ok",
                "huggingface_configured": model.is_configured(),
                "models": {"xray": model.HF_XRAY_ID, "validator": model.HF_VALIDATOR_ID},
            }
        ),
        200,
    )


@app.post("/predict")
def predict():
    data = request.get_json(silent=True) or {}
    symptoms = (data.get("symptoms") or "").strip()
    if not symptoms:
        return jsonify({"error": "No symptoms provided"}), 400

    try:
        result = model.predict_disease(symptoms)
        return jsonify({"success": True, "data": result}), 200
    except Exception as exc:  # noqa: BLE001 - degrade gracefully
        logger.warning("Validator model unavailable, using fallback: %s", exc)
        return (
            jsonify(
                {
                    "success": True,
                    "data": {
                        "disease": "Inconclusive",
                        "confidence": 0.0,
                        "source": "fallback",
                        "note": "AI model is temporarily unavailable.",
                    },
                }
            ),
            200,
        )


@app.post("/analyze-xray")
def analyze_xray():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_bytes = request.files["image"].read()
    if not image_bytes:
        return jsonify({"error": "Empty image file"}), 400
    if len(image_bytes) > MAX_IMAGE_BYTES:
        return jsonify({"error": "Image is too large"}), 413

    # Validate that the upload is actually a decodable image.
    try:
        Image.open(io.BytesIO(image_bytes)).verify()
    except Exception:  # noqa: BLE001
        return jsonify({"error": "Invalid or unsupported image file"}), 400

    try:
        result = model.analyze_xray_image(image_bytes)
        return jsonify({"success": True, "data": result}), 200
    except Exception as exc:  # noqa: BLE001 - degrade gracefully
        logger.warning("X-ray model unavailable, using fallback: %s", exc)
        return (
            jsonify(
                {
                    "success": True,
                    "data": {
                        "condition": "Inconclusive",
                        "confidence": 0.0,
                        "source": "fallback",
                        "note": "AI model is temporarily unavailable.",
                    },
                }
            ),
            200,
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    logger.info("ML service running on http://127.0.0.1:%s", port)
    app.run(host="0.0.0.0", port=port, debug=debug)
