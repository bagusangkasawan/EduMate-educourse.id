import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FaBookOpen, FaQuestionCircle } from 'react-icons/fa';

export const StatsCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
    <div className={`p-4 rounded-full ${color}`}>
      {React.cloneElement(icon, { className: 'text-white text-3xl' })}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export const ProgressChart = ({ data }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 720);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="topic"
          angle={isSmallScreen ? -15 : 0}
          textAnchor={isSmallScreen ? "end" : "middle"}
          interval={0}
          tickFormatter={(value) =>
            isSmallScreen && value.length > 10
              ? `${value.slice(0, 10)}...`
              : value
          }
        />
        <YAxis unit="%" />
        <Tooltip />
        <Legend wrapperStyle={{ paddingTop: 10 }} />
        <Bar
          dataKey="averageScore"
          name="Rata-rata Skor"
          fill="#4f46e5"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const RecentActivity = ({ activities }) => (
  <div className="space-y-4">
    {activities.length > 0 ? (
      activities.map((act) => {
        const isQuiz = act.progressType === 'quiz';
        const title = act.item?.title || 'Item tidak diketahui';
        const icon = isQuiz ? (
          <FaQuestionCircle className="w-4 h-4 text-blue-600" />
        ) : (
          <FaBookOpen className="w-4 h-4 text-green-600" />
        );

        return (
          <div
            key={act._id}
            className="flex items-start space-x-3"
          >
            <div className="bg-gray-200 p-2 rounded-full mt-1">
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium">
                {isQuiz
                  ? `Kuis "${title}" selesai`
                  : `Materi "${title}" selesai`}
              </p>
              <p className="text-xs text-gray-500">
                Topik: {act.topic?.title || 'Tidak diketahui'}
                {isQuiz && ` | Skor: ${act.score?.toFixed(0) ?? 0}%`}
              </p>
              <p className="text-xs text-gray-400">
                {format(new Date(act.createdAt), 'dd MMMM yyyy, HH:mm', {
                  locale: id
                })}
              </p>
            </div>
          </div>
        );
      })
    ) : (
      <p className="text-sm text-gray-500">Belum ada aktivitas.</p>
    )}
  </div>
);
