import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BK6R-x6E.js";
import { B as Badge } from "./badge-D_0uEcAf.js";
import { Plus, Building2, Eye, Edit, Trash2 } from "lucide-react";
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
const deleteAccount = (accountId, accountName) => {
  if (confirm(`Voulez-vous vraiment supprimer le compte "${accountName}" ?`)) {
    router.delete(`/settings/accounts/${accountId}`);
  }
};
function AccountsIndex({ accounts }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Comptes", href: "/settings/accounts" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Comptes" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Comptes" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Gérez vos comptes de plateforme" })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/settings/accounts/create", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Nouveau compte"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5" }),
            "Comptes configurés (",
            accounts.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Liste de tous les comptes clients avec leurs plateformes associées" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: accounts && accounts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: accounts.map((account) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 overflow-hidden", children: account.logo ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: `/storage/${account.logo}`,
                    alt: account.name,
                    className: "h-full w-full object-cover"
                  }
                ) : /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5 text-green-600 dark:text-green-400" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: account.name }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: account.platforms && account.platforms.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs("span", { children: [
                      account.platforms.length,
                      " plateforme",
                      account.platforms.length > 1 ? "s" : ""
                    ] }),
                    /* @__PURE__ */ jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
                      account.platforms.slice(0, 3).map((platform) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: platform.name }, platform.id)),
                      account.platforms.length > 3 && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                        "+",
                        account.platforms.length - 3
                      ] })
                    ] })
                  ] }) : /* @__PURE__ */ jsx("span", { className: "text-amber-600 dark:text-amber-400", children: "Aucune plateforme" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/settings/accounts/${account.id}`, children: [
                  /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4 mr-2" }),
                  "Voir"
                ] }) }),
                /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: `/settings/accounts/${account.id}/edit`, children: [
                  /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4 mr-2" }),
                  "Éditer"
                ] }) }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => deleteAccount(account.id, account.name),
                    className: "text-red-600 hover:text-red-700",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ]
          },
          account.id
        )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
          /* @__PURE__ */ jsx(Building2, { className: "h-12 w-12 text-gray-300 dark:text-gray-700" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-gray-600 dark:text-gray-400", children: "Aucun compte configuré" }),
          /* @__PURE__ */ jsx(Button, { asChild: true, className: "mt-4", size: "sm", children: /* @__PURE__ */ jsx(Link, { href: "/settings/accounts/create", children: "Créer votre premier compte" }) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  AccountsIndex as default
};
