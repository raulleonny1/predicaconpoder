import { PredicarProviders } from "@/components/predicar/predicar-providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Predicar",
  description:
    "Prepara tu mensaje, busca la Biblia al instante y proyecta con un visor grande para la congregación.",
};

export default function PredicarLayout({ children }: { children: React.ReactNode }) {
  return <PredicarProviders>{children}</PredicarProviders>;
}
