import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { DataTable } from '../components/DataTable';
import { CreditCard, CheckCircle } from 'lucide-react';

export const PaymentPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const pData = await apiService.getPayments();
    setPayments(pData);
  };

  const handlePay = async (paymentId) => {
    await apiService.payFee(paymentId);
    loadData();
  };

  const columns = [
    { header: 'Student', render: (r) => r.student?.user?.fullName || 'Alex Mercer' },
    { header: 'Roll No', render: (r) => r.student?.rollNumber || 'CS2024001' },
    { header: 'Fee Type', accessor: 'paymentType' },
    { header: 'Amount ($)', render: (r) => `$${Number(r.amount).toFixed(2)}` },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Transaction ID', render: (r) => r.transactionId || '-' },
    {
      header: 'Status',
      render: (r) => (
        <span className={`badge ${r.status === 'PAID' ? 'badge-success' : r.status === 'OVERDUE' ? 'badge-danger' : 'badge-warning'}`}>
          {r.status}
        </span>
      )
    },
    {
      header: 'Action',
      render: (r) => r.status !== 'PAID' ? (
        <button onClick={() => handlePay(r.id)} className="btn btn-primary btn-sm">
          Pay Now
        </button>
      ) : (
        <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 600 }}>Cleared</span>
      )
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hostel Fee & Payment Status</h1>
          <p className="page-subtitle">Track hostel dues, mess charges, and payment receipts</p>
        </div>
      </div>

      <div className="glass-card">
        <DataTable columns={columns} data={payments} />
      </div>
    </div>
  );
};
