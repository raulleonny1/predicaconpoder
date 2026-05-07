import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg overflow-hidden",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt="Predica con Poder"
        width={40}
        height={40}
        className="h-full w-full object-contain"
        priority
      />
    </div>
  );
}
