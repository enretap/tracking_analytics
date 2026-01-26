import { jsx, jsxs } from "react/jsx-runtime";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, e as DropdownMenuCheckboxItem, A as AppLayout } from "./app-layout-C3_vghij.js";
import { Head } from "@inertiajs/react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-BK6R-x6E.js";
import { B as Button } from "./button-VCvxHZJY.js";
import { Table, Settings2, AlertTriangle, MapPin, Activity, TrendingUp, Fuel, BarChart3, Clock, CheckCircle, Award, User, TrendingDown, Gauge, ShieldCheck, Wrench, DollarSign, Calendar, FileText, Droplet, Truck, Bell, Zap, Loader2, Download, Mail } from "lucide-react";
import { useState, createContext, useContext } from "react";
import { B as Badge } from "./badge-D_0uEcAf.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "../ssr.js";
import "@inertiajs/react/server";
import "react-dom/server";
import "clsx";
import "tailwind-merge";
function SummaryTemplate({ data }) {
  const [columns, setColumns] = useState([
    { key: "immatriculation", label: "Immatriculation", visible: true, essential: true },
    { key: "driver", label: "Driver", visible: true, essential: true },
    { key: "project", label: "Projet", visible: false },
    { key: "max_speed", label: "Vitesse max", visible: true },
    { key: "distance", label: "Distance parcourue", visible: true },
    { key: "driving_time", label: "Temps de conduite continu", visible: true },
    { key: "idle_time", label: "Temps moteur tournant à l'arrêt", visible: false },
    { key: "harsh_braking", label: "Freinages brusques", visible: false },
    { key: "harsh_acceleration", label: "Accélérations brusques", visible: false },
    { key: "dangerous_turns", label: "Virage dangereux", visible: false },
    { key: "speed_violations", label: "Violation vitesse max", visible: false },
    { key: "driving_time_violations", label: "Violation heure conduite", visible: false },
    { key: "total_violations", label: "Violation totale", visible: true }
  ]);
  const toggleColumn = (key) => {
    setColumns((prev) => prev.map(
      (col) => col.key === key && !col.essential ? { ...col, visible: !col.visible } : col
    ));
  };
  const visibleColumns = columns.filter((col) => col.visible);
  data.total_vehicles ? Math.round((data.active_vehicles || 0) / data.total_vehicles * 100) : 0;
  data.total_drivers ? Math.round((data.active_drivers || 0) / data.total_drivers * 100) : 0;
  data.scheduled_maintenances ? Math.round((data.completed_maintenances || 0) / data.scheduled_maintenances * 100) : 0;
  data.total_alerts ? Math.round((data.resolved_alerts || 0) / data.total_alerts * 100) : 0;
  return /* @__PURE__ */ jsx("div", { className: "space-y-5 p-3 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-sm", children: data.vehicle_details && data.vehicle_details.length > 0 && /* @__PURE__ */ jsxs(Card, { className: "shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white shadow-md", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "flex items-center gap-3 text-base font-bold p-1", children: /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg", children: /* @__PURE__ */ jsx(Table, { className: "h-6 w-6" }) }) }),
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white", children: [
          /* @__PURE__ */ jsx(Settings2, { className: "h-4 w-4 mr-2" }),
          "Colonnes (",
          visibleColumns.length,
          "/",
          columns.length,
          ")"
        ] }) }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-64", children: [
          columns.map((column) => /* @__PURE__ */ jsx(
            DropdownMenuCheckboxItem,
            {
              checked: column.visible,
              onCheckedChange: () => toggleColumn(column.key),
              disabled: column.essential,
              className: "cursor-pointer",
              children: /* @__PURE__ */ jsxs("span", { className: column.essential ? "font-semibold" : "", children: [
                column.label,
                column.essential && " *"
              ] })
            },
            column.key
          )),
          /* @__PURE__ */ jsx("div", { className: "px-2 py-1.5 text-xs text-muted-foreground border-t mt-1", children: "* Colonnes essentielles" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "p-0 bg-white", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto p-4", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-gradient-to-r from-gray-900 to-gray-800 text-white", children: /* @__PURE__ */ jsx("tr", { children: columns.map((col) => col.visible && /* @__PURE__ */ jsx(
          "th",
          {
            className: `px-4 py-4 font-semibold border-r border-gray-700 last:border-r-0 ${col.key === "immatriculation" || col.key === "driver" || col.key === "project" ? "text-left" : "text-right"}`,
            children: col.label
          },
          col.key
        )) }) }),
        /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-gray-200 bg-white", children: [
          data.vehicle_details.map((vehicle, index) => /* @__PURE__ */ jsx("tr", { className: "hover:bg-blue-50 transition-colors duration-150", children: columns.map((col) => {
            if (!col.visible) return null;
            const getCellValue = () => {
              switch (col.key) {
                case "immatriculation":
                  return vehicle.immatriculation;
                case "driver":
                  return vehicle.driver;
                case "project":
                  return vehicle.project || "-";
                case "max_speed":
                  return vehicle.max_speed ?? "-";
                case "distance":
                  return vehicle.distance?.toFixed(2) ?? "-";
                case "driving_time":
                  return vehicle.driving_time ?? "-";
                case "idle_time":
                  return vehicle.idle_time ?? "-";
                case "harsh_braking":
                  return vehicle.harsh_braking ?? 0;
                case "harsh_acceleration":
                  return vehicle.harsh_acceleration ?? 0;
                case "dangerous_turns":
                  return vehicle.dangerous_turns ?? 0;
                case "speed_violations":
                  return vehicle.speed_violations ?? 0;
                case "driving_time_violations":
                  return vehicle.driving_time_violations ?? 0;
                case "total_violations":
                  return vehicle.total_violations ?? 0;
                default:
                  return "-";
              }
            };
            const isLeftAlign = ["immatriculation", "driver", "project"].includes(col.key);
            const isBold = ["immatriculation", "total_violations"].includes(col.key);
            return /* @__PURE__ */ jsx(
              "td",
              {
                className: `px-4 py-3 ${isLeftAlign ? "text-left" : "text-right"} ${isBold ? "font-semibold" : ""}`,
                children: getCellValue()
              },
              col.key
            );
          }) }, index)),
          /* @__PURE__ */ jsx("tr", { className: "bg-gray-900 text-white font-bold", children: columns.map((col, idx) => {
            if (!col.visible) return null;
            if (idx === 0) {
              const essentialColsCount = columns.filter((c) => c.visible && c.essential).length;
              return /* @__PURE__ */ jsx("td", { className: "px-4 py-3", colSpan: essentialColsCount, children: "Total" }, col.key);
            }
            if (col.essential) return null;
            const getTotalValue = () => {
              switch (col.key) {
                case "max_speed":
                  return Math.max(...(data.vehicle_details || []).map((v) => v.max_speed || 0));
                case "distance":
                  return (data.vehicle_details || []).reduce((sum, v) => sum + (v.distance || 0), 0).toFixed(2);
                case "driving_time":
                  const drivingMinutes = (data.vehicle_details || []).reduce((sum, v) => {
                    const match = v.driving_time?.match(/(\d+)h\s*(\d+)min/);
                    return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
                  }, 0);
                  return `${Math.floor(drivingMinutes / 60).toString().padStart(2, "0")}h ${(drivingMinutes % 60).toString().padStart(2, "0")}min`;
                case "idle_time":
                  const idleMinutes = (data.vehicle_details || []).reduce((sum, v) => {
                    const match = v.idle_time?.match(/(\d+)h\s*(\d+)min/);
                    return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
                  }, 0);
                  return `${Math.floor(idleMinutes / 60).toString().padStart(2, "0")}h ${(idleMinutes % 60).toString().padStart(2, "0")}min`;
                case "harsh_braking":
                  return (data.vehicle_details || []).reduce((sum, v) => sum + (v.harsh_braking || 0), 0);
                case "harsh_acceleration":
                  return (data.vehicle_details || []).reduce((sum, v) => sum + (v.harsh_acceleration || 0), 0);
                case "dangerous_turns":
                  return (data.vehicle_details || []).reduce((sum, v) => sum + (v.dangerous_turns || 0), 0);
                case "speed_violations":
                  return (data.vehicle_details || []).reduce((sum, v) => sum + (v.speed_violations || 0), 0);
                case "driving_time_violations":
                  return (data.vehicle_details || []).reduce((sum, v) => sum + (v.driving_time_violations || 0), 0);
                case "total_violations":
                  return (data.vehicle_details || []).reduce((sum, v) => sum + (v.total_violations || 0), 0);
                default:
                  return "-";
              }
            };
            return /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: getTotalValue() }, col.key);
          }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 bg-gradient-to-br from-red-50 to-orange-50 border-t-2 border-red-200", children: [
        /* @__PURE__ */ jsxs("h4", { className: "font-bold text-red-700 mb-2 flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }),
          "Seuil de tolérance"
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-700", children: [
          /* @__PURE__ */ jsx("li", { children: "-*Vitesse max: ≤ 90 km/h ± 5" }),
          /* @__PURE__ */ jsx("li", { children: "-Temps de conduite continu: ≤ 2h30 ± 15 min" }),
          /* @__PURE__ */ jsx("li", { children: "-Freinage brusque: ≤ 3" }),
          /* @__PURE__ */ jsx("li", { children: "-Accélération brusque: ≤ 2" }),
          /* @__PURE__ */ jsx("li", { className: "text-xs italic", children: "* Sur autoroute ou respecter la limitation de vitesse affichée en fonction de la route utilisée" })
        ] })
      ] })
    ] })
  ] }) });
}
function FleetActivityTemplate({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Distance totale" }),
          /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            data.total_distance?.toLocaleString() || "0",
            " km"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Parcourue durant la période" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Véhicules actifs" }),
          /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            data.active_vehicles || 0,
            " / ",
            data.total_vehicles || 0
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
            data.total_vehicles ? Math.round((data.active_vehicles || 0) / data.total_vehicles * 100) : 0,
            "% de la flotte"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Vitesse moyenne" }),
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            data.average_speed || 0,
            " km/h"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Moyenne de la flotte" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Alertes" }),
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: data.alerts || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: data.alerts === 0 ? "Aucune alerte" : "Alertes enregistrées" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Consommation" }),
          /* @__PURE__ */ jsx(Fuel, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            data.fuel_consumption?.toFixed(1) || "0.0",
            " L/100km"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Moyenne de la flotte" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Trajets effectués" }),
          /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: data.trip_count || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Sur la période" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Temps d'exploitation" }),
          /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            data.operating_time || 0,
            "h"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Total de la flotte" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Conformité" }),
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: "95%" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Taux de conformité" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5" }),
          "Statistiques détaillées"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Distance moyenne par véhicule" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              data.total_vehicles && data.total_distance ? Math.round(data.total_distance / data.total_vehicles).toLocaleString() : "0",
              " km"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Trajets moyens par véhicule" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: data.total_vehicles && data.trip_count ? Math.round(data.trip_count / data.total_vehicles) : "0" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Temps moyen par trajet" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              data.trip_count && data.operating_time ? (data.operating_time / data.trip_count).toFixed(1) : "0",
              "h"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Distance moyenne par trajet" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              data.trip_count && data.total_distance ? Math.round(data.total_distance / data.trip_count) : "0",
              " km"
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5" }),
          "Performance"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Taux d'utilisation" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                data.total_vehicles && data.active_vehicles ? Math.round(data.active_vehicles / data.total_vehicles * 100) : 0,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-blue-600 h-2 rounded-full transition-all",
                style: {
                  width: `${data.total_vehicles && data.active_vehicles ? Math.round(data.active_vehicles / data.total_vehicles * 100) : 0}%`
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Conformité" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-green-600 dark:text-green-400", children: "95%" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-green-600 h-2 rounded-full transition-all",
                style: { width: "95%" }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Efficacité énergétique" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-yellow-600 dark:text-yellow-400", children: "78%" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-yellow-600 h-2 rounded-full transition-all",
                style: { width: "78%" }
              }
            ) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
