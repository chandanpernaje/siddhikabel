import React, { useEffect, useState } from 'react';
import { FileText, Eye, RefreshCw, AlertCircle, CheckCircle, UserPlus, Trash2, X, Download, Printer } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  role: string;
}

interface RFQ {
  _id: string;
  quoteNo: string;
  date: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  grandTotal: number;
  status: string;
  assignedToName: string | null;
  createdAt: string;
  items?: any[];
  subtotal?: number;
}

export const AdminRFQs: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Retrieve current admin details
  const currentAdminStr = localStorage.getItem('siddhi_admin_user');
  const currentAdmin = currentAdminStr ? JSON.parse(currentAdminStr) : null;
  const isAdmin = currentAdmin?.role === 'Admin' || currentAdmin?.role === 'Super Admin';

  const fetchData = async () => {
    setLoading(true);
    try {
      // If Sales Exec, only fetch assigned RFQs
      const url = isAdmin 
        ? 'http://localhost:5000/api/rfqs'
        : `http://localhost:5000/api/rfqs?assignedTo=${currentAdmin?._id}`;

      const [rfqRes, userRes] = await Promise.all([
        fetch(url),
        fetch('http://localhost:5000/api/admin/users')
      ]);
      
      if (rfqRes.ok) {
        setRfqs(await rfqRes.json());
        setSelectedIds([]);
      }
      if (userRes.ok) {
        const allUsers: User[] = await userRes.json();
        setUsers(allUsers.filter(u => u.role.includes('Sales')));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (rfqId: string, userId: string) => {
    const selectedUser = users.find(u => u._id === userId);
    if (!selectedUser) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/rfqs/${rfqId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedTo: userId, assignedToName: selectedUser.name })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this RFQ?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/rfqs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(rfqs.map(r => r._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} RFQs?`)) return;
    try {
      const res = await fetch('http://localhost:5000/api/rfqs/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchData();
      }
    } catch (error) {
      console.error('Bulk delete failed', error);
    }
  };

  const handleExportCSV = () => {
    if (rfqs.length === 0) return;
    const headers = ['Quote No', 'Date', 'Customer Name', 'Company', 'Email', 'Phone', 'Total', 'Status', 'Assigned To'];
    const rows = rfqs.map(r => [
      r.quoteNo,
      r.date || new Date(r.createdAt).toLocaleDateString(),
      r.customerName,
      r.companyName,
      r.email,
      r.phone,
      r.grandTotal || 0,
      r.status,
      r.assignedToName || 'Unassigned'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(item => `"${item}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RFQs_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">RFQ Management</h2>
          <p className="text-sm text-slate-500">
            {isAdmin ? 'View and assign customer quotation requests.' : 'View RFQs assigned to you.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex-shrink-0 flex items-center px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200 text-sm"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors font-medium text-sm border border-emerald-200"
          >
            <Download size={16} />
            Export Excel
          </button>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                {isAdmin && (
                  <th className="py-3 px-4 w-12 font-semibold">
                    <input 
                      type="checkbox" 
                      checked={rfqs.length > 0 && selectedIds.length === rfqs.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer w-4 h-4"
                    />
                  </th>
                )}
                <th className="py-3 px-4 font-semibold">RFQ Number</th>
                <th className="py-3 px-4 font-semibold">Company</th>
                <th className="py-3 px-4 font-semibold">Total (₹)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                {isAdmin && <th className="py-3 px-4 font-semibold">Assigned To</th>}
                <th className="py-3 px-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 5} className="py-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
                    Loading RFQs...
                  </td>
                </tr>
              ) : rfqs.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 5} className="py-12 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No RFQs Found</h3>
                  </td>
                </tr>
              ) : (
                rfqs.map((rfq) => (
                  <tr key={rfq._id} className="hover:bg-slate-50 transition-colors">
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(rfq._id)}
                          onChange={() => handleSelectOne(rfq._id)}
                          className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer w-4 h-4"
                        />
                      </td>
                    )}
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">{rfq.quoteNo}</td>
                    <td className="py-3 px-4 text-slate-900 font-medium">{rfq.companyName}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">₹{rfq.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4">
                      <select 
                        value={rfq.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const res = await fetch(`http://localhost:5000/api/rfqs/${rfq._id}/status`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: newStatus })
                            });
                            if (res.ok) fetchData();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className={`text-xs font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer ${
                          rfq.status === 'Open' || rfq.status === 'New' || rfq.status === 'RFQ Submitted'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : rfq.status === 'Under Review' || rfq.status === 'Assigned'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : rfq.status === 'Processing' || rfq.status === 'Process By Sales'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <select 
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-700"
                          value={rfq.assignedToName || ''}
                          onChange={(e) => {
                            const userId = e.target.options[e.target.selectedIndex].getAttribute('data-id');
                            if (userId) handleAssign(rfq._id, userId);
                          }}
                        >
                          <option value="">Unassigned</option>
                          {users.map(u => (
                            <option key={u._id} data-id={u._id} value={u.name}>{u.name}</option>
                          ))}
                        </select>
                      </td>
                    )}
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => setSelectedRfq(rfq)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors mr-2" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(rfq._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                          title="Delete RFQ"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRfq && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-xl font-bold text-slate-800">Quotation Details: {selectedRfq.quoteNo}</h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-sm print:hidden"
                >
                  <Printer size={16} />
                  Print PDF
                </button>
                <button onClick={() => setSelectedRfq(null)} className="text-slate-400 hover:text-slate-600 print:hidden">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto print:overflow-visible print:h-auto print:max-h-none print:p-0">
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500 font-medium">Customer Details</p>
                  <p className="font-bold text-slate-800">{selectedRfq.companyName}</p>
                  <p className="text-slate-600">{selectedRfq.customerName}</p>
                  <p className="text-slate-600">{selectedRfq.email} | {selectedRfq.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 font-medium">Date / Status</p>
                  <p className="font-bold text-slate-800">{selectedRfq.date}</p>
                  <p className="text-slate-600">{selectedRfq.status}</p>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 mb-3 uppercase tracking-wider text-xs">Requested Items</h4>
              {selectedRfq.items && selectedRfq.items.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 font-semibold text-slate-600">Part No</th>
                        <th className="py-2 px-3 font-semibold text-slate-600">Description</th>
                        <th className="py-2 px-3 font-semibold text-slate-600">Brand</th>
                        <th className="py-2 px-3 font-semibold text-slate-600 text-right">Qty</th>
                        <th className="py-2 px-3 font-semibold text-slate-600 text-right">Unit Price</th>
                        <th className="py-2 px-3 font-semibold text-slate-600 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRfq.items.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono">{item.partNo}</td>
                          <td className="py-2 px-3">{item.name}</td>
                          <td className="py-2 px-3">{item.brand}</td>
                          <td className="py-2 px-3 text-right">{item.qty}</td>
                          <td className="py-2 px-3 text-right">₹{item.unitPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="py-2 px-3 text-right font-medium">₹{item.totalBeforeTax?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No items found for this quotation.</p>
              )}

              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{selectedRfq.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 text-lg border-t border-slate-200 pt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{selectedRfq.grandTotal?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedRfq(null)} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
