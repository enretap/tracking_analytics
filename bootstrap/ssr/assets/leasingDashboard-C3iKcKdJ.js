import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { A as AppLayout, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuCheckboxItem } from "./app-layout-C3_vghij.js";
import { d as dashboard, B as Button } from "./button-VCvxHZJY.js";
import { usePage, Head } from "@inertiajs/react";
import { FileKey, Building2, Car, Activity, PauseCircle, AlertTriangle, Clock, Search, Columns2, MapPin, ChevronLeft, ChevronRight, Gauge, RefreshCw } from "lucide-react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-BK6R-x6E.js";
import { B as Badge } from "./badge-D_0uEcAf.js";
import { u as useVehicles } from "./useVehicles-qp71L5JC.js";
import { I as Input } from "./input-KsoydCnh.js";
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
import "axios";
const VehicleMap = lazy(() => import("./vehicle-map-DvD31aff.js").then((module) => ({ default: module.VehicleMap })));
const breadcrumbs = [
  {
    title: "Accueil",
    href: dashboard().url
  }
];
const mockVehicles = [];
function LeasingDashboard({ eco_data, event_data }) {
  const { auth } = usePage().props;
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [dateRange, setDateRange] = useState({ from: /* @__PURE__ */ new Date(), to: /* @__PURE__ */ new Date() });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [totalReports, setTotalReports] = useState(0);
  const { vehicles: apiVehicles } = useVehicles();
  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
      try {
        const response = await fetch("/api/reports");
        if (response.ok) {
          const data = await response.json();
          setReports(data.data || []);
          setTotalReports(data.total || 0);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des rapports:", error);
      } finally {
        setLoadingReports(false);
      }
    };
    fetchReports();
  }, []);
  const vehicles = apiVehicles.length > 0 ? apiVehicles : mockVehicles;
  const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [visibleColumns, setVisibleColumns] = useState({
    plate: true,
    brand: true,
    model: true,
    distance: true,
    position: true,
    lastUpdate: true,
    status: true
  });
  useEffect(() => {
    if (vehicles.length > 0 && selectedVehicleIds.length === 0) {
      const activeIds = vehicles.filter((v) => v.status === "active").map((v) => v.id);
      setSelectedVehicleIds(activeIds);
    }
  }, [vehicles]);
  const displayedVehicles = useMemo(
    () => vehicles.filter((v) => selectedVehicleIds.includes(v.id)),
    [vehicles, selectedVehicleIds]
  );
  const stats = useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1e3);
    return {
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter((v) => v.status === "active").length,
      inactiveVehicles: vehicles.filter((v) => v.status === "inactive").length,
      maintenanceVehicles: vehicles.filter((v) => v.status === "maintenance").length,
      outdatedVehicles: vehicles.filter((v) => {
        const lastUpdate = new Date(v.lastUpdate);
        return lastUpdate < threeDaysAgo;
      }).length
    };
  }, [vehicles]);
  const topVehiclesByDistance = useMemo(
    () => [...vehicles].filter((v) => v.distance > 0).sort((a, b) => b.distance - a.distance).slice(0, 5),
    [vehicles]
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const handleToggleVehicle = (vehicleId) => {
    setSelectedVehicleIds(
      (prev) => prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  };
  const handleSelectAll = () => {
    setSelectedVehicleIds(vehicles.map((v) => v.id));
  };
  const handleSelectActiveOnly = () => {
    const activeIds = vehicles.filter((v) => v.status === "active").map((v) => v.id);
    setSelectedVehicleIds(activeIds);
  };
  const handleDeselectAll = () => {
    setSelectedVehicleIds([]);
  };
  const filteredVehicles = useMemo(() => {
    if (!vehicleSearchQuery.trim()) return vehicles;
    const query = vehicleSearchQuery.toLowerCase();
    return vehicles.filter(
      (v) => v.name.toLowerCase().includes(query) || v.plate.toLowerCase().includes(query)
    );
  }, [vehicles, vehicleSearchQuery]);
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Tableau de bord Leasing - Tracking Analytics" }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 p-4 pt-2 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white", children: [
            /* @__PURE__ */ jsx(FileKey, { className: "h-8 w-8 text-purple-600" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Tableau de bord Leasing - ",
              auth.user.account_name || auth.user.name
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Gestion et suivi de votre flotte" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center", children: auth.user.account_logo ? /* @__PURE__ */ jsx(
          "img",
          {
            src: `/storage/${auth.user.account_logo}`,
            alt: auth.user.account_name || auth.user.name,
            className: "h-16 w-16 rounded-lg object-cover shadow-md"
          }
        ) : /* @__PURE__ */ jsx(Building2, { className: "h-16 w-16 text-gray-400" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxs(Card, { className: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white dark:border-yellow-700 dark:from-yellow-900/20 dark:to-gray-900", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-medium text-yellow-600 dark:text-yellow-400", children: "Total des véhicules de la flotte" }),
            /* @__PURE__ */ jsx(Car, { className: "h-8 w-8 text-yellow-500" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: stats.totalVehicles }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Tous les véhicules de la flotte" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-800 dark:from-green-900/20 dark:to-gray-900", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-medium text-green-600 dark:text-green-400", children: "Véhicules en mouvement" }),
            /* @__PURE__ */ jsx(Activity, { className: "h-8 w-8 text-green-500" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: stats.activeVehicles }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: "En déplacement actuellement" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:border-slate-700 dark:from-slate-800/30 dark:to-gray-900", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-medium text-slate-700 dark:text-slate-300", children: "Véhicules à l'arrêt" }),
            /* @__PURE__ */ jsx(PauseCircle, { className: "h-8 w-8 text-slate-600 dark:text-slate-400" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: stats.totalVehicles - stats.activeVehicles }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 dark:text-slate-400", children: "Tous les véhicules à l'arrêt" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:border-orange-800 dark:from-orange-900/20 dark:to-gray-900", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-medium text-orange-600 dark:text-orange-400", children: "Véhicules en maintenance" }),
            /* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 text-orange-500" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: stats.maintenanceVehicles }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Véhicules en réparation" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-red-200 bg-gradient-to-br from-red-50 to-white dark:border-red-800 dark:from-red-900/20 dark:to-gray-900", children: [
          /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xs font-medium text-red-600 dark:text-red-400", children: "Non actualisés (+3j)" }),
            /* @__PURE__ */ jsx(Clock, { className: "h-8 w-8 text-red-500" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold text-gray-900 dark:text-white", children: stats.outdatedVehicles }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Dernière actualisation > 3 jours" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Car, { className: "h-5 w-5 text-purple-600" }),
              "Liste des véhicules"
            ] }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              vehicles.length,
              " véhicule",
              vehicles.length > 1 ? "s" : "",
              " au total"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "text",
                  placeholder: "Rechercher...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "pl-9 h-9 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "h-9 border-purple-200 hover:bg-purple-50", children: [
                /* @__PURE__ */ jsx(Columns2, { className: "h-4 w-4 mr-2" }),
                "Colonnes"
              ] }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-56", children: [
                /* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Colonnes visibles" }),
                /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsx(
                  DropdownMenuCheckboxItem,
                  {
                    checked: visibleColumns.plate,
                    onCheckedChange: (checked) => setVisibleColumns((prev) => ({ ...prev, plate: checked })),
                    children: "Immatriculation"
                  }
                ),
                /* @__PURE__ */ jsx(
                  DropdownMenuCheckboxItem,
                  {
                    checked: visibleColumns.brand,
                    onCheckedChange: (checked) => setVisibleColumns((prev) => ({ ...prev, brand: checked })),
                    children: "Marque"
                  }
                ),
                /* @__PURE__ */ jsx(
                  DropdownMenuCheckboxItem,
                  {
                    checked: visibleColumns.model,
                    onCheckedChange: (checked) => setVisibleColumns((prev) => ({ ...prev, model: checked })),
                    children: "Modèle"
                  }
                ),
                /* @__PURE__ */ jsx(
                  DropdownMenuCheckboxItem,
                  {
                    checked: visibleColumns.distance,
                    onCheckedChange: (checked) => setVisibleColumns((prev) => ({ ...prev, distance: checked })),
                    children: "Distance"
                  }
                ),
                /* @__PURE__ */ jsx(
                  DropdownMenuCheckboxItem,
                  {
                    checked: visibleColumns.position,
                    onCheckedChange: (checked) => setVisibleColumns((prev) => ({ ...prev, position: checked })),
                    children: "Dernière position"
                  }
                ),
                /* @__PURE__ */ jsx(
                  DropdownMenuCheckboxItem,
                  {
                    checked: visibleColumns.lastUpdate,
                    onCheckedChange: (checked) => setVisibleColumns((prev) => ({ ...prev, lastUpdate: checked })),
                    children: "Dernière actualisation"
                  }
                ),
                /* @__PURE__ */ jsx(
                  DropdownMenuCheckboxItem,
                  {
                    checked: visibleColumns.status,
                    onCheckedChange: (checked) => setVisibleColumns((prev) => ({ ...prev, status: checked })),
                    children: "Statut"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-purple-100 overflow-hidden shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-full divide-y divide-purple-100", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-purple-900/20", children: /* @__PURE__ */ jsxs("tr", { children: [
              visibleColumns.plate && /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider", children: "Immatriculation" }),
              visibleColumns.brand && /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider", children: "Marque" }),
              visibleColumns.model && /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider", children: "Modèle" }),
              visibleColumns.distance && /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider", children: "Distance" }),
              visibleColumns.position && /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider", children: "Dernière position" }),
              visibleColumns.lastUpdate && /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider", children: "Dernière actualisation" }),
              visibleColumns.status && /* @__PURE__ */ jsx("th", { className: "px-6 py-2 text-left text-xs font-semibold text-purple-900 dark:text-purple-300 uppercase tracking-wider", children: "Statut" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700", children: (() => {
              const filteredVehicles2 = vehicles.filter((vehicle) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return vehicle.plate?.toLowerCase().includes(query) || vehicle.name?.toLowerCase().includes(query) || vehicle.address?.toLowerCase().includes(query);
              });
              Math.ceil(filteredVehicles2.length / itemsPerPage);
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const paginatedVehicles = filteredVehicles2.slice(startIndex, endIndex);
              if (filteredVehicles2.length === 0) {
                return /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "px-6 py-12 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400", children: [
                  /* @__PURE__ */ jsx(Car, { className: "h-16 w-16 opacity-30" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: searchQuery ? "Aucun véhicule trouvé" : "Aucun véhicule disponible" }),
                  searchQuery && /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => setSearchQuery(""),
                      className: "mt-2",
                      children: "Réinitialiser la recherche"
                    }
                  )
                ] }) }) });
              }
              return paginatedVehicles.map((vehicle, index) => {
                const nameParts = vehicle.name.split(" ");
                const marque = nameParts[0] || "-";
                const modele = nameParts.slice(1).join(" ") || "-";
                const position = vehicle.address || "Adresse inconnue";
                const lastUpdate = new Date(vehicle.lastUpdate);
                const formattedDate = lastUpdate.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                });
                const formattedTime = lastUpdate.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit"
                });
                return /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    className: "group hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-200",
                    children: [
                      visibleColumns.plate && /* @__PURE__ */ jsx("td", { className: "px-6 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center", children: /* @__PURE__ */ jsx(Car, { className: "h-4 w-4 text-purple-600 dark:text-purple-400" }) }),
                        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: vehicle.plate })
                      ] }) }),
                      visibleColumns.brand && /* @__PURE__ */ jsx("td", { className: "px-6 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300 font-medium", children: marque }) }),
                      visibleColumns.model && /* @__PURE__ */ jsx("td", { className: "px-6 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: modele }) }),
                      visibleColumns.distance && /* @__PURE__ */ jsx("td", { className: "px-6 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("div", { className: "text-sm font-bold text-purple-700 dark:text-purple-400", children: vehicle.distance.toLocaleString() }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "km" })
                      ] }) }),
                      visibleColumns.position && /* @__PURE__ */ jsx("td", { className: "px-6 py-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 max-w-xs", children: [
                        /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" }),
                        /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400 line-clamp-2", children: position })
                      ] }) }),
                      visibleColumns.lastUpdate && /* @__PURE__ */ jsx("td", { className: "px-6 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-gray-400" }),
                        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: [
                          /* @__PURE__ */ jsx("div", { className: "font-medium", children: formattedDate }),
                          /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500", children: formattedTime })
                        ] })
                      ] }) }),
                      visibleColumns.status && /* @__PURE__ */ jsx("td", { className: "px-6 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: `text-xs font-medium ${vehicle.status === "active" ? "border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400" : vehicle.status === "maintenance" ? "border-orange-500 text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400" : "border-gray-500 text-gray-700 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400"}`,
                          children: vehicle.status === "active" ? "● Actif" : vehicle.status === "maintenance" ? "● Maintenance" : "● À l'arrêt"
                        }
                      ) })
                    ]
                  },
                  vehicle.id
                );
              });
            })() })
          ] }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400", children: [
              /* @__PURE__ */ jsx("div", { children: (() => {
                const filteredVehicles2 = vehicles.filter((v) => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  return v.plate?.toLowerCase().includes(query) || v.name?.toLowerCase().includes(query) || v.address?.toLowerCase().includes(query);
                });
                const totalFiltered = filteredVehicles2.length;
                const startIndex = (currentPage - 1) * itemsPerPage + 1;
                const endIndex = Math.min(currentPage * itemsPerPage, totalFiltered);
                if (totalFiltered === 0) {
                  return /* @__PURE__ */ jsx("span", { children: "Aucun résultat" });
                }
                return /* @__PURE__ */ jsxs("span", { children: [
                  "Affichage de ",
                  startIndex,
                  " à ",
                  endIndex,
                  " sur ",
                  totalFiltered,
                  " véhicule",
                  totalFiltered > 1 ? "s" : "",
                  searchQuery && " (filtré)"
                ] });
              })() }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
                Object.values(visibleColumns).filter(Boolean).length,
                " / 7 colonnes affichées"
              ] })
            ] }),
            (() => {
              const filteredVehicles2 = vehicles.filter((v) => {
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase();
                return v.plate?.toLowerCase().includes(query) || v.name?.toLowerCase().includes(query) || v.address?.toLowerCase().includes(query);
              });
              const totalPages = Math.ceil(filteredVehicles2.length / itemsPerPage);
              if (totalPages <= 1) return null;
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
                    disabled: currentPage === 1,
                    className: "h-9 w-9 p-0",
                    children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (pageNum === 1 || pageNum === totalPages || pageNum >= currentPage - 1 && pageNum <= currentPage + 1) {
                    return /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: currentPage === pageNum ? "default" : "outline",
                        size: "sm",
                        onClick: () => setCurrentPage(pageNum),
                        className: `h-9 w-9 p-0 ${currentPage === pageNum ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600" : ""}`,
                        children: pageNum
                      },
                      pageNum
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return /* @__PURE__ */ jsx("span", { className: "px-1", children: "..." }, pageNum);
                  }
                  return null;
                }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
                    disabled: currentPage === totalPages,
                    className: "h-9 w-9 p-0",
                    children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                  }
                )
              ] });
            })()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-xl", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-6 w-6 text-purple-600" }),
            "Suivi kilométrique - Top 5"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "Véhicules les plus utilisés ce mois" })
        ] }) }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: topVehiclesByDistance.map((vehicle, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group flex items-center justify-between rounded-lg border border-purple-200 bg-gradient-to-r from-white to-purple-50/50 p-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] dark:border-purple-700 dark:from-gray-800 dark:to-purple-800/10",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-md", children: /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-white", children: [
                  "#",
                  index + 1
                ] }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: vehicle.name }),
                    vehicle.status === "active" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-1 w-1 rounded-full bg-green-500 animate-pulse" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-green-700 dark:text-green-400", children: "En mouvement" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                    /* @__PURE__ */ jsx(Car, { className: "h-3 w-3 text-gray-400" }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: vehicle.plate })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400", children: vehicle.distance.toLocaleString() }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: "kilomètres" })
                ] }),
                /* @__PURE__ */ jsx(
                  Badge,
                  {
                    variant: vehicle.status === "active" ? "default" : "secondary",
                    className: `px-2 py-0.5 text-xs ${vehicle.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" : vehicle.status === "maintenance" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"}`,
                    children: vehicle.status === "active" ? "Actif" : vehicle.status === "maintenance" ? "Maintenance" : "À l'arrêt"
                  }
                )
              ] })
            ]
          },
          vehicle.id
        )) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-purple-600" }),
              "Dernière position des véhicules en leasing"
            ] }),
            /* @__PURE__ */ jsxs(CardDescription, { children: [
              selectedVehicleIds.length,
              " véhicule",
              selectedVehicleIds.length > 1 ? "s" : "",
              " affiché",
              selectedVehicleIds.length > 1 ? "s" : "",
              " sur ",
              stats.totalVehicles
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleSelectActiveOnly,
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4" }),
                  "Actifs seulement"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleSelectAll,
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(Car, { className: "h-4 w-4" }),
                  "Tout afficher"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleDeselectAll,
                disabled: selectedVehicleIds.length === 0,
                children: "Tout masquer"
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-1/4 space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Rechercher par nom ou plaque...",
                  value: vehicleSearchQuery,
                  onChange: (e) => setVehicleSearchQuery(e.target.value),
                  className: "w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                }
              ),
              vehicleSearchQuery && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setVehicleSearchQuery(""),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                  children: "×"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-[550px] overflow-y-auto rounded-lg border border-purple-200 dark:border-purple-800", children: filteredVehicles.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-purple-100 dark:divide-purple-800", children: filteredVehicles.map((vehicle) => /* @__PURE__ */ jsxs(
              "label",
              {
                className: "flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20",
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: selectedVehicleIds.includes(vehicle.id),
                      onChange: () => handleToggleVehicle(vehicle.id),
                      className: "h-4 w-4 shrink-0 rounded border-purple-300 text-purple-600 focus:ring-purple-500 dark:border-purple-600 dark:bg-gray-700"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center gap-2 overflow-hidden", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-white shrink-0", children: vehicle.plate }),
                    /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "•" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400 truncate", children: vehicle.name }),
                    /* @__PURE__ */ jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-xs shrink-0 ${vehicle.status === "active" ? "border-green-500 text-green-600 dark:text-green-400" : vehicle.status === "maintenance" ? "border-amber-500 text-amber-600 dark:text-amber-400" : "border-gray-500 text-gray-600 dark:text-gray-400"}`,
                        children: vehicle.status === "active" ? "Actif" : vehicle.status === "maintenance" ? "Maint." : "À l'arrêt"
                      }
                    ),
                    vehicle.speed !== void 0 && vehicle.speed > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-auto", children: [
                      /* @__PURE__ */ jsx(Gauge, { className: "h-3 w-3" }),
                      /* @__PURE__ */ jsxs("span", { children: [
                        vehicle.speed,
                        " km/h"
                      ] })
                    ] })
                  ] })
                ]
              },
              vehicle.id
            )) }) : /* @__PURE__ */ jsxs("div", { className: "p-8 text-center text-gray-500 dark:text-gray-400", children: [
              /* @__PURE__ */ jsx(Car, { className: "mx-auto h-12 w-12 opacity-50" }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm", children: vehicleSearchQuery ? "Aucun véhicule trouvé" : "Aucun véhicule disponible" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-3/4", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "h-8 w-8 animate-spin text-purple-500" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Chargement de la carte..." })
          ] }), children: /* @__PURE__ */ jsx(
            VehicleMap,
            {
              vehicles: displayedVehicles.map((v) => ({
                ...v,
                status: v.status === "unknown" ? "inactive" : v.status
              })),
              height: "600px"
            }
          ) }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  LeasingDashboard as default
};
