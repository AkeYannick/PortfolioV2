import type { PorteurAcces } from "../auth/jwt.guard";

declare module "express" {
    interface Request {
        utilisateur?: PorteurAcces;
    }
}
