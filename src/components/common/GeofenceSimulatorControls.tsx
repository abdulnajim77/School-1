import React, { useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Navigation, ShieldCheck, ChevronDown, ChevronUp, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTransport } from '../../context/TransportContext';

export const GeofenceSimulatorControls: React.FC = () => {
  const {
    trip,
    isSimulating,
    simulationSpeed,
    toggleSimulation,
    setSimulationSpeed,
    jumpToStep,
    resetTrip,
    startTrip,
  } = useTransport();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      {/* Collapsed Pill Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#253B80] hover:bg-[#1E3066] text-white rounded-full shadow-xl border-2 border-white transition-all transform hover:scale-105"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
          </span>
          <span className="text-xs font-bold tracking-wide">Demo GPS & Geofence Simulator</span>
          <ChevronUp className="w-4 h-4 ml-1" />
        </button>
      )}

      {/* Expanded Control Drawer */}
      {isOpen && (
        <div className="w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#253B80] px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-300" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Demo Simulation Panel</h4>
                <p className="text-[11px] text-blue-200">Trigger live GPS & Geofencing events</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-200 hover:text-white p-1 rounded-lg"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3.5 text-xs text-slate-700">
            {/* Play/Pause & Speed */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSimulation}
                  className={`p-2 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                    isSimulating
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isSimulating ? 'Pause GPS' : 'Resume GPS'}
                </button>

                <button
                  onClick={resetTrip}
                  title="Reset Simulation"
                  className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed Pills */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimulationSpeed(spd)}
                    className={`px-2 py-0.5 rounded font-bold transition text-[11px] ${
                      simulationSpeed === spd
                        ? 'bg-[#253B80] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Trigger Step Buttons */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Instant Geofence Event Triggers:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => jumpToStep('start')}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-lg transition text-[11px] font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  1. Trip Start (Station)
                </button>
                <button
                  onClick={() => jumpToStep('approaching_riya')}
                  className="p-2 text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition text-[11px] font-semibold text-blue-900 flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 text-blue-600" />
                  2. 500m Approaching
                </button>
                <button
                  onClick={() => jumpToStep('at_riya')}
                  className="p-2 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition text-[11px] font-semibold text-green-900 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                  3. 100m Pickup Geofence
                </button>
                <button
                  onClick={() => jumpToStep('boarded_riya')}
                  className="p-2 text-left bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  4. Mark Riya Boarded
                </button>
                <button
                  onClick={() => jumpToStep('approaching_school')}
                  className="p-2 text-left bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition text-[11px] font-semibold text-indigo-900 flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-indigo-600" />
                  5. 200m Near School
                </button>
                <button
                  onClick={() => jumpToStep('at_school')}
                  className="p-2 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition text-[11px] font-semibold text-purple-900 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  6. Reached School
                </button>
              </div>
            </div>

            {/* Trip Type Switcher */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500">Trip Mode:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => startTrip('morning_pickup')}
                  className={`px-2.5 py-1 rounded-md font-semibold ${
                    trip.tripType === 'morning_pickup'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Morning Pickup
                </button>
                <button
                  onClick={() => startTrip('afternoon_drop')}
                  className={`px-2.5 py-1 rounded-md font-semibold ${
                    trip.tripType === 'afternoon_drop'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Afternoon Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
