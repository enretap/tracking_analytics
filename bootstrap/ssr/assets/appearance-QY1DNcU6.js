import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { Head } from "@inertiajs/react";
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
function Appearance() {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { label: "Paramètres", href: "/settings" },
    { label: "Apparence", href: "/settings/appearance" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Apparence" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Apparence" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Personnalisez l'apparence de l'application" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Les paramètres d'apparence seront disponibles prochainement." }) })
    ] })
  ] });
}
export {
  Appearance as default
};
