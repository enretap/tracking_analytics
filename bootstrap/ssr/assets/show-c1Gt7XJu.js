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
function ShowPlatform({ platform }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Plateformes", href: "/settings/platforms" },
    { title: platform.name, href: `/settings/platforms/${platform.id}` }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: platform.name }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: platform.name }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Détails de la plateforme" })
        ] }),
        /* @__PURE__ */ jsx(
          Link,
          {
            href: `/settings/platforms/${platform.id}/edit`,
            className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition",
            children: "Modifier"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6", children: /* @__PURE__ */ jsx("pre", { className: "text-sm text-gray-900 dark:text-gray-100 overflow-auto", children: JSON.stringify(platform, null, 2) }) })
    ] })
  ] });
}
export {
  ShowPlatform as default
};
