"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UneguiItem {
  id: number;
  title: string;
  price: number;
  place: string;
  description: string;
  area: string;
  floor_number: number;
  balcony: number;
  garage: number;
  built_year: number;
  elevator: boolean;
  building_status: boolean;
}

interface ActionLog {
  timestamp: string;
  action: string;
  itemId?: number;
  detail?: string;
}

export default function UneguiAdminPanel() {
  const [data, setData] = useState<UneguiItem[]>([]);
  const [search, setSearch] = useState("");
  const [showRentOnly, setShowRentOnly] = useState<"all" | "rent" | "sell">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortAsc, setSortAsc] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const itemsPerPage = 10;

  // Log нэмэх функц
  const addLog = (action: string, itemId?: number, detail?: string) => {
    setLogs(prev => [
      ...prev,
      { timestamp: new Date().toLocaleString(), action, itemId, detail },
    ]);
  };

  useEffect(() => {
    axios.get("http://localhost:8000/api/unegui/")
      .then(res => {
        setData(res.data.results || res.data);
        addLog("Fetched all items");
      })
      .catch(err => console.log(err));
  }, []);

  const filteredData = data.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.place.toLowerCase().includes(search.toLowerCase());

    const matchesRentSell =
      showRentOnly === "all" ||
      (showRentOnly === "rent" && item.price < 10000000) ||
      (showRentOnly === "sell" && item.price >= 10000000);

    return matchesSearch && matchesRentSell;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortAsc === null) return 0;
    return sortAsc ? a.price - b.price : b.price - a.price;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  // Tailan metrics
  const rentData = filteredData.filter(item => item.price < 10000000);
  const sellData = filteredData.filter(item => item.price >= 10000000);

  const tailanChartData = {
    labels: ["Rent", "Sell"],
    datasets: [
      {
        label: "Нийт зарууд",
        data: [rentData.length, sellData.length],
        backgroundColor: ["#3b82f6", "#10b981"],
      },
      {
        label: "Дундаж үнэ",
        data: [
          rentData.length > 0 ? Math.round(rentData.reduce((acc, cur) => acc + cur.price, 0) / rentData.length) : 0,
          sellData.length > 0 ? Math.round(sellData.reduce((acc, cur) => acc + cur.price, 0) / sellData.length) : 0,
        ],
        backgroundColor: ["#93c5fd", "#6ee7b7"],
      },
      {
        label: "Max үнэ",
        data: [
          rentData.length > 0 ? Math.max(...rentData.map(item => item.price)) : 0,
          sellData.length > 0 ? Math.max(...sellData.map(item => item.price)) : 0,
        ],
        backgroundColor: ["#1e40af", "#047857"],
      },
      {
        label: "Min үнэ",
        data: [
          rentData.length > 0 ? Math.min(...rentData.map(item => item.price)) : 0,
          sellData.length > 0 ? Math.min(...sellData.map(item => item.price)) : 0,
        ],
        backgroundColor: ["#93c5fd", "#6ee7b7"],
      },
    ],
  };

  const tailanChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Tailan / Report" },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Админ Panel - Үнэгүй зарууд</h1>

      {/* Search + Rent/Sell filter */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or place..."
          className="p-2 border rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => { setSearch(e.target.value); addLog("Search filter changed", undefined, e.target.value); }}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            className={`px-4 py-2 rounded ${showRentOnly === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => { setShowRentOnly("all"); setCurrentPage(1); addLog("Filter set to All"); }}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${showRentOnly === "rent" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => { setShowRentOnly("rent"); setCurrentPage(1); addLog("Filter set to Rent"); }}
          >
            Rent
          </button>
          <button
            className={`px-4 py-2 rounded ${showRentOnly === "sell" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => { setShowRentOnly("sell"); setCurrentPage(1); addLog("Filter set to Sell"); }}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Tailan Chart */}
      <div className="my-6 p-4 bg-white shadow rounded w-full md:w-2/3 h-64 mx-auto">
        <Bar options={tailanChartOptions} data={tailanChartData} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
              <th
                className="px-4 py-2 text-right text-sm font-medium text-gray-700 cursor-pointer"
                onClick={() => { setSortAsc(sortAsc === null ? true : !sortAsc); addLog(`Sort by price ${sortAsc === null ? "asc" : sortAsc ? "desc" : "asc"}`); }}
              >
                Price {sortAsc === null ? "" : sortAsc ? "↑" : "↓"}
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Place</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Area</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Floor</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Balcony</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Garage</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Built Year</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Elevator</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2 text-left text-sm text-gray-700">{item.title}</td>
                <td className="px-4 py-2 text-right text-sm text-gray-700">{item.price.toLocaleString()}</td>
                <td className="px-4 py-2 text-center text-sm text-gray-700">{item.price < 10000000 ? "Rent" : "Sell"}</td>
                <td className="px-4 py-2 text-left text-sm text-gray-700">{item.place}</td>
                <td className="px-4 py-2 text-sm text-gray-700 break-words whitespace-normal text-justify">{item.description}</td>
                <td className="px-4 py-2 text-center text-sm text-gray-700">{item.area}</td>
                <td className="px-4 py-2 text-center text-sm text-gray-700">{item.floor_number}</td>
                <td className="px-4 py-2 text-center text-sm text-gray-700">{item.balcony ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-center text-sm text-gray-700">{item.garage ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-center text-sm text-gray-700">{item.built_year}</td>
                <td className="px-4 py-2 text-center text-sm text-gray-700">{item.elevator ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-center text-sm text-gray-700">{item.building_status ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

<div className="mt-4 flex justify-center items-center gap-2">

  <button
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((p) => p - 1)}
  >
    Prev
  </button>

  {getPageNumbers().map((num, idx) => {
    const isNumber = typeof num === "number";
    const isActive = isNumber && currentPage === num;

    return (
      <button
        key={idx}
        disabled={!isNumber}
        className={`
          px-3 py-1 rounded
          ${isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}
          ${isNumber ? "cursor-pointer" : "cursor-default"}
        `}
        onClick={() => isNumber && setCurrentPage(num)}
      >
        {num}
      </button>
    );
  })}

  <button
    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((p) => p + 1)}
  >
    Next
  </button>

</div>


      {/* Logs */}
      <div className="mt-6 p-4 bg-white shadow rounded max-h-64 overflow-y-auto">
        <h2 className="font-bold mb-2">Action Logs</h2>
        <ul className="text-sm text-gray-700">
          {logs.map((log, idx) => (
            <li key={idx}>
              [{log.timestamp}] {log.action} {log.itemId ? `(ID: ${log.itemId})` : ""} {log.detail ? `- ${log.detail}` : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
