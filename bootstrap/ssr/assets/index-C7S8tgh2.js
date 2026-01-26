import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BK6R-x6E.js";
import { B as Badge } from "./badge-D_0uEcAf.js";
import { Plus, Server, Eye, Edit, Trash2 } from "lucide-react";
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
const deletePlatform = (platformId, platformName) => {
  if (confirm(`Voulez-vous vraiment supprimer la plateforme "${platformName}" ?`)) {
    router.delete(`/settings/platforms/${platformId}`);
  }
};
function PlatformsIndex({ platforms }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Plateformes", href: "/settings/platforms" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Plateformes" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Plateformes" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Gérez vos plateformes de télématique" })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/settings/platforms/create", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Nouvelle plateforme"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Server, { className: "h-5 w-5" }),
            "Plateformes configurées (",
            platforms.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Liste de toutes les plateformes de télématique disponibles" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: platforms && platforms.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: platforms.map((platform) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30", children: /* @__PURE__ */ jsx(Server, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: platform.name }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: [
                    platform.provider && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { children: platform.provider }),
                      /* @__PURE__ */ jsx("span", { children: "•" })
                    ] }),
                    platform.type && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Badge, { variant: "outline", children: platform.type }),
                      /* @__PURE__ */ jsx("span", { children: "•" })
                    ] }),
                    platform.is_active !== void 0 && /* @__PURE__ */ jsx(Badge, { variant: platform.is_active ? "default" : "secondary", children: platform.is_active ? "Active" : "Inactive" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/settings/platforms/${platform.id}`, children: [
                  /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-2" }),
                  "Voir"
                ] }) }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/settings/platforms/${platform.id}/edit`, children: [
                  /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-2" }),
                  "Éditer"
                ] }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => deletePlatform(platform.id, platform.name),
                    className: "text-red-600 hover:text-red-700",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ]
          },
          platform.id
        )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
          /* @__PURE__ */ jsx(Server, { className: "h-12 w-12 text-gray-300 dark:text-gray-700" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-gray-600 dark:text-gray-400", children: "Aucune plateforme configurée" }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4", size: "sm", children: /* @__PURE__ */ jsx(Link, { href: "/settings/platforms/create", children: "Créer votre première plateforme" }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  PlatformsIndex as default
};
