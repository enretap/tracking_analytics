import { jsxs, jsx } from "react/jsx-runtime";
import { h as home } from "./button-VCvxHZJY.js";
import { Link } from "@inertiajs/react";
function AuthSimpleLayout({
  children,
  title,
  description
}) {
  return /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden p-6 md:p-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-orange-900/20", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -left-40 top-0 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 opacity-30 blur-3xl mix-blend-multiply filter dark:opacity-20" }),
      /* @__PURE__ */ jsx("div", { className: "animation-delay-2000 absolute -right-40 top-0 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-orange-400 to-amber-300 opacity-30 blur-3xl mix-blend-multiply filter dark:opacity-20" }),
      /* @__PURE__ */ jsx("div", { className: "animation-delay-4000 absolute -bottom-40 left-20 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-yellow-400 to-orange-300 opacity-30 blur-3xl mix-blend-multiply filter dark:opacity-20" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 w-full max-w-sm", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-8", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-2xl backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          href: home(),
          className: "flex flex-col items-center gap-2 font-medium transition-transform hover:scale-105",
          children: [
            /* @__PURE__ */ jsx("div", { className: "mb-1 flex items-center justify-center rounded-2xl bg-white/80 p-4 backdrop-blur-sm dark:bg-gray-800/80", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: "/logo-ct.png",
                alt: "ATC Comafrique Logo",
                className: "h-16 w-auto object-contain"
              }
            ) }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: title })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-medium text-gray-900 dark:text-white", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400 pb-4", children: description })
      ] }),
      children
    ] }) }) })
  ] });
}
function AuthLayout({
  children,
  title,
  description,
  ...props
}) {
  return /* @__PURE__ */ jsx(AuthSimpleLayout, { title, description, ...props, children });
}
export {
  AuthLayout as A
};
