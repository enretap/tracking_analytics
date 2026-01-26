import { jsxs, jsx } from "react/jsx-runtime";
import { usePage, createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
import { createContext, useState, useCallback, useEffect, useContext } from "react";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const ToastContext = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4e3);
  }, []);
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value: { show }, children: [
    children,
    /* @__PURE__ */ jsx("div", { "aria-live": "polite", className: "fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:justify-end z-50", children: /* @__PURE__ */ jsx("div", { className: "w-full flex flex-col items-center space-y-2 sm:items-end", children: toasts.map((t) => /* @__PURE__ */ jsx("div", { className: `max-w-sm w-full bg-white dark:bg-gray-800 shadow rounded-md pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`, children: /* @__PURE__ */ jsxs("div", { className: `p-3 ${t.type === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}`, children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-900 dark:text-white", children: t.type === "success" ? "Succès" : "Erreur" }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-gray-700 dark:text-gray-300", children: t.message })
    ] }) }, t.id)) }) })
  ] });
}
function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
function FlashToast() {
  const { props } = usePage();
  const toast = useToast();
  useEffect(() => {
    const flash = props.flash ?? {};
    if (flash.success) {
      toast.show(flash.success, "success");
    }
    if (flash.error) {
      toast.show(flash.error, "error");
    }
  }, [props.flash, toast]);
  return null;
}
const appName = "TrackingRepports";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./Pages/auth/confirm-password.tsx": () => import("./assets/confirm-password-DTZa6b7f.js"), "./Pages/auth/forgot-password.tsx": () => import("./assets/forgot-password-B2bJUYtq.js"), "./Pages/auth/login.tsx": () => import("./assets/login-L40JzShD.js"), "./Pages/auth/register.tsx": () => import("./assets/register-Du-avwA6.js"), "./Pages/auth/reset-password.tsx": () => import("./assets/reset-password-CjVS3uGv.js"), "./Pages/auth/two-factor-challenge.tsx": () => import("./assets/two-factor-challenge-gZqwUoJR.js"), "./Pages/auth/verify-email.tsx": () => import("./assets/verify-email-CGV-5adC.js"), "./Pages/dashboard.tsx": () => import("./assets/dashboard-CUhxddki.js"), "./Pages/leasingDashboard.tsx": () => import("./assets/leasingDashboard-C3iKcKdJ.js"), "./Pages/reports/detail.tsx": () => import("./assets/detail-BMdpTViG.js"), "./Pages/reports/list.tsx": () => import("./assets/list-BwX_uPFV.js"), "./Pages/settings/accounts/create.tsx": () => import("./assets/create-CqWoqM-R.js"), "./Pages/settings/accounts/edit.tsx": () => import("./assets/edit-DPcxQxuO.js"), "./Pages/settings/accounts/index.tsx": () => import("./assets/index-CEdy4BJO.js"), "./Pages/settings/accounts/show.tsx": () => import("./assets/show-DFTP14vb.js"), "./Pages/settings/appearance.tsx": () => import("./assets/appearance-QY1DNcU6.js"), "./Pages/settings/index.tsx": () => import("./assets/index-WzFZ-x9E.js"), "./Pages/settings/platform-configuration.tsx": () => import("./assets/platform-configuration-C_HHjWKQ.js"), "./Pages/settings/platforms/create.tsx": () => import("./assets/create-CwUSG-eN.js"), "./Pages/settings/platforms/edit.tsx": () => import("./assets/edit-Du3xjgGP.js"), "./Pages/settings/platforms/index.tsx": () => import("./assets/index-C7S8tgh2.js"), "./Pages/settings/platforms/show.tsx": () => import("./assets/show-c1Gt7XJu.js"), "./Pages/settings/reports/create.tsx": () => import("./assets/create-BREAMGoo.js"), "./Pages/settings/reports/edit.tsx": () => import("./assets/edit-B0hNoWku.js"), "./Pages/settings/reports/index.tsx": () => import("./assets/index-DRt9bVDD.js"), "./Pages/settings/reports/show.tsx": () => import("./assets/show-DgoVYN-s.js"), "./Pages/settings/users/create.tsx": () => import("./assets/create-BgJyfZyk.js"), "./Pages/settings/users/edit.tsx": () => import("./assets/edit-DPkUiEjj.js"), "./Pages/settings/users/index.tsx": () => import("./assets/index-xUZta5O3.js") })
    ),
    setup: ({ App, props }) => {
      return /* @__PURE__ */ jsx(ToastProvider, { children: /* @__PURE__ */ jsx(App, { ...props }) });
    }
  })
);
export {
  FlashToast as F
};
