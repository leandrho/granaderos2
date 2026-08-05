export function vacioANull(formData: FormData, clave: string): string | null {
  const valor = String(formData.get(clave) ?? "").trim();
  return valor === "" ? null : valor;
}