function DriverBehaviorTemplate({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Score moyen" }),
          /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: [
            data.average_score || 0,
            "/100"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Score de conduite" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Conducteurs" }),
          /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            data.excellent_drivers || 0,
            " / ",
            data.total_drivers || 0
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Excellents conducteurs" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Freinages brusques" }),
          /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-600 dark:text-orange-400", children: data.harsh_braking_events || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Événements enregistrés" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Excès de vitesse" }),
          /* @__PURE__ */ jsx(Gauge, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-red-600 dark:text-red-400", children: data.speeding_violations || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Infractions détectées" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Accélérations brusques" }),
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-amber-600 dark:text-amber-400", children: data.harsh_acceleration_events || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Événements enregistrés" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Temps de conduite" }),
          /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            data.total_driving_time || 0,
            "h"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Total de la période" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Conduite sécuritaire" }),
          /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: [
            data.safe_driving_percentage || 0,
            "%"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Du temps total" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Amélioration" }),
          /* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: "+12%" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Vs. période précédente" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }),
            "Classement des conducteurs"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Top 5 des meilleurs scores" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
          { name: "Jean Dupont", score: 98, rank: 1 },
          { name: "Marie Martin", score: 95, rank: 2 },
          { name: "Pierre Bernard", score: 92, rank: 3 },
          { name: "Sophie Petit", score: 88, rank: 4 },
          { name: "Luc Durand", score: 85, rank: 5 }
        ].map((driver) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800 last:border-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${driver.rank === 1 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : driver.rank === 2 ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" : driver.rank === 3 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`, children: driver.rank }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: driver.name })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-green-600 dark:text-green-400", children: driver.score })
        ] }, driver.rank)) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }),
            "Distribution des événements"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Répartition des incidents" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Freinages brusques" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: data.harsh_braking_events || 0 })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-orange-600 h-2 rounded-full transition-all",
                style: {
                  width: `${Math.min(100, (data.harsh_braking_events || 0) / 50 * 100)}%`
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Accélérations brusques" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: data.harsh_acceleration_events || 0 })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-amber-600 h-2 rounded-full transition-all",
                style: {
                  width: `${Math.min(100, (data.harsh_acceleration_events || 0) / 50 * 100)}%`
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Excès de vitesse" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: data.speeding_violations || 0 })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-red-600 h-2 rounded-full transition-all",
                style: {
                  width: `${Math.min(100, (data.speeding_violations || 0) / 50 * 100)}%`
                }
              }
            ) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
function MaintenanceTemplate({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Maintenances totales" }),
          /* @__PURE__ */ jsx(Wrench, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: data.total_maintenances || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Sur la période" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Maintenances urgentes" }),
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-red-600 dark:text-red-400", children: data.urgent_maintenances || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Nécessitent attention" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Coût total" }),
          /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            (data.total_cost || 0).toLocaleString(),
            " €"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Dépenses de maintenance" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Taux de complétion" }),
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: [
            data.total_maintenances ? Math.round((data.completed_maintenances || 0) / data.total_maintenances * 100) : 0,
            "%"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Maintenances complétées" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Coût moyen" }),
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            (data.average_cost || 0).toLocaleString(),
            " €"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Par intervention" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Planifiées" }),
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: data.scheduled_maintenances || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Maintenances programmées" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Véhicules à réviser" }),
          /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-600 dark:text-orange-400", children: data.vehicles_due || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Révision en retard" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Prochainement" }),
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: data.upcoming_maintenances || 0 }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Prévues ce mois" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5" }),
            "Maintenances à venir"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Planifiées pour les 30 prochains jours" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
          { vehicle: "AB-123-CD", type: "Révision complète", date: "2025-12-25", urgent: false },
          { vehicle: "EF-456-GH", type: "Changement pneus", date: "2025-12-28", urgent: false },
          { vehicle: "IJ-789-KL", type: "Vidange moteur", date: "2026-01-02", urgent: true },
          { vehicle: "MN-012-OP", type: "Contrôle technique", date: "2026-01-05", urgent: false }
        ].map((maintenance, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800 last:border-0", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "font-medium flex items-center gap-2", children: [
              maintenance.vehicle,
              maintenance.urgent && /* @__PURE__ */ jsx(Badge, { variant: "destructive", className: "text-xs", children: "Urgent" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: maintenance.type })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: new Date(maintenance.date).toLocaleDateString("fr-FR") })
        ] }, index)) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5" }),
            "Répartition des coûts"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Par type de maintenance" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Révisions" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "45%" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all", style: { width: "45%" } }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Réparations" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "30%" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "bg-orange-600 h-2 rounded-full transition-all", style: { width: "30%" } }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Pièces détachées" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "25%" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "bg-green-600 h-2 rounded-full transition-all", style: { width: "25%" } }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
