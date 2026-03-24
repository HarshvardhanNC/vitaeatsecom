import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { CheckCircle, Printer, ArrowLeft } from 'lucide-react';

const Invoice = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/payment/invoice/${orderId}`, config);
        setOrder(data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch invoice details.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchInvoice();
  }, [orderId, user]);

  if (loading) return <div className="container mt-8 text-center">Loading Invoice...</div>;
  if (!order) return <div className="container mt-8 text-center">Invoice not found or unauthorized.</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
    <style>{`
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; padding: 0 !important; margin: 0 !important; }
        .card { box-shadow: none !important; border: 1px solid #e2e8f0 !important; padding: 1.5rem !important; }
        .container { margin: 0 !important; max-width: 100% !important; }
      }
    `}</style>
    <div className="container mt-8 mb-12">
      <div className="flex justify-between items-center mb-6 no-print">
        <Link to="/user/profile" className="btn btn-outline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Profile
        </Link>
        <button onClick={handlePrint} className="btn btn-primary flex items-center gap-2">
          <Printer size={18} /> Print / Save as PDF
        </button>
      </div>

      <div className="card" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto', borderTop: '8px solid var(--primary)' }}>
        <div className="flex justify-between items-start mb-8 border-b pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-1px' }}>VitaEats</h1>
            <p style={{ color: 'var(--text-muted)' }}>Healthy & Organic Food Delivery</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>INVOICE</h2>
            <p style={{ fontWeight: '500' }}>#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
            <p style={{ color: 'var(--text-muted)' }}>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Billed To:</h3>
            <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{order.user?.name}</p>
            <p style={{ color: 'var(--text-muted)' }}>{order.user?.email}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Payment Status:</h3>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontWeight: '600' }}>
              <CheckCircle size={16} /> {order.paymentStatus === 'Success' ? 'PAID' : order.paymentStatus.toUpperCase()}
            </div>
            {order.paymentId && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Txn ID: {order.paymentId}</p>}
          </div>
        </div>

        {order.shippingAddress && (
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 no-print">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Delivery Address:</h3>
            <p style={{ color: 'var(--text-muted)' }}>{order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.zip}</p>
          </div>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Item Description</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>Qty</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)' }}>Price</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-muted)' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '300px' }}>
            <div className="flex justify-between mb-2">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>₹{(order.totalAmount - 40).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span style={{ color: 'var(--text-muted)' }}>Delivery Charge</span>
              <span>₹40.00</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between mb-4 text-green-600 font-semibold">
                <span>Discount Applied</span>
                <span>-₹{order.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between" style={{ padding: '1rem 0', borderTop: '2px solid var(--text-main)', fontSize: '1.3rem', fontWeight: '700' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <p>Thank you for choosing VitaEats for your healthy meals!</p>
          <p>For any queries, please contact support@vitaeats.com</p>
        </div>
      </div>
    </div>
    </>
  );
};
export default Invoice;
