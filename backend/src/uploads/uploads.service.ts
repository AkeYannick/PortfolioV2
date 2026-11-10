import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { BadRequestException, Injectable, PayloadTooLargeException } from "@nestjs/common";
import { lireEnv } from "../env";

export const TAILLE_MAX_IMAGE = 10 * 1024 * 1024;

type FormatImage = { extension: string; mime: string; signature: (octets: Buffer) => boolean };

// Signatures réelles des fichiers : le type déclaré par le navigateur ne suffit pas.
const FORMATS: FormatImage[] = [
    {
        extension: ".png",
        mime: "image/png",
        signature: (o) => o.length >= 8 && o.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    },
    {
        extension: ".jpg",
        mime: "image/jpeg",
        signature: (o) => o.length >= 3 && o[0] === 0xff && o[1] === 0xd8 && o[2] === 0xff,
    },
    {
        extension: ".gif",
        mime: "image/gif",
        signature: (o) => o.length >= 6 && (o.toString("ascii", 0, 6) === "GIF87a" || o.toString("ascii", 0, 6) === "GIF89a"),
    },
    {
        extension: ".webp",
        mime: "image/webp",
        signature: (o) => o.length >= 12 && o.toString("ascii", 0, 4) === "RIFF" && o.toString("ascii", 8, 12) === "WEBP",
    },
    {
        extension: ".avif",
        mime: "image/avif",
        signature: (o) => o.length >= 12 && o.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(o.toString("ascii", 8, 12)),
    },
];

export const MIMES_ACCEPTES = FORMATS.map((format) => format.mime);

export type ImageTeleversee = { url: string; nom: string; taille: number; type: string };

@Injectable()
export class UploadsService {
    private readonly dossierImages: string;

    constructor() {
        this.dossierImages = join(lireEnv().dossierUploads, "images");
        mkdirSync(this.dossierImages, { recursive: true });
    }

    async enregistrerImage(fichier: Express.Multer.File | undefined): Promise<ImageTeleversee> {
        if (!fichier || fichier.size === 0) {
            throw new BadRequestException("Fichier vide ou manquant (champ « fichier »)");
        }
        if (fichier.size > TAILLE_MAX_IMAGE) {
            throw new PayloadTooLargeException("Image trop volumineuse : 10 Mo maximum");
        }

        const format = FORMATS.find((candidate) => candidate.signature(fichier.buffer));
        if (!format) {
            throw new BadRequestException("Format non pris en charge : PNG, JPEG, WebP, AVIF ou GIF uniquement");
        }

        // Nom régénéré : jamais celui du client, et l'extension vient du contenu détecté.
        const nom = `${randomUUID()}${format.extension}`;
        await writeFile(join(this.dossierImages, nom), fichier.buffer);

        return {
            url: `/uploads/images/${nom}`,
            // Busboy décode les noms en latin1 : on restaure l'UTF-8 pour l'affichage.
            nom: Buffer.from(fichier.originalname, "latin1").toString("utf8"),
            taille: fichier.size,
            type: format.mime,
        };
    }
}