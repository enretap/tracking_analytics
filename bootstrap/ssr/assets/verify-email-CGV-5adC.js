import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthLayout } from "./auth-layout-w58_EJ3s.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { B as Button } from "./button-VCvxHZJY.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
function VerifyEmail({ status }) {
  const { post, processing } = useForm({});
  const submit = (e) => {
    e.preventDefault();
    post("/email/verification-notification");
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Vérifier votre email",
      description: "Un lien de vérification a été envoyé à votre adresse email",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Vérification email" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Merci de vous être inscrit ! Avant de commencer, pourriez-vous vérifier votre adresse email en cliquant sur le lien que nous venons de vous envoyer ? Si vous n'avez pas reçu l'email, nous vous en enverrons un autre avec plaisir." }),
          status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-green-600 dark:text-green-400", children: "Un nouveau lien de vérification a été envoyé à l'adresse email que vous avez fournie lors de l'inscription." }),
          /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, children: "Renvoyer l'email de vérification" }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/logout",
                method: "post",
                as: "button",
                className: "text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                children: "Se déconnecter"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  VerifyEmail as default
};
