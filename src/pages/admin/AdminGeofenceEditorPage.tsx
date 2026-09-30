import React, { useState } from 'react';
import {
  MapPin,
  Save,
  ShieldCheck,
  Navigation,
  CheckCircle2,
  ChevronRight,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { InteractiveMap } from '../../components/common/InteractiveMap';

export const AdminGeofenceEditorPage: React.FC = () => {
  const { school, updateSchool } = useSchoolData();

  const [schoolRadius, setSchoolRadius] = useState(school.geofenceRadius || 200);
  const [pickupRadius, setPickupRadius] = useState(school.defaultPickupRadius || 100);
  const [dropRadius, setDropRadius] = useState(school.defaultDropRadius || 100);
  const [approachDist, setApproachDist] = useState(school.approachingDistance || 500);

  const [schoolLat, setSchoolLat] = useState(school.latitude || 22.8688);
  const [schoolLng, setSchoolLng] = useState(school.longitude || 88.3638);
  const [cutoffTime, setCutoffTime] = useState(school.transportSkipCutoffTime || '06:30');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      geofenceRadius: Number(schoolRadius),
      defaultPickupRadius: Number(pickupRadius),
      defaultDropRadius: Number(dropRadius),
      approachingDistance: Number(approachDist),
      latitude: Number(schoolLat),
      longitude: Number(schoolLng),
      transportSkipCutoffTime: cutoffTime,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Transport System</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Geofence Radius Engine</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Geofence Map Editor & Proximity Rules
          </h1>
          <p className="text-xs text-slate-500">
            Configure Haversine distance triggers and perimeter circles for safe arrival and approach alerts
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition self-start"
        >
          <Save className="w-4 h-4" />
          Save Geofence Rules
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span>Geofence rules and coordinates updated in system! Real-time trigger thresholds recalibrated.</span>
        </div>
      )}

      {/* Editor Layout: Left Map, Right Radius Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <InteractiveMap
            busPosition={{ latitude: 22.8605, longitude: 88.3565 }}
            schoolPosition={{ latitude: schoolLat, longitude: schoolLng }}
            schoolRadiusMeters={schoolRadius}
            studentPickupPosition={{ latitude: 22.8605, longitude: 88.3565 }}
            studentPickupRadiusMeters={pickupRadius}
            highlightStudentStopName="Jyoti More"
            className="h-[500px] w-full"
          />

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Blue circle represents <strong>School Perimeter ({schoolRadius}m)</strong>. Green circle represents <strong>Pickup Zone ({pickupRadius}m)</strong>.
            </span>
            <span className="font-mono text-slate-400 text-[11px]">Formula: Haversine Trigonometric Great-Circle</span>
          </div>
        </div>

        {/* Sliders & Coordinates Panel */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">Configurable Parameters</h3>
          </div>

          {/* 1. School Geofence Radius */}
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>School Geofence Radius</span>
              <span className="text-blue-700 font-mono">{schoolRadius} meters</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={schoolRadius}
              onChange={(e) => setSchoolRadius(Number(e.target.value))}
              className="w-full accent-[#253B80]"
            />
            <span className="text-[10px] text-slate-400">Triggers “Bus approaching school” alert</span>
          </div>

          {/* 2. Default Student Pickup Radius */}
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Default Pickup Stop Radius</span>
              <span className="text-green-700 font-mono">{pickupRadius} meters</span>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={pickupRadius}
              onChange={(e) => setPickupRadius(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <span className="text-[10px] text-slate-400">Triggers “Your child’s bus arrived nearby”</span>
          </div>

          {/* 3. Approaching Distance */}
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Approaching Alert Distance</span>
              <span className="text-amber-700 font-mono">{approachDist} meters</span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="50"
              value={approachDist}
              onChange={(e) => setApproachDist(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <span className="text-[10px] text-slate-400">Early reminder to prepare child before arrival</span>
          </div>

          {/* 4. Parent Skip Cutoff Time */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-700 mb-1">
              Parent Transport Skip Daily Cutoff Time
            </label>
            <input
              type="time"
              value={cutoffTime}
              onChange={(e) => setCutoffTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
            />
            <span className="text-[10px] text-slate-400">Default: 06:30 AM before departure</span>
          </div>

          {/* 5. School Coordinates */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="font-bold text-slate-700 block">School Center Point Coordinates</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={schoolLat}
                  onChange={(e) => setSchoolLat(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={schoolLng}
                  onChange={(e) => setSchoolLng(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition"
          >
            Apply Geofence Settings
          </button>
        </form>
      </div>
    </div>
  );
};
