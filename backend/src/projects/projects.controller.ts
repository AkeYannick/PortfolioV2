import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { JwtGuard } from "../auth/jwt.guard";
import { CreerProjetDto, ModifierProjetDto } from "./dto/project.dto";
import { ProjectsService } from "./projects.service";

@Controller("projets")
export class ProjectsController {
    constructor(private readonly projects: ProjectsService) {}

    /** Route publique du site : uniquement les projets publiés. */
    @Get()
    listerPublies() {
        return this.projects.listerPublies();
    }

    /** Vue complète du dashboard (brouillons inclus) — réservée aux jetons admin. */
    @UseGuards(JwtGuard)
    @Get("admin/tous")
    listerTous() {
        return this.projects.listerTous();
    }

    @UseGuards(JwtGuard)
    @Get(":id")
    lire(@Param("id", ParseUUIDPipe) id: string) {
        return this.projects.lireUn(id);
    }

    @UseGuards(JwtGuard)
    @Throttle({ default: { limit: 30, ttl: 60_000 } })
    @Post()
    creer(@Body() dto: CreerProjetDto) {
        return this.projects.creer(dto);
    }

    @UseGuards(JwtGuard)
    @Throttle({ default: { limit: 60, ttl: 60_000 } })
    @Patch(":id")
    modifier(@Param("id", ParseUUIDPipe) id: string, @Body() dto: ModifierProjetDto) {
        return this.projects.modifier(id, dto);
    }

    @UseGuards(JwtGuard)
    @Throttle({ default: { limit: 30, ttl: 60_000 } })
    @HttpCode(200)
    @Delete(":id")
    supprimer(@Param("id", ParseUUIDPipe) id: string) {
        return this.projects.supprimer(id);
    }
}
