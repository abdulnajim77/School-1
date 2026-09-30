import React, { useState, useRef, useEffect } from 'react';
import { Bus, MapPin, Navigation, School as SchoolIcon, UserCheck, ShieldCheck, Compass, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { LatLng, formatDistance } from '../../utils/geo';
import { RouteStop } from '../../types';

interface InteractiveMapProps {
  busPosition: LatLng;
  busHeading?: number;
  busSpeed?: number;
  schoolPosition: LatLng;
  schoolRadiusMeters?: number;
  studentPickupPosition?: LatLng;
  studentPickupRadiusMeters?: number;
  studentDropPosition?: LatLng;
  studentDropRadiusMeters?: number;
  stops?: RouteStop[];
  highlightStudentStopName?: string;
  statusLabel?: string;
  className?: string;
  showAllBuses?: {
    id: string;
    busNumber: string;
    vehicleNumber: string;
    driverName: string;
    position: LatLng;
    status: string;
    speed: number;
  }[];
  onBusClick?: (busId: string) => void;
  selectedBusId?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  busPosition,
  busHeading = 0,
  busSpeed = 30,
  schoolPosition,
  schoolRadiusMeters = 200,
  studentPickupPosition,
  studentPickupRadiusMeters = 100,
  stops = [],
  highlightStudentStopName = 'Jyoti More',
  statusLabel = 'On Route',
  className = 'h-96 w-full',
  showAllBuses,
  onBusClick,
  selectedBusId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapTheme, setMapTheme] = useState<'clean' | 'satellite'>('clean');
  const [autoFollow, setAutoFollow] = useState<boolean>(true);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Map coordinate bounds to SVG viewport coordinates (800x550)
  // Center roughly around Chandannagar area: lat ~ 22.852 to 22.872, lng ~ 88.348 to 88.368
  const minLat = 22.8520;
  const maxLat = 22.8710;
  const minLng = 88.3480;
  const maxLng = 88.3665;

  const latToY = (lat: number) => {
    const fraction = (lat - minLat) / (maxLat - minLat);
    return 520 - fraction * 490; // Invert for SVG (higher lat is higher on screen)
  };

  const lngToX = (lng: number) => {
    const fraction = (lng - minLng) / (maxLng - minLng);
    return 30 + fraction * 740;
  };

  // Convert meters to approximate SVG pixel radius
  const metersToPixels = (meters: number) => {
    // Approx 2.1km across ~740px -> 1 meter is ~0.35px
    return Math.max(12, meters * 0.35 * zoomLevel);
  };

  const busX = lngToX(busPosition.longitude);
  const busY = latToY(busPosition.latitude);

  const schoolX = lngToX(schoolPosition.longitude);
  const schoolY = latToY(schoolPosition.latitude);

  const pickupX = studentPickupPosition ? lngToX(studentPickupPosition.longitude) : 0;
  const pickupY = studentPickupPosition ? latToY(studentPickupPosition.latitude) : 0;

  // Road network polyline coordinates
  const roadNetworkPath = `
    M ${lngToX(88.3505)} ${latToY(22.8530)}
    L ${lngToX(88.3510)} ${latToY(22.8550)}
    L ${lngToX(88.3528)} ${latToY(22.8568)}
    L ${lngToX(88.3548)} ${latToY(22.8588)}
    L ${lngToX(88.3565)} ${latToY(22.8605)}
    L ${lngToX(88.3580)} ${latToY(22.8622)}
    L ${lngToX(88.3598)} ${latToY(22.8642)}
    L ${lngToX(88.3615)} ${latToY(22.8665)}
    L ${lngToX(88.3628)} ${latToY(22.8678)}
    L ${lngToX(88.3638)} ${latToY(22.8688)}
  `;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${
        mapTheme === 'clean' ? 'bg-[#EEF2F6]' : 'bg-[#1E293B]'
      } ${className}`}
    >
      {/* Top Floating Overlay Controls */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-semibold text-[#172033] border border-slate-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          GPS LIVE
          <span className="text-slate-400">|</span>
          <span className="text-blue-600 font-bold">{busSpeed} km/h</span>
        </div>

        <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-xs font-medium text-slate-700 border border-slate-200">
          {statusLabel}
        </div>
      </div>

      {/* Top Right Tool Buttons */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
          title="Zoom In"
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
          title="Zoom Out"
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAutoFollow(!autoFollow)}
          title={autoFollow ? 'Auto-follow Bus ON' : 'Auto-follow Bus OFF'}
          className={`p-1.5 rounded-lg transition ${
            autoFollow ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-500'
          }`}
        >
          <Navigation className="w-4 h-4" />
        </button>
        <button
          onClick={() => setMapTheme(mapTheme === 'clean' ? 'satellite' : 'clean')}
          className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition"
        >
          {mapTheme === 'clean' ? 'Clean' : 'Dark'}
        </button>
      </div>

      {/* SVG Canvas Map Representation */}
      <svg
        viewBox="0 0 800 550"
        className="w-full h-full transition-transform duration-500 select-none"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: autoFollow ? `${(busX / 800) * 100}% ${(busY / 550) * 100}%` : '50% 50%',
        }}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={mapTheme === 'clean' ? '#E2E8F0' : '#334155'}
              strokeWidth="0.8"
            />
          </pattern>
          {/* River Hooghly gradient */}
          <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.35" />
          </linearGradient>
          {/* Glow filter for bus pulse */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Map Background Grid */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Hooghly River representation on the east */}
        <path
          d="M 680 -20 Q 640 150 710 320 T 660 580 L 820 580 L 820 -20 Z"
          fill="url(#riverGrad)"
        />
        <text
          x="730"
          y="260"
          transform="rotate(80 730 260)"
          fill="#3B82F6"
          opacity="0.4"
          fontSize="14"
          fontWeight="bold"
          letterSpacing="4"
        >
          HOOGHLY RIVER
        </text>

        {/* Road Background (Base broad road) */}
        <path
          d={roadNetworkPath}
          fill="none"
          stroke={mapTheme === 'clean' ? '#CBD5E1' : '#475569'}
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Active Route Colored Line */}
        <path
          d={roadNetworkPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 4"
        />

        {/* -------------------------------------------------------- */}
        {/* GEOFENCE CIRCLES */}
        {/* -------------------------------------------------------- */}

        {/* 1. School Geofence Circle (200m) */}
        <circle
          cx={schoolX}
          cy={schoolY}
          r={metersToPixels(schoolRadiusMeters)}
          fill="#3B82F6"
          fillOpacity="0.12"
          stroke="#253B80"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text
          x={schoolX}
          y={schoolY - metersToPixels(schoolRadiusMeters) - 6}
          textAnchor="middle"
          fill="#253B80"
          fontSize="10"
          fontWeight="bold"
        >
          School Geofence ({schoolRadiusMeters}m)
        </text>

        {/* 2. Student Pickup Geofence Circle (100m) */}
        {studentPickupPosition && (
          <>
            <circle
              cx={pickupX}
              cy={pickupY}
              r={metersToPixels(studentPickupRadiusMeters)}
              fill="#22C55E"
              fillOpacity="0.14"
              stroke="#16A34A"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <text
              x={pickupX}
              y={pickupY - metersToPixels(studentPickupRadiusMeters) - 6}
              textAnchor="middle"
              fill="#15803D"
              fontSize="10"
              fontWeight="bold"
            >
              {highlightStudentStopName} Pickup ({studentPickupRadiusMeters}m)
            </text>
          </>
        )}

        {/* -------------------------------------------------------- */}
        {/* STOPS & LANDMARKS */}
        {/* -------------------------------------------------------- */}
        {stops.map((stop) => {
          const sx = lngToX(stop.longitude);
          const sy = latToY(stop.latitude);
          const isHighlighted = stop.name.includes(highlightStudentStopName);

          return (
            <g
              key={stop.id}
              className="cursor-pointer"
              onClick={() => setSelectedMarker(stop.name)}
            >
              {isHighlighted && (
                <circle
                  cx={sx}
                  cy={sy}
                  r="14"
                  fill="#22C55E"
                  opacity="0.3"
                  className="animate-ping"
                />
              )}
              <circle
                cx={sx}
                cy={sy}
                r="7"
                fill={isHighlighted ? '#22C55E' : '#FFFFFF'}
                stroke={isHighlighted ? '#15803D' : '#64748B'}
                strokeWidth="2.5"
              />
              <text
                x={sx}
                y={sy + 18}
                textAnchor="middle"
                fill="#334155"
                fontSize="9"
                fontWeight={isHighlighted ? 'bold' : 'normal'}
                className="select-none"
              >
                {stop.name.split('(')[0]}
              </text>
            </g>
          );
        })}

        {/* School Campus Building Marker */}
        <g
          transform={`translate(${schoolX - 18}, ${schoolY - 26})`}
          className="cursor-pointer"
          onClick={() => setSelectedMarker('Little Star Kids Academy Campus')}
        >
          <rect
            width="36"
            height="32"
            rx="8"
            fill="#253B80"
            stroke="#FFFFFF"
            strokeWidth="2"
            className="shadow-md"
          />
          <path
            d="M 6 12 L 18 4 L 30 12 L 30 26 L 6 26 Z"
            fill="#3B82F6"
          />
          <text
            x="18"
            y="22"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
          >
            SCH
          </text>
        </g>
        <text
          x={schoolX}
          y={schoolY + 22}
          textAnchor="middle"
          fill="#1E293B"
          fontSize="11"
          fontWeight="bold"
        >
          Little Star Academy
        </text>

        {/* -------------------------------------------------------- */}
        {/* BUS MARKER (MOVING WITH ROTATION & PULSE) */}
        {/* -------------------------------------------------------- */}
        {showAllBuses ? (
          showAllBuses.map((b) => {
            const bx = lngToX(b.position.longitude);
            const by = latToY(b.position.latitude);
            const isSelected = selectedBusId === b.id;

            return (
              <g
                key={b.id}
                transform={`translate(${bx}, ${by})`}
                className="cursor-pointer transition-all duration-300"
                onClick={() => onBusClick && onBusClick(b.id)}
              >
                <circle
                  r={isSelected ? '22' : '16'}
                  fill={isSelected ? '#3B82F6' : '#253B80'}
                  opacity="0.25"
                  className="animate-pulse"
                />
                <circle
                  r="14"
                  fill="#253B80"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="#FFFFFF"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {b.busNumber.replace('Bus ', 'B')}
                </text>
                <text
                  y="24"
                  textAnchor="middle"
                  fill="#0F172A"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {b.busNumber}
                </text>
              </g>
            );
          })
        ) : (
          <g
            transform={`translate(${busX}, ${busY})`}
            className="transition-transform duration-700 ease-out"
          >
            {/* Outer radar pulse wave */}
            <circle
              r="28"
              fill="#3B82F6"
              opacity="0.3"
              className="animate-pulse-ring"
            />
            {/* Heading indicator triangle */}
            <g transform={`rotate(${busHeading})`}>
              <polygon
                points="0,-22 7,-14 -7,-14"
                fill="#253B80"
              />
            </g>
            {/* Bus Main Circle Badge */}
            <circle
              r="18"
              fill="#253B80"
              stroke="#FFFFFF"
              strokeWidth="3"
              filter="url(#glow)"
            />
            {/* Bus Icon glyph in center */}
            <g transform="translate(-10, -10) scale(0.85)">
              <path
                d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"
                fill="#FFFFFF"
              />
            </g>
            {/* Bus Tag */}
            <rect
              x="-26"
              y="22"
              width="52"
              height="18"
              rx="9"
              fill="#172033"
              fillOpacity="0.9"
            />
            <text
              y="34"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="9"
              fontWeight="bold"
            >
              BUS 03
            </text>
          </g>
        )}
      </svg>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-2 left-2 z-20 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-md text-[11px] text-slate-600 border border-slate-200">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#253B80]"></span>
          School (200m)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span>
          Pickup Stop (100m)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
          Active Route
        </span>
      </div>
    </div>
  );
};
