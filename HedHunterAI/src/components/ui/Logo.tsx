import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  height?: number;
  href?: string;
  className?: string;
}

export function Logo({ height = 36, href = "/", className }: LogoProps) {
  const img = (
    <Image
      src="/HedHunhterAi 1.png"
      alt="Hed Hunter AI"
      width={0}
      height={height}
      sizes="300px"
      priority
      className={className}
      style={{ width: "auto", height: height, objectFit: "contain" }}
    />
  );

  if (!href) return img;
  return <Link href={href} style={{ display: "inline-flex", alignItems: "center" }}>{img}</Link>;
}
