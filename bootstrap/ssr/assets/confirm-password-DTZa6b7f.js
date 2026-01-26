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
function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post("/user/confirm-password", {
      onFinish: () => reset("password")
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Confirmer le mot de passe",
      description: "Veuillez confirmer votre mot de passe pour continuer",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Confirmer le mot de passe" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Il s'agit d'une zone sécurisée de l'application. Veuillez confirmer votre mot de passe avant de continuer." }),
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
                autoFocus: true,
                onChange: (e) => setData("password", e.target.value),
                required: true
              }
            ),
            errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.password })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: processing, children: "Confirmer" })
        ] })
      ]
    }
  );
}
export {
  ConfirmPassword as default
};
