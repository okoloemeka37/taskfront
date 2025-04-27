"use client";

import { useEffect, useState } from "react";
import { api } from "next-laravel-apihelper";
import { format } from "date-fns";
import { PlusCircle, XCircle, CreditCard, Pencil, CheckCircle, Download, Search } from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";


export default function ActivityHistoryPage() {
    const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const limit = 20; // items per load

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const res = await api.get(`/getHistory?page=${page}&limit=${limit}`);
      const newActivities = res.data || [];
      setActivities((prev) => [...prev, ...newActivities]);
      if (newActivities.length < limit) setHasMore(false);
    } catch (err) {
      console.error("Error loading activities", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let data = [...activities];

    if (filterType !== "all") {
      data = data.filter((a) => a.type === filterType);
    }

    if (searchTerm) {
      data = data.filter(
        (a) =>
          (a.text && a.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (a.type && a.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      data = data.filter((a) => {
        const created = new Date(a.created_at);
        return created >= start && created <= end;
      });
    }

    setFilteredActivities(data);
  }, [activities, filterType, searchTerm, startDate, endDate]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredActivities);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ActivityHistory.xlsx");
  };

  const exportToPDF = () => {
 
    const doc = new jsPDF();
    doc.text("Activity History", 14, 20);
    const tableData = filteredActivities.map((a, index) => [
      index + 1,
      a.text,
      a.type,
      format(new Date(a.created_at), "PPP"),
    ]);
    (doc as any).autoTable({
      head: [["#", "Title", "Type", "Date"]],
      body: tableData,
    });
    doc.save("ActivityHistory.pdf");
  };

  const changePage = (id:number) => {
   router.push(`/Dashbord/Expense/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center text-white p-6">
        <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading activity history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-6">Activity History 📜</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 text-white pl-10 pr-4 py-2 rounded-lg backdrop-blur-md focus:outline-none"
          />
        </div>

        <div className="flex gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 text-white px-4 py-2 rounded-lg backdrop-blur-md w-full"
          >
            <option value="all">All Activities</option>
            <option value="add">Task Added</option>
            <option value="delete">Task Deleted</option>
            <option value="payment">Payment Confirmed</option>
            <option value="edit">Task Updated</option>
            <option value="confirm">Confirmation Completed</option>
          </select>
        </div>
      </div>

      {/* Date Range */}
      <div className="flex flex-wrap gap-4 mt-6">
        <div>
          <label className="text-gray-400 text-xs">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block bg-white/10 text-white p-2 rounded-lg backdrop-blur-md"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block bg-white/10 text-white p-2 rounded-lg backdrop-blur-md"
          />
        </div>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="mt-5 bg-red-400/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-400/40 transition"
        >
          Clear
        </button>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-400/20 text-green-300 rounded-lg hover:bg-green-400/30 transition"
        >
          <Download size={18} /> Export Excel
        </button>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-400/20 text-blue-300 rounded-lg hover:bg-blue-400/30 transition"
        >
          <Download size={18} /> Export PDF
        </button>
      </div>

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={filteredActivities.length}
        next={() => {
          setPage((prev) => prev + 1);
          loadActivities();
        }}
        hasMore={hasMore}
        loader={<h4 className="text-center text-white">Loading more activities...</h4>}
        endMessage={<p className="text-center text-gray-400 mt-6">That's all 🎉</p>}
      >
        <div className="relative border-l-2 border-gray-700 ml-4 space-y-10">
          {filteredActivities.length === 0 ? (
      
            <div className="text-center text-gray-400 p-10">
            <img src="/empty-state.svg" alt="No activity" className="mx-auto w-32 mb-4 opacity-70" />
            <p>No activities yet. Start making history!</p>
          </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 group" onClick={()=>changePage(activity.item_id)}>
                <div className="relative">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mt-2"></div>
                  <div className="absolute top-5 left-1.5 w-px h-full bg-gray-700"></div>
                </div>

                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-md w-full group-hover:bg-white/20 transition">
                  <div className="flex items-center gap-3 mb-2 text-white">
                    {getActivityIcon(activity.type)}
                    <h3 className="font-semibold text-lg">{activity.text}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{format(new Date(activity.created_at), "PPPppp")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
}







function getActivityIcon(type: string) {

    if (type.toLocaleUpperCase().includes("add")) {
      return <PlusCircle size={20} className="text-green-400" />;
        
    }else if (type.includes("delete")) {
        return <XCircle size={20} className="text-red-400" />;
    }else if (type.includes("payment")) {
        return <CreditCard size={20} className="text-yellow-400" />;
    }else if (type.includes("edit")) {
        return <Pencil size={20} className="text-blue-400" />;  
    }else if (type.includes("confirm")) {
        return <CheckCircle size={20} className="text-green-400" />;
    }else{
        return <PlusCircle size={20} className="text-gray-400" />;
    }

}
