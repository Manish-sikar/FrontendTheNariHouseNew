import { useState } from "react";
import DataTable from "react-data-table-component";

const DataTableComponent = ({ columns, data, title }) => {
  const [filterText, setFilterText] = useState("");

  // 🔍 Filter logic
  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div className="p-3 bg-white dark:bg-slate-800 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>

      {/* 🔍 Global Search */}
      <input
        type="text"
        placeholder="Global search..."
        className="mb-3 p-2 w-full rounded border dark:bg-slate-700 dark:text-white"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      {/* 📊 Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        striped
        highlightOnHover
        responsive
        defaultSortField="fullName"
        persistTableHead
      />
    </div>
  );
};

export default DataTableComponent;
