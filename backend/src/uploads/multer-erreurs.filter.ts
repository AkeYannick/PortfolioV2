import { ArgumentsHost, Catch, ExceptionFilter, PayloadTooLargeException } from "@nestjs/common";
import type { Response } from "express";

/** Nest mappe déjà MulterError en 413 : on remplace juste le message anglais par le message métier. */
@Catch(PayloadTooLargeException)
export class FiltreErreursMulter implements ExceptionFilter {
    catch(_erreur: PayloadTooLargeException, host: ArgumentsHost) {
        const reponse = host.switchToHttp().getResponse<Response>();
        const exception = new PayloadTooLargeException("Image trop volumineuse : 10 Mo maximum");
        reponse.status(exception.getStatus()).json(exception.getResponse());
    }
}