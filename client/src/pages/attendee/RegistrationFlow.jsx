import React, { useState } from 'react';
import api from '../../services/api';

const RegistrationFlow = ({ event, onClose, onSuccess }) => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const ticketTypes = event.ticketTypes || [];

    const handleApplyCoupon = async () => {
        try {
            const response = await api.post('/coupons/validate', { code: couponCode, eventId: event.id });
            setDiscount(response.data.discountAmount || 0);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid coupon');
            setDiscount(0);
        }
    };

    const handleRegister = async () => {
        if (!selectedTicket) {
            setError('Please select a ticket type');
            return;
        }
        
        setLoading(true);
        try {
            const response = await api.post('/registrations', {
                eventId: event.id,
                ticketTypeId: selectedTicket.id,
                quantity,
                couponCode
            });
            onSuccess(response.data.ticketId);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!selectedTicket) return 0;
        const subtotal = selectedTicket.price * quantity;
        return Math.max(0, subtotal - discount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold">Register for {event.title}</h2>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow space-y-6">
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
                    
                    <div>
                        <h3 className="font-semibold mb-3">Select Ticket</h3>
                        <div className="space-y-3">
                            {ticketTypes.map(ticket => (
                                <label 
                                    key={ticket.id} 
                                    className={`flex items-center justify-between p-4 border rounded cursor-pointer ${selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center">
                                        <input 
                                            type="radio" 
                                            name="ticketType" 
                                            value={ticket.id}
                                            checked={selectedTicket?.id === ticket.id}
                                            onChange={() => setSelectedTicket(ticket)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">{ticket.name}</div>
                                            <div className="text-sm text-gray-500">{ticket.description}</div>
                                        </div>
                                    </div>
                                    <div className="font-bold">${ticket.price}</div>
                                </label>
                            ))}
                            {ticketTypes.length === 0 && <p>No tickets available.</p>}
                        </div>
                    </div>

                    {selectedTicket && (
                        <div>
                            <h3 className="font-semibold mb-3">Quantity</h3>
                            <select 
                                value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="border rounded p-2 w-full"
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedTicket && (
                        <div>
                            <h3 className="font-semibold mb-3">Coupon Code</h3>
                            <div className="flex space-x-2">
                                <input 
                                    type="text" 
                                    value={couponCode} 
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter coupon code"
                                    className="border rounded p-2 flex-grow"
                                />
                                <button 
                                    type="button" 
                                    onClick={handleApplyCoupon}
                                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Apply
                                </button>
                            </div>
                            {discount > 0 && <p className="text-green-600 mt-2 text-sm">Discount applied: -${discount}</p>}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                    <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="text-2xl font-bold ml-2">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            onClick={handleRegister}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading || !selectedTicket}
                        >
                            {loading ? 'Processing...' : 'Complete Registration'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationFlow;
