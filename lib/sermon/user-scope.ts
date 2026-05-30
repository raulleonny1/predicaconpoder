/** Identificador de espacio de datos: uid de Firebase o invitado en este navegador */
export function getUserScope(userId: string | null | undefined): string {
  return userId ?? "guest";
}

export function draftStorageKey(userId: string | null | undefined): string {
  return `pcp:draft:${getUserScope(userId)}`;
}

export function libraryIndexKey(userId: string | null | undefined): string {
  return `pcp:library:${getUserScope(userId)}`;
}

export function libraryItemKey(userId: string | null | undefined, savedId: string): string {
  return `pcp:library-item:${getUserScope(userId)}:${savedId}`;
}

export function presentationKey(userId: string | null | undefined): string {
  return `pcp:presentation:${getUserScope(userId)}`;
}
