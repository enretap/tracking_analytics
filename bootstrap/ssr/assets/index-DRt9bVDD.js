import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BK6R-x6E.js";
import { B as Badge } from "./badge-D_0uEcAf.js";
import { Plus, FileText, Eye, Edit, Trash2 } from "lucide-react";
import "react";
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
const deleteReport = (reportId, reportName) => {
  if (confirm(`Voulez-vous vraiment supprimer le rapport "${reportName}" ?`)) {
    router.delete(`/settings/reports/${reportId}`);
  }
};
const getReportTypeBadge = (type) => {
  if (!type) return null;
  const typeColors = {
    "summary": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    "fleet_activity": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "driver_behavior": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "maintenance": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    "fuel_consumption": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  };
  return /* @__PURE__ */ jsx(Badge, { variant: "outline", className: typeColors[type] || "", children: type.replace("_", " ") });
};
function ReportsIndex({ reports }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Rapports", href: "/settings/reports" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Configuration des rapports" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Configuration des rapports" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Gérez vos configurations de rapports" })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/settings/reports/create", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Nouveau rapport"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
            "Rapports configurés (",
            reports.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Liste de tous les types de rapports disponibles pour vos comptes" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: reports && reports.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: reports.map((report) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6 text-indigo-600 dark:text-indigo-400" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: report.name }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: [
                    report.type && /* @__PURE__ */ jsxs(Fragment, { children: [
                      getReportTypeBadge(report.type),
                      /* @__PURE__ */ jsx("span", { children: "•" })
                    ] }),
                    report.accounts && report.accounts.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsxs("span", { children: [
                        report.accounts.length,
                        " compte",
                        report.accounts.length > 1 ? "s" : ""
                      ] }),
                      /* @__PURE__ */ jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
                        report.accounts.slice(0, 2).map((account) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: account.name }, account.id)),
                        report.accounts.length > 2 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                          "+",
                          report.accounts.length - 2
                        ] })
                      ] })
                    ] }) : /* @__PURE__ */ jsx("span", { className: "text-amber-600 dark:text-amber-400", children: "Aucun compte" })
                  ] }),
                  report.description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1", children: report.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/settings/reports/${report.id}`, children: [
                  /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-2" }),
                  "Voir"
                ] }) }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/settings/reports/${report.id}/edit`, children: [
                  /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-2" }),
                  "Éditer"
                ] }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => deleteReport(report.id, report.name),
                    className: "text-red-600 hover:text-red-700",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ]
          },
          report.id
        )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-12 w-12 text-gray-300 dark:text-gray-700" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-gray-600 dark:text-gray-400", children: "Aucun rapport configuré" }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4", size: "sm", children: /* @__PURE__ */ jsx(Link, { href: "/settings/reports/create", children: "Créer votre premier rapport" }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  ReportsIndex as default
};
