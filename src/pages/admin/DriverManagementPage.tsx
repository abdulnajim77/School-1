import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, Phone, Mail, Award, ChevronRight, X } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { DriverProfile } from '../../types';

export const DriverManagementPage: React.FC = () => {
  const { drivers, addDriver } = useSchoolData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98322 ');
  const [licenseNumber, setLicenseNumber] = useState('WB16-202000');
  const [licenseExpiry, setLicenseExpiry] = useState('2029-12-31');
  const [assignedBus, setAssignedBus] = useState('bus_003');

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    addDriver({
      name,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
      phone,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.com`,
      licenseNumber,
      licenseExpiry,
      assignedBusId: assignedBus,
      assignedRouteId: 'route_001',
      emergencyContact: '+91 98322 00000',
      status: 'Active',
      rating: 4.9,
      experienceYears: 7,
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
            <span className="font-semibold text-blue-600">Drivers & Helpers</span>
          </div>
          <h1 className="text-2xl font-black text-[#172033] tracking-tight">
            Certified Driver & Staff Roster
          </h1>
          <p className="text-xs text-slate-500">
            Background verified transport drivers, commercial licenses and active route assignments
          </p>
        </div>

        <button
          onClick={() => {
            setName('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#253B80] hover:bg-[#1C2C60] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition self-start"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {drivers.map((drv) => (
          <div
            key={drv.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={drv.photoUrl}
                  alt={drv.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
                />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                    {drv.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">{drv.experienceYears} Years Exp</span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                    <Award className="w-3 h-3" /> {drv.rating} Star Driver
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile Phone:</span>
                  <span className="font-mono font-bold text-slate-900">{drv.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Commercial License:</span>
                  <span className="font-mono text-slate-700">{drv.licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">License Expiry:</span>
                  <span className="font-mono text-slate-700">{drv.licenseExpiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Bus:</span>
                  <strong className="text-blue-700">Bus 03 (WB-16A-1234)</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-green-700 font-bold bg-green-50 px-2.5 py-0.5 rounded-full">
                {drv.status}
              </span>
              <a href={`tel:${drv.phone}`} className="text-blue-600 font-bold hover:underline">
                Call Driver
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Register New Driver</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Driver Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Ghosh"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Driving License No.</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">License Expiry</label>
                  <input
                    type="date"
                    required
                    value={licenseExpiry}
                    onChange={(e) => setLicenseExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
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
                  Save Driver Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
