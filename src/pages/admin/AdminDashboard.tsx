import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, FileText, AlertCircle, CheckCircle, Clock, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalRFQs: 0,
    pendingRFQs: 0,
    recentRFQs: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard');
        
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        } else {
          // Fallback if API fails
          setData({
            totalCustomers: 0,
            totalProducts: 0,
            totalRFQs: 0,
            pendingRFQs: 0,
            recentRFQs: []
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: 'Total Customers', value: data.totalCustomers, icon: Users, color: 'from-blue-600 to-blue-400', shadow: 'shadow-blue-500/20', trend: '+12%', up: true },
    { title: 'Total Products', value: data.totalProducts, icon: ShoppingBag, color: 'from-purple-600 to-purple-400', shadow: 'shadow-purple-500/20', trend: '+4%', up: true },
    { title: 'Total RFQs', value: data.totalRFQs, icon: FileText, color: 'from-emerald-600 to-emerald-400', shadow: 'shadow-emerald-500/20', trend: '+24%', up: true },
    { title: 'Pending Actions', value: data.pendingRFQs, icon: AlertCircle, color: 'from-amber-500 to-orange-400', shadow: 'shadow-amber-500/20', trend: '-2%', up: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Welcome Banner - Premium 2026 Glassmorphism */}
      <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden group gap-4">
        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-bl from-amber-400/30 via-rose-400/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Welcome back! 👋</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2 font-medium max-w-sm sm:max-w-none">Here is what's happening with your projects today.</p>
        </div>
        <div className="w-full md:w-auto flex items-center relative z-10 mt-2 md:mt-0">
           <div className="w-full sm:w-auto bg-white/60 border border-white/80 rounded-2xl p-3 sm:p-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center gap-3 sm:gap-4 backdrop-blur-sm">
             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 shrink-0 border border-amber-500/20">
               <Activity size={20} className="sm:w-6 sm:h-6" />
             </div>
             <div>
               <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">System Status</p>
               <p className="text-sm sm:text-lg font-black text-slate-800 leading-tight">All Systems Normal</p>
             </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 relative overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group cursor-default">
              <div className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl ${stat.color} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`} />
              
              <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center shadow-lg ${stat.shadow} transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-sm font-bold ${stat.up ? 'text-emerald-600' : 'text-red-600'} bg-white/60 border border-white/80 shadow-sm px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg`}>
                  {stat.up ? <ArrowUpRight size={14} className="sm:w-4 sm:h-4" /> : <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />}
                  {stat.trend}
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{stat.value.toLocaleString()}</h3>
                <p className="text-xs sm:text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent RFQs Table */}
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 overflow-hidden relative group">
        <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-white/60 flex flex-col sm:flex-row sm:items-center justify-between bg-white/30 gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800">Recent Quotations</h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 sm:mt-1">Latest RFQs generated by customers</p>
          </div>
          <Link to="/admin/rfqs" className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-white/70 backdrop-blur-md border border-white/80 hover:border-amber-400 hover:text-amber-600 hover:bg-white text-slate-600 text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group/link">
            View All RFQs
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-white/40 border-b border-white/60">
              <tr>
                <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Quote ID</th>
                <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Customer & Company</th>
                <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Date Generated</th>
                <th className="px-5 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.recentRFQs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 sm:px-8 py-10 sm:py-12 text-center">
                     <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-200 mx-auto mb-2 sm:mb-3" />
                     <p className="text-sm text-slate-500 font-medium">No recent quotations found.</p>
                  </td>
                </tr>
              ) : (
                data.recentRFQs.map((rfq: any) => (
                  <tr key={rfq._id} className="hover:bg-white/60 transition-colors group/row">
                    <td className="px-5 sm:px-8 py-4 sm:py-5">
                      <span className="text-xs sm:text-sm font-black text-slate-800 bg-white/80 shadow-sm border border-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg group-hover/row:bg-amber-100 group-hover/row:text-amber-700 transition-colors whitespace-nowrap">{rfq.quoteNo}</span>
                    </td>
                    <td className="px-5 sm:px-8 py-4 sm:py-5">
                      <div className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1">{rfq.customerName}</div>
                      <div className="text-[10px] sm:text-xs font-bold text-slate-400 mt-0.5 line-clamp-1">{rfq.companyName}</div>
                    </td>
                    <td className="px-5 sm:px-8 py-4 sm:py-5">
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black border whitespace-nowrap ${
                        (rfq.status === 'Pending' || rfq.status === 'New' || rfq.status === 'RFQ Submitted') ? 'bg-amber-50 text-amber-700 border-amber-200/50' :
                        (rfq.status === 'Assigned' || rfq.status === 'Under Review') ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                      }`}>
                        {(rfq.status === 'Pending' || rfq.status === 'New' || rfq.status === 'RFQ Submitted') && <Clock size={12} className="mr-1 sm:mr-2 sm:w-3.5 sm:h-3.5" strokeWidth={3} />}
                        {(rfq.status === 'Assigned' || rfq.status === 'Under Review') && <Users size={12} className="mr-1 sm:mr-2 sm:w-3.5 sm:h-3.5" strokeWidth={3} />}
                        {(rfq.status === 'Quoted' || rfq.status === 'Closed') && <CheckCircle size={12} className="mr-1 sm:mr-2 sm:w-3.5 sm:h-3.5" strokeWidth={3} />}
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-5 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold text-slate-500 whitespace-nowrap">{rfq.date}</td>
                    <td className="px-5 sm:px-8 py-4 sm:py-5 text-right">
                      <Link to="/admin/rfqs" className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 border border-white text-slate-400 hover:text-white hover:bg-amber-500 hover:border-amber-500 hover:shadow-md transition-all shadow-sm shrink-0">
                        <TrendingUp size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
