import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BK6R-x6E.js";
import { I as Input } from "./input-KsoydCnh.js";
import { L as Label } from "./label-BpmQxPHw.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-lrdiZK72.js";
import { T as Textarea } from "./textarea-DZPuCGde.js";
import { C as Checkbox } from "./checkbox-1ktPqgeX.js";
import { ArrowLeft, FileText } from "lucide-react";
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
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-checkbox";
function CreateReport({ accounts }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    type: "summary",
    description: "",
    account_ids: []
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/settings/reports");
  };
  const toggleAccount = (accountId) => {
    if (data.account_ids.includes(accountId)) {
      setData("account_ids", data.account_ids.filter((id) => id !== accountId));
    } else {
      setData("account_ids", [...data.account_ids, accountId]);
    }
  };
  const reportTypes = [
    { value: "summary", label: "Rapport de synthèse" },
    { value: "fleet_activity", label: "Activité de la flotte" },
    { value: "driver_behavior", label: "Comportement conducteur" },
    { value: "maintenance", label: "Maintenance" },
    { value: "fuel_consumption", label: "Consommation carburant" },
    { value: "eco_driving", label: "Éco-Conduite" },
    { value: "driver_eco_driving", label: "Éco-Conduite par Conducteur" },
    { value: "geo_eco_driving", label: "Éco-Conduite Géographique" }
  ];
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Rapports", href: "/settings/reports" },
    { title: "Créer", href: "/settings/reports/create" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Créer un rapport" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/settings/reports", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Créer un rapport" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Configurez un nouveau rapport" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
            "Configuration du rapport"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Définissez le type de rapport et les comptes associés" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nom du rapport" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Rapport mensuel",
                required: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "type", children: "Type de rapport" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: data.type,
                onValueChange: (value) => setData("type", value),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sélectionnez un type" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: reportTypes.map((type) => /* @__PURE__ */ jsx(SelectItem, { value: type.value, children: type.label }, type.value)) })
                ]
              }
            ),
            errors.type && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.type })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Description" }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "description",
                value: data.description,
                onChange: (e) => setData("description", e.target.value),
                placeholder: "Description du rapport...",
                rows: 3
              }
            ),
            errors.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.description })
          ] }),
          accounts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx(Label, { children: "Comptes associés" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: accounts.map((account) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: `account-${account.id}`,
                  checked: data.account_ids.includes(account.id),
                  onCheckedChange: () => toggleAccount(account.id)
                }
              ),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: `account-${account.id}`,
                  className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                  children: account.name
                }
              )
            ] }, account.id)) }),
            errors.account_ids && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.account_ids })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Création en cours..." : "Créer le rapport" }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/settings/reports", children: "Annuler" }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  CreateReport as default
};
