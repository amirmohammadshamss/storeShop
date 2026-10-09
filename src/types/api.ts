

export type BackendFailureKind = "configuration" | "network" | "http" | "schema";

export type BackendRequestOptions = RequestInit & { next?: { revalidate: number } };

export type ReadPolicy = "catalog" | "private";
