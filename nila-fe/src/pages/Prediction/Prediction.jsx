import { useState } from "react";
import { predictionService } from "../../services/api";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { FaFish, FaUndo, FaBrain, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const Prediction = () => {
  const [formData, setFormData] = useState({
    temp: "28.5",
    ph: "7.2",
    doVal: "6.5",
    weight: "250",
    fishCount: "1000",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({ temp: "27.0", ph: "7.0", doVal: "6.0", weight: "200", fishCount: "1000" });
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await predictionService.predictSize(formData);
      const data = res.data; // Mengambil objek data dari Laravel

      // --- LOGIKA MAPPING DATA ---
      // Kita hitung pakan di frontend karena tidak ada di response API
      const totalBiomassKg = (parseFloat(formData.weight) * parseFloat(formData.fishCount)) / 1000;
      const totalFeed = totalBiomassKg * 0.03;

      // Transformasi data agar sesuai dengan UI
      const transformedResult = {
        status: data.prediction_result.includes("LOW") ? "Warning" : "Healthy",
        prediction: data.prediction_result,
        confidence: data.multiplier_rate,
        method: data.decision_method,
        totalFeed: totalFeed.toFixed(2),
        feedPagi: (totalFeed / 2).toFixed(2),
        feedSore: (totalFeed / 2).toFixed(2),
        notes: data.analyst_notes
      };

      setResult(transformedResult);
    } catch (err) {
      setError(err.message || "Gagal menjalankan model prediksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="AI Prediction Engine"
        subtitle="Analisis kecerdasan buatan K-NN untuk klasifikasi pakan berdasarkan parameter lingkungan dan bobot ikan."
      />

      <div className="grid-container grid-cols-3">
        <div style={{ gridColumn: "span 2" }}>
          <Card title="Input Parameter Sensor & Biometrik">
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ backgroundColor: "var(--danger-light)", color: "var(--danger)", padding: "12px", borderRadius: "var(--radius-sm)", marginBottom: "20px", fontSize: "13px", fontWeight: 500 }}>
                  {error}
                </div>
              )}

              <div className="form-row">
                <Input label="Suhu Air Asli (°C) *" type="number" step="0.1" name="temp" value={formData.temp} onChange={handleChange} required />
                <Input label="Kadar pH Level *" type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <Input label="Dissolved Oxygen (mg/L) *" type="number" step="0.1" name="doVal" value={formData.doVal} onChange={handleChange} required />
                <Input label="Rata-rata Berat Ikan (Gram) *" type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <Input label="Estimasi Jumlah Ikan (Ekor)" type="number" name="fishCount" value={formData.fishCount} onChange={handleChange} />
                <div style={{ width: "100%" }}></div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                <Button variant="outline" icon={<FaUndo />} onClick={handleReset} type="button">Reset</Button>
                <Button variant="primary" icon={<FaBrain />} type="submit" disabled={loading}>Run AI Prediction</Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card title="Hasil Keputusan AI" style={{ height: "100%" }}>
            {loading && <div style={{ display: "flex", height: "300px", alignItems: "center", justifyContent: "center" }}><Loading message="AI sedang menghitung..." /></div>}
            
            {!loading && !result && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                <FaFish style={{ fontSize: "52px", color: "var(--border)", marginBottom: "16px" }} />
                <h4 style={{ color: "var(--text-heading)", fontWeight: 600, fontSize: "15px" }}>Model Belum Dijalankan</h4>
              </div>
            )}

            {!loading && result && (
              <div style={{ animation: "scaleUp 0.3s ease-out" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "var(--radius-sm)", backgroundColor: result.status === "Healthy" ? "var(--secondary-light)" : "var(--danger-light)", color: result.status === "Healthy" ? "var(--secondary)" : "var(--danger)", fontWeight: 600, marginBottom: "20px" }}>
                  {result.status === "Healthy" ? <FaCheckCircle /> : <FaExclamationTriangle />} {result.status === "Healthy" ? "Analisis Selesai" : "Peringatan Lingkungan"}
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px" }}>Rekomendasi Keputusan</span>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-heading)", marginTop: "4px", lineHeight: "1.3" }}>{result.prediction}</h3>
                </div>
                <div style={{ marginBottom: "20px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Multiplier Rating AI</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)" }}>{result.confidence}</span>
                  </div>
                </div>
                
                <div style={{ marginBottom: "20px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                  <p style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "8px" }}>
                    Estimasi Pakan (3% Biomassa)
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Harian:</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--secondary)" }}>{result.totalFeed} kg</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Pagi (08:00):</span>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{result.feedPagi} kg</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Sore (17:00):</span>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{result.feedSore} kg</span>
                  </div>
                </div>

                <div style={{ marginBottom: "20px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px" }}>Metode Engine</span>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginTop: "4px", fontSize: "12px", color: "var(--text-main)" }}><FaInfoCircle style={{ marginTop: "3px", flexShrink: 0, color: "var(--primary)" }} /><span>{result.method}</span></div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prediction;