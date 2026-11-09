import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreerProjetDto, ModifierProjetDto } from "./dto/project.dto";

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) {}

    /** Ce que le site public affiche : uniquement les projets publiés, dans l'ordre. */
    listerPublies() {
        return this.prisma.project.findMany({
            where: { publie: true },
            orderBy: [{ ordre: "asc" }, { createdAt: "desc" }],
        });
    }

    /** Vue complète du dashboard (brouillons inclus). */
    listerTous() {
        return this.prisma.project.findMany({ orderBy: [{ ordre: "asc" }, { createdAt: "desc" }] });
    }

    async lireUn(id: string) {
        const projet = await this.prisma.project.findUnique({ where: { id } });
        if (!projet) throw new NotFoundException("Projet introuvable");
        return projet;
    }

    creer(dto: CreerProjetDto) {
        return this.prisma.project.create({ data: dto as Prisma.ProjectCreateInput });
    }

    async modifier(id: string, dto: ModifierProjetDto) {
        await this.lireUn(id);
        return this.prisma.project.update({ where: { id }, data: dto as Prisma.ProjectUpdateInput });
    }

    async supprimer(id: string) {
        await this.lireUn(id);
        await this.prisma.project.delete({ where: { id } });
        return { id, supprime: true };
    }
}
