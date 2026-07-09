import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const MyAttendance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/attendance/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user._id, user.token]);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-red-400 p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">My Attendance</h1>

      <div className="bg-gray-800 rounded-lg p-6 max-w-sm">
        <p className="text-4xl font-bold text-blue-400">{data.percentage}%</p>
        <p className="text-gray-400 mt-2">
          Present: {data.presentCount} / {data.totalSessions} sessions
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Absent: {data.absentCount}
        </p>
      </div>
    </div>
  );
};

export default MyAttendance;