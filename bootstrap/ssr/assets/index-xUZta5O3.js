import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./app-layout-C3_vghij.js";
import { Head, Link, router } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BK6R-x6E.js";
import { B as Badge } from "./badge-D_0uEcAf.js";
import { UserPlus, Mail, Clock, RefreshCw, XCircle, Users } from "lucide-react";
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
const getRoleBadge = (role) => {
  switch (role) {
    case "super-admin":
      return /* @__PURE__ */ jsx(Badge, { className: "bg-purple-500", children: "Super Admin" });
    case "admin":
      return /* @__PURE__ */ jsx(Badge, { className: "bg-blue-500", children: "Admin" });
    case "agent":
      return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Agent" });
    default:
      return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: role });
  }
};
const resendInvitation = (invitationId) => {
  router.post(`/settings/users/invitations/${invitationId}/resend`, {}, {
    preserveScroll: true
  });
};
const cancelInvitation = (invitationId) => {
  if (confirm("Voulez-vous vraiment annuler cette invitation ?")) {
    router.delete(`/settings/users/invitations/${invitationId}`, {
      preserveScroll: true
    });
  }
};
const deleteUser = (userId) => {
  if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
    router.delete(`/settings/users/${userId}`);
  }
};
function UsersIndex({ users, invitations }) {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs: [
    { title: "Paramètres", href: "/settings" },
    { title: "Utilisateurs", href: "/settings/users" }
  ], children: [
    /* @__PURE__ */ jsx(Head, { title: "Gestion des utilisateurs" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100", children: "Gestion des utilisateurs" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Gérez les utilisateurs et les invitations" })
        ] }),
        /* @__PURE__ */ jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { href: "/settings/users/create", children: [
          /* @__PURE__ */ jsx(UserPlus, { className: "mr-2 h-4 w-4" }),
          "Inviter un utilisateur"
        ] }) })
      ] }),
      invitations.length > 0 && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }),
            "Invitations en attente (",
            invitations.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Ces utilisateurs n'ont pas encore accepté leur invitation" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: invitations.map((invitation) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30", children: /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: invitation.email }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: [
                    getRoleBadge(invitation.role),
                    invitation.account && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsx("span", { children: invitation.account.name })
                    ] }),
                    /* @__PURE__ */ jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Expire le ",
                      new Date(invitation.expires_at).toLocaleDateString("fr-FR")
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => resendInvitation(invitation.id),
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
                      "Renvoyer"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => cancelInvitation(invitation.id),
                    className: "text-red-600 hover:text-red-700",
                    children: /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" })
                  }
                )
              ] })
            ]
          },
          invitation.id
        )) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }),
            "Utilisateurs actifs (",
            users.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Liste de tous les utilisateurs de votre organisation" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: users.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: users.map((user) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-blue-600 dark:text-blue-400", children: user.name.charAt(0).toUpperCase() }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: user.name }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400", children: [
                    /* @__PURE__ */ jsx("span", { children: user.email }),
                    /* @__PURE__ */ jsx("span", { children: "•" }),
                    getRoleBadge(user.role),
                    user.account && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsx("span", { children: user.account.name })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    asChild: true,
                    children: /* @__PURE__ */ jsx(Link, { href: `/settings/users/${user.id}/edit`, children: "Modifier" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => deleteUser(user.id),
                    className: "text-red-600 hover:text-red-700",
                    children: "Supprimer"
                  }
                )
              ] })
            ]
          },
          user.id
        )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-12 w-12 text-gray-300 dark:text-gray-700" }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-gray-600 dark:text-gray-400", children: "Aucun utilisateur pour le moment" })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  UsersIndex as default
};
