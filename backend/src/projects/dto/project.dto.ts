import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Length,
    Max,
    MaxLength,
    Min,
    ValidateIf,
} from "class-validator";
import { CategorieProjet } from "../../generated/prisma/enums.js";

export class CreerProjetDto {
    @IsString()
    @Length(2, 120)
    titre!: string;

    @IsString()
    @Length(2, 120)
    sousTitre!: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @MaxLength(40, { each: true })
    stack!: string[];

    @IsString()
    @Length(2, 40)
    annee!: string;

    @IsEnum(CategorieProjet)
    categorie!: CategorieProjet;

    @ValidateIf((_o, v: unknown) => v !== "" && v !== null && v !== undefined)
    @IsString()
    @MaxLength(500)
    @IsOptional()
    image?: string;

    @ValidateIf((_o, v: unknown) => v !== "" && v !== null && v !== undefined)
    @IsString()
    @MaxLength(500)
    @IsOptional()
    lien?: string;

    @IsOptional()
    @IsBoolean()
    publie?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(9999)
    ordre?: number;
}

/** Toutes les champs sont optionnels : c'est un PATCH. */
export class ModifierProjetDto {
    @IsOptional()
    @IsString()
    @Length(2, 120)
    titre?: string;

    @IsOptional()
    @IsString()
    @Length(2, 120)
    sousTitre?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @MaxLength(40, { each: true })
    stack?: string[];

    @IsOptional()
    @IsString()
    @Length(2, 40)
    annee?: string;

    @IsOptional()
    @IsEnum(CategorieProjet)
    categorie?: CategorieProjet;

    @ValidateIf((_o, v: unknown) => v !== "" && v !== null && v !== undefined)
    @IsString()
    @MaxLength(500)
    @IsOptional()
    image?: string;

    @ValidateIf((_o, v: unknown) => v !== "" && v !== null && v !== undefined)
    @IsString()
    @MaxLength(500)
    @IsOptional()
    lien?: string;

    @IsOptional()
    @IsBoolean()
    publie?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(9999)
    ordre?: number;
}
