import React, { useState } from 'react';
import { Bus as BusIcon, Plus, Edit, Trash2, ShieldCheck, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Bus } from '../../types';

export const BusManagementPage: React.FC = () => {
  const { buses, addBus, updateBus, deleteBus } = useSchoolData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busNumber, setBusNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<'Standard Bus' | 'Mini Bus' | 'Van'>('Standard Bus');
  const [capacity, setCapacity] = useState(30);
  const [driverName, setDriverName] = useState('Sanjay Das');
  const [driverPhone, setDriverPhone] = useState('+91 98322 78901');
  const [helperName, setHelperName] = useState('Mita Ghosh');
  const [helperPhone, setHelperPhone] = useState('+91 98322 78902');
  const [routeName, setRouteName] = useState('Route A');

  const handleCreateBus = (e: React.FormEvent) => {
    e.preventDefault();
    addBus({
      busNumber,
      vehicleNumber,
      vehicleType,
      capacity: Number(capacity),
      driverId: 'drv_001',
      driverName,
      driverPhone,
      helperName,
      helperPhone,
      routeId: 'route_001',
      routeName,
      insuranceExpiry: '2027-05-15',
      fitnessExpiry: '2027-04-10',
      status: 'Active',
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Fleet Administration</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-blue-600">Buses</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            School Bus Fleet & Fitness Management
          </h1>
          <p className="text-xs text-slate-500">
            Vehicle registration, regulatory fitness certifications, seating capacity and crew assignments
          </p>
        </div>

        <button
          onClick={() => {
            setBusNumber(`Bus 0${buses.length + 1}`);
            setVehicleNumber(`WB-16D-${Math.floor(1000 + Math.random() * 9000)}`);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition self-start"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Buses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-2xl bg-[#253B80] text-white">
                    <BusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 leading-tight">
                      {bus.busNumber}
                    </h3>
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      {bus.vehicleNumber}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-green-100 text-green-800 uppercase">
                  {bus.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Route:</span>
                  <strong className="text-slate-900 truncate max-w-[170px]">{bus.routeName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seating Capacity:</span>
                  <strong className="text-slate-900">{bus.capacity} Seats</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver & Contact:</span>
                  <strong className="text-slate-900">{bus.driverName} ({bus.driverPhone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bus Helper / Attendant:</span>
                  <strong className="text-slate-900">{bus.helperName}</strong>
                </div>
              </div>

              {/* Compliance Dates */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Fitness Certificate Valid:</span>
                  <span className="font-mono text-slate-800 font-bold">{bus.fitnessExpiry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Insurance Expiry:</span>
                  <span className="font-mono text-slate-800 font-bold">{bus.insuranceExpiry}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> GPS Active
              </span>
              <button
                onClick={() => {
                  if (confirm(`Remove vehicle ${bus.busNumber}?`)) {
                    deleteBus(bus.id);
                  }
                }}
                className="text-xs font-bold text-red-600 hover:text-red-800 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Bus Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Add New School Bus</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBus} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bus Call Sign</label>
                  <input
                    type="text"
                    required
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="e.g. Bus 04"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle License Plate</label>
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="WB-16D-4455"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="Standard Bus">Standard Bus</option>
                    <option value="Mini Bus">Mini Bus</option>
                    <option value="Van">Van / Force Traveller</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Driver Phone</label>
                  <input
                    type="text"
                    required
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#253B80] text-white rounded-xl font-extrabold uppercase"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
