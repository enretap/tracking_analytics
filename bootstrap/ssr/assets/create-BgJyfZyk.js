import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BK6R-x6E.js";
import { I as Input } from "./input-KsoydCnh.js";
import { L as Label } from "./label-BpmQxPHw.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-lrdiZK72.js";
import { ArrowLeft, Mail } from "lucide-react";
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
function UsersCreate({ accounts }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    role: "agent",
    account_id: accounts.length === 1 ? accounts[0].id : ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/settings/users");
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Utilisateurs", href: "/settings/users" },
    { title: "Inviter", href: "/settings/users/create" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Inviter un utilisateur" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "icon", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/settings/users", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Inviter un utilisateur" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Envoyez une invitation par email" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }),
            "Informations de l'utilisateur"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "L'utilisateur recevra un email avec un lien pour créer son compte" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Nom complet" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "name",
                type: "text",
                value: data.name,
                onChange: (e) => setData("name", e.target.value),
                placeholder: "Jean Dupont",
                required: true
              }
            ),
            errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "email",
                type: "email",
                value: data.email,
                onChange: (e) => setData("email", e.target.value),
                placeholder: "jean.dupont@example.com",
                required: true
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "role", children: "Rôle" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: data.role,
                onValueChange: (value) => setData("role", value),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sélectionnez un rôle" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "agent", children: "Agent" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "admin", children: "Admin" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "super-admin", children: "Super Admin" })
                  ] })
                ]
              }
            ),
            errors.role && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.role }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              data.role === "super-admin" && "Accès complet à toutes les fonctionnalités",
              data.role === "admin" && "Peut gérer les utilisateurs de son compte",
              data.role === "agent" && "Accès en lecture seule aux rapports"
            ] })
          ] }),
          accounts.length > 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "account_id", children: "Compte" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: data.account_id?.toString() || "",
                onValueChange: (value) => setData("account_id", parseInt(value)),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sélectionnez un compte" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: accounts.map((account) => /* @__PURE__ */ jsx(SelectItem, { value: account.id.toString(), children: account.name }, account.id)) })
                ]
              }
            ),
            errors.account_id && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.account_id })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Envoi en cours..." : "Envoyer l'invitation" }),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { href: "/settings/users", children: "Annuler" }) })
          ] })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  UsersCreate as default
};
