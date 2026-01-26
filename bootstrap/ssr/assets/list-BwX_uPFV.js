import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { Head, Link } from "@inertiajs/react";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "lucide-react";
import "./button-VCvxHZJY.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "../ssr.js";
import "@inertiajs/react/server";
import "react-dom/server";
function ReportsList({ accounts, platforms, reports }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Rapports", href: "/reports" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Rapports" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Rapports" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Consultez vos rapports d'activité" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow", children: reports && reports.length > 0 ? /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: reports.map((report) => /* @__PURE__ */ jsxs(
        Link,
        {
          href: `/reports/${report.id}`,
          className: "block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: report.name }),
            report.account && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-400", children: [
              "Compte: ",
              report.account.name
            ] })
          ]
        },
        report.id
      )) }) : /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-gray-600 dark:text-gray-400", children: "Aucun rapport disponible" }) })
    ] })
  ] });
}
export {
  ReportsList as default
};
