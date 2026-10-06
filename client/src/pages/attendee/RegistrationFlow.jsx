import React, { useState } from 'react';
import { X, Tag, Check, Ticket, AlertCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const RegistrationFlow = ({ event, onClose, onSuccess }) => {
  const ticketTypes = event.ticketTypes && event.ticketTypes.length > 0
    ? event.ticketTypes
    : [
        { _id: 't-early', name: 'Early Bird Pass', price: 99, description: 'Standard 3-day conference access' },
        { _id: 't-vip', name: 'VIP Executive Pass', price: 299, description: 'VIP lounge, front-row seats & speaker dinner' }
      ];

  const [selectedTicket, setSelectedTicket] = useState(ticketTypes[0] || null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [error, setError] = useState(null);

  const eventId = event._id || event.id;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setError(null);
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        eventId,
        ticketPrice: selectedTicket?.price || 0
      });
      const data = res.data;
      const disc = data.discountAmount || 0;
      setDiscount(disc);
      setCouponMessage(data.message || `Coupon applied: $${disc} discount`);
      toast.success(data.message || 'Coupon applied successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired coupon code';
      setError(msg);
      setDiscount(0);
      setCouponMessage('');
      toast.error(msg);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRegister = async () => {
    if (!selectedTicket) {
      setError('Please select a ticket tier');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const ticketTypeId = selectedTicket._id || selectedTicket.id;
      const response = await api.post('/registrations', {
        eventId,
        ticketTypeId,
        couponCode: couponCode ? couponCode.trim().toUpperCase() : undefined
      });

      const ticketId = response.data?.ticketId || response.data?.data?._id;
      toast.success('Registration confirmed! Official QR pass generated.');
      onSuccess(ticketId);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = selectedTicket ? selectedTicket.price : 0;
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <div className="fixed inset-0 bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-secondary-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-secondary-100 flex items-center justify-between bg-secondary-50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 bg-primary-100/60 px-2.5 py-0.5 rounded-full">
              Registration Pass
            </span>
            <h2 className="text-xl font-bold text-secondary-900 mt-1 line-clamp-1">
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-secondary-400 hover:text-secondary-700 hover:bg-secondary-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Ticket Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700">
              Select Ticket Tier
            </label>
            <div className="space-y-2.5">
              {ticketTypes.map(ticket => {
                const tId = ticket._id || ticket.id;
                const isSelected = selectedTicket?._id === tId || selectedTicket?.id === tId;
                return (
                  <div
                    key={tId}
                    onClick={() => { setSelectedTicket(ticket); setDiscount(0); setCouponMessage(''); }}
                    className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50/50 shadow-sm'
                        : 'border-secondary-200 hover:border-secondary-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary-600 bg-primary-600' : 'border-secondary-300'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-secondary-900 text-sm">{ticket.name}</h4>
                        <p className="text-xs text-secondary-500">{ticket.description || 'Full 3-day access'}</p>
                      </div>
                    </div>
                    <span className="text-lg font-extrabold text-secondary-900">${ticket.price}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promo Coupon Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-700">
                Promo Code
              </label>
              <span className="text-[11px] text-secondary-400">Try code: TECH2026</span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-secondary-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TECH2026"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-secondary-300 text-sm font-mono uppercase focus:border-primary-500"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleApplyCoupon}
                isLoading={validatingCoupon}
                className="font-bold bg-secondary-100 hover:bg-secondary-200"
              >
                Apply
              </Button>
            </div>
            {couponMessage && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5" />
                {couponMessage}
              </p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-secondary-50 rounded-2xl p-4 border border-secondary-200 space-y-2 text-xs">
            <div className="flex justify-between text-secondary-600">
              <span>Ticket Tier</span>
              <span className="font-semibold text-secondary-900">{selectedTicket?.name || 'Selected Pass'}</span>
            </div>
            <div className="flex justify-between text-secondary-600">
              <span>Standard Price</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-secondary-200 flex justify-between items-center text-sm">
              <span className="font-bold text-secondary-900">Total Due</span>
              <span className="text-xl font-extrabold text-primary-700">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-secondary-100 bg-secondary-50 flex items-center justify-between gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleRegister}
            isLoading={loading}
            className="flex-1 font-bold shadow-md shadow-primary-600/20"
          >
            Confirm & Issue Pass (${finalTotal.toFixed(2)})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFlow;
