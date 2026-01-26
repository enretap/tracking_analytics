import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthLayout } from "./auth-layout-w58_EJ3s.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { I as Input } from "./input-KsoydCnh.js";
import { L as Label } from "./label-BpmQxPHw.js";
import { C as Checkbox } from "./checkbox-1ktPqgeX.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-checkbox";
import "lucide-react";
function Login({ canResetPassword, canRegister, status }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const submit = (e) => {
    e.preventDefault();
    post("/login", {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(AuthLayout, { title: "Tracking Analytics", description: "Connectez-vous à votre compte", children: [
    /* @__PURE__ */ jsx(Head, { title: "Connexion" }),
    status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600 dark:text-green-400", children: status }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            name: "email",
            value: data.email,
            autoComplete: "username",
            autoFocus: true,
            onChange: (e) => setData("email", e.target.value),
            placeholder: "votre.email@example.com",
            required: true
          }
        ),
        errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.email })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Mot de passe" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            name: "password",
            value: data.password,
            autoComplete: "current-password",
            onChange: (e) => setData("password", e.target.value),
            placeholder: "Entrez votre mot de passe",
            required: true
          }
        ),
        errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: "remember",
              checked: data.remember,
              onCheckedChange: (checked) => setData("remember", checked === true)
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: "remember", className: "text-sm font-normal cursor-pointer", children: "Se souvenir de moi" })
        ] }),
        canResetPassword && /* @__PURE__ */ jsx(
          Link,
          {
            href: "/forgot-password",
            className: "text-sm text-amber-600 hover:text-amber-500 dark:text-amber-400",
            children: "Mot de passe oublié ?"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300", disabled: processing, children: "Se connecter" })
    ] })
  ] });
}
export {
  Login as default
};
