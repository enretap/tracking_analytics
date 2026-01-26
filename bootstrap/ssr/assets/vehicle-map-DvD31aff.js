import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MapContainer, ScaleControl, LayersControl, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { Car, Wrench, AlertTriangle } from "lucide-react";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});
function VehicleMap({ vehicles, className = "", height = "400px" }) {
  const [mounted, setMounted] = useState(false);
  const [center, setCenter] = useState([7.54, -5.5471]);
  const [zoom, setZoom] = useState(7);
  const vehiclesWithPositions = vehicles.filter(
    (vehicle) => vehicle.latitude && vehicle.longitude && vehicle.latitude !== 0 && vehicle.longitude !== 0
  );
  const getVehicleIcon = (status) => {
    const iconSize = 32;
    const iconAnchor = 16;
    const iconHtml = (color) => `
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
        ${status === "active" ? "🚗" : status === "maintenance" ? "🔧" : "⏸️"}
      </div>
    `;
    return L.divIcon({
      html: iconHtml(
        status === "active" ? "#10B981" : status === "maintenance" ? "#F59E0B" : "#6B7280"
      ),
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconAnchor, iconAnchor],
      className: "vehicle-marker"
    });
  };
  useEffect(() => {
    if (vehiclesWithPositions.length > 0) {
      const validVehicles = vehiclesWithPositions.filter((v) => v.latitude && v.longitude);
      if (validVehicles.length > 0) {
        const avgLat = validVehicles.reduce((sum, v) => sum + (v.latitude || 0), 0) / validVehicles.length;
        const avgLng = validVehicles.reduce((sum, v) => sum + (v.longitude || 0), 0) / validVehicles.length;
        setCenter([avgLat, avgLng]);
        if (validVehicles.length > 1) {
          const lats = validVehicles.map((v) => v.latitude || 0);
          const lngs = validVehicles.map((v) => v.longitude || 0);
          const latSpread = Math.max(...lats) - Math.min(...lats);
          const lngSpread = Math.max(...lngs) - Math.min(...lngs);
          const maxSpread = Math.max(latSpread, lngSpread);
          if (maxSpread > 5) setZoom(6);
          else if (maxSpread > 2) setZoom(8);
          else if (maxSpread > 0.5) setZoom(10);
          else setZoom(12);
        } else {
          setZoom(13);
        }
      }
    }
  }, [vehiclesWithPositions]);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 ${className}`,
        style: { height },
        children: /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-2 inline-block rounded-lg bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-900/50", children: /* @__PURE__ */ jsx(Car, { className: "mx-auto h-8 w-8 text-gray-400" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Chargement de la carte..." })
        ] }) })
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden rounded-lg ${className}`, style: { height }, children: [
    /* @__PURE__ */ jsx("style", { children: `
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
      ` }),
    /* @__PURE__ */ jsxs(
      MapContainer,
      {
        center,
        zoom,
        style: { height: "100%", width: "100%", borderRadius: "0.5rem" },
        className: "leaflet-map",
        children: [
          /* @__PURE__ */ jsx(ScaleControl, { position: "bottomleft", imperial: false }),
          /* @__PURE__ */ jsxs(LayersControl, { position: "topright", children: [
            /* @__PURE__ */ jsx(LayersControl.BaseLayer, { name: "OpenStreetMap", children: /* @__PURE__ */ jsx(
              TileLayer,
              {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
            ) }),
            /* @__PURE__ */ jsx(LayersControl.BaseLayer, { name: "CARTO Light", children: /* @__PURE__ */ jsx(
              TileLayer,
              {
                attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
                url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              }
            ) }),
            /* @__PURE__ */ jsx(LayersControl.BaseLayer, { name: "CARTO Dark", children: /* @__PURE__ */ jsx(
              TileLayer,
              {
                attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
                url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              }
            ) }),
            /* @__PURE__ */ jsx(LayersControl.BaseLayer, { checked: true, name: "Satellite", children: /* @__PURE__ */ jsx(
              TileLayer,
              {
                attribution: "Tiles © Esri",
                url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }
            ) }),
            /* @__PURE__ */ jsx(LayersControl.BaseLayer, { name: "Terrain", children: /* @__PURE__ */ jsx(
              TileLayer,
              {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              }
            ) })
          ] }),
          vehiclesWithPositions.map((vehicle) => {
            if (!vehicle.latitude || !vehicle.longitude) return null;
            return /* @__PURE__ */ jsx(
              Marker,
              {
                position: [vehicle.latitude, vehicle.longitude],
                icon: getVehicleIcon(vehicle.status),
                children: /* @__PURE__ */ jsx(Popup, { children: /* @__PURE__ */ jsx("div", { className: "min-w-[200px] p-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-full ${vehicle.status === "active" ? "bg-green-100 text-green-600" : vehicle.status === "maintenance" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"}`, children: vehicle.status === "active" ? /* @__PURE__ */ jsx(Car, { className: "h-5 w-5" }) : vehicle.status === "maintenance" ? /* @__PURE__ */ jsx(Wrench, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-900", children: vehicle.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: vehicle.plate }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-2 space-y-1", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Statut:" }),
                        /* @__PURE__ */ jsx("span", { className: `font-medium ${vehicle.status === "active" ? "text-green-600" : vehicle.status === "maintenance" ? "text-amber-600" : "text-gray-600"}`, children: vehicle.status === "active" ? "Actif" : vehicle.status === "maintenance" ? "Maintenance" : "Inactif" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Vitesse:" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-900", children: [
                          vehicle.speed,
                          " km/h"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
                        /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Distance:" }),
                        /* @__PURE__ */ jsxs("span", { className: "font-medium text-gray-900", children: [
                          vehicle.distance.toLocaleString(),
                          " km"
                        ] })
                      ] })
                    ] })
                  ] })
                ] }) }) })
              },
              vehicle.id
            );
          }),
          vehiclesWithPositions.filter((v) => v.status === "active" && v.latitude && v.longitude).map((vehicle) => /* @__PURE__ */ jsx(
            CircleMarker,
            {
              center: [vehicle.latitude, vehicle.longitude],
              radius: 15,
              pathOptions: {
                color: "#10B981",
                fillColor: "#10B981",
                fillOpacity: 0.1,
                weight: 1
              }
            },
            `circle-${vehicle.id}`
          ))
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-4 rounded-lg bg-white/90 p-3 backdrop-blur-sm shadow-lg dark:bg-gray-900/90", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-green-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-700 dark:text-gray-300", children: "Véhicules actifs" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-amber-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-700 dark:text-gray-300", children: "En maintenance" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-gray-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-700 dark:text-gray-300", children: "Inactifs" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute right-4 top-4 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setZoom(zoom + 1),
          className: "rounded-lg bg-white/90 p-2 backdrop-blur-sm hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900",
          title: "Zoomer",
          children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-gray-700 dark:text-gray-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setZoom(zoom - 1),
          className: "rounded-lg bg-white/90 p-2 backdrop-blur-sm hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900",
          title: "Dézoomer",
          children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5 text-gray-700 dark:text-gray-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-2 backdrop-blur-sm shadow-lg dark:bg-gray-900/90", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Car, { className: "h-4 w-4 text-gray-600 dark:text-gray-400" }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: [
        vehicles.filter((v) => v.status === "active").length,
        " véhicules actifs"
      ] })
    ] }) })
  ] });
}
export {
  VehicleMap
};
