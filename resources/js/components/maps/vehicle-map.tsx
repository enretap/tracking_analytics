// @/components/maps/vehicle-map.tsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, LayersControl, ScaleControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Car, AlertTriangle, Wrench } from 'lucide-react';

// Fix pour les icônes Leaflet dans React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Vehicle {
  id: string;
  name: string;
  plate: string;
  status: 'active' | 'inactive' | 'maintenance';
  distance: number;
  latitude?: number;
  longitude?: number;
  speed?: number;
  lastUpdate?: string;
}

interface VehicleMapProps {
  vehicles: Vehicle[];
  className?: string;
  height?: string;
}

export function VehicleMap({ vehicles, className = '', height = '400px' }: VehicleMapProps) {
  const [mounted, setMounted] = useState(false);
  const [center, setCenter] = useState<[number, number]>([7.5400, -5.5471]); // Côte d'Ivoire par défaut
  const [zoom, setZoom] = useState(7);

  // Utiliser les positions réelles des véhicules
  const vehiclesWithPositions = vehicles.filter(vehicle => 
    vehicle.latitude && vehicle.longitude && 
    vehicle.latitude !== 0 && vehicle.longitude !== 0
  );

  // Icônes personnalisées
  const getVehicleIcon = (status: Vehicle['status']) => {
    const iconSize = 32;
    const iconAnchor = 16;
    
    // Créer une icône personnalisée avec HTML/CSS
    const iconHtml = (color: string) => `
      <div style="
        background-color: ${color};
        width: ${iconSize}px;
        height: ${iconSize}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        ${status === 'active' ? '🚗' : status === 'maintenance' ? '🔧' : '⏸️'}
      </div>
    `;

    return L.divIcon({
      html: iconHtml(
        status === 'active' ? '#10B981' : 
        status === 'maintenance' ? '#F59E0B' : 
        '#6B7280'
      ),
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconAnchor, iconAnchor],
      className: 'vehicle-marker',
    });
  };

  // Calculer le centre de la carte en fonction des véhicules
  useEffect(() => {
    if (vehiclesWithPositions.length > 0) {
      const validVehicles = vehiclesWithPositions.filter(v => v.latitude && v.longitude);
      if (validVehicles.length > 0) {
        const avgLat = validVehicles.reduce((sum, v) => sum + (v.latitude || 0), 0) / validVehicles.length;
        const avgLng = validVehicles.reduce((sum, v) => sum + (v.longitude || 0), 0) / validVehicles.length;
        setCenter([avgLat, avgLng]);
        
        // Ajuster le zoom en fonction de la dispersion des véhicules
        if (validVehicles.length > 1) {
          const lats = validVehicles.map(v => v.latitude || 0);
          const lngs = validVehicles.map(v => v.longitude || 0);
          const latSpread = Math.max(...lats) - Math.min(...lats);
          const lngSpread = Math.max(...lngs) - Math.min(...lngs);
          const maxSpread = Math.max(latSpread, lngSpread);
          
          // Ajuster le zoom selon la dispersion
          if (maxSpread > 5) setZoom(6);
          else if (maxSpread > 2) setZoom(8);
          else if (maxSpread > 0.5) setZoom(10);
          else setZoom(12);
        } else {
          setZoom(13); // Zoom proche pour un seul véhicule
        }
      }
    }
  }, [vehiclesWithPositions]);

  // Pour éviter les erreurs de SSR avec Leaflet
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 ${className}`}
        style={{ height }}
      >
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 inline-block rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-900/50">
              <Car className="mx-auto h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Chargement de la carte...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ height }}>
      <style>{`
        .leaflet-control {
          z-index: 1000 !important;
        }
        .leaflet-control-layers {
          background: white;
          border: 2px solid rgba(0,0,0,0.2);
          border-radius: 5px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        }
        .leaflet-control-scale {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(0,0,0,0.2);
          border-radius: 5px;
          padding: 0 5px;
        }
        .dark .leaflet-control-layers {
          background: #1f2937;
          border-color: #374151;
          color: white;
        }
        .dark .leaflet-control-scale {
          background: rgba(31, 41, 55, 0.9);
          border-color: #374151;
          color: white;
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        className="leaflet-map"
      >
        {/* Contrôle d'échelle */}
        <ScaleControl position="bottomleft" imperial={false} />

        {/* Contrôle des couches de carte */}
        <LayersControl position="topright">
          {/* Couche OpenStreetMap */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Couche CARTO Light */}
          <LayersControl.BaseLayer name="CARTO Light">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          {/* Couche CARTO Dark */}
          <LayersControl.BaseLayer name="CARTO Dark">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>

          {/* Couche Satellite */}
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          {/* Couche Terrain */}
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Marqueurs des véhicules */}
        {vehiclesWithPositions.map((vehicle) => {
          if (!vehicle.latitude || !vehicle.longitude) return null;
          
          return (
            <Marker
              key={vehicle.id}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={getVehicleIcon(vehicle.status)}
            >
              <Popup>
                <div className="min-w-[200px] p-2">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-600' :
                      vehicle.status === 'maintenance' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {vehicle.status === 'active' ? (
                        <Car className="h-5 w-5" />
                      ) : vehicle.status === 'maintenance' ? (
                        <Wrench className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600">{vehicle.plate}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Statut:</span>
                          <span className={`font-medium ${
                            vehicle.status === 'active' ? 'text-green-600' :
                            vehicle.status === 'maintenance' ? 'text-amber-600' :
                            'text-gray-600'
                          }`}>
                            {vehicle.status === 'active' ? 'Actif' :
                             vehicle.status === 'maintenance' ? 'Maintenance' : 'Inactif'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Vitesse:</span>
                          <span className="font-medium text-gray-900">{vehicle.speed} km/h</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Distance:</span>
                          <span className="font-medium text-gray-900">{vehicle.distance.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Cercles d'animation pour les véhicules actifs */}
        {vehiclesWithPositions
          .filter(v => v.status === 'active' && v.latitude && v.longitude)
          .map(vehicle => (
            <CircleMarker
              key={`circle-${vehicle.id}`}
              center={[vehicle.latitude!, vehicle.longitude!]}
              radius={15}
              pathOptions={{
                color: '#10B981',
                fillColor: '#10B981',
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          ))}
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 p-3 backdrop-blur-sm shadow-lg dark:bg-gray-900/90">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Véhicules actifs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-xs text-gray-700 dark:text-gray-300">En maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-500" />
            <span className="text-xs text-gray-700 dark:text-gray-300">Inactifs</span>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom(zoom + 1)}
          className="rounded-lg bg-white/90 p-2 backdrop-blur-sm hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
          title="Zoomer"
        >
          <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={() => setZoom(zoom - 1)}
          className="rounded-lg bg-white/90 p-2 backdrop-blur-sm hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
          title="Dézoomer"
        >
          <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      {/* Compteur de véhicules */}
      <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-2 backdrop-blur-sm shadow-lg dark:bg-gray-900/90">
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {vehicles.filter(v => v.status === 'active').length} véhicules actifs
          </span>
        </div>
      </div>
    </div>
  );
}