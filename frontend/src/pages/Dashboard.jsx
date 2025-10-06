import { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { attendanceService, userService } from '../services/api';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    presentToday: 0,
    monthlyAttendance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user.role === 'user') {
        // Get today's attendance
        const today = new Date().toISOString().split('T')[0];
        const todayResponse = await attendanceService.getMyAttendance(today, today);
        
        const todayRecords = todayResponse.data || [];
        const clockInRecord = todayRecords.find(record => record.status === 'IN');
        const clockOutRecord = todayRecords.find(record => record.status === 'OUT');
        
        setTodayAttendance({
          clockInTime: clockInRecord ? `${clockInRecord.date}T${clockInRecord.time}` : null,
          clockOutTime: clockOutRecord ? `${clockOutRecord.date}T${clockOutRecord.time}` : null
        });
        
        // Get monthly attendance
        const currentMonth = new Date();
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthlyResponse = await attendanceService.getMyAttendance(
          startOfMonth.toISOString().split('T')[0],
          today
        );
        
        setStats(prev => ({
          ...prev,
          monthlyAttendance: monthlyResponse.data ? monthlyResponse.data.length : 0
        }));
      } else if (user.role === 'admin') {
        const usersData = await userService.getAllUsers();
        const today = new Date().toISOString().split('T')[0];
        const todayAttendanceResponse = await attendanceService.getAllAttendance({
          startDate: today,
          endDate: today
        });
        
        const todayAttendanceData = todayAttendanceResponse.data || [];
        const uniqueUsers = new Set(todayAttendanceData.map(record => record.userId));
        
        setStats({
          totalUsers: usersData.length,
          presentToday: uniqueUsers.size,
          monthlyAttendance: todayAttendanceData.length
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? '...' : value}
          </p>
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening at your workplace today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === 'admin' ? (
            <>
              <StatCard
                title="Total Employees"
                value={stats.totalUsers}
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Present Today"
                value={stats.presentToday}
                icon={Clock}
                color="bg-green-500"
              />
              <StatCard
                title="Today's Attendance"
                value={stats.monthlyAttendance}
                icon={TrendingUp}
                color="bg-purple-500"
              />
            </>
          ) : (
            <>
              <StatCard
                title="Monthly Attendance"
                value={stats.monthlyAttendance}
                icon={Calendar}
                color="bg-blue-500"
              />
              <StatCard
                title="Clock In Time"
                value={formatTime(todayAttendance?.clockInTime)}
                icon={Clock}
                color="bg-green-500"
              />
              <StatCard
                title="Clock Out Time"
                value={formatTime(todayAttendance?.clockOutTime)}
                icon={Clock}
                color="bg-red-500"
              />
            </>
          )}
        </div>

        {/* Today's Attendance Card for Users */}
        {user.role === 'user' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Today's Attendance
            </h3>
            
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ) : todayAttendance ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Clock In</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatTime(todayAttendance.clockInTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Clock Out</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatTime(todayAttendance.clockOutTime)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No attendance record for today</p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.role === 'user' ? (
              <>
                <a
                  href="/attendance"
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-900">Clock In/Out</span>
                </a>
                <a
                  href="/attendance/summary"
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-green-900">View Summary</span>
                </a>
                <a
                  href="/profile"
                  className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Users className="h-6 w-6 text-purple-600" />
                  <span className="font-medium text-purple-900">Edit Profile</span>
                </a>
              </>
            ) : (
              <>
                <a
                  href="/admin/employees"
                  className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Users className="h-6 w-6 text-blue-600" />
                  <span className="font-medium text-blue-900">Manage Employees</span>
                </a>
                <a
                  href="/admin/attendance"
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Clock className="h-6 w-6 text-green-600" />
                  <span className="font-medium text-green-900">View Attendance</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;