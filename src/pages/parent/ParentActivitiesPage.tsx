import React, { useState } from 'react';
import { Sparkles, Heart, Calendar, ChevronRight } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';

export const ParentActivitiesPage: React.FC = () => {
  const { activities } = useSchoolData();
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  const handleLike = (id: string, initialLikes: number) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialLikes) + 1,
    }));
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>School Life</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-blue-600">Activities Gallery</span>
        </div>
        <h1 className="text-2xl font-black text-[#172033] tracking-tight">
          School Activities & Celebrations
        </h1>
        <p className="text-xs text-slate-500">
          Photo memories, sports, arts and circle time moments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activities.map((act) => {
          const currentLikes = likesMap[act.id] ?? act.likes;

          return (
            <div
              key={act.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white font-bold text-[10px] rounded-full uppercase">
                    {act.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {act.date}
                  </div>
                  <h3 className="font-extrabold text-base text-[#172033] leading-snug">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between">
                <button
                  onClick={() => handleLike(act.id, act.likes)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition"
                >
                  <Heart className="w-4 h-4 fill-rose-600" />
                  {currentLikes} Appreciations
                </button>
                <span className="text-[11px] text-slate-400">Little Star Academy</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
