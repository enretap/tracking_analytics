import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthLayout } from "./auth-layout-w58_EJ3s.js";
import { useForm, Head } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import { I as Input } from "./input-KsoydCnh.js";
import { L as Label } from "./label-BpmQxPHw.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
function ResetPassword({ email, token }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token,
    email,
    password: "",
    password_confirmation: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post("/reset-password", {
      onFinish: () => reset("password", "password_confirmation")
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Réinitialiser le mot de passe",
      description: "Choisissez un nouveau mot de passe",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Réinitialiser le mot de passe" }),
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
                onChange: (e) => setData("email", e.target.value),
                required: true
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Nouveau mot de passe" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "password",
                type: "password",
                name: "password",
                value: data.password,
                autoComplete: "new-password",
                autoFocus: true,
                onChange: (e) => setData("password", e.target.value),
                required: true
              }
            ),
            errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "password_confirmation", children: "Confirmer le mot de passe" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "password_confirmation",
                type: "password",
                name: "password_confirmation",
                value: data.password_confirmation,
                autoComplete: "new-password",
                onChange: (e) => setData("password_confirmation", e.target.value),
                required: true
              }
            ),
            errors.password_confirmation && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password_confirmation })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: processing, children: "Réinitialiser le mot de passe" })
        ] })
      ]
    }
  );
}
export {
  ResetPassword as default
};
