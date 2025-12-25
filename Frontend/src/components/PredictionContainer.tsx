import React, { useState } from "react";
import { PredictionCard } from "./PredictionCard";
import { ValidationCard } from "./ValidationCard";
import { Card } from "./ui/card";

export function PredictionContainer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function handlePredict() {
    if (!file) return alert("Please upload a file first.");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://0.0.0.0:8001/predict", {
        method: "POST",
        body: formData
      });

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error:", err);
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/60 border border-cyan-500/20">
        <h2 className="text-cyan-400 mb-4 text-xl">Upload Report</h2>

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-gray-300"
        />

        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-all"
        >
          {loading ? "Processing..." : "Run Prediction"}
        </button>
      </Card>

      {data && (
        <>
          <PredictionCard
            riskPercentage={data?.riskPercentage ?? 0}
            features={data?.features ?? []}
            onRun={handlePredict}   // <= important if prediction button exists
          />

          <ValidationCard
            validPercentage={data?.validPercentage ?? 0}
            invalidPercentage={data?.invalidPercentage ?? 0}
            issues={data?.issues ?? []}
          />
        </>
      )}
    </div>
  );
}
