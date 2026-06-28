import { useState, useEffect } from "react";
import { FaFish, FaHeartbeat, FaChartBar, FaBell } from "react-icons/fa";
import { dashboardService, historyService } from "../../services/api";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import Button from "../../components/Button"; // Pastikan sudah di-import
import Loading from "../../components/Loading";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [latestLog, setLatestLog] = useState(null); // State baru untuk data dinamis
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [res, historyRes] = await Promise.all([
          dashboardService.getStats(),
          historyService.getHistory()
        ]);

        // Mapping Statistik
        const statsSource = res?.stats || { total_predictions: 0, avg_ph: 0 };
        const mappedStats = {
          totalFish: { value: statsSource.total_predictions || 0, change: "Total", trend: "positive" },
          healthyFish: { value: parseFloat(statsSource.avg_ph).toFixed(2) || 0, change: "Avg pH", trend: "positive" },
          predictionsToday: { value: statsSource.total_predictions || 0, change: "Update", trend: "positive" },
          alertsActive: { value: 0, change: "Clear", trend: "positive" },
        };

        setData({ stats: mappedStats });

        // Mapping Grafik & Data Dinamis Terbaru
        if (historyRes?.data && historyRes.data.length > 0) {
          // Ambil data paling baru untuk status air
          setLatestLog(historyRes.data[0]);

          const formattedData = historyRes.data.map((item) => ({
            time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            Suhu: item.inputs.temp,
            pH: item.inputs.ph,
            DO: item.inputs.doVal,
          })).reverse();
          setChartData(formattedData);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Loading message="Loading dashboard real-time..." />;
  if (!data) return <div style={{ padding: '20px', color: 'red' }}>Gagal memuat data. Periksa koneksi API Anda.</div>;

  const { stats } = data;

  return (
    <div>
      <PageHeader title="Dashboard Overview" subtitle="Real-time insights from MySQL Database" />

      {/* 4 Stat Cards */}
      <div className="grid-container grid-cols-4" style={{ marginBottom: "28px" }}>
        <StatCard label="Total Predictions" value={stats.totalFish.value} icon={<FaFish />} indicator={stats.totalFish.change} indicatorType={stats.totalFish.trend} iconColor="#2563eb" />
        <StatCard label="Average pH" value={stats.healthyFish.value} icon={<FaHeartbeat />} indicator={stats.healthyFish.change} indicatorType={stats.healthyFish.trend} iconColor="#10b981" />
        <StatCard label="Latest Prediction" value={stats.predictionsToday.value} icon={<FaChartBar />} indicator={stats.predictionsToday.change} indicatorType={stats.predictionsToday.trend} iconColor="#06b6d4" />
        <StatCard label="Alerts" value={stats.alertsActive.value} icon={<FaBell />} indicator={stats.alertsActive.change} indicatorType={stats.alertsActive.trend} iconColor="#ef4444" />
      </div>

      {/* Dynamic Water Status & Quick Ops */}
      {latestLog && (
        <div className="grid-container grid-cols-2" style={{ marginBottom: "28px", gap: "20px" }}>
          <Card title="Current Water Status">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div style={{ padding: "15px", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>WATER TEMPERATURE</div>
                <div style={{ fontSize: "20px", fontWeight: "700" }}>{latestLog.inputs.temp}°C
                  <span style={{ fontSize: "12px", color: latestLog.inputs.temp >= 26 && latestLog.inputs.temp <= 30 ? "#10b981" : "#ef4444", marginLeft: "5px" }}>
                    {latestLog.inputs.temp >= 26 && latestLog.inputs.temp <= 30 ? "Good" : "Warning"}
                  </span>
                </div>
              </div>
              <div style={{ padding: "15px", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>DISSOLVED OXYGEN (DO)</div>
                <div style={{ fontSize: "20px", fontWeight: "700" }}>{latestLog.inputs.doVal} mg/L
                  <span style={{ fontSize: "12px", color: latestLog.inputs.doVal >= 5.0 ? "#10b981" : "#ef4444", marginLeft: "5px" }}>
                    {latestLog.inputs.doVal >= 5.0 ? "Good" : "Low"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Quick Operations">
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Button variant="outline" onClick={() => window.location.href = '/prediction'}>Run AI Prediction →</Button>
              <Button variant="outline" onClick={() => window.location.href = '/monitoring'}>View Water Quality →</Button>
              <Button variant="outline" onClick={() => window.location.href = '/history'}>Review Logs →</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card title="Water Quality Trend">
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Suhu" stroke="#ef4444" name="Temp (°C)" />
              <Line type="monotone" dataKey="pH" stroke="#3b82f6" name="pH" />
              <Line type="monotone" dataKey="DO" stroke="#10b981" name="DO (mg/L)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;