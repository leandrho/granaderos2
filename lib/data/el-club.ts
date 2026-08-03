export interface ObjetivoEspecifico {
  numero: string;
  titulo: string;
  descripcion: string;
}

export const MISION =
  "El club nace con la misión de brindar a los niños y jóvenes de Juana Koslay un espacio seguro y enriquecedor, donde puedan aprender y crecer tanto como deportistas como personas. La escuela de fútbol tiene como objetivo principal la formación integral de los jóvenes, enfocándose en los valores de educación, respeto y solidaridad.";

export const OBJETIVO_GENERAL =
  "Crear un espacio de formación deportiva y personal que sirva como alternativa para los jóvenes, alejándolos de situaciones de riesgo y fomentando un sentido de pertenencia hacia su comunidad y el Club Deportivo Granaderos de Koslay.";

export const OBJETIVOS_ESPECIFICOS: ObjetivoEspecifico[] = [
  {
    numero: "01",
    titulo: "Fomentar la educación",
    descripcion:
      "Integrar valores educativos en la práctica del fútbol, enseñando a los niños la importancia del estudio y el esfuerzo personal.",
  },
  {
    numero: "02",
    titulo: "Promover el respeto",
    descripcion:
      "Inculcar el respeto hacia los demás, tanto dentro como fuera del campo de juego, valorando el trabajo en equipo y la diversidad.",
  },
  {
    numero: "03",
    titulo: "Desarrollar la solidaridad",
    descripcion:
      "Fomentar la ayuda mutua y la empatía, creando un ambiente de compañerismo y apoyo.",
  },
  {
    numero: "04",
    titulo: "Capacitación a futuro",
    descripcion:
      "Formar a los jóvenes como futuros líderes y dirigentes del Club Deportivo Granaderos de Koslay, brindándoles herramientas para asumir ese compromiso.",
  },
];
