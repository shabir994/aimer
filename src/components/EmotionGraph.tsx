import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { dashboardAPI } from '../lib/api/mockData';

const EmotionGraph = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const progressData = await dashboardAPI.getEmotionProgress();
        setData(progressData);
      } catch (error) {
        console.error('Error fetching emotion progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="h-[400px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="happiness"
            stroke="#4F46E5"
            strokeWidth={2}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="stress"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionGraph;