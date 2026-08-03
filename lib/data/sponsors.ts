export interface Sponsor {
  id: string;
  nombre: string;
  logo: string;
  href: string;
}

export const SPONSORS: Sponsor[] = [
  { id: "amorfar", nombre: "Amorfar", logo: "/sponsors/amorfar.png", href: "#" },
  { id: "elpela", nombre: "El Pela", logo: "/sponsors/elpela.png", href: "#" },
  { id: "gran-pata", nombre: "Gran Pata", logo: "/sponsors/gran-pata.png", href: "#" },
  { id: "martilleros", nombre: "Martilleros", logo: "/sponsors/martilleros.png", href: "#" },
  { id: "oscar", nombre: "Oscar", logo: "/sponsors/oscar.png", href: "#" },
];
