import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface MapViewProps {
  lat: number;
  lon: number;
  locationName?: string;
  riskLevel?: string;
}

const MapView: React.FC<MapViewProps> = ({ lat, lon, locationName, riskLevel }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const isMobile = window.innerWidth < 768;

    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
      // Prevent scroll hijacking on mobile
      scrollWheelZoom: !isMobile,
      dragging: !isMobile,
    });

    // Add zoom control to bottom-right so it doesn't overlap header on mobile
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const riskColors: Record<string, string> = {
      'Critical': '#ef4444',
      'High': '#f97316',
      'Medium': '#eab308',
      'Low': '#22c55e',
    };

    const markerColor = riskColors[riskLevel || ''] || '#3b82f6';

    const markerIcon = L.divIcon({
      className: 'custom-div-marker',
      html: `<div style="
        width: 32px; height: 32px;
        background: ${markerColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          width: 10px; height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker([lat, lon], { icon: markerIcon }).addTo(map);

    if (locationName) {
      const popupContent = `
        <div style="font-family: Inter, system-ui, sans-serif; min-width: 140px; max-width: 220px;">
          <p style="font-weight: 800; font-size: 13px; margin: 0 0 4px 0; line-height: 1.3; word-wrap: break-word;">${locationName}</p>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 6px 0;">
            ${lat.toFixed(4)}, ${lon.toFixed(4)}
          </p>
          ${riskLevel ? `<span style="
            background: ${markerColor}; color: white;
            padding: 2px 10px; border-radius: 12px;
            font-size: 11px; font-weight: 700;
          ">${riskLevel}</span>` : ''}
        </div>
      `;
      marker.bindPopup(popupContent, {
        maxWidth: isMobile ? 200 : 280,
        closeButton: true,
        autoPan: true,
        autoPanPadding: L.point(20, 20),
      });
      // Delay popup open so map finishes rendering first
      setTimeout(() => {
        marker.openPopup();
      }, 400);
    }

    // Risk zone circle
    L.circle([lat, lon], {
      radius: 2000,
      color: markerColor,
      fillColor: markerColor,
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '5, 5',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Fix grey tiles: invalidateSize after animation completes and container stabilizes
    const timers = [
      setTimeout(() => map.invalidateSize(), 100),
      setTimeout(() => map.invalidateSize(), 350),
      setTimeout(() => { map.invalidateSize(); setMapReady(true); }, 600),
    ];

    return () => {
      timers.forEach(clearTimeout);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, locationName, riskLevel]);

  // Enable interaction controls after user taps "interact" on mobile
  const enableInteraction = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.scrollWheelZoom.enable();
    map.dragging.enable();
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-600 shadow-sm relative leaflet-map-container">
      <div
        ref={mapRef}
        className="w-full"
        style={{ height: isMobile ? '260px' : '320px' }}
      />
      {/* Mobile: tap overlay to enable map interaction */}
      {isMobile && !mapReady && (
        <div className="absolute inset-0 z-[450] pointer-events-none" />
      )}
      {isMobile && mapReady && (
        <button
          onClick={enableInteraction}
          className="absolute bottom-3 left-3 z-[450] bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 transition-opacity hover:bg-white dark:hover:bg-slate-700"
        >
          Sentuh untuk interaksi peta
        </button>
      )}
    </div>
  );
};

export default MapView;
