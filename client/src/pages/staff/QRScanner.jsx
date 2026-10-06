import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, CheckCircle2, XCircle, ArrowLeft, Search, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Button from '../../components/ui/Button';

const QRScanner = () => {
  const [manualCode, setManualCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);

  useEffect(() => {
    let html5QrCode;
    const initScanner = async () => {
      try {
        const { Html5QrcodeScanner } = await import('html5-qrcode');
        const scanner = new Html5QrcodeScanner('qr-reader-box', {
          qrbox: { width: 220, height: 220 },
          fps: 10
        });

        scanner.render((decodedText) => {
          handleCheckInCode(decodedText);
        }, () => {});
      } catch (e) {
        // Camera fallback ignored
      }
    };
    initScanner();

    return () => {
      // Cleanup if any
    };
  }, []);

  const handleCheckInCode = async (rawInput) => {
    if (!rawInput || !rawInput.trim()) return;
    setProcessing(true);
    setScanResult(null);
    setScanError(null);

    let ticketId = rawInput.trim();
    let eventId = undefined;

    // Check if input is JSON from QR code
    try {
      const parsed = JSON.parse(rawInput);
      if (parsed.ticketId || parsed.registrationId) {
        ticketId = parsed.ticketId || parsed.registrationId;
        eventId = parsed.eventId;
      }
    } catch (e) {
      // Plain text ticket code
    }

    try {
      // If code starts with REG- search for registration by number
      const response = await api.post('/staff/checkin', {
        ticketId,
        eventId,
        registrationNumber: ticketId
      });

      const data = response.data?.data || response.data;
      setScanResult(data);
      toast.success('Attendee checked in successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Check-in validation failed';
      setScanError(msg);
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleCheckInCode(manualCode);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/dashboard/staff"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-secondary-500 hover:text-primary-600 mb-1 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Staff Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-secondary-900 tracking-tight flex items-center gap-2">
            <QrCode className="w-6 h-6 text-primary-600" />
            Express Check-In & Scanner
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Camera Scanner Box */}
        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-700 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-primary-600" />
            Live Camera Scan
          </h3>
          <div className="bg-secondary-50 p-2 rounded-xl border border-secondary-200 overflow-hidden">
            <div id="qr-reader-box" className="w-full min-h-[220px]" />
          </div>
          <p className="text-[11px] text-secondary-500 text-center">
            Point camera at attendee's digital badge QR code on their phone or printed badge.
          </p>
        </div>

        {/* Right: Manual Registration Code Input */}
        <div className="bg-white p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-secondary-700 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            Manual Registration Code Entry
          </h3>
          <p className="text-xs text-secondary-600 leading-relaxed">
            Search or enter Registration Number (e.g. <code>REG-2026-10000</code>) or Ticket ID.
          </p>

          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="REG-2026-10000"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full rounded-xl border border-secondary-300 px-4 py-2.5 text-sm font-mono font-bold uppercase tracking-wider text-secondary-900 focus:border-primary-500"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              isLoading={processing}
              className="w-full font-bold py-2.5 shadow-sm"
            >
              Verify & Check In
            </Button>
          </form>

          {/* Demo Quick Codes */}
          <div className="pt-3 border-t border-secondary-100">
            <span className="text-[11px] font-bold text-secondary-400 uppercase tracking-wider">Quick Sample Codes:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {['REG-2026-10000', 'REG-2026-10001', 'REG-2026-10002'].map(code => (
                <button
                  key={code}
                  type="button"
                  onClick={() => { setManualCode(code); handleCheckInCode(code); }}
                  className="text-xs font-mono bg-secondary-100 hover:bg-primary-100 text-secondary-800 px-2 py-1 rounded-lg border border-secondary-200 transition"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validation Result Banner */}
      {(scanResult || scanError) && (
        <div className={`p-6 rounded-2xl border-2 transition-all animate-in fade-in zoom-in-95 ${
          scanResult ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          {scanResult ? (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">
                  Valid Check-In Confirmed
                </div>
                <h3 className="text-xl font-extrabold text-emerald-950">{scanResult.attendeeName}</h3>
                <p className="text-xs text-emerald-800 font-medium">
                  <strong>Ticket Pass:</strong> {scanResult.ticketTypeName} • <strong>Event:</strong> {scanResult.eventName}
                </p>
                <p className="text-[11px] text-emerald-700">
                  Checked in at {new Date(scanResult.checkedInAt || Date.now()).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <XCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-800 bg-red-200/60 px-2.5 py-0.5 rounded-full">
                  Check-In Failed
                </div>
                <h3 className="text-lg font-bold text-red-950">{scanError}</h3>
                <p className="text-xs text-red-700">
                  Verify the ticket registration code with platform administration or ensure pass is not already checked in.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
