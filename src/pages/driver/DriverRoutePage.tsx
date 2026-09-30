import React from 'react';
import {
  Navigation,
  Bus,
  CheckCircle2,
  Phone,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Users,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';
import { formatDistance } from '../../utils/geo';

export const DriverRoutePage: React.FC = () => {
  const { students, routes } = useSchoolData();
  const { trip, boardStudent, dropStudent } = useTransport();

  const route = routes.find((r) => r.id === trip.routeId) || routes[0];
  const isMorning = trip.tripType === 'morning_pickup';

  const handleOpenGoogleMaps = (lat: number, lng: number) => {
    // Mobile navigation intent
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Route A Manifest</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">
              {isMorning ? 'Morning Boarding List' : 'Afternoon Drop List'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Stop-by-Stop Student Boarding
          </h1>
          <p className="text-xs text-slate-500">
            Touch-friendly confirmation for Driver Sanjay Das & Helper Mita Ghosh
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold">
            {trip.boardedStudentIds.length} / {students.length} Confirmed
          </span>
        </div>
      </div>

      {/* Stop by Stop List */}
      <div className="space-y-6">
        {route.stops.map((stop, stopIdx) => {
          // Find students assigned to this stop
          const stopStudents = students.filter(
            (s) => s.pickupStopId === stop.id || stop.assignedStudentIds.includes(s.id)
          );

          const isCurrentStop = trip.currentStopIndex === stopIdx;

          return (
            <div
              key={stop.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs transition-all ${
                isCurrentStop ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200/80'
              }`}
            >
              {/* Stop Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                      isCurrentStop
                        ? 'bg-[#253B80] text-white shadow-md'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {stopIdx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Stop {stopIdx + 1} &bull; {isMorning ? stop.expectedPickupTime : stop.expectedDropTime}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {stop.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenGoogleMaps(stop.latitude, stop.longitude)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  NAVIGATE
                </button>
              </div>

              {/* Students at this stop */}
              {stopStudents.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  No registered kindergarten pickups at this campus point.
                </p>
              ) : (
                <div className="space-y-3">
                  {stopStudents.map((st) => {
                    const isBoarded = trip.boardedStudentIds.includes(st.id);
                    const isDropped = trip.droppedStudentIds.includes(st.id);
                    const isOnLeave = st.currentTransportStatus === 'SCHOOL_LEAVE';
                    const isSkipped = st.currentTransportStatus === 'TRANSPORT_SKIP';

                    return (
                      <div
                        key={st.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isOnLeave
                            ? 'bg-amber-50/50 border-amber-200'
                            : isSkipped
                            ? 'bg-blue-50/50 border-blue-200'
                            : isBoarded || isDropped
                            ? 'bg-green-50/50 border-green-200'
                            : 'bg-slate-50/60 border-slate-200'
                        }`}
                      >
                        {/* Student details */}
                        <div className="flex items-center gap-3">
                          <img
                            src={st.photoUrl}
                            alt={st.fullName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-slate-900">
                                {st.fullName}
                              </h4>
                              <span className="text-[11px] font-semibold text-slate-500">
                                ({st.class}-{st.section})
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Parent: {st.parentName} &bull; <span className="font-mono">{st.parentPhone}</span>
                            </p>
                          </div>
                        </div>

                        {/* Status Action / Touch-friendly Button */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* Case 1: Approved Leave */}
                          {isOnLeave && (
                            <span className="px-4 py-2.5 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-xs uppercase tracking-wide border border-amber-200">
                              ON LEAVE &bull; DO NOT STOP
                            </span>
                          )}

                          {/* Case 2: Transport Skip Today */}
                          {isSkipped && (
                            <span className="px-4 py-2.5 rounded-xl bg-blue-100 text-blue-900 font-extrabold text-xs uppercase tracking-wide border border-blue-200">
                              TRANSPORT SKIP &bull; SELF DROP
                            </span>
                          )}

                          {/* Case 3: Normal Boarding / Drop Buttons */}
                          {!isOnLeave && !isSkipped && (
                            <>
                              {isMorning ? (
                                isBoarded ? (
                                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white font-black text-xs uppercase shadow-xs">
                                    <CheckCircle2 className="w-4 h-4" />
                                    BOARDED
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => boardStudent(st.id)}
                                    className="px-6 py-3 bg-[#253B80] hover:bg-[#1C2C60] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                                  >
                                    BOARD
                                  </button>
                                )
                              ) : isDropped ? (
                                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-black text-xs uppercase shadow-xs">
                                  <CheckCircle2 className="w-4 h-4" />
                                  DROPPED
                                </span>
                              ) : (
                                <button
                                  onClick={() => dropStudent(st.id)}
                                  className="px-6 py-3 bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition"
                                >
                                  DROP
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
