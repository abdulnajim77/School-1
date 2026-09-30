import React, { useState } from 'react';
import { Compass, Plus, MapPin, Clock, Users, ArrowUpDown, ChevronRight, X } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { RouteStop } from '../../types';

export const RouteManagementPage: React.FC = () => {
  const { routes, updateRoute, addRouteStop } = useSchoolData();

  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || 'route_001');
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [newStopName, setNewStopName] = useState('');
  const [newStopLat, setNewStopLat] = useState(22.8620);
  const [newStopLng, setNewStopLng] = useState(88.3570);
  const [pickupTime, setPickupTime] = useState('07:52 AM');

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    addRouteStop(selectedRoute.id, {
      name: newStopName,
      latitude: Number(newStopLat),
      longitude: Number(newStopLng),
      expectedPickupTime: pickupTime,
      expectedDropTime: '02:48 PM',
      assignedStudentIds: [],
    });
    setIsAddStopModalOpen(false);
    setNewStopName('');
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const newStops = [...selectedRoute.stops];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newStops.length) return;

    const temp = newStops[index];
    newStops[index] = newStops[targetIdx];
    newStops[targetIdx] = temp;

    // Re-index stop numbers
    const updated = newStops.map((s, idx) => ({ ...s, stopNumber: idx + 1 }));
    updateRoute(selectedRoute.id, { stops: updated });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Fleet Administration</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Routes & Stops</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Bus Route Architecture & Stop Sequences
          </h1>
          <p className="text-xs text-slate-500">
            Define waypoints, reorder morning/afternoon stops and inspect student stop allocations
          </p>
        </div>

        <button
          onClick={() => setIsAddStopModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition self-start"
        >
          <Plus className="w-4 h-4" />
          Add Stop to Route
        </button>
      </div>

      {/* Route Switcher Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {routes.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRouteId(r.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedRouteId === r.id
                ? 'bg-[#253B80] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {r.name} ({r.stops.length} Stops &bull; {r.totalDistanceKm} km)
          </button>
        ))}
      </div>

      {/* Stops Sequence Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-[#172033]">
              {selectedRoute.name} Waypoint Sequence
            </h3>
            <p className="text-xs text-slate-400">
              Start: {selectedRoute.startLocationName} &rarr; End: {selectedRoute.endLocationName}
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            ~{selectedRoute.estimatedDurationMin} Mins Total Trip
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {selectedRoute.stops.map((stop, idx) => (
            <div
              key={stop.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 rounded-xl px-2 transition"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-[#253B80] text-white font-black flex items-center justify-center text-xs flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {stop.name}
                  </h4>
                  <div className="flex items-center gap-3 text-slate-400 text-[11px] mt-0.5">
                    <span>Expected Pickup: <strong className="text-slate-700">{stop.expectedPickupTime}</strong></span>
                    <span>Drop: <strong className="text-slate-700">{stop.expectedDropTime}</strong></span>
                    <span className="font-mono">{stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Reorder and Student Count */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px]">
                  {stop.assignedStudentIds.length} Students
                </span>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveStop(idx, 'up')}
                    className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30"
                    title="Move earlier in route"
                  >
                    &uarr;
                  </button>
                  <button
                    disabled={idx === selectedRoute.stops.length - 1}
                    onClick={() => handleMoveStop(idx, 'down')}
                    className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30"
                    title="Move later in route"
                  >
                    &darr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Stop Modal */}
      {isAddStopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Add Stop to {selectedRoute.name}</h3>
              <button onClick={() => setIsAddStopModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStop} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Stop Name / Landmark</label>
                <input
                  type="text"
                  required
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  placeholder="e.g. French Cemetery Crossing"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newStopLat}
                    onChange={(e) => setNewStopLat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newStopLng}
                    onChange={(e) => setNewStopLng(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Morning Pickup Time</label>
                <input
                  type="text"
                  required
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="07:55 AM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStopModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#253B80] text-white rounded-xl font-extrabold uppercase"
                >
                  Add Stop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
