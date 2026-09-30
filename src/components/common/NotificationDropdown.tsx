import React from 'react';
import { Bell, ShieldAlert, CheckCircle, Info, AlertTriangle, Bus, BookOpen, CreditCard, Calendar } from 'lucide-react';
import { NotificationItem, NotificationPriority } from '../../types';
import { useTransport } from '../../context/TransportContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead, markNotificationRead } = useTransport();

  if (!isOpen) return null;

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'EMERGENCY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 animate-pulse">
            <ShieldAlert className="w-3 h-3" /> EMERGENCY
          </span>
        );
      case 'SAFETY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> SAFETY
          </span>
        );
      case 'IMPORTANT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3" /> IMPORTANT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
            <Info className="w-3 h-3" /> INFO
          </span>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transport':
      case 'Safety':
        return <Bus className="w-4 h-4 text-blue-600" />;
      case 'Academic':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'Fee':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'Emergency':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      {/* Dropdown panel */}
      <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="px-4 py-3 bg-[#F6F8FC] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#253B80]" />
            <h3 className="text-sm font-bold text-[#172033]">Notifications</h3>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-700 rounded-full">
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>
          <button
            onClick={markAllNotificationsRead}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No notifications yet</div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3.5 hover:bg-slate-50 transition cursor-pointer ${
                  !item.read ? 'bg-blue-50/40' : ''
                } ${item.priority === 'EMERGENCY' ? 'bg-red-50/50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{item.message}</p>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(item.priority)}
                      <span className="text-[10px] text-slate-400">{item.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
