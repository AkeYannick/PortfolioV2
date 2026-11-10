import { BadRequestException, Controller, Post, UploadedFile, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Throttle } from "@nestjs/throttler";
import { memoryStorage } from "multer";
import { JwtGuard } from "../auth/jwt.guard";
import { FiltreErreursMulter } from "./multer-erreurs.filter";
import { MIMES_ACCEPTES, TAILLE_MAX_IMAGE, UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
    constructor(private readonly uploads: UploadsService) {}

    /** Import d'une image ou capture d'écran depuis le dashboard — réservé aux jetons admin. */
    @UseGuards(JwtGuard)
    @UseFilters(FiltreErreursMulter)
    @Throttle({ default: { limit: 20, ttl: 60_000 } })
    @Post("images")
    @UseInterceptors(
        FileInterceptor("fichier", {
            storage: memoryStorage(),
            limits: { fileSize: TAILLE_MAX_IMAGE, files: 1 },
            fileFilter: (_requete, fichier, retour) => {
                if (MIMES_ACCEPTES.includes(fichier.mimetype)) return retour(null, true);
                retour(new BadRequestException("Format non pris en charge : PNG, JPEG, WebP, AVIF ou GIF uniquement"), false);
            },
        }),
    )
    televerser(@UploadedFile() fichier: Express.Multer.File | undefined) {
        return this.uploads.enregistrerImage(fichier);
    }
}