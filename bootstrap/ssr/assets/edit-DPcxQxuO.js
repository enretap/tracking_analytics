import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BK6R-x6E.js";
import { I as Input } from "./input-KsoydCnh.js";
import { L as Label } from "./label-BpmQxPHw.js";
import { C as Checkbox } from "./checkbox-1ktPqgeX.js";
import { ArrowLeft, Building2, Globe, Tag, Image } from "lucide-react";
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
import "@radix-ui/react-checkbox";
function EditAccount({ account, platforms }) {
  const { data, setData, put, processing, errors } = useForm({
    name: account.name || "",
    domain: account.domain || "",
    reference_ctrack: account.reference_ctrack || "",
    logo: null,
    platform_ids: account.platforms?.map((p) => p.id) || []
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/settings/accounts/${account.id}`, {
      forceFormData: true
    });
  };
  const togglePlatform = (platformId) => {
    if (data.platform_ids.includes(platformId)) {
      setData("platform_ids", data.platform_ids.filter((id) => id !== platformId));
    } else {
      setData("platform_ids", [...data.platform_ids, platformId]);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Comptes", href: "/settings/accounts" },
    { title: account.name, href: `/settings/accounts/${account.id}` },
    { title: "Modifier", href: `/settings/accounts/${account.id}/edit` }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: `Modifier ${account.name}` }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/settings/accounts", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: [
            "Modifier ",
            account.name
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Modifiez les informations du compte" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5" }),
            "Informations du compte"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Modifiez le compte et ses plateformes associées" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nom du compte" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Compte principal",
                required: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "domain", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
              "Domaine d'activité"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "domain",
                type: "text",
                value: data.domain,
                onChange: (e) => setData("domain", e.target.value),
                placeholder: "Transport, Logistique, etc."
              }
            ),
            errors.domain && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.domain })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "reference_ctrack", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }),
              "Référence CTRACK"
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "reference_ctrack",
                type: "text",
                value: data.reference_ctrack,
                onChange: (e) => setData("reference_ctrack", e.target.value),
                placeholder: "Référence du compte sur CTRACK"
              }
            ),
            errors.reference_ctrack && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.reference_ctrack })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "logo", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" }),
              "Logo du compte"
            ] }),
            account.logo && !data.logo && /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: `/storage/${account.logo}`,
                  alt: "Logo actuel",
                  className: "h-16 w-auto rounded border border-gray-200"
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Logo actuel" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "logo",
                type: "file",
                accept: "image/*",
                onChange: (e) => setData("logo", e.target.files?.[0] || null)
              }
            ),
            data.logo && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
              "Nouveau fichier sélectionné : ",
              data.logo.name
            ] }),
            errors.logo && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.logo })
          ] }),
          platforms.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx(Label, { children: "Plateformes associées" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-2", children: platforms.map((platform) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                Checkbox,
                {
                  id: `platform-${platform.id}`,
                  checked: data.platform_ids.includes(platform.id),
                  onCheckedChange: () => togglePlatform(platform.id)
                }
              ),
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: `platform-${platform.id}`,
                  className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                  children: platform.name
                }
              )
            ] }, platform.id)) }),
            errors.platform_ids && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.platform_ids })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Mise à jour..." : "Mettre à jour" }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/settings/accounts", children: "Annuler" }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  EditAccount as default
};
