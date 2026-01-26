import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { useForm, Head, router } from "@inertiajs/react";
import { c as cn, B as Button } from "./button-VCvxHZJY.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle, d as CardDescription } from "./card-BK6R-x6E.js";
import { I as Input } from "./input-KsoydCnh.js";
import { L as Label } from "./label-BpmQxPHw.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-lrdiZK72.js";
import { T as Textarea } from "./textarea-DZPuCGde.js";
import { B as Badge } from "./badge-D_0uEcAf.js";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon, Zap, CheckCircle, XCircle, Settings, Trash2, TestTube } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import "@radix-ui/react-slot";
import "class-variance-authority";
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
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", children: [
            /* @__PURE__ */ jsx(XIcon, {}),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function PlatformConfiguration({ platforms, error }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    account_id: 0,
    platform_id: 0,
    api_url: "",
    api_token: "",
    http_method: "GET",
    token_type: "bearer",
    token_key: "",
    additional_params: ""
  });
  const openConfigDialog = (platform, account) => {
    setSelectedPlatform(platform);
    setSelectedAccount(account);
    setTestResult(null);
    setData({
      account_id: account.id,
      platform_id: platform.id,
      api_url: account.api_url || "",
      api_token: account.api_token || "",
      http_method: account.http_method || "GET",
      token_type: account.token_type || "bearer",
      token_key: account.token_key || "",
      additional_params: account.additional_params || ""
    });
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedAccount(null);
    setSelectedPlatform(null);
    setTestResult(null);
    reset();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/settings/platform-api", {
      preserveScroll: true,
      onSuccess: () => {
        closeDialog();
      }
    });
  };
  const handleDelete = (platformId, accountId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette configuration ?")) {
      router.delete(`/settings/platform-api/${platformId}`, {
        data: { account_id: accountId },
        preserveScroll: true
      });
    }
  };
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      const response = await axios.post("/settings/platform-api/test", {
        api_url: data.api_url,
        api_token: data.api_token,
        http_method: data.http_method,
        token_type: data.token_type,
        token_key: data.token_key,
        additional_params: data.additional_params
      });
      setTestResult({
        success: true,
        message: response.data.message
      });
    } catch (error2) {
      setTestResult({
        success: false,
        message: error2.response?.data?.message || "Erreur lors du test de connexion"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Configuration API", href: "/settings/platform-api" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Configuration API" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Configuration API" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Configurez les APIs pour chaque compte par plateforme" })
      ] }),
      error && /* @__PURE__ */ jsx(Card, { className: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsx("p", { className: "text-red-600 dark:text-red-400", children: error }) }) }),
      platforms.map((platform) => /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Zap, { className: "h-5 w-5" }),
            platform.name,
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "ml-2", children: platform.provider })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Configurez les accès API pour chaque compte" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: platform.accounts.map((account) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg border p-4",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                account.configured ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-gray-400" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-medium", children: account.name }),
                  account.configured && account.api_url && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: account.api_url })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: account.configured ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => openConfigDialog(platform, account),
                    children: [
                      /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4 mr-1" }),
                      "Modifier"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => handleDelete(platform.id, account.id),
                    children: [
                      /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 mr-1" }),
                      "Supprimer"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "default",
                  size: "sm",
                  onClick: () => openConfigDialog(platform, account),
                  children: "Configurer"
                }
              ) })
            ]
          },
          account.id
        )) }) })
      ] }, platform.id))
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxs(DialogTitle, { children: [
          selectedAccount?.configured ? "Modifier" : "Configurer",
          " l'API"
        ] }),
        /* @__PURE__ */ jsxs(DialogDescription, { children: [
          "Configuration de ",
          selectedPlatform?.name,
          " pour ",
          selectedAccount?.name
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "api_url", children: "URL de l'API *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "api_url",
              type: "url",
              value: data.api_url,
              onChange: (e) => setData("api_url", e.target.value),
              placeholder: "https://api.example.com/endpoint",
              required: true
            }
          ),
          errors.api_url && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.api_url })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "http_method", children: "Méthode HTTP" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: data.http_method,
                onValueChange: (value) => setData("http_method", value),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "GET", children: "GET" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "POST", children: "POST" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "token_type", children: "Type de Token" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: data.token_type,
                onValueChange: (value) => setData("token_type", value),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "bearer", children: "Bearer" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "header", children: "Header personnalisé" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "body", children: "Dans le body" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        data.token_type !== "bearer" && /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "token_key", children: "Nom de la clé du token" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "token_key",
              type: "text",
              value: data.token_key,
              onChange: (e) => setData("token_key", e.target.value),
              placeholder: "X-API-Key ou api_token"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Le nom du header ou du paramètre body pour le token" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "api_token", children: "Token API *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "api_token",
              type: "password",
              value: data.api_token,
              onChange: (e) => setData("api_token", e.target.value),
              placeholder: "••••••••••••••••",
              required: true
            }
          ),
          errors.api_token && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.api_token })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "additional_params", children: "Paramètres additionnels (JSON)" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "additional_params",
              value: data.additional_params,
              onChange: (e) => setData("additional_params", e.target.value),
              placeholder: '{"param1": "value1", "param2": "value2"}',
              rows: 3
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Format JSON valide pour les paramètres supplémentaires" }),
          errors.additional_params && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600", children: errors.additional_params })
        ] }),
        testResult && /* @__PURE__ */ jsx(
          "div",
          {
            className: `rounded-lg p-4 ${testResult.success ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900" : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900"}`,
            children: /* @__PURE__ */ jsx(
              "p",
              {
                className: testResult.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                children: testResult.message
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleTestConnection,
              disabled: isTestingConnection || !data.api_url || !data.api_token,
              children: [
                /* @__PURE__ */ jsx(TestTube, { className: "h-4 w-4 mr-2" }),
                isTestingConnection ? "Test en cours..." : "Tester la connexion"
              ]
            }
          ),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: closeDialog, children: "Annuler" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: processing ? "Enregistrement..." : "Enregistrer" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  PlatformConfiguration as default
};
