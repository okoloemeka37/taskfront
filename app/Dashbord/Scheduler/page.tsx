
"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card ,CardHeader,CardContent, CardTitle } from "../../components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { api } from "next-laravel-apihelper";


export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState<{ title: string; freq_word    : "daily" | "weekly" | "monthly"; next_run: string;last_run:string; last_status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const frequencyLabel = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  };

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        
         const response = await api.get("/AllJobs");
         console.log(response);
         setTasks(response.data);
         setLoading(false);
     
      } catch (error) {
        console.error("Failed to fetch tasks, using demo data.", error);
     
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-indigo-400">Scheduled Tasks</h1>
        <p className="text-gray-400 mt-2">Automated tasks that run on your behalf.</p>
      </div>

      {loading ? (
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mt-12" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task, index) => (
            <Card key={index} className="bg-white/10 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-base">{task.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <span>Frequency: {frequencyLabel[task.freq_word]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <span>Next run: {formatDistanceToNow(new Date(task.next_run), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <span>Last run: {task.last_run !== null ? formatDistanceToNow(new Date(task.last_run), { addSuffix: true }) : "N/A"}</span>
                </div>
                <p>
                  last_status:
                  <span
                    className={`ml-1 font-semibold ${
                      task.last_status === "success"
                        ? "text-green-400"
                        : task.last_status === "pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {task.last_status}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



