import React, { useState } from 'react';
import {
  Bus,
  Phone,
  Navigation,
  RefreshCw,
  Users,
  Clock,
  ShieldCheck,
  MapPin,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useTransport } from '../../context/TransportContext';
import { InteractiveMap } from '../../components/common/InteractiveMap';
import { LatLng } from '../../utils/geo';

export const AdminLiveTrackingPage: React.FC = () => {
  const { school, buses, drivers, routes } = useSchoolData();
  const { trip } = useTransport();

  const [selectedBusId, setSelectedBusId] = useState<string>('bus_003');

  // Multi-bus fleet positions
  const fleetData = [
    {
      id: 'bus_003',
      busNumber: 'Bus 03',
      vehicleNumber: 'WB-16A-1234',
      driverName: 'Sanjay Das',
      driverPhone: '+91 98322 78901',
      routeName: 'Route A - Chandannagar',
      status: trip.status.replace('_', ' '),
      speed: trip.speed,
      studentsCount: 28,
      position: { latitude: trip.currentLatitude, longitude: trip.currentLongitude },
      lastUpdate: trip.lastUpdated,
    },
    {
      id: 'bus_001',
      busNumber: 'Bus 01',
      vehicleNumber: 'WB-16B-5678',
      driverName: 'Ramesh Mondal',
      driverPhone: '+91 98322 11223',
      routeName: 'Route B - Mankundu',
      status: 'At School',
      speed: 0,
      studentsCount: 27,
      position: { latitude: 22.8688, longitude: 88.3638 },
      lastUpdate: '08:24:12 AM',
    },
    {
      id: 'bus_002',
      busNumber: 'Bus 02',
      vehicleNumber: 'WB-16C-9012',
      driverName: 'Bikash Paul',
      driverPhone: '+91 98322 33445',
      routeName: 'Route C - Chinsurah Court',
      status: 'On Route',
      speed: 26,
      studentsCount: 19,
      position: { latitude: 22.8640, longitude: 88.3580 },
      lastUpdate: '08:28:45 AM',
    },
  ];

  const selectedBus = fleetData.find((b) => b.id === selectedBusId) || fleetData[0];

  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Fleet Operations</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">All Buses Live Map</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          Campus Fleet Live Tracking Radar
        </h1>
        <p className="text-xs text-slate-500">
          Real-time location, speed and safety compliance for all {buses.length} school buses
        </p>
      </div>

      {/* Main Map & Fleet Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveMap
            busPosition={selectedBus.position}
            busHeading={45}
            busSpeed={selectedBus.speed}
            schoolPosition={{ latitude: school.latitude, longitude: school.longitude }}
            schoolRadiusMeters={school.geofenceRadius}
            showAllBuses={fleetData}
            onBusClick={(id) => setSelectedBusId(id)}
            selectedBusId={selectedBusId}
            className="h-[520px] w-full"
          />
        </div>

        {/* Fleet Roster Sidebar */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm text-[#172033] uppercase tracking-wider">
            Active Vehicles ({fleetData.length})
          </h3>

          <div className="space-y-3">
            {fleetData.map((b) => {
              const isSelected = selectedBusId === b.id;

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBusId(b.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#253B80] bg-blue-50/40 shadow-sm ring-2 ring-blue-100'
                      : 'border-slate-200/80 bg-white hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#253B80] text-white">
                        <Bus className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{b.busNumber}</h4>
                        <span className="font-mono text-[11px] text-slate-400">{b.vehicleNumber}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status.includes('On Route') || b.status.includes('EN ROUTE')
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{b.routeName}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-[11px] text-slate-500">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Driver</span>
                      <strong className="text-slate-800 truncate block">{b.driverName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Speed</span>
                      <strong className="text-slate-800">{b.speed} km/h</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Students</span>
                      <strong className="text-slate-800">{b.studentsCount} Kids</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Vehicle Deep Details Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h4 className="font-extrabold text-sm text-slate-900">
              Selected: {selectedBus.busNumber} Telemetry
            </h4>

            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center justify-between">
                <span>Driver Contact:</span>
                <span className="font-mono font-bold text-slate-900">{selectedBus.driverPhone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last GPS Ping:</span>
                <span className="font-mono text-slate-500">{selectedBus.lastUpdate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Current Status:</span>
                <span className="font-bold text-green-700">{selectedBus.status}</span>
              </div>
            </div>

            <a
              href={`tel:${selectedBus.driverPhone}`}
              className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Driver ({selectedBus.driverName})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
