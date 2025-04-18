export {};

// Create a type for the roles
export type Roles = "USER" | "MODERATOR" | "ADMIN";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
