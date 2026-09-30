import type { Metadata } from "next";
import { Anton, Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import { TransicionPagina } from "@/components/layout/TransicionPagina";
import { SITE } from "@/lib/site";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Inicio",
    template: `%s | ${SITE.nombreCompleto}`,
  },
  description: SITE.descripcion,
};

const themeScript = `(function(){try{var s=localStorage.getItem("grana-theme");var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var t=d?"dark":"light";document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-theme="dark"
      suppressHydrationWarning
      className={`${anton.variable} ${hankenGrotesk.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <TransicionPagina>{children}</TransicionPagina>
      </body>
    </html>
  );
}
