import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BK6R-x6E.js";
import { I as Input } from "./input-KsoydCnh.js";
import { L as Label } from "./label-BpmQxPHw.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-lrdiZK72.js";
import { ArrowLeft, Server } from "lucide-react";
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
function CreatePlatform() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    type: "telematics",
    provider: "",
    api_url: "",
    api_key: "",
    is_active: true
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/settings/platforms");
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Plateformes", href: "/settings/platforms" },
    { title: "Créer", href: "/settings/platforms/create" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Créer une plateforme" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/settings/platforms", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Créer une plateforme" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Ajoutez une nouvelle plateforme de télématique" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Server, { className: "h-5 w-5" }),
            "Informations de la plateforme"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Configurez les paramètres de connexion à la plateforme" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nom de la plateforme" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "TARGE TELEMATICS",
                required: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "type", children: "Type" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: data.type,
                onValueChange: (value) => setData("type", value),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sélectionnez un type" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "telematics", children: "Télématique" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "gps", children: "GPS" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "fleet", children: "Gestion de flotte" })
                  ] })
                ]
              }
            ),
            errors.type && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.type })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "provider", children: "Fournisseur" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "provider",
                type: "text",
                value: data.provider,
                onChange: (e) => setData("provider", e.target.value),
                placeholder: "TARGE",
                required: true
              }
            ),
            errors.provider && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.provider })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "api_url", children: "URL de l'API" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "api_url",
                type: "url",
                value: data.api_url,
                onChange: (e) => setData("api_url", e.target.value),
                placeholder: "https://api.example.com",
                required: true
              }
            ),
            errors.api_url && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.api_url })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "api_key", children: "Clé API" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "api_key",
                type: "password",
                value: data.api_key,
                onChange: (e) => setData("api_key", e.target.value),
                placeholder: "••••••••••••••••",
                required: true
              }
            ),
            errors.api_key && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.api_key }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "La clé sera stockée de manière sécurisée" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Création en cours..." : "Créer la plateforme" }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/settings/platforms", children: "Annuler" }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  CreatePlatform as default
};
