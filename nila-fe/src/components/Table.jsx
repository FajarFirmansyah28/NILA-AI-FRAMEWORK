import Loading from "./Loading";
import EmptyState from "./EmptyState";

const Table = ({
  headers = [],
  data = [],
  loading = false,
  renderRow,
  emptyTitle = "No data available",
  emptySubtitle = "There is no information to display here.",
}) => {
  if (loading) {
    return <Loading />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => renderRow(row, idx))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
