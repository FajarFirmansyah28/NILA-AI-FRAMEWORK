import { useState, useEffect, useCallback } from "react";
import { historyService } from "../../services/api";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";
import Table from "../../components/Table";
import SearchBox from "../../components/SearchBox";
import Pagination from "../../components/Pagination";
import { FaTrash } from "react-icons/fa";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await historyService.getHistory(); // Mengambil data penuh
      setHistory(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("DEBUG - Fetch Error:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // LOGIKA FILTER BARU: Memfilter data secara lokal agar lebih akurat
  const filteredHistory = history.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.prediction?.toLowerCase().includes(searchLower) ||
      item.status?.toLowerCase().includes(searchLower) ||
      item.date?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination Lokal berdasarkan data yang terfilter
  const indexOfLastItem = currentPage * paginationInfo.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - paginationInfo.itemsPerPage;
  const currentHistory = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / paginationInfo.itemsPerPage) || 1;

  const handleDelete = async (id) => {
    if (window.confirm("Hapus data analisis ini?")) {
      try {
        await historyService.deleteHistory(id);
        alert("Data berhasil dihapus.");
        fetchHistory(); 
      } catch (err) {
        console.error("DEBUG - Delete Error:", err.response?.data || err.message);
        alert("Gagal hapus: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset ke halaman 1 saat mencari
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const headers = ["Date & Time", "Prediction", "Params", "Confidence", "Status", "Action"];

  const renderRow = (row) => {
    return (
      <tr key={row.id}>
        <td>{row.date}</td>
        <td>{row.prediction?.split(" (")[0]}</td>
        <td>
          Temp: {row.inputs?.temp}°C, pH: {row.inputs?.ph}, DO: {row.inputs?.doVal || row.inputs?.do}
        </td>
        <td>{row.confidence}</td>
        <td><span className={`badge ${row.status === 'Warning' ? 'badge-danger' : 'badge-success'}`}>{row.status}</span></td>
        <td>
          <button 
            type="button"
            onClick={() => handleDelete(row.id)}
            style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <PageHeader title="Prediction Logs History" subtitle="Data dari MySQL Database" />
      <Card>
        <div className="table-toolbar">
          <SearchBox value={search} onChange={handleSearchChange} placeholder="Search by prediction or status..." />
        </div>

        <Table headers={headers} data={currentHistory} loading={loading} renderRow={renderRow} />

        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Card>
    </div>
  );
};

export default History;