import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthLayout } from "./auth-layout-w58_EJ3s.js";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { B as Button } from "./button-VCvxHZJY.js";
import { I as Input } from "./input-KsoydCnh.js";
import { L as Label } from "./label-BpmQxPHw.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
function TwoFactorChallenge() {
  const [recovery, setRecovery] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    code: "",
    recovery_code: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post("/two-factor-challenge", {
      onFinish: () => reset("code", "recovery_code")
    });
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Authentification à deux facteurs",
      description: recovery ? "Veuillez confirmer l'accès à votre compte en saisissant un de vos codes de récupération" : "Veuillez confirmer l'accès à votre compte en saisissant le code d'authentification fourni par votre application d'authentification",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Authentification à deux facteurs" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-6", children: [
          !recovery ? /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "code", children: "Code" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "code",
                type: "text",
                inputMode: "numeric",
                name: "code",
                value: data.code,
                autoComplete: "one-time-code",
                autoFocus: true,
                onChange: (e) => setData("code", e.target.value),
                required: true
              }
            ),
            errors.code && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.code })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "recovery_code", children: "Code de récupération" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "recovery_code",
                type: "text",
                name: "recovery_code",
                value: data.recovery_code,
                autoComplete: "one-time-code",
                autoFocus: true,
                onChange: (e) => setData("recovery_code", e.target.value),
                required: true
              }
            ),
            errors.recovery_code && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.recovery_code })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400",
                onClick: () => {
                  setRecovery(!recovery);
                  reset();
                },
                children: recovery ? "Utiliser un code d'authentification" : "Utiliser un code de récupération"
              }
            ),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: "Se connecter" })
          ] })
        ] })
      ]
    }
  );
}
export {
  TwoFactorChallenge as default
};
