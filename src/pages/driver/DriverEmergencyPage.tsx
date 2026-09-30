import React, { useState } from 'react';
import { ShieldAlert, Phone, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

export const DriverEmergencyPage: React.FC = () => {
  const { school } = useSchoolData();
  const { trip, reportEmergency, clearEmergency } = useTransport();

  const [type, setType] = useState('Vehicle Breakdown');
  const [details, setDetails] = useState('');
  const [reported, setReported] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportEmergency(type, details);
    setReported(true);
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Driver Console</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-red-600">Incident Dispatch</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          Report In-Transit Emergency
        </h1>
        <p className="text-xs text-slate-500">
          Broadcast immediate alerts to parents and school authorities for Bus 03
        </p>
      </div>

      {trip.emergencyReported ? (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-6 text-red-900 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-black text-lg">Emergency Broadcast is Active</h3>
              <p className="text-xs text-red-700">Type: {trip.emergencyReported.type}</p>
            </div>
          </div>
          <p className="text-xs bg-white/70 p-3 rounded-xl border border-red-200">
            "{trip.emergencyReported.details}"
          </p>
          <div className="flex gap-2">
            <button
              onClick={clearEmergency}
              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs uppercase rounded-xl shadow-xs"
            >
              Clear Emergency (All Resolved)
            </button>
            <a
              href={`tel:${school.phone}`}
              className="px-4 py-2.5 bg-white border border-red-300 text-red-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> Call Control Room
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Incident Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-red-600"
            >
              <option value="Vehicle Breakdown">Vehicle Breakdown (Flat Tyre / Engine / Electrical)</option>
              <option value="Traffic Delay">Severe Traffic / Road Blockade Delay (&gt;15 Mins)</option>
              <option value="Minor Collision">Minor Collision / Accident (Students Safe)</option>
              <option value="Medical Need">Medical Attention Required for Student</option>
              <option value="Weather / Waterlogging">Waterlogged Street / Weather Diversion</option>
              <option value="Other">Other Operational Issue</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Incident Location & Details</label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Bus 03 has developed a mechanical issue near Strand Road crossing. All students are safe and comfortable inside. Mechanic arriving in 10 minutes."
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-600"
            ></textarea>
          </div>

          <div className="p-3 bg-red-50 text-red-800 rounded-xl text-[11px] leading-relaxed">
            Note: Triggering this broadcast sends high-priority notifications to all parents whose children are assigned to Bus 03 and dispatches school backup.
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            CONFIRM & BROADCAST EMERGENCY ALERT
          </button>
        </form>
      )}
    </div>
  );
};
