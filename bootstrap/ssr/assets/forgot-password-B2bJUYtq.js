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
function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post("/forgot-password");
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Mot de passe oublié",
      description: "Entrez votre adresse email pour recevoir un lien de réinitialisation",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Mot de passe oublié" }),
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
                required: true
              }
            ),
            errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: errors.email })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300", disabled: processing, children: "Envoyer le lien de réinitialisation" })
        ] })
      ]
    }
  );
}
export {
  ForgotPassword as default
};
