"""
Real ML inference via the HuggingFace Inference API.

Wires the two models referenced in the project environment:
  - HF_XRAY_ID      : chest X-ray image classifier
  - HF_VALIDATOR_ID : medical-report / symptom text classifier

If the HuggingFace API is unavailable (no token, model cold/unhosted, network
error) each function raises; the Flask layer turns that into a clearly-labelled
graceful fallback so the wider app keeps working.
"""
import os
import logging

from huggingface_hub import InferenceClient

logger = logging.getLogger("ml_service.model")

HF_TOKEN = os.getenv("HF_ACCESS_TOKEN")
HF_XRAY_ID = os.getenv("HF_XRAY_ID", "Rishika08/chest-xray-pneumonia-detector")
HF_VALIDATOR_ID = os.getenv("HF_VALIDATOR_ID", "Rishika08/medical-report-validator")

_client = InferenceClient(token=HF_TOKEN) if HF_TOKEN else None


def is_configured() -> bool:
    return _client is not None


def _client_or_raise() -> InferenceClient:
    if _client is None:
        raise RuntimeError("HF_ACCESS_TOKEN is not configured")
    return _client


def _normalize(predictions) -> list:
    """Coerce HF responses (dataclasses or dicts) into [{label, score}] sorted desc."""
    items = []
    for p in predictions:
        label = getattr(p, "label", None)
        score = getattr(p, "score", None)
        if label is None and isinstance(p, dict):
            label = p.get("label")
            score = p.get("score")
        if label is not None and score is not None:
            items.append({"label": str(label), "score": round(float(score), 4)})
    items.sort(key=lambda x: x["score"], reverse=True)
    return items


def analyze_xray_image(image_bytes: bytes) -> dict:
    client = _client_or_raise()
    predictions = client.image_classification(image_bytes, model=HF_XRAY_ID)
    ranked = _normalize(predictions)
    if not ranked:
        raise RuntimeError("Empty response from X-ray model")
    top = ranked[0]
    return {
        "condition": top["label"],
        "confidence": top["score"],
        "source": "huggingface",
        "model": HF_XRAY_ID,
        "predictions": ranked,
    }


def predict_disease(symptoms: str) -> dict:
    client = _client_or_raise()
    predictions = client.text_classification(symptoms, model=HF_VALIDATOR_ID)
    ranked = _normalize(predictions)
    if not ranked:
        raise RuntimeError("Empty response from validator model")
    top = ranked[0]
    return {
        "disease": top["label"],
        "confidence": top["score"],
        "source": "huggingface",
        "model": HF_VALIDATOR_ID,
        "predictions": ranked,
    }