function FuelConsumptionTemplate({ data }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Consommation totale" }),
          /* @__PURE__ */ jsx(Fuel, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            (data.total_fuel || 0).toLocaleString(),
            " L"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Sur la période" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Coût total" }),
          /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            (data.total_cost || 0).toLocaleString(),
            " €"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Dépenses en carburant" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Consommation moyenne" }),
          /* @__PURE__ */ jsx(Gauge, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            (data.average_consumption || 0).toFixed(1),
            " L/100km"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Moyenne de la flotte" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Économies réalisées" }),
          /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: [
            (data.fuel_savings || 0).toLocaleString(),
            " €"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Vs. période précédente" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Meilleure performance" }),
          /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: [
            (data.best_vehicle_consumption || 0).toFixed(1),
            " L/100km"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Véhicule le plus économe" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Pire performance" }),
          /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-red-600 dark:text-red-400", children: [
            (data.worst_vehicle_consumption || 0).toFixed(1),
            " L/100km"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Nécessite optimisation" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Émissions CO₂" }),
          /* @__PURE__ */ jsx(Droplet, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            (data.co2_emissions || 0).toLocaleString(),
            " kg"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Empreinte carbone" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium", children: "Distance totale" }),
          /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold", children: [
            (data.total_distance || 0).toLocaleString(),
            " km"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Sur la période" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Fuel, { className: "h-5 w-5" }),
            "Top véhicules par consommation"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Classement des plus économes" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
          { vehicle: "AB-123-CD", consumption: 6.2, savings: "+15%" },
          { vehicle: "EF-456-GH", consumption: 6.8, savings: "+10%" },
          { vehicle: "IJ-789-KL", consumption: 7.1, savings: "+8%" },
          { vehicle: "MN-012-OP", consumption: 7.5, savings: "+5%" },
          { vehicle: "QR-345-ST", consumption: 8.2, savings: "-3%" }
        ].map((vehicle, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800 last:border-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : index === 4 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`, children: index + 1 }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: vehicle.vehicle })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("div", { className: "font-bold", children: [
              vehicle.consumption,
              " L/100km"
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-xs ${vehicle.savings.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`, children: vehicle.savings })
          ] })
        ] }, index)) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "h-5 w-5" }),
            "Évolution mensuelle"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Tendance de consommation" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Janvier" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "7.2 L/100km" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all", style: { width: "72%" } }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Février" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "6.8 L/100km" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "bg-green-600 h-2 rounded-full transition-all", style: { width: "68%" } }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Mars" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: "6.5 L/100km" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800", children: /* @__PURE__ */ jsx("div", { className: "bg-green-600 h-2 rounded-full transition-all", style: { width: "65%" } }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2 border-t border-gray-200 dark:border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: "Amélioration globale" }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-green-600 dark:text-green-400 flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4" }),
              "-9.7%"
            ] })
          ] }) })
        ] }) })
      ] })
    ] })
  ] });
}
const TabsContext = createContext(void 0);
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Les composants Tabs doivent être utilisés à l'intérieur d'un composant Tabs");
  }
  return context;
}
function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className = ""
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const isControlled = controlledValue !== void 0;
  const currentValue = isControlled ? controlledValue : internalValue;
  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };
  return /* @__PURE__ */ jsx(TabsContext.Provider, { value: { value: currentValue, onValueChange: handleValueChange }, children: /* @__PURE__ */ jsx("div", { className: `w-full ${className}`, children }) });
}
function TabsList({ children, className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className}`,
      children
    }
  );
}
function TabsTrigger({
  value,
  children,
  className = "",
  disabled = false
}) {
  const { value: currentValue, onValueChange } = useTabsContext();
  const isActive = currentValue === value;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: () => !disabled && onValueChange(value),
      disabled,
      className: `
        inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium 
        transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50
        ${isActive ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white" : "text-gray-500 hover:bg-white/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-white"}
        ${className}
      `,
      children
    }
  );
}
function TabsContent({
  value,
  children,
  className = ""
}) {
  const { value: currentValue } = useTabsContext();
  if (currentValue !== value) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: `mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`, children });
}
function EcoDrivingTemplate({ data }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-5 p-3 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-sm", children: data.vehicle_details && data.vehicle_details.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(Card, { className: "shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 bg-gray-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-90" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg backdrop-blur-sm", children: /* @__PURE__ */ jsx(Truck, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/90 uppercase tracking-wide mb-1", children: "Véhicules actifs" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: data.vehicle_details.filter((v) => (v.distance || 0) > 0).length }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80 mt-1", children: "En circulation" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-90" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg backdrop-blur-sm", children: /* @__PURE__ */ jsx(Gauge, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/90 uppercase tracking-wide mb-1", children: "Véhicules en excès" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: data.vehicle_details.filter((v) => (v.max_speed || 0) > 90).length }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80 mt-1", children: "> 90 km/h" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg backdrop-blur-sm", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/90 uppercase tracking-wide mb-1", children: "Vitesse maximale" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: Math.max(...data.vehicle_details.map((v) => v.max_speed || 0)) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80 mt-1", children: "km/h" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 opacity-90" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg backdrop-blur-sm", children: /* @__PURE__ */ jsx(Bell, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/90 uppercase tracking-wide mb-1", children: "Violations vitesses" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: data.vehicle_details.reduce((sum, v) => sum + (v.speed_violations || 0), 0) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80 mt-1", children: "Infractions" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Répartition des violations par niveau de risque" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white p-4", children: (() => {
          const getRiskLevel = (vehicle) => {
            const totalViolations = vehicle.total_violations || 0;
            if (totalViolations === 0) return "ACCEPTABLE";
            if (totalViolations < 50) return "ÉLEVÉ";
            return "CRITIQUE";
          };
          const classifiedVehicles = data.vehicle_details.map((v) => ({
            ...v,
            risk: getRiskLevel(v)
          }));
          const acceptable = classifiedVehicles.filter((v) => v.risk === "ACCEPTABLE").length;
          const elevated = classifiedVehicles.filter((v) => v.risk === "ÉLEVÉ").length;
          const critical = classifiedVehicles.filter((v) => v.risk === "CRITIQUE").length;
          const total = data.vehicle_details.length;
          if (total === 0) {
            return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune donnée disponible" });
          }
          const riskData = [
            { label: "ACCEPTABLE", count: acceptable, color: "#3b82f6" },
            { label: "ÉLEVÉ", count: elevated, color: "#f59e0b" },
            { label: "CRITIQUE", count: critical, color: "#ef4444" }
          ].filter((item) => item.count > 0);
          return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-56 h-56", children: [
              /* @__PURE__ */ jsx("svg", { viewBox: "0 0 200 200", className: "transform -rotate-90", children: (() => {
                let currentAngle = 0;
                return riskData.map((item, idx) => {
                  const percentage = item.count / total;
                  const angle = percentage * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;
                  currentAngle = endAngle;
                  const startRad = startAngle * Math.PI / 180;
                  const endRad = endAngle * Math.PI / 180;
                  const x1 = 100 + 80 * Math.cos(startRad);
                  const y1 = 100 + 80 * Math.sin(startRad);
                  const x2 = 100 + 80 * Math.cos(endRad);
                  const y2 = 100 + 80 * Math.sin(endRad);
                  const largeArc = angle > 180 ? 1 : 0;
                  return /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`,
                      fill: item.color,
                      stroke: "white",
                      strokeWidth: "2"
                    },
                    idx
                  );
                });
              })() }),
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-800", children: total }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Véhicules" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2 w-full text-xs", children: riskData.map((item, idx) => {
              const percentage = (item.count / total * 100).toFixed(1);
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.label })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-gray-600", children: [
                  percentage,
                  "% (",
                  item.count,
                  ")"
                ] })
              ] }, idx);
            }) })
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Classification des véhicules par niveau de risque" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white p-4", children: (() => {
          const getRiskLevel = (vehicle) => {
            const totalViolations = vehicle.total_violations || 0;
            if (totalViolations === 0) return "ACCEPTABLE";
            if (totalViolations < 50) return "ÉLEVÉ";
            return "CRITIQUE";
          };
          const classifiedVehicles = data.vehicle_details.map((v) => ({
            ...v,
            risk: getRiskLevel(v)
          }));
          const acceptable = classifiedVehicles.filter((v) => v.risk === "ACCEPTABLE");
          const elevated = classifiedVehicles.filter((v) => v.risk === "ÉLEVÉ");
          const critical = classifiedVehicles.filter((v) => v.risk === "CRITIQUE");
          return /* @__PURE__ */ jsxs(Tabs, { defaultValue: "acceptable", className: "w-full", children: [
            /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
              /* @__PURE__ */ jsxs(TabsTrigger, { value: "acceptable", className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-blue-500" }),
                "ACCEPTABLE (",
                acceptable.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxs(TabsTrigger, { value: "elevated", className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-amber-500" }),
                "ÉLEVÉ (",
                elevated.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxs(TabsTrigger, { value: "critical", className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-red-500" }),
                "CRITIQUE (",
                critical.length,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx(TabsContent, { value: "acceptable", className: "mt-4", children: acceptable.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto pr-2", children: acceptable.map((vehicle, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xs", children: idx + 1 }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900", children: vehicle.immatriculation })
              ] }),
              /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-blue-100 text-blue-700 border-blue-300", children: [
                vehicle.total_violations || 0,
                " violations"
              ] })
            ] }, idx)) }) : /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucun véhicule dans cette catégorie" }) }),
            /* @__PURE__ */ jsx(TabsContent, { value: "elevated", className: "mt-4", children: elevated.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto pr-2", children: elevated.map((vehicle, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs", children: idx + 1 }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900", children: vehicle.immatriculation })
              ] }),
              /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-amber-100 text-amber-700 border-amber-300", children: [
                vehicle.total_violations || 0,
                " violations"
              ] })
            ] }, idx)) }) : /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucun véhicule dans cette catégorie" }) }),
            /* @__PURE__ */ jsx(TabsContent, { value: "critical", className: "mt-4", children: critical.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto pr-2", children: critical.map((vehicle, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-xs", children: idx + 1 }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900", children: vehicle.immatriculation })
              ] }),
              /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "bg-red-100 text-red-700 border-red-300", children: [
                vehicle.total_violations || 0,
                " violations"
              ] })
            ] }, idx)) }) : /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucun véhicule dans cette catégorie" }) })
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Distribution des distances parcourues par véhicule (km)" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white p-4", children: (() => {
          const sortedByDistance = [...data.vehicle_details].filter((v) => (v.distance || 0) > 0).sort((a, b) => (b.distance || 0) - (a.distance || 0)).slice(0, 8);
          if (sortedByDistance.length === 0) {
            return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune distance parcourue" });
          }
          const maxDistance = Math.max(...sortedByDistance.map((v) => v.distance || 0));
          return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-end justify-around h-64 gap-2 pb-6", children: sortedByDistance.map((vehicle, idx) => {
              const distance = vehicle.distance || 0;
              const heightPercent = maxDistance > 0 ? distance / maxDistance * 100 : 0;
              return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-end flex-1 h-full", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold mb-1 text-[#1e3a5f]", children: distance.toFixed(1) }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-full bg-gradient-to-t from-[#1e3a5f] to-[#3b5998] rounded-t transition-all duration-300 hover:opacity-80 min-h-[4px]",
                    style: { height: `${heightPercent}%` }
                  }
                )
              ] }, idx);
            }) }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-around gap-2", children: sortedByDistance.map((vehicle, idx) => /* @__PURE__ */ jsx("div", { className: "flex-1 text-center text-xs", children: vehicle.immatriculation }, idx)) })
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Accélérations par véhicule" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white", children: (() => {
          const topAccelerators = data.vehicle_details.filter((v) => (v.harsh_acceleration || 0) > 0).sort((a, b) => (b.harsh_acceleration || 0) - (a.harsh_acceleration || 0)).slice(0, 8);
          const maxAccel = Math.max(...topAccelerators.map((v) => v.harsh_acceleration || 0));
          return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: topAccelerators.map((vehicle, idx) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1 text-xs", children: [
              /* @__PURE__ */ jsx("span", { children: vehicle.immatriculation }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: vehicle.harsh_acceleration })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded h-4", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "bg-[#1e3a5f] h-4 rounded",
                style: { width: `${(vehicle.harsh_acceleration || 0) / maxAccel * 100}%` }
              }
            ) })
          ] }, idx)) });
        })() })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white md:col-span-2", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base text-gray-800", children: "Tendance des vitesses maximales atteintes (Km/h)" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white p-4", children: (() => {
          const sortedBySpeed = [...data.vehicle_details].sort((a, b) => (b.max_speed || 0) - (a.max_speed || 0)).slice(0, 12);
          const maxSpeed = Math.max(...sortedBySpeed.map((v) => v.max_speed || 0));
          const yMax = Math.ceil(maxSpeed / 10) * 10;
          if (sortedBySpeed.length === 0) {
            return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune donnée disponible" });
          }
          return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "relative pt-6 pb-16 px-2", children: /* @__PURE__ */ jsxs("div", { className: "relative h-72", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-12 w-12 flex flex-col justify-between text-xs text-gray-600 font-medium", children: [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0].map((val, i) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end pr-2", children: /* @__PURE__ */ jsx("span", { children: val.toFixed(0) }) }, i)) }),
              /* @__PURE__ */ jsxs("div", { className: "absolute left-12 right-0 top-0 bottom-12 border-l-2 border-b-2 border-gray-300", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex flex-col justify-between", children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 border-dashed" }, i)) }),
                /* @__PURE__ */ jsxs("svg", { className: "absolute inset-0 w-full h-full overflow-visible", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: [
                  /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "speedGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#1e3a5f", stopOpacity: "0.3" }),
                    /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#1e3a5f", stopOpacity: "0.05" })
                  ] }) }),
                  /* @__PURE__ */ jsx(
                    "polygon",
                    {
                      fill: "url(#speedGradient)",
                      points: `
                                                                                0,100 
                                                                                ${sortedBySpeed.map((v, i) => {
                        const x = i / (sortedBySpeed.length - 1) * 100;
                        const y = 100 - (v.max_speed || 0) / yMax * 100;
                        return `${x},${y}`;
                      }).join(" ")}
                                                                                100,100
                                                                            `
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "polyline",
                    {
                      fill: "none",
                      stroke: "#1e3a5f",
                      strokeWidth: "1",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      vectorEffect: "non-scaling-stroke",
                      points: sortedBySpeed.map((v, i) => {
                        const x = i / (sortedBySpeed.length - 1) * 100;
                        const y = 100 - (v.max_speed || 0) / yMax * 100;
                        return `${x},${y}`;
                      }).join(" ")
                    }
                  ),
                  sortedBySpeed.map((v, i) => {
                    const x = i / (sortedBySpeed.length - 1) * 100;
                    const y = 100 - (v.max_speed || 0) / yMax * 100;
                    const isHighSpeed = (v.max_speed || 0) > 90;
                    return /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx(
                      "circle",
                      {
                        cx: x,
                        cy: y,
                        r: "1.8",
                        fill: "white",
                        stroke: isHighSpeed ? "#ef4444" : "#1e3a5f",
                        strokeWidth: "0.8",
                        vectorEffect: "non-scaling-stroke"
                      }
                    ) }, i);
                  })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none", children: sortedBySpeed.map((v, i) => {
                  const xPercent = i / (sortedBySpeed.length - 1) * 100;
                  const yPercent = 100 - (v.max_speed || 0) / yMax * 100;
                  const isHighSpeed = (v.max_speed || 0) > 90;
                  return /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `absolute text-[10px] font-bold whitespace-nowrap ${isHighSpeed ? "text-red-600" : "text-[#1e3a5f]"}`,
                      style: {
                        left: `${xPercent}%`,
                        top: `${yPercent}%`,
                        transform: "translate(-50%, -18px)"
                      },
                      children: v.max_speed
                    },
                    i
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "absolute left-12 right-0 bottom-0 h-12 pt-2", children: /* @__PURE__ */ jsx("div", { className: "relative w-full h-full", children: sortedBySpeed.map((v, i) => {
                const xPercent = i / (sortedBySpeed.length - 1) * 100;
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute text-[9px] font-medium text-gray-700 transform -rotate-45 origin-top-left whitespace-nowrap",
                    style: {
                      left: `${xPercent}%`,
                      top: "0px"
                    },
                    children: v.immatriculation
                  },
                  i
                );
              }) }) })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6 text-xs bg-gray-50 p-2 rounded", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-[#1e3a5f]" }),
                /* @__PURE__ */ jsx("span", { children: "Vitesse normale (≤90 km/h)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-red-600" }),
                /* @__PURE__ */ jsx("span", { children: "Excès de vitesse (>90 km/h)" })
              ] })
            ] })
          ] });
        })() })
      ] })
    ] })
  ] }) }) }) });
}
function DriverEcoDrivingTemplate({ data }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-5 p-3 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-sm", children: data.vehicle_details && data.vehicle_details.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(Card, { className: "shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-6 bg-gray-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg backdrop-blur-sm", children: /* @__PURE__ */ jsx(MapPin, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/90 uppercase tracking-wide mb-1", children: "Distance totale" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: data.vehicle_details.reduce((sum, v) => sum + (v.distance || 0), 0).toFixed(0) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80 mt-1", children: "km parcourus" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 opacity-90" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg backdrop-blur-sm", children: /* @__PURE__ */ jsx(Clock, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/90 uppercase tracking-wide mb-1", children: "Temps de conduite" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: (() => {
              const totalMinutes = data.vehicle_details.reduce((sum, v) => {
                const match = v.driving_time?.match(/(\d+)h\s*(\d+)min/);
                return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
              }, 0);
              return `${Math.floor(totalMinutes / 60)}h ${(totalMinutes % 60).toString().padStart(2, "0")}`;
            })() }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80 mt-1", children: "En circulation" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-90" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg backdrop-blur-sm", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/90 uppercase tracking-wide mb-1", children: "Évènements totaux" }),
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: data.vehicle_details.reduce(
              (sum, v) => sum + (v.harsh_braking || 0) + (v.harsh_acceleration || 0) + (v.dangerous_turns || 0),
              0
            ) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80 mt-1", children: "Infractions détectées" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 opacity-90" }),
        /* @__PURE__ */ jsxs("div", { className: "relative p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-white/20 rounded-lg backdrop-blur-sm", children: /* @__PURE__ */ jsx(Zap, { className: "h-6 w-6 text-white" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-white/90 uppercase tracking-wide mb-1", children: "Temps au ralenti" }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: (() => {
              const totalMinutes = data.vehicle_details.reduce((sum, v) => {
                const match = v.idle_time?.match(/(\d+)h\s*(\d+)min/);
                return sum + (match ? parseInt(match[1]) * 60 + parseInt(match[2]) : 0);
              }, 0);
              return `${Math.floor(totalMinutes / 60)}h ${(totalMinutes % 60).toString().padStart(2, "0")}`;
            })() }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-white/80 mt-1", children: "Moteur au ralenti" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Répartition des infractions par véhicule (%)" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white p-4", children: (() => {
          const totalViolations = data.vehicle_details.reduce((sum, v) => sum + (v.total_violations || 0), 0);
          const topViolators = data.vehicle_details.filter((v) => (v.total_violations || 0) > 0).sort((a, b) => (b.total_violations || 0) - (a.total_violations || 0)).slice(0, 6);
          if (totalViolations === 0) {
            return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune infraction" });
          }
          const colors = ["#1e3a5f", "#8B4513", "#d946ef", "#f59e0b", "#10b981", "#ef4444"];
          return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-64 h-64", children: [
              /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 200", className: "transform -rotate-90", children: [
                (() => {
                  let currentAngle = 0;
                  return topViolators.map((vehicle, idx) => {
                    const percentage = (vehicle.total_violations || 0) / totalViolations;
                    const angle = percentage * 360;
                    const startAngle = currentAngle;
                    currentAngle += angle;
                    const startRad = startAngle * Math.PI / 180;
                    const endRad = currentAngle * Math.PI / 180;
                    const x1 = 100 + 75 * Math.cos(startRad);
                    const y1 = 100 + 75 * Math.sin(startRad);
                    const x2 = 100 + 75 * Math.cos(endRad);
                    const y2 = 100 + 75 * Math.sin(endRad);
                    const largeArc = angle > 180 ? 1 : 0;
                    return /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: `M 100 100 L ${x1} ${y1} A 75 75 0 ${largeArc} 1 ${x2} ${y2} Z`,
                        fill: colors[idx],
                        stroke: "white",
                        strokeWidth: "2",
                        className: "hover:opacity-80 transition-opacity cursor-pointer"
                      },
                      idx
                    );
                  });
                })(),
                /* @__PURE__ */ jsx("circle", { cx: "100", cy: "100", r: "50", fill: "white" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-gray-800", children: totalViolations }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Total" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full grid grid-cols-2 gap-1.5 text-xs", children: topViolators.map((vehicle, idx) => {
              const percentage = ((vehicle.total_violations || 0) / totalViolations * 100).toFixed(1);
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 p-1.5 rounded hover:bg-gray-50", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-sm flex-shrink-0", style: { backgroundColor: colors[idx] } }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium truncate", children: vehicle.immatriculation })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end text-right flex-shrink-0", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-bold text-gray-800", children: [
                    percentage,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "text-gray-500 text-[10px]", children: [
                    "(",
                    vehicle.total_violations,
                    ")"
                  ] })
                ] })
              ] }, idx);
            }) })
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Nombre d'infractions par véhicules" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white p-4", children: (() => {
          const topViolators = data.vehicle_details.filter((v) => (v.harsh_braking || 0) + (v.harsh_acceleration || 0) + (v.dangerous_turns || 0) > 0).sort(
            (a, b) => (b.harsh_braking || 0) + (b.harsh_acceleration || 0) + (b.dangerous_turns || 0) - ((a.harsh_braking || 0) + (a.harsh_acceleration || 0) + (a.dangerous_turns || 0))
          ).slice(0, 4);
          const maxValue = Math.max(
            ...topViolators.map(
              (v) => Math.max(v.harsh_braking || 0, v.harsh_acceleration || 0, v.dangerous_turns || 0)
            )
          );
          if (topViolators.length === 0) {
            return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune infraction" });
          }
          return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-xs justify-center bg-gray-50 p-2 rounded", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded bg-[#1e3a5f]" }),
                /* @__PURE__ */ jsx("span", { children: "Virages dangereux" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded bg-[#d946ef]" }),
                /* @__PURE__ */ jsx("span", { children: "Freinages brusques" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded bg-[#8B4513]" }),
                /* @__PURE__ */ jsx("span", { children: "Accélérations brusques" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-end justify-around h-56 gap-6 pb-2", children: topViolators.map((vehicle, idx) => /* @__PURE__ */ jsxs("div", { className: "flex-1 flex gap-2 items-end justify-center h-full", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-end h-full", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs font-bold mb-1 text-[#1e3a5f]", children: vehicle.dangerous_turns || 0 }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-full bg-gradient-to-t from-[#1e3a5f] to-[#3b5998] rounded-t transition-all duration-300 hover:opacity-80 min-h-[6px]",
                      style: { height: `${(vehicle.dangerous_turns || 0) / maxValue * 100}%` }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-end h-full", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs font-bold mb-1 text-[#d946ef]", children: vehicle.harsh_braking || 0 }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-full bg-gradient-to-t from-[#d946ef] to-[#f0abfc] rounded-t transition-all duration-300 hover:opacity-80 min-h-[6px]",
                      style: { height: `${(vehicle.harsh_braking || 0) / maxValue * 100}%` }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-end h-full", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs font-bold mb-1 text-[#8B4513]", children: vehicle.harsh_acceleration || 0 }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-full bg-gradient-to-t from-[#8B4513] to-[#D4A76A] rounded-t transition-all duration-300 hover:opacity-80 min-h-[6px]",
                      style: { height: `${(vehicle.harsh_acceleration || 0) / maxValue * 100}%` }
                    }
                  )
                ] })
              ] }, idx)) }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-around gap-6", children: topViolators.map((vehicle, idx) => /* @__PURE__ */ jsx("div", { className: "flex-1 text-center text-xs font-semibold text-gray-700", children: vehicle.immatriculation }, idx)) })
            ] })
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Score de risque par véhicule" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white", children: (() => {
          const getRiskColor = (violations) => {
            if (violations === 0) return "#10b981";
            if (violations < 50) return "#f59e0b";
            return "#ef4444";
          };
          const sortedVehicles = [...data.vehicle_details].sort((a, b) => (b.total_violations || 0) - (a.total_violations || 0)).slice(0, 10);
          const maxViolations = Math.max(...sortedVehicles.map((v) => v.total_violations || 0));
          return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: sortedVehicles.map((vehicle, idx) => /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-between mb-1 text-xs", children: /* @__PURE__ */ jsx("span", { children: vehicle.immatriculation }) }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded h-5", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-5 rounded transition-all",
                style: {
                  width: `${maxViolations > 0 ? (vehicle.total_violations || 0) / maxViolations * 100 : 0}%`,
                  backgroundColor: getRiskColor(vehicle.total_violations || 0),
                  minWidth: (vehicle.total_violations || 0) > 0 ? "20px" : "0"
                }
              }
            ) })
          ] }, idx)) });
        })() })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Distribution des distances parcourues par véhicule (km)" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white p-4", children: (() => {
          const sortedByDistance = [...data.vehicle_details].sort((a, b) => (b.distance || 0) - (a.distance || 0)).slice(0, 9);
          const maxDistance = Math.max(...sortedByDistance.map((v) => v.distance || 0));
          return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-end justify-around h-64 gap-2 pb-6", children: sortedByDistance.map((vehicle, idx) => {
              const heightPercent = (vehicle.distance || 0) / maxDistance * 100;
              return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-end flex-1 h-full", children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold mb-1 text-[#1e3a5f]", children: vehicle.distance ? vehicle.distance.toFixed(0) : "0" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-full bg-gradient-to-t from-[#1e3a5f] to-[#3b5998] rounded-t transition-all duration-300 hover:opacity-80 min-h-[4px]",
                    style: { height: `${heightPercent}%` }
                  }
                )
              ] }, idx);
            }) }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-around gap-2", children: sortedByDistance.map((vehicle, idx) => /* @__PURE__ */ jsx("div", { className: "flex-1 text-center text-xs", children: vehicle.immatriculation }, idx)) })
          ] });
        })() })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white md:col-span-2", children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Taux d'utilisation des véhicules (Durée de conduite VS Temps au ralenti)" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "bg-white p-4", children: (() => {
          const vehiclesWithTime = data.vehicle_details.map((v) => {
            const drivingMatch = v.driving_time?.match(/(\d+)h\s*(\d+)min/);
            const idleMatch = v.idle_time?.match(/(\d+)h\s*(\d+)min/);
            const drivingMinutes = drivingMatch ? parseInt(drivingMatch[1]) * 60 + parseInt(drivingMatch[2]) : 0;
            const idleMinutes = idleMatch ? parseInt(idleMatch[1]) * 60 + parseInt(idleMatch[2]) : 0;
            const totalMinutes = drivingMinutes + idleMinutes;
            return {
              ...v,
              drivingMinutes,
              idleMinutes,
              totalMinutes,
              drivingPercent: totalMinutes > 0 ? drivingMinutes / totalMinutes * 100 : 0,
              idlePercent: totalMinutes > 0 ? idleMinutes / totalMinutes * 100 : 0
            };
          }).filter((v) => v.totalMinutes > 0).sort((a, b) => b.drivingPercent - a.drivingPercent).slice(0, 10);
          if (vehiclesWithTime.length === 0) {
            return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune donnée disponible" });
          }
          const maxPercent = Math.max(
            ...vehiclesWithTime.map((v) => Math.max(v.drivingPercent, v.idlePercent))
          );
          const yMax = Math.ceil(maxPercent / 10) * 10;
          return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex gap-6 text-xs justify-center bg-gray-50 p-3 rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-0.5 bg-[#1e3a5f]" }),
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-[#1e3a5f] -ml-1" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-[#1e3a5f]", children: "Durée de conduite (%)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-8 h-0.5 bg-[#f59e0b]" }),
                  /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-[#f59e0b] -ml-1" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-[#f59e0b]", children: "Temps au ralenti (%)" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "relative pt-4 pb-12", children: /* @__PURE__ */ jsxs("div", { className: "relative h-64 border-l-2 border-b-2 border-gray-300 ml-8", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute -left-8 inset-y-0 flex flex-col justify-between text-xs text-gray-600 font-medium", children: [yMax, yMax * 0.75, yMax * 0.5, yMax * 0.25, 0].map((val, i) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs("span", { className: "absolute right-1 -translate-y-1/2", children: [
                  val.toFixed(0),
                  "%"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "absolute left-8 w-full border-t border-gray-200 border-dashed" })
              ] }, i)) }),
              /* @__PURE__ */ jsxs("svg", { className: "absolute inset-0 w-full h-full overflow-visible", viewBox: "0 0 100 100", preserveAspectRatio: "none", children: [
                /* @__PURE__ */ jsx(
                  "polyline",
                  {
                    fill: "none",
                    stroke: "#1e3a5f",
                    strokeWidth: "0.8",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke",
                    points: vehiclesWithTime.map((v, i) => {
                      const x = i / (vehiclesWithTime.length - 1) * 100;
                      const y = 100 - v.drivingPercent / yMax * 100;
                      return `${x},${y}`;
                    }).join(" ")
                  }
                ),
                vehiclesWithTime.map((v, i) => {
                  const x = i / (vehiclesWithTime.length - 1) * 100;
                  const y = 100 - v.drivingPercent / yMax * 100;
                  return /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx: x,
                      cy: y,
                      r: "1.5",
                      fill: "white",
                      stroke: "#1e3a5f",
                      strokeWidth: "0.6",
                      vectorEffect: "non-scaling-stroke"
                    }
                  ) }, `driving-${i}`);
                }),
                /* @__PURE__ */ jsx(
                  "polyline",
                  {
                    fill: "none",
                    stroke: "#f59e0b",
                    strokeWidth: "0.8",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "2,2",
                    vectorEffect: "non-scaling-stroke",
                    points: vehiclesWithTime.map((v, i) => {
                      const x = i / (vehiclesWithTime.length - 1) * 100;
                      const y = 100 - v.idlePercent / yMax * 100;
                      return `${x},${y}`;
                    }).join(" ")
                  }
                ),
                vehiclesWithTime.map((v, i) => {
                  const x = i / (vehiclesWithTime.length - 1) * 100;
                  const y = 100 - v.idlePercent / yMax * 100;
                  return /* @__PURE__ */ jsx("g", { children: /* @__PURE__ */ jsx(
                    "circle",
                    {
                      cx: x,
                      cy: y,
                      r: "1.5",
                      fill: "white",
                      stroke: "#f59e0b",
                      strokeWidth: "0.6",
                      vectorEffect: "non-scaling-stroke"
                    }
                  ) }, `idle-${i}`);
                })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none", children: vehiclesWithTime.map((v, i) => {
                const xPercent = i / (vehiclesWithTime.length - 1) * 100;
                const yDrivingPercent = 100 - v.drivingPercent / yMax * 100;
                const yIdlePercent = 100 - v.idlePercent / yMax * 100;
                return /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "absolute text-[10px] font-bold text-[#1e3a5f] whitespace-nowrap",
                      style: {
                        left: `${xPercent}%`,
                        top: `${yDrivingPercent}%`,
                        transform: "translate(-50%, -20px)"
                      },
                      children: [
                        v.drivingPercent.toFixed(1),
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "absolute text-[10px] font-bold text-[#f59e0b] whitespace-nowrap",
                      style: {
                        left: `${xPercent}%`,
                        top: `${yIdlePercent}%`,
                        transform: "translate(-50%, 12px)"
                      },
                      children: [
                        v.idlePercent.toFixed(1),
                        "%"
                      ]
                    }
                  )
                ] }, i);
              }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-10 left-0 right-0 flex justify-between px-1", children: vehiclesWithTime.map((v, i) => /* @__PURE__ */ jsx(
                "div",
                {
                  className: "text-[10px] font-medium text-gray-700 transform -rotate-45 origin-top-left",
                  style: { width: "60px" },
                  children: v.immatriculation
                },
                i
              )) })
            ] }) })
          ] });
        })() })
      ] })
    ] })
  ] }) }) }) });
}
function GeoEcoDrivingTemplate({ data }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-6", children: data.events && data.events.length > 0 && /* @__PURE__ */ jsx(Card, { className: "shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 overflow-hidden", children: /* @__PURE__ */ jsx(CardContent, { className: "p-6 bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white", children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Nombre de véhicules par Type d'événement" }) }),
    /* @__PURE__ */ jsx(CardContent, { className: "bg-white", children: (() => {
      if (!data?.events_by_name || !data?.stats?.events_by_name) {
        return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune donnée d'événements disponible" });
      }
      const getEventDisplayName = (eventName) => {
        if (eventName === "2HS_Between 20h and 04h") {
          return "Conduite de nuit";
        }
        if (eventName === "SPEED") {
          return "Vitesse";
        }
        return eventName;
      };
      const eventsByName = data.stats.events_by_name;
      const totalEvents = data.stats.total_events;
      if (totalEvents === 0) {
        return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucun événement trouvé" });
      }
      const topEvents = Object.entries(eventsByName).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const colors = ["#ef4444", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"];
      return /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "relative w-48 h-48 mx-auto mb-4", children: [
          /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 100", className: "transform -rotate-90", children: [
            (() => {
              let currentAngle = 0;
              return topEvents.map(([eventName, count], idx) => {
                const percentage = count / totalEvents * 100;
                const angle = percentage / 100 * 360;
                const startAngle = currentAngle;
                currentAngle += angle;
                const startRad = startAngle * Math.PI / 180;
                const endRad = currentAngle * Math.PI / 180;
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                const largeArc = angle > 180 ? 1 : 0;
                const displayName = getEventDisplayName(eventName);
                return /* @__PURE__ */ jsxs("g", { children: [
                  /* @__PURE__ */ jsx("title", { children: `${displayName}: ${count} (${percentage.toFixed(1)}%)` }),
                  /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
                      fill: colors[idx],
                      stroke: "white",
                      strokeWidth: "0.5",
                      className: "hover:opacity-80 transition-opacity cursor-pointer"
                    }
                  )
                ] }, idx);
              });
            })(),
            /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "25", fill: "white" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-gray-800", children: totalEvents }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Total" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2 text-xs", children: topEvents.map(([eventName, count], idx) => {
          const percentage = (count / totalEvents * 100).toFixed(1);
          const displayName = getEventDisplayName(eventName);
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-3 h-3 rounded-full flex-shrink-0",
                  style: { backgroundColor: colors[idx] }
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "truncate", title: displayName, children: displayName.length > 20 ? displayName.substring(0, 20) + "..." : displayName })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 ml-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                percentage,
                "%"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
                "(",
                count,
                ")"
              ] })
            ] })
          ] }, idx);
        }) })
      ] });
    })() })
  ] }) }) }) }) });
}
function ReportDetail({ report }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/reports/${report.id}/export/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/pdf"
        }
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rapport-${report.name.toLowerCase().replace(/\s+/g, "-")}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Erreur lors de l'export PDF");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsExporting(false);
    }
  };
  const handleShareEmail = async () => {
    setIsSharing(true);
    try {
      const response = await fetch(`/api/reports/${report.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        alert("Le rapport a été envoyé par email avec succès !");
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.message || "Impossible d'envoyer le rapport"}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de l'envoi du rapport");
    } finally {
      setIsSharing(false);
    }
  };
  const renderTemplate = () => {
    const data = {
      ...report.data,
      period_start: report.period_start,
      period_end: report.period_end
    };
    switch (report.type) {
      case "summary":
        return /* @__PURE__ */ jsx(SummaryTemplate, { data });
      case "fleet_activity":
        return /* @__PURE__ */ jsx(FleetActivityTemplate, { data });
      case "driver_behavior":
        return /* @__PURE__ */ jsx(DriverBehaviorTemplate, { data });
      case "maintenance":
        return /* @__PURE__ */ jsx(MaintenanceTemplate, { data });
      case "fuel_consumption":
        return /* @__PURE__ */ jsx(FuelConsumptionTemplate, { data });
      case "eco_driving":
        return /* @__PURE__ */ jsx(EcoDrivingTemplate, { data });
      case "driver_eco_driving":
        return /* @__PURE__ */ jsx(DriverEcoDrivingTemplate, { data });
      case "geo_eco_driving":
        return /* @__PURE__ */ jsx(GeoEcoDrivingTemplate, { data });
      default:
        return /* @__PURE__ */ jsx(FleetActivityTemplate, { data });
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Rapports", href: "/reports" },
    { title: report.name, href: `/reports/${report.id}` }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: report.name }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: report.name }),
          report.period_start && report.period_end && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: [
            "Période: ",
            new Date(report.period_start).toLocaleDateString("fr-FR"),
            " - ",
            new Date(report.period_end).toLocaleDateString("fr-FR")
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleExportPDF,
              disabled: isExporting,
              variant: "outline",
              className: "flex items-center gap-2",
              children: [
                isExporting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
                isExporting ? "Export en cours..." : "Exporter en PDF"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleShareEmail,
              disabled: isSharing,
              className: "flex items-center gap-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600",
              children: [
                isSharing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }),
                isSharing ? "Envoi en cours..." : "Partager par email"
              ]
            }
          )
        ] })
      ] }),
      renderTemplate()
    ] })
  ] });
}
export {
  ReportDetail as default
};
