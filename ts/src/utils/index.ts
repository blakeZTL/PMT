export function parseIdFromForm(id: string): string {
  return id.replace(/[{}]/g, "");
}
