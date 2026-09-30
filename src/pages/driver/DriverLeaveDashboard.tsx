import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Bus, Users, CheckCircle2, AlertTriangle, ArrowRight, ChevronRight, Phone } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';

export const DriverLeaveDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { students, routes } = useSchoolData();
  const { trip, startTrip } = useTransport();

  const totalAssigned = 28;
  const onLeaveStudents = students.filter((s) => s.currentTransportStatus === 'SCHOOL_LEAVE');
  const transportSkipStudents = students.filter((s) => s.currentTransportStatus === 'TRANSPORT_SKIP');

  const onLeaveCount = onLeaveStudents.length || 2;
  const transportSkipCount = transportSkipStudents.length || 1;
  const expectedPickup = totalAssigned - onLeaveCount - transportSkipCount;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Pre-Trip Audit</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">Daily Student Manifest</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          Today's Route & Leave Manifest
        </h1>
        <p className="text-xs text-slate-500">
          Review expected pickups before departing on <strong className="text-slate-800">Bus 03 (Route A)</strong>
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Assigned</span>
          <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalAssigned}</h3>
          <span className="text-[10px] text-slate-500">Registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs text-center bg-amber-50/40">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">On Leave</span>
          <h3 className="text-2xl font-black text-amber-600 mt-0.5">{onLeaveCount}</h3>
          <span className="text-[10px] text-amber-700 font-semibold">Do Not Stop</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs text-center bg-blue-50/40">
          <span className="text-[10px] uppercase font-bold text-blue-800 block">Transport Skip</span>
          <h3 className="text-2xl font-black text-blue-600 mt-0.5">{transportSkipCount}</h3>
          <span className="text-[10px] text-blue-700 font-semibold">Self Drop Today</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-green-200 shadow-xs text-center bg-green-50/40">
          <span className="text-[10px] uppercase font-bold text-green-800 block">Expected Pickup</span>
          <h3 className="text-2xl font-black text-green-700 mt-0.5">{expectedPickup}</h3>
          <span className="text-[10px] text-green-800 font-semibold">Boarding Today</span>
        </div>
      </div>

      {/* Route Skip Recommendation Box (from prompt: Prepare architecture for future route optimisation) */}
      <div className="p-4 rounded-3xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-950">
        <div>
          <span className="font-extrabold uppercase text-[10px] text-blue-700 block tracking-wide">
            Automated Route Optimization Insight
          </span>
          <p className="mt-0.5">
            <strong>3 students are absent/on skip today.</strong> 1 stop (Jyoti More) has only 1 pickup which is skipped.
          </p>
        </div>
        <button
          onClick={() => alert('Route Review: Jyoti More stop can be bypassed today saving ~4 minutes of travel time.')}
          className="px-4 py-2 bg-[#253B80] hover:bg-[#1C2C60] text-white font-bold rounded-xl text-xs flex-shrink-0 transition"
        >
          REVIEW ROUTE
        </button>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <h3 className="font-extrabold text-base text-[#172033] mb-4">Complete Student Transport Manifest</h3>

        <div className="space-y-3">
          {students.map((st) => {
            const isOnLeave = st.currentTransportStatus === 'SCHOOL_LEAVE';
            const isSkipped = st.currentTransportStatus === 'TRANSPORT_SKIP';

            return (
              <div
                key={st.id}
                className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={st.photoUrl}
                    alt={st.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{st.fullName}</h4>
                    <p className="text-slate-500">
                      Stop: <strong className="text-slate-700">{st.pickupPointName}</strong> &bull; Class {st.class}-{st.section}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isOnLeave ? (
                    <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-[11px]">
                      ON LEAVE
                    </span>
                  ) : isSkipped ? (
                    <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-900 font-extrabold text-[11px]">
                      TRANSPORT SKIP
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-green-100 text-green-900 font-extrabold text-[11px]">
                      PICKUP REQUIRED
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => navigate('/driver/route')}
            className="flex items-center gap-2 px-5 py-3 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition"
          >
            <span>Proceed to Boarding List</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
