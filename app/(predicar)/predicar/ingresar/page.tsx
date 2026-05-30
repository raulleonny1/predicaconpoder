import type { Metadata } from "next";
import { IngresarPage } from "@/components/predicar/auth-user-menu";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Crea tu cuenta o entra para guardar tus mensajes de predicación de forma privada.",
};

export default function IngresarRoute() {
  return <IngresarPage />;
}
