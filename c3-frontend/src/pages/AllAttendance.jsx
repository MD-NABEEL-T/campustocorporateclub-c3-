import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AllAttendance = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/attendance/all', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMembers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user.token]);

  if (loading) return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-red-400 p-8">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">All Members — Attendance</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400 text-sm">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Present</th>
              <th className="py-2 pr-4">Absent</th>
              <th className="py-2 pr-4">%</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m._id} className="border-b border-gray-800">
                <td className="py-2 pr-4">{m.name}</td>
                <td className="py-2 pr-4 text-gray-400">{m.email}</td>
                <td className="py-2 pr-4">{m.presentCount}</td>
                <td className="py-2 pr-4">{m.absentCount}</td>
                <td className="py-2 pr-4 text-blue-400 font-semibold">{m.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAttendance;