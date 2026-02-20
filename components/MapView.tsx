import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

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
      className: 'custom-marker',
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
      marker.bindPopup(`
        <div style="font-family: Inter, system-ui, sans-serif; min-width: 160px;">
          <p style="font-weight: 800; font-size: 14px; margin: 0 0 4px 0;">${locationName}</p>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 6px 0;">
            ${lat.toFixed(4)}, ${lon.toFixed(4)}
          </p>
          ${riskLevel ? `<span style="
            background: ${markerColor}; color: white;
            padding: 2px 10px; border-radius: 12px;
            font-size: 11px; font-weight: 700;
          ">${riskLevel}</span>` : ''}
        </div>
      `).openPopup();
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

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon, locationName, riskLevel]);

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-600 shadow-sm">
      <div ref={mapRef} style={{ height: '300px', width: '100%' }} />
    </div>
  );
};

export default MapView;
