import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, MapPin, Calendar } from 'lucide-react';
import { attendanceService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Attendance = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchTodayAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const data = await attendanceService.getMyAttendance();
      const allRecords = data.data || [];

      // Sort all by date then time (ascending)
      allRecords.sort((a, b) => {
        const d = a.date.localeCompare(b.date);
        return d !== 0 ? d : a.time.localeCompare(b.time);
      });

      // Last overall status (drives which button is enabled)
      const lastOverall = allRecords.length ? allRecords[allRecords.length - 1] : null;
      const overallLastStatus = lastOverall ? lastOverall.status : null;

      // Today-only for display
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = allRecords.filter(r => r.date === today);
      todayRecords.sort((a, b) => a.time.localeCompare(b.time));

      const lastIn = [...todayRecords.filter(r => r.status === 'IN')].pop() || null;
      const lastOut = [...todayRecords.filter(r => r.status === 'OUT')].pop() || null;

      setTodayAttendance({
        lastStatus: overallLastStatus, // 'IN' | 'OUT' | null (controls buttons)
        clockInTime: lastIn ? `${lastIn.date}T${lastIn.time}` : null,
        clockOutTime: lastOut ? `${lastOut.date}T${lastOut.time}` : null,
        date: today,
        records: todayRecords,
      });
    } catch (error) {
      console.error('Failed to fetch today attendance:', error);
      setTodayAttendance({
        lastStatus: null,
        clockInTime: null,
        clockOutTime: null,
        date: new Date().toISOString().split('T')[0],
        records: [],
      });
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await attendanceService.clockIn();
      // Optimistic enable OUT
      setTodayAttendance(prev => ({ ...(prev || {}), lastStatus: 'IN' }));
      await fetchTodayAttendance();
      alert('✅ Clock in successful!');
    } catch (error) {
      console.error('Failed to clock in:', error);
      alert('❌ Failed to clock in: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await attendanceService.clockOut();
      // Optimistic enable IN
      setTodayAttendance(prev => ({ ...(prev || {}), lastStatus: 'OUT' }));
      await fetchTodayAttendance();
      alert('✅ Clock out successful!');
    } catch (error) {
      console.error('Failed to clock out:', error);
      alert('❌ Failed to clock out: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAttendanceTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Exactly one button active based on overall lastStatus
  const lastStatus = todayAttendance?.lastStatus || null;
  const canClockIn = !loading && (lastStatus !== 'IN');   // allow IN if last not IN
  const canClockOut = !loading && (lastStatus === 'IN');  // allow OUT only if last is IN

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Clock in and out for your work day</p>
        </div>

        {/* Current Time Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 mr-3" />
              <h2 className="text-2xl font-bold">Current Time</h2>
            </div>
            <div className="text-5xl font-bold mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-xl opacity-90">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Attendance Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clock In */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clock In</h3>
              <p className="text-gray-600 mb-6">Start your work day</p>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-1">Clock In Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatAttendanceTime(todayAttendance?.clockInTime)}
                </p>
              </div>

              <button
                onClick={handleClockIn}
                disabled={!canClockIn}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  canClockIn ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canClockIn ? 'Clock In' : 'Already Clocked In (or waiting to Out)'}
              </button>
            </div>
          </div>

          {/* Clock Out */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clock Out</h3>
              <p className="text-gray-600 mb-6">End your work day</p>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-1">Clock Out Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatAttendanceTime(todayAttendance?.clockOutTime)}
                </p>
              </div>

              <button
                onClick={handleClockOut}
                disabled={!canClockOut}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  canClockOut ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canClockOut ? 'Clock Out' : 'Clock In first'}
              </button>
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Summary</h3>
          
          {todayAttendance && (todayAttendance.hasClockIn || todayAttendance.hasClockOut) ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(todayAttendance.date).toLocaleDateString('id-ID')}
                </p>
              </div>
              
              <div className={`text-center p-4 rounded-lg ${todayAttendance.hasClockIn ? 'bg-green-50' : 'bg-gray-50'}`}>
                <LogIn className={`h-8 w-8 mx-auto mb-2 ${todayAttendance.hasClockIn ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-gray-600 mb-1">Clock In</p>
                <p className={`text-lg font-semibold ${todayAttendance.hasClockIn ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formatAttendanceTime(todayAttendance.clockInTime)}
                </p>
              </div>
              
              <div className={`text-center p-4 rounded-lg ${todayAttendance.hasClockOut ? 'bg-red-50' : 'bg-gray-50'}`}>
                <LogOut className={`h-8 w-8 mx-auto mb-2 ${todayAttendance.hasClockOut ? 'text-red-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-gray-600 mb-1">Clock Out</p>
                <p className={`text-lg font-semibold ${todayAttendance.hasClockOut ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formatAttendanceTime(todayAttendance.clockOutTime)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">No attendance record for today</p>
              <p className="text-sm text-gray-500 mt-1">Click "Clock In" to start tracking your attendance</p>
            </div>
          )}
        </div>

        {/* Work Hours Calculation */}
        {todayAttendance?.clockInTime && todayAttendance?.clockOutTime && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Hours</h3>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {(() => {
                  const clockIn = new Date(todayAttendance.clockInTime);
                  const clockOut = new Date(todayAttendance.clockOutTime);
                  const diffMs = clockOut - clockIn;
                  const hours = Math.floor(diffMs / (1000 * 60 * 60));
                  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  return `${hours}h ${minutes}m`;
                })()}
              </div>
              <p className="text-gray-600">Total work hours today</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;