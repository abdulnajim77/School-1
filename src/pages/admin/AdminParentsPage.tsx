import React, { useState } from 'react';
import { UserCheck, Phone, Mail, MapPin, Users, ChevronRight, Search } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';

export const AdminParentsPage: React.FC = () => {
  const { students } = useSchoolData();
  const [searchTerm, setSearchTerm] = useState('');

  // Unique parents extracted from students
  const parentMap = new Map();
  students.forEach((s) => {
    if (!parentMap.has(s.parentId)) {
      parentMap.set(s.parentId, {
        id: s.parentId,
        name: s.parentName,
        phone: s.parentPhone,
        email: `${s.parentName.toLowerCase().replace(/[^a-z]/g, '')}@demo.com`,
        address: s.address,
        children: [s],
        emergencyContact: s.emergencyContact,
        status: 'Active',
      });
    } else {
      const p = parentMap.get(s.parentId);
      p.children.push(s);
    }
  });

  const parentsList = Array.from(parentMap.values()).filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-20">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Administration</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">Parents</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          Parent Directory & Guardian Accounts
        </h1>
        <p className="text-xs text-slate-500">
          Registered guardians, verified contact numbers and linked student wards
        </p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search parent by name or mobile..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {parentsList.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-blue-800 text-sm">
                    {p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                      {p.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">{p.phone}</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                  {p.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{p.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{p.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Emergency: {p.emergencyContact}</span>
                </div>
              </div>

              {/* Linked Children */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Linked Student Wards:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.children.map((child: any) => (
                    <span
                      key={child.id}
                      className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200"
                    >
                      {child.fullName} ({child.class}-{child.section})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">Portal Access: Enabled</span>
              <a href={`tel:${p.phone}`} className="text-blue-600 font-bold hover:underline">
                Call Guardian
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
