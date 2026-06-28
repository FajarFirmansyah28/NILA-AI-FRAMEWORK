import { Link } from "react-router-dom";
import { FaFish, FaChartLine, FaBrain, FaHistory, FaArrowRight } from "react-icons/fa";

const Landing = () => {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- NAVBAR --- */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
          <FaFish style={{ color: '#2563eb' }} />
          <span>NILA AI</span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/login" style={{ padding: '8px 20px', color: '#475569', textDecoration: 'none', fontWeight: '600' }}>Masuk</Link>
          <Link to="/register" style={{ padding: '8px 20px', backgroundColor: '#2563eb', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}>Daftar Akun</Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ padding: '10px 20px', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '30px', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
          🚀 Sistem Cerdas Akuakultur Masa Depan
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', maxWidth: '800px', lineHeight: '1.2' }}>
          Monitoring Air & Prediksi Pakan Ikan Berbasis <span style={{ color: '#2563eb' }}>Artificial Intelligence</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
          Tingkatkan efisiensi panen ikan nila Anda dengan analisis K-Nearest Neighbors (K-NN) dan pemantauan sensor IoT secara real-time.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/register" style={{ padding: '14px 32px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)' }}>
            Mulai Sekarang <FaArrowRight />
          </Link>
          <Link to="/login" style={{ padding: '14px 32px', backgroundColor: 'white', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
            Masuk Dashboard
          </Link>
        </div>
      </main>

      {/* --- FEATURES SECTION --- */}
      <section style={{ backgroundColor: 'white', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Card 1 */}
          <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <FaChartLine style={{ fontSize: '24px', color: '#2563eb' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>Real-time Monitoring</h3>
            <p style={{ color: '#64748b', lineHeight: '1.5' }}>Pantau suhu, pH, dan Dissolved Oxygen (DO) kolam secara langsung dari integrasi perangkat sensor IoT.</p>
          </div>
          {/* Card 2 */}
          <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <FaBrain style={{ fontSize: '24px', color: '#2563eb' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>K-NN AI Engine</h3>
            <p style={{ color: '#64748b', lineHeight: '1.5' }}>Algoritma kecerdasan buatan untuk memprediksi keputusan pemberian pakan yang paling optimal.</p>
          </div>
          {/* Card 3 */}
          <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <FaHistory style={{ fontSize: '24px', color: '#2563eb' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>Data Logging</h3>
            <p style={{ color: '#64748b', lineHeight: '1.5' }}>Seluruh riwayat kualitas air dan hasil prediksi tersimpan aman untuk analisis lanjutan dan pelaporan.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ padding: '24px', textAlign: 'center', backgroundColor: '#1e293b', color: '#94a3b8', fontSize: '14px' }}>
        © {new Date().getFullYear()} NILA AI - Sistem Informasi Universitas Pendidikan Ganesha. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
};

export default Landing;