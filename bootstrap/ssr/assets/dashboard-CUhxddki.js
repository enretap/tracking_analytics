import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { c as cn, b as buttonVariants, B as Button, d as dashboard } from "./button-VCvxHZJY.js";
import { usePage, Head } from "@inertiajs/react";
import { ChevronRight, ChevronLeft, Calendar as Calendar$1, X, Building2, Filter, RefreshCw, Car, Activity, PauseCircle, AlertTriangle, FileText, Globe, Search, User, Gauge, MapPin } from "lucide-react";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-BK6R-x6E.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-lrdiZK72.js";
import { B as Badge } from "./badge-D_0uEcAf.js";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { I as Input } from "./input-KsoydCnh.js";
import { u as useVehicles } from "./useVehicles-qp71L5JC.js";
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
import "@radix-ui/react-select";
import "axios";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn("p-3", className),
      classNames: {
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames
      },
      components: {
        IconLeft: ({ ...props2 }) => /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
        IconRight: ({ ...props2 }) => /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
      },
      ...props
    }
  );
}
Calendar.displayName = "Calendar";
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
function DateRangePicker({
  className,
  date,
  onDateChange,
  placeholder = "Sélectionner une période"
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClear = (e) => {
    e.stopPropagation();
    onDateChange?.(void 0);
  };
  const handleSelect = (selectedDate) => {
    onDateChange?.(selectedDate);
    if (selectedDate?.from && selectedDate?.to) {
      setIsOpen(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: cn("grid gap-2", className), children: /* @__PURE__ */ jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        id: "date",
        variant: "outline",
        className: cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground",
          "border-gray-300 hover:border-blue-500 hover:bg-white dark:border-gray-700 dark:hover:border-blue-500"
        ),
        children: [
          /* @__PURE__ */ jsx(Calendar$1, { className: "mr-2 h-4 w-4" }),
          date?.from ? date.to ? /* @__PURE__ */ jsxs(Fragment, { children: [
            format(date.from, "dd MMM yyyy", { locale: fr }),
            " -",
            " ",
            format(date.to, "dd MMM yyyy", { locale: fr })
          ] }) : format(date.from, "dd MMM yyyy", { locale: fr }) : /* @__PURE__ */ jsx("span", { children: placeholder }),
          date?.from && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "ml-auto h-6 w-6 p-0 hover:bg-transparent",
              onClick: handleClear,
              children: [
                /* @__PURE__ */ jsx(X, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Effacer" })
              ]
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(PopoverContent, { className: "w-auto p-0", align: "start", children: [
      /* @__PURE__ */ jsx(
        Calendar,
        {
          initialFocus: true,
          mode: "range",
          defaultMonth: date?.from,
          selected: date,
          onSelect: handleSelect,
          numberOfMonths: 2,
          locale: fr,
          className: "rounded-md border",
          classNames: {
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            ),
            day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white dark:bg-blue-500 dark:hover:bg-blue-600",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible"
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "border-t p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "flex-1",
            onClick: () => {
              const today = /* @__PURE__ */ new Date();
              const lastWeek = /* @__PURE__ */ new Date();
              lastWeek.setDate(today.getDate() - 7);
              onDateChange?.({ from: lastWeek, to: today });
              setIsOpen(false);
            },
            children: "7 derniers jours"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "flex-1",
            onClick: () => {
              const today = /* @__PURE__ */ new Date();
              const lastMonth = /* @__PURE__ */ new Date();
              lastMonth.setMonth(today.getMonth() - 1);
              onDateChange?.({ from: lastMonth, to: today });
              setIsOpen(false);
            },
            children: "30 derniers jours"
          }
        )
      ] }) })
    ] })
  ] }) });
}
const VehicleMap = lazy(() => import("./vehicle-map-DvD31aff.js").then((module) => ({ default: module.VehicleMap })));
const breadcrumbs = [
  {
    title: "Accueil",
    href: dashboard().url
  }
];
const mockVehicles = [
  /* {
    id: 'vehicle-1',
    name: 'Camion Renault Master',
    plate: 'AB-234-CF',
    status: 'active',
    distance: 12450,
    latitude: 5.3311583,
    longitude: -3.9688833,
    speed: 65,
    lastUpdate: new Date(Date.now() - 30 * 60000).toISOString(), // Il y a 30 minutes
  },
  {
    id: 'vehicle-2',
    name: 'Fourgon Mercedes Sprinter',
    plate: 'CD-567-GH',
    status: 'active',
    distance: 8560,
    latitude: 48.870502,
    longitude: 2.306546,
    speed: 45,
    lastUpdate: new Date(Date.now() - 15 * 60000).toISOString(), // Il y a 15 minutes
  },
  {
    id: 'vehicle-3',
    name: 'Utilitaire Peugeot Partner',
    plate: 'EF-890-IJ',
    status: 'maintenance',
    distance: 23100,
    latitude: 48.835798,
    longitude: 2.329376,
    speed: 0,
    lastUpdate: new Date(Date.now() - 2 * 3600000).toISOString(), // Il y a 2 heures
  },
  {
    id: 'vehicle-4',
    name: 'Camionnette Ford Transit',
    plate: 'GH-123-KL',
    status: 'active',
    distance: 18765,
    latitude: 48.892423,
    longitude: 2.236596,
    speed: 72,
    lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(), // Il y a 5 minutes
  },
  {
    id: 'vehicle-5',
    name: 'Fourgon Renault Trafic',
    plate: 'IJ-456-MN',
    status: 'inactive',
    distance: 15230,
    latitude: 48.826862,
    longitude: 2.270044,
    lastUpdate: new Date(Date.now() - 8 * 3600000).toISOString(), // Il y a 8 heures
  },
  {
    id: 'vehicle-6',
    name: 'Camion Iveco Daily',
    plate: 'KL-789-OP',
    status: 'active',
    distance: 32450,
    latitude: 48.863576,
    longitude: 2.327735,
    speed: 58,
    lastUpdate: new Date(Date.now() - 45 * 60000).toISOString(), // Il y a 45 minutes
  },
  {
    id: 'vehicle-7',
    name: 'Fourgon Volkswagen Crafter',
    plate: 'MN-012-QR',
    status: 'active',
    distance: 28900,
    latitude: 48.847894,
    longitude: 2.389506,
    speed: 38,
    lastUpdate: new Date(Date.now() - 20 * 60000).toISOString(), // Il y a 20 minutes
  },
  {
    id: 'vehicle-8',
    name: 'Utilitaire Citroën Jumper',
    plate: 'OP-345-ST',
    status: 'maintenance',
    distance: 41200,
    latitude: 48.839654,
    longitude: 2.360221,
    lastUpdate: new Date(Date.now() - 3 * 3600000).toISOString(), // Il y a 3 heures
  },
  {
    id: 'vehicle-9',
    name: 'Camionnette Fiat Ducato',
    plate: 'QR-678-UV',
    status: 'active',
    distance: 15600,
    latitude: 48.880856,
    longitude: 2.355398,
    speed: 82,
    lastUpdate: new Date(Date.now() - 10 * 60000).toISOString(), // Il y a 10 minutes
  },
  {
    id: 'vehicle-10',
    name: 'Fourgon Nissan NV400',
    plate: 'ST-901-WX',
    status: 'inactive',
    distance: 27500,
    latitude: 48.812345,
    longitude: 2.398712,
    lastUpdate: new Date(Date.now() - 12 * 3600000).toISOString(), // Il y a 12 heures
  }, */
];
const timePeriods = [
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "week", label: "Cette semaine" },
  { value: "month", label: "Ce mois" },
  { value: "quarter", label: "Ce trimestre" },
  { value: "year", label: "Cette année" },
  { value: "custom", label: "Période personnalisée" }
];
function Dashboard({ eco_data: initialEcoData, event_data: initialEventData }) {
  const { auth } = usePage().props;
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [dateRange, setDateRange] = useState({ from: /* @__PURE__ */ new Date(), to: /* @__PURE__ */ new Date() });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState("");
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [totalReports, setTotalReports] = useState(0);
  const [ecoData, setEcoData] = useState(initialEcoData);
  const [eventData, setEventData] = useState(initialEventData);
  const [eventsSearchQuery, setEventsSearchQuery] = useState("");
  const [eventsCurrentPage, setEventsCurrentPage] = useState(1);
  const eventsItemsPerPage = 5;
  const { vehicles: apiVehicles } = useVehicles();
  const getDateRangeFromPeriod = (period) => {
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate = new Date(today);
    let endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);
    switch (period) {
      case "today":
        startDate = new Date(today);
        break;
      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        endDate = new Date(today);
        endDate.setDate(today.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case "quarter":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90);
        break;
      case "year":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);
        break;
      case "custom":
        return { startDate: dateRange.from, endDate: dateRange.to };
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    }
    return { startDate, endDate };
  };
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const { startDate, endDate } = getDateRangeFromPeriod(selectedPeriod);
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const startDateStr = formatDate(startDate);
      const endDateStr = formatDate(endDate);
      const [ecoResponse, eventResponse] = await Promise.all([
        fetch(`/api/getDailyVehicleEcoSummary?start_date=${startDateStr}&end_date=${endDateStr}`),
        fetch(`/api/getEventHistoryReport?start_date=${startDateStr}&end_date=${endDateStr}`)
      ]);
      if (ecoResponse.ok) {
        const ecoDataResult = await ecoResponse.json();
        setEcoData(ecoDataResult);
      }
      if (eventResponse.ok) {
        const eventDataResult = await eventResponse.json();
        setEventData(eventDataResult);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  useEffect(() => {
    refreshData();
  }, [selectedPeriod]);
  useEffect(() => {
    if (selectedPeriod === "custom") {
      refreshData();
    }
  }, [dateRange]);
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
  const stats = useMemo(() => ({
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter((v) => v.status === "active").length,
    inactiveVehicles: vehicles.filter((v) => v.status === "inactive").length,
    maintenanceVehicles: vehicles.filter((v) => v.status === "maintenance").length
  }), [vehicles]);
  const topVehiclesByDistance = useMemo(
    () => [...vehicles].filter((v) => v.distance > 0).sort((a, b) => b.distance - a.distance).slice(0, 5),
    [vehicles]
  );
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
  const getReportUrl = (reportId) => {
    const { startDate, endDate } = getDateRangeFromPeriod(selectedPeriod);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    return `/reports/${reportId}?start_date=${startDateStr}&end_date=${endDateStr}`;
  };
  const filteredVehicles = useMemo(() => {
    if (!vehicleSearchQuery.trim()) return vehicles;
    const query = vehicleSearchQuery.toLowerCase();
    return vehicles.filter(
      (v) => v.name.toLowerCase().includes(query) || v.plate.toLowerCase().includes(query)
    );
  }, [vehicles, vehicleSearchQuery]);
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard - Tracking Analytics" }),
    /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-1 flex-col gap-4 p-4 pt-2 bg-gray-100 dark:bg-gray-900", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-4 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold tracking-tight text-gray-900 dark:text-white", children: [
            "Tableau de bord - ",
            auth.user.account_name || auth.user.name
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Vue d'ensemble des activités de votre flotte" })
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
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Filter, { className: "h-5 w-5 text-gray-500" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700 dark:text-gray-300", children: "Filtres" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-wrap items-center gap-4 lg:w-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-1 lg:flex-none", children: /* @__PURE__ */ jsxs(Select, { value: selectedPeriod, onValueChange: setSelectedPeriod, disabled: isRefreshing, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full lg:w-[180px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Calendar$1, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx(SelectValue, { placeholder: "Période" })
            ] }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: timePeriods.map((period) => /* @__PURE__ */ jsx(SelectItem, { value: period.value, children: period.label }, period.value)) })
          ] }) }),
          selectedPeriod === "custom" && /* @__PURE__ */ jsx("div", { className: "w-full lg:w-auto", children: /* @__PURE__ */ jsx(
            DateRangePicker,
            {
              date: dateRange,
              onDateChange: (date) => {
                if (!date) return;
                setDateRange({
                  from: date.from ?? date.start ?? date.startDate,
                  to: date.to ?? date.end ?? date.endDate
                });
              }
            }
          ) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: refreshData,
              disabled: isRefreshing,
              className: "flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${isRefreshing ? "animate-spin" : ""}` }),
                isRefreshing ? "Actualisation..." : "Actualiser"
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
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
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5" }),
              "Analyse des comportements à risques par conducteur"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Performance et comportements de conduite par conducteur" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: (() => {
            const driverReport = reports.find((r) => r.type === "driver_eco_driving");
            if (driverReport) {
              return /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => window.location.href = getReportUrl(driverReport.id),
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
                    "Voir le rapport complet"
                  ]
                }
              );
            }
            return null;
          })() })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Répartition des infractions par véhicule (%)" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: (() => {
              if (!ecoData?.vehicle_details || ecoData.vehicle_details.length === 0) {
                return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune infraction" });
              }
              const totalViolations = ecoData.vehicle_details.reduce((sum, v) => sum + (v.total_violations || 0), 0);
              const topViolators = ecoData.vehicle_details.filter((v) => (v.total_violations || 0) > 0).sort((a, b) => (b.total_violations || 0) - (a.total_violations || 0)).slice(0, 6);
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
          /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Nombre d'infractions par véhicules" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: (() => {
              if (!ecoData?.vehicle_details || ecoData.vehicle_details.length === 0) {
                return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune infraction" });
              }
              const topViolators = ecoData.vehicle_details.filter((v) => (v.total_violations || 0) > 0).sort(
                (a, b) => (b.total_violations || 0) - (a.total_violations || 0)
              ).slice(0, 10);
              if (topViolators.length === 0) {
                return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucune infraction" });
              }
              const maxViolations = Math.max(...topViolators.map((v) => v.total_violations || 0));
              const barColor = "#f59e0b";
              return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between text-[9px] text-gray-500 font-medium", style: { height: "160px" }, children: [
                    /* @__PURE__ */ jsx("span", { children: maxViolations }),
                    /* @__PURE__ */ jsx("span", { children: Math.round(maxViolations * 0.75) }),
                    /* @__PURE__ */ jsx("span", { children: Math.round(maxViolations * 0.5) }),
                    /* @__PURE__ */ jsx("span", { children: Math.round(maxViolations * 0.25) }),
                    /* @__PURE__ */ jsx("span", { children: "0" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex-1 flex justify-between gap-1 border-l border-b border-gray-200 pl-2 pb-6 relative", style: { height: "230px" }, children: topViolators.map((vehicle, idx) => {
                    const violations = vehicle.total_violations || 0;
                    const maxHeight = 200;
                    const barHeight = violations / maxViolations * maxHeight;
                    return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-end relative", children: [
                      /* @__PURE__ */ jsx("div", { className: "absolute text-[10px] font-bold text-gray-700", style: { bottom: `${barHeight + 5}px` }, children: violations }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "w-full rounded-t-md hover:opacity-80 hover:shadow-lg transition-all cursor-pointer relative group",
                          style: {
                            height: `${Math.max(barHeight, 4)}px`,
                            backgroundColor: barColor
                          },
                          title: `${vehicle.immatriculation}: ${violations} infractions`,
                          children: /* @__PURE__ */ jsxs("div", { className: "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg", children: [
                            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: vehicle.immatriculation }),
                            /* @__PURE__ */ jsxs("div", { className: "text-gray-300", children: [
                              violations,
                              " infraction",
                              violations > 1 ? "s" : ""
                            ] })
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "absolute text-[9px] font-medium text-gray-500", style: { bottom: "-20px" }, children: [
                        "#",
                        idx + 1
                      ] })
                    ] }, idx);
                  }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 pt-3 space-y-1.5", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] font-semibold text-gray-600 mb-2", children: "TOP 10 VÉHICULES" }),
                  topViolators.slice(0, 10).map((vehicle, idx) => {
                    const violations = vehicle.total_violations || 0;
                    return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 text-xs", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: "w-2.5 h-2.5 rounded-sm flex-shrink-0",
                            style: { backgroundColor: barColor }
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { className: "font-medium truncate", title: vehicle.immatriculation, children: vehicle.immatriculation })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-800 flex-shrink-0", children: violations })
                    ] }, idx);
                  })
                ] })
              ] });
            })() })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }),
              "Analyse des comportements à risques"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Vue d'ensemble des infractions et comportements à risques de la flotte" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: (() => {
            const ecoReport = reports.find((r) => r.type === "eco_driving");
            if (ecoReport) {
              return /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => window.location.href = getReportUrl(ecoReport.id),
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
                    "Voir le rapport complet"
                  ]
                }
              );
            }
            return null;
          })() })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Répartition des freinages brusques par véhicule (%)" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: (() => {
              if (!ecoData?.vehicle_details || ecoData.vehicle_details.length === 0) {
                return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucun freinage brusque" });
              }
              const totalHarshBraking = ecoData.vehicle_details.reduce((sum, v) => sum + (v.harsh_braking || 0), 0);
              const topVehicles = ecoData.vehicle_details.filter((v) => (v.harsh_braking || 0) > 0).sort((a, b) => (b.harsh_braking || 0) - (a.harsh_braking || 0)).slice(0, 5);
              if (totalHarshBraking === 0) {
                return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucun freinage brusque" });
              }
              const colors = ["#1e3a5f", "#8B4513", "#d946ef", "#f59e0b", "#10b981"];
              return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative w-56 h-56", children: [
                  /* @__PURE__ */ jsx("svg", { viewBox: "0 0 200 200", className: "transform -rotate-90", children: (() => {
                    let currentAngle = 0;
                    return topVehicles.map((vehicle, idx) => {
                      const harshBraking = vehicle.harsh_braking || 0;
                      const percentage = harshBraking / totalHarshBraking;
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
                      const percentDisplay = (percentage * 100).toFixed(1);
                      return /* @__PURE__ */ jsxs("g", { children: [
                        /* @__PURE__ */ jsx("title", { children: `${vehicle.immatriculation}: ${harshBraking} freinages brusques (${percentDisplay}%)` }),
                        /* @__PURE__ */ jsx(
                          "path",
                          {
                            d: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`,
                            fill: colors[idx],
                            stroke: "white",
                            strokeWidth: "2",
                            className: "hover:opacity-80 transition-opacity cursor-pointer"
                          }
                        )
                      ] }, idx);
                    });
                  })() }),
                  /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-800", children: totalHarshBraking }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Total" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-2 w-full text-xs", children: topVehicles.map((vehicle, idx) => {
                  const harshBraking = vehicle.harsh_braking || 0;
                  const percentage = (harshBraking / totalHarshBraking * 100).toFixed(1);
                  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 p-1.5 rounded hover:bg-gray-50 transition-colors", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-sm flex-shrink-0", style: { backgroundColor: colors[idx] } }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium truncate", title: vehicle.immatriculation, children: vehicle.immatriculation })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                      /* @__PURE__ */ jsxs("span", { className: "font-bold text-gray-800", children: [
                        percentage,
                        "%"
                      ] }),
                      /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
                        "(",
                        harshBraking,
                        ")"
                      ] })
                    ] })
                  ] }, idx);
                }) })
              ] });
            })() })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Véhicules avec les vitesses maximales (Km/h)" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: (() => {
              if (!ecoData?.vehicle_details || ecoData.vehicle_details.length === 0) {
                return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucun véhicule" });
              }
              const speedViolators = ecoData.vehicle_details.filter((v) => (v.max_speed || 0) > 90).sort((a, b) => (b.max_speed || 0) - (a.max_speed || 0)).slice(0, 5);
              const maxSpeed = Math.max(...speedViolators.map((v) => v.max_speed || 0));
              return /* @__PURE__ */ jsx("div", { className: "space-y-2", children: speedViolators.map((vehicle, idx) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-1 text-sm", children: [
                  /* @__PURE__ */ jsx("span", { children: vehicle.immatriculation }),
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-[#8B4513]", children: vehicle.max_speed })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded h-5", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "bg-[#1e3a5f] h-5 rounded",
                    style: { width: `${(vehicle.max_speed || 0) / maxSpeed * 100}%` }
                  }
                ) })
              ] }, idx)) });
            })() })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5" }),
              "Analyse géospatiale des comportements à risques"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Analyse des comportements par zones géographiques et itinéraires" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: (() => {
            const geoReport = reports.find((r) => r.type === "geo_eco_driving");
            if (geoReport) {
              return /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => window.location.href = getReportUrl(geoReport.id),
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
                    "Voir le rapport complet"
                  ]
                }
              );
            }
            return null;
          })() })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Alertes par Type d'événement" }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: (() => {
              if (!eventData?.events_by_name || !eventData?.stats?.events_by_name) {
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
              const eventsByName = eventData.stats.events_by_name;
              const totalEvents = eventData.stats.total_events;
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
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "border-0 shadow-md hover:shadow-lg transition-shadow duration-300 md:col-span-2", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 bg-gradient-to-r from-red-50 to-yellow-50 border-b border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Tableau de détail des évènements" }),
              /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                eventData?.stats?.total_events || 0,
                " événements"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "p-4", children: (() => {
              if (!eventData?.events || eventData.events.length === 0) {
                return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-8", children: "Aucun événement disponible" });
              }
              const filteredEvents = eventData.events.filter((event) => {
                if (!eventsSearchQuery.trim()) return true;
                const query = eventsSearchQuery.toLowerCase();
                return event.vehicle?.toLowerCase().includes(query) || event.driver?.toLowerCase().includes(query) || event.event_type?.toLowerCase().includes(query) || event.address?.toLowerCase().includes(query);
              });
              const totalPages = Math.ceil(filteredEvents.length / eventsItemsPerPage);
              const startIndex = (eventsCurrentPage - 1) * eventsItemsPerPage;
              const endIndex = startIndex + eventsItemsPerPage;
              const paginatedEvents = filteredEvents.slice(startIndex, endIndex);
              return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      placeholder: "Rechercher par véhicule, conducteur, type ou adresse...",
                      value: eventsSearchQuery,
                      onChange: (e) => {
                        setEventsSearchQuery(e.target.value);
                        setEventsCurrentPage(1);
                      },
                      className: "pl-9 h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-gray-200 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-full divide-y divide-gray-200", children: [
                  /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
                    /* @__PURE__ */ jsx("th", { className: "px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Véhicule" }),
                    /* @__PURE__ */ jsx("th", { className: "px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Conducteur" }),
                    /* @__PURE__ */ jsx("th", { className: "px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Nom de l'événement" }),
                    /* @__PURE__ */ jsx("th", { className: "px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Vitesse" }),
                    /* @__PURE__ */ jsx("th", { className: "px-4 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider", children: "Adresse" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: paginatedEvents.length > 0 ? paginatedEvents.map((event, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Car, { className: "h-4 w-4 text-gray-400" }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900", children: event.vehicle || "N/A" }),
                        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: event.plate_number || "" })
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(User, { className: "h-4 w-4 text-gray-400" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-900", children: event.driver || "N/A" })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-700", children: (() => {
                      const eventName = event.event_name || "N/A";
                      if (eventName === "2HS_Between 20h and 04h") {
                        return "Conduite de nuit";
                      }
                      if (eventName === "SPEED") {
                        return "Vitesse";
                      }
                      return eventName;
                    })() }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Gauge, { className: "h-4 w-4 text-gray-400" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-gray-900", children: event.speed || 0 }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "km/h" })
                    ] }) }),
                    /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 max-w-xs", children: [
                      /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-600 line-clamp-2", children: event.address || "Adresse inconnue" })
                    ] }) })
                  ] }, event.id || idx)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 6, className: "px-4 py-8 text-center text-gray-500", children: "Aucun événement trouvé" }) }) })
                ] }) }) }),
                totalPages > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
                    "Affichage de ",
                    startIndex + 1,
                    " à ",
                    Math.min(endIndex, filteredEvents.length),
                    " sur ",
                    filteredEvents.length,
                    " événements"
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => setEventsCurrentPage((prev) => Math.max(1, prev - 1)),
                        disabled: eventsCurrentPage === 1,
                        className: "h-9 w-9 p-0",
                        children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      if (pageNum === 1 || pageNum === totalPages || pageNum >= eventsCurrentPage - 1 && pageNum <= eventsCurrentPage + 1) {
                        return /* @__PURE__ */ jsx(
                          Button,
                          {
                            variant: eventsCurrentPage === pageNum ? "default" : "outline",
                            size: "sm",
                            onClick: () => setEventsCurrentPage(pageNum),
                            className: `h-9 w-9 p-0 ${eventsCurrentPage === pageNum ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600" : ""}`,
                            children: pageNum
                          },
                          pageNum
                        );
                      } else if (pageNum === eventsCurrentPage - 2 || pageNum === eventsCurrentPage + 2) {
                        return /* @__PURE__ */ jsx("span", { className: "px-1", children: "..." }, pageNum);
                      }
                      return null;
                    }) }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        onClick: () => setEventsCurrentPage((prev) => Math.min(totalPages, prev + 1)),
                        disabled: eventsCurrentPage === totalPages,
                        className: "h-9 w-9 p-0",
                        children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                      }
                    )
                  ] })
                ] })
              ] });
            })() })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-xl", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-6 w-6 text-blue-600" }),
              "Top 5 des distances parcourues"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { className: "mt-1", children: "Classement des véhicules par distance parcourue" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5 text-green-500" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: [
              topVehiclesByDistance.filter((v) => v.status === "active").length,
              " actifs"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: topVehiclesByDistance.map((vehicle, index) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group flex items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-r from-white to-gray-50/50 p-3 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/50",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-white", children: [
                    "#",
                    index + 1
                  ] }),
                  index === 0 && /* @__PURE__ */ jsx("div", { className: "absolute -top-0.5 -right-0.5", children: /* @__PURE__ */ jsx("div", { className: "h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse" }) })
                ] }),
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
                  /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400", children: vehicle.distance.toLocaleString() }),
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
              /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5" }),
              "Dernière position des véhicules"
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
                  className: "w-full rounded-md border border-gray-300 bg-white px-4 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
            /* @__PURE__ */ jsx("div", { className: "h-[550px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800", children: filteredVehicles.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-800", children: filteredVehicles.map((vehicle) => /* @__PURE__ */ jsxs(
              "label",
              {
                className: "flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50",
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: selectedVehicleIds.includes(vehicle.id),
                      onChange: () => handleToggleVehicle(vehicle.id),
                      className: "h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
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
            /* @__PURE__ */ jsx(RefreshCw, { className: "h-8 w-8 animate-spin text-blue-500" }),
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
  Dashboard as default
};
