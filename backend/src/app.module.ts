import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.service";
import { ProjectsModule } from "./projects/projects.module";
import { UploadsModule } from "./uploads/uploads.module";

@Module({
    imports: [
        ThrottlerModule.forRoot([{ limit: 100, ttl: 60_000 }]),
        PrismaModule,
        AuthModule,
        ProjectsModule,
        UploadsModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
