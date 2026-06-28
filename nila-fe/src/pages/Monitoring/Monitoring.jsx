import { useState, useEffect } from "react";
import { monitoringService } from "../../services/api";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Table from "../../components/Table";
import SearchBox from "../../components/SearchBox";
import Pagination from "../../components/Pagination";

const Monitoring = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Berikan nilai default agar tidak crash
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });

  useEffect(() => {
    let active = true;
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await monitoringService.getLogs();
        if (!active) return;

        // Ambil array data dari backend secara aman
        const rawData = res?.data || [];

        // Mapping nama kolom Laravel ke format yang dibaca UI Tabel
        const formattedLogs = rawData.map((item, index) => ({
          id: item.id || index,
          date: new Date(item.created_at).toLocaleString(),
          temp: parseFloat(item.temperature) || 0,
          ph: parseFloat(item.ph) || 0,
          do: parseFloat(item.dissolved_oxygen) || 0,
          turbidity: 20, // Dummy karena tidak ada di tabel database
          feed: parseFloat(item.fish_weight) || 0,
          status: item.prediction_result?.includes("LOW") ? "Warning" : "Normal"
        }));

        setLogs(formattedLogs);

        // Amankan Pagination secara lokal
        setPaginationInfo({
          totalPages: Math.ceil(formattedLogs.length / 5) || 1,
          totalItems: formattedLogs.length,
          itemsPerPage: 5,
        });
      } catch (err) {
        console.error("Failed to load monitoring logs", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchLogs();
    
    return () => {
      active = false;
    };
  }, []); // Hapus dependencies agar tidak refresh terus menerus

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const headers = [
    "Date & Time",
    "Temp (°C)",
    "pH Level",
    "DO (mg/L)",
    "Turbidity (NTU)",
    "Feed (kg)",
    "Status",
  ];

  const renderRow = (row) => {
    let statusClass = "badge-success";
    if (row.status === "Warning") statusClass = "badge-warning";
    if (row.status === "Critical") statusClass = "badge-danger";

    return (
      <tr key={row.id}>
        <td style={{ fontWeight: 500, color: "var(--text-heading)" }}>{row.date}</td>
        <td>{row.temp.toFixed(1)}°C</td>
        <td>{row.ph.toFixed(1)}</td>
        <td>
          <span style={{ color: row.do < 5.0 ? "var(--danger)" : "inherit" }}>
            {row.do.toFixed(1)} mg/L
          </span>
        </td>
        <td>{row.turbidity} NTU</td>
        <td>{row.feed > 0 ? `${row.feed.toFixed(1)} kg` : "-"}</td>
        <td>
          <span className={`badge ${statusClass}`}>{row.status}</span>
        </td>
      </tr>
    );
  };

  // Logika Filter & Pagination Lokal agar tetap jalan mulus
  const filteredLogs = logs.filter(item => 
    !search || item.date.toLowerCase().includes(search.toLowerCase())
  );
  
  const indexOfLastItem = currentPage * paginationInfo.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - paginationInfo.itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <PageHeader
        title="Water Quality Monitoring"
        subtitle="Review real-time environmental telemetry logs from IoT sensors installed in active breeding tanks."
      />

      <Card>
        <div className="table-toolbar">
          <SearchBox
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by date..."
          />
          <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
            Active Tanks: <strong>Tank A, Tank B</strong>
          </div>
        </div>

        <Table
          headers={headers}
          data={currentLogs}
          loading={loading}
          renderRow={renderRow}
          emptyTitle="No telemetry records match"
          emptySubtitle="Try adjusting your search criteria or resetting filters."
        />

        {!loading && filteredLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredLogs.length / paginationInfo.itemsPerPage) || 1}
            onPageChange={handlePageChange}
            totalItems={filteredLogs.length}
            itemsPerPage={paginationInfo.itemsPerPage}
          />
        )}
      </Card>
    </div>
  );
};

export default Monitoring;