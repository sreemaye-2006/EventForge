import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const QRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('qr-reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText) {
            try {
                const data = JSON.parse(decodedText);
                if (data.ticketId && data.eventId) {
                    handleCheckIn(data);
                    scanner.pause(true); // Pause scanning while processing
                } else {
                    showToast('Invalid QR Code format', 'error');
                }
            } catch (e) {
                showToast('Invalid QR Code format', 'error');
            }
        }

        function onScanFailure(error) {
            // Usually just background noise, ignore
        }

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    const handleCheckIn = async (data) => {
        try {
            const response = await api.post('/staff/checkin', { ticketId: data.ticketId, eventId: data.eventId });
            setScanResult(response.data);
            setScanError(null);
            showToast('Check-in successful!', 'success');
        } catch (err) {
            setScanError(err.response?.data?.message || 'Check-in failed');
            setScanResult(null);
            showToast('Check-in failed', 'error');
        }
    };

    const showToast = (message, type) => {
        setToastMessage({ text: message, type });
        setTimeout(() => setToastMessage(null), 3000);
    };

    const resumeScanning = () => {
        setScanResult(null);
        setScanError(null);
        window.location.reload(); 
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">QR Scanner</h1>
                <Link to="/staff/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>

            {toastMessage && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded shadow-lg text-white font-semibold transition-opacity ${toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toastMessage.text}
                </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow border mb-6">
                <div id="qr-reader" className="w-full"></div>
            </div>

            {(scanResult || scanError) && (
                <div className={`p-6 rounded-lg border ${scanResult ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    {scanResult ? (
                        <div>
                            <h3 className="text-xl font-bold text-green-800 mb-2">Check-in Valid</h3>
                            <p className="text-green-700"><strong>Attendee:</strong> {scanResult.attendeeName}</p>
                            <p className="text-green-700"><strong>Ticket Type:</strong> {scanResult.ticketTypeName}</p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-red-800 mb-2">Check-in Error</h3>
                            <p className="text-red-700">{scanError}</p>
                        </div>
                    )}
                    <button 
                        onClick={resumeScanning}
                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                    >
                        Scan Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
