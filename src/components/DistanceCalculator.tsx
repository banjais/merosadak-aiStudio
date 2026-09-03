import React, { useState } from 'react';
import { CITIES_AND_JUNCTIONS } from '../data/nepalHighwaysData';
import { findOptimizedRoute, calculateDirectDistanceKm } from '../utils/routeOptimizer';
import { CityNode, VehicleType } from '../types';
import { Calculator, ArrowRight, Car, Fuel, Zap, Clock, ArrowUpDown, Mountain, MapPin, Check } from 'lucide-react';

interface DistanceCalculatorProps {
  onPlanFullRoute?: (originId: string, destId: string) => void;
}

export const DistanceCalculator: React.FC<DistanceCalculatorProps> = ({ onPlanFullRoute }) => {
  const [originId, setOriginId] = useState<string>('ktm');
  const [destId, setDestId] = useState<string>('pkr');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('car');
  const [matrixFilter, setMatrixFilter] = useState<string>('');

  const origin = CITIES_AND_JUNCTIONS.find((c) => c.id === originId) || CITIES_AND_JUNCTIONS[0];
  const destination = CITIES_AND_JUNCTIONS.find((c) => c.id === destId) || CITIES_AND_JUNCTIONS[1];

  const swapCities = () => {
    const temp = originId;
    setOriginId(destId);
    setDestId(temp);
  };

  // Calculate route between chosen pair
  const routeResult = originId !== destId ? findOptimizedRoute(originId, destId, 'fastest', selectedVehicle) : null;
  const aerialDistance = calculateDirectDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng);

  // Key hubs for distance matrix
  const keyHubs = CITIES_AND_JUNCTIONS.filter((c) => c.isMajorHub);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="p-6 rounded-2xl"
        style={{ background: 'var(--surface-glass)', backdropFilter: 'blur(16px)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="flex items-center space-x-2">
          <span
            className="px-2.5 py-1 text-xs font-bold rounded-lg"
            style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-gold)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
          >
            GEOGRAPHIC MILEAGE ENGINE
          </span>
          <span className="text-xs text-slate-400">Roads Board Nepal Calibration</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mt-1 font-display">
          Nepal Inter-City Distance & Elevation Calculator
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Accurate driving distances, aerial displacements, mountain altitude variance, and multi-vehicle fuel / time estimations along verified highway corridors.
        </p>
      </div>

      {/* Interactive Pair Calculator Card */}
      <div
        className="p-6 rounded-2xl space-y-6"
        style={{ background: 'var(--surface-glass)', backdropFilter: 'blur(16px)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Origin Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent-gold)' }} />
              <span>Origin Location (City / Junction)</span>
            </label>
            <select
              id="select-calc-origin"
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="matrix-input"
            >
              {CITIES_AND_JUNCTIONS.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.district} - {city.elevationM}m)
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center pt-4 md:pt-0">
            <button
              onClick={swapCities}
              title="Swap origin and destination"
              className="map-toggle-btn"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent-emerald)' }} />
              <span>Destination Location (City / Junction)</span>
            </label>
            <select
              id="select-calc-dest"
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="matrix-input"
            >
              {CITIES_AND_JUNCTIONS.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.district} - {city.elevationM}m)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculation Result Display */}
        {routeResult ? (
          <div className="matrix-result-line flex-col items-stretch space-y-4 !items-stretch">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--surface-border)' }}>
              <div className="matrix-result-route">
                <span className="matrix-city-from">{origin.name}</span>
                <span className="matrix-arrow">➔</span>
                <span className="matrix-city-to">{destination.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPlanFullRoute && onPlanFullRoute(originId, destId)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
                  style={{ background: 'var(--accent-emerald)', color: '#04120c' }}
                >
                  <span>Open in Route Optimizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--surface-border)' }}>
                <div className="text-xs text-slate-400 font-medium">Road Driving Distance</div>
                <div className="text-2xl font-black mt-0.5 font-display mono" style={{ color: 'var(--accent-emerald)' }}>
                  {routeResult.totalDistanceKm} <span className="text-sm font-normal text-slate-400">km</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Aerial: {aerialDistance} km straight-line</div>
              </div>

              <div className="p-3.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--surface-border)' }}>
                <div className="text-xs text-slate-400 font-medium">Estimated Drive Time</div>
                <div className="text-2xl font-black mt-0.5 font-display mono" style={{ color: 'var(--accent-sky)' }}>
                  {Math.floor(routeResult.estimatedTimeMinutes / 60)}h {routeResult.estimatedTimeMinutes % 60}m
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Avg Speed: ~{Math.round(routeResult.totalDistanceKm / (routeResult.estimatedTimeMinutes / 60))} km/h</div>
              </div>

              <div className="p-3.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--surface-border)' }}>
                <div className="text-xs text-slate-400 font-medium">Elevation Delta</div>
                <div className="text-2xl font-black mt-0.5 font-display mono flex items-baseline space-x-1" style={{ color: 'var(--accent-purple)' }}>
                  <span>{destination.elevationM - origin.elevationM > 0 ? `+${destination.elevationM - origin.elevationM}` : destination.elevationM - origin.elevationM}</span>
                  <span className="text-sm font-normal text-slate-400">m</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{origin.elevationM}m ➔ {destination.elevationM}m</div>
              </div>

              <div className="p-3.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--surface-border)' }}>
                <div className="text-xs text-slate-400 font-medium">Est. Petrol / Diesel Cost</div>
                <div className="text-2xl font-black mt-0.5 font-display mono" style={{ color: 'var(--accent-gold)' }}>
                  Rs. {routeResult.fuelEstimate.costNpr.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">~{routeResult.fuelEstimate.liters} Liters required</div>
              </div>
            </div>

            {/* Step summary of highways traversed */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Corridors Traversed:
              </div>
              <div className="flex flex-wrap gap-2">
                {routeResult.steps.map((st, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2 p-2 rounded-xl text-xs"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--surface-border)' }}
                  >
                    <span
                      className="w-5 h-5 rounded-full font-bold flex items-center justify-center text-[10px] mono"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--accent-gold)' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-slate-200 font-medium">{st.instruction}</span>
                    <span className="text-slate-500 font-semibold mono">({st.distanceKm} km)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            Please choose different origin and destination locations.
          </div>
        )}
      </div>

      {/* Comprehensive City-to-City Distance Matrix Table */}
      <div
        className="p-6 rounded-2xl space-y-4"
        style={{ background: 'var(--surface-glass)', backdropFilter: 'blur(16px)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white font-display">Nepal Major Hubs Distance Matrix (km)</h3>
            <p className="text-xs text-slate-400">Click any cell to load the calculation instantly into the calculator.</p>
          </div>
          <input
            type="text"
            placeholder="Filter matrix hubs..."
            value={matrixFilter}
            onChange={(e) => setMatrixFilter(e.target.value)}
            className="matrix-input sm:max-w-[220px]"
          />
        </div>

        <div className="overflow-x-auto rounded-xl matrix-table" style={{ border: '1px solid var(--surface-border)' }}>
          <table className="w-full text-center text-xs text-slate-300">
            <thead className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <tr>
                <th className="py-2.5 px-3 text-left sticky left-0 z-10" style={{ background: 'rgba(15,23,42,0.98)' }}>City Hub</th>
                {keyHubs
                  .filter((h) => h.name.toLowerCase().includes(matrixFilter.toLowerCase()))
                  .map((hub) => (
                    <th key={hub.id} className="py-2.5 px-3 whitespace-nowrap">
                      {hub.name.split(' ')[0]}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {keyHubs
                .filter((h) => h.name.toLowerCase().includes(matrixFilter.toLowerCase()))
                .map((rowHub) => (
                  <tr key={rowHub.id} className="hover:bg-white/[0.03] transition">
                    <td className="py-2.5 px-3 text-left font-bold text-white sticky left-0 z-10 whitespace-nowrap" style={{ background: 'rgba(15,23,42,0.95)' }}>
                      {rowHub.name.split(' ')[0]} <span className="text-[10px] text-slate-500 font-normal">({rowHub.elevationM}m)</span>
                    </td>
                    {keyHubs
                      .filter((h) => h.name.toLowerCase().includes(matrixFilter.toLowerCase()))
                      .map((colHub) => {
                        if (rowHub.id === colHub.id) {
                          return (
                            <td key={colHub.id} className="py-2.5 px-3 text-slate-600" style={{ background: 'rgba(0,0,0,0.2)' }}>
                              -
                            </td>
                          );
                        }
                        const dist = findOptimizedRoute(rowHub.id, colHub.id, 'fastest', 'car')?.totalDistanceKm || calculateDirectDistanceKm(rowHub.lat, rowHub.lng, colHub.lat, colHub.lng);
                        return (
                          <td
                            key={colHub.id}
                            onClick={() => {
                              setOriginId(rowHub.id);
                              setDestId(colHub.id);
                            }}
                            className="matrix-cell py-2.5 px-3 font-semibold text-slate-200 cursor-pointer transition mono"
                            title={`Calculate ${rowHub.name} to ${colHub.name}`}
                          >
                            {dist}
                          </td>
                        );
                      })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
