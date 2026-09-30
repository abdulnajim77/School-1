import React from 'react';
import { Phone, Shield, User, Clock, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

interface CallDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName?: string;
  driverPhone?: string;
  helperName?: string;
  helperPhone?: string;
  busNumber?: string;
}

export const CallDriverModal: React.FC<CallDriverModalProps> = ({
  isOpen,
  onClose,
  driverName = 'Sanjay Das',
  driverPhone = '+91 98322 78901',
  helperName = 'Mita Ghosh',
  helperPhone = '+91 98322 78902',
  busNumber = 'Bus 03',
}) => {
  const { school } = useSchoolData();
  const { trip } = useTransport();

  if (!isOpen) return null;

  const isTripActive = trip.status !== 'NOT_STARTED' && trip.status !== 'COMPLETED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#253B80] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Contact Transport Staff</h3>
              <p className="text-xs text-blue-200">{busNumber} &bull; Route A</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Privacy Protected Calling</span>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Calls are logged for student security. Please call only for urgent transport coordination while the bus is on route.
              </p>
            </div>
          </div>

          {/* Active Trip Status Check */}
          {!isTripActive && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Bus is currently not on an active trip. Calls may be forwarded to the school helpdesk.</span>
            </div>
          )}

          {/* Driver Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                SD
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Main Driver
                </span>
                <h4 className="font-bold text-sm text-slate-900">{driverName}</h4>
                <p className="text-xs text-slate-500 font-mono">
                  {school.driverPhonePrivacy ? '••••• •••01 (Masked)' : driverPhone}
                </p>
              </div>
            </div>

            <a
              href={`tel:${driverPhone}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-sm transition"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          </div>

          {/* Helper Card */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                MG
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Bus Helper / Attendant
                </span>
                <h4 className="font-bold text-sm text-slate-900">{helperName}</h4>
                <p className="text-xs text-slate-500 font-mono">
                  {school.driverPhonePrivacy ? '••••• •••02 (Masked)' : helperPhone}
                </p>
              </div>
            </div>

            <a
              href={`tel:${helperPhone}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-sm transition"
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </a>
          </div>

          {/* School Helpdesk Direct */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              <span className="font-semibold block text-slate-800">School Transport Desk:</span>
              <span className="font-mono text-slate-500">{school.phone}</span>
            </div>
            <a
              href={`tel:${school.phone}`}
              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition"
            >
              Desk Line
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
