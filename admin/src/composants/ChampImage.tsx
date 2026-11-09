import { useEffect, useRef, useState, type DragEvent } from "react";
import { Check, CloudUpload, FileImage, Link2, Trash2, X } from "lucide-react";
import { resoudreImage, TAILLE_MAX_IMAGE, televerserImage, TYPES_IMAGE_ACCEPTES } from "../api";

type Props = {
    valeur: string;
    onChange: (valeur: string) => void;
    onTeleversement?: (enCours: boolean) => void;
};

const TYPES_PAR_EXTENSION: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    avif: "image/avif",
    gif: "image/gif",
};

const MESSAGE_FORMAT = "Format non pris en charge : PNG, JPEG, WebP, AVIF ou GIF uniquement.";

const formaterTaille = (octets: number) =>
    octets >= 1024 * 1024 ? `${(octets / (1024 * 1024)).toFixed(1)} Mo` : `${Math.max(1, Math.round(octets / 1024))} Ko`;

const ChampImage = ({ valeur, onChange, onTeleversement }: Props) => {
    const [survol, setSurvol] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);
    const [televersement, setTeleversement] = useState<{ nom: string; pourcentage: number; apercu: string } | null>(null);
    const [dernierImport, setDernierImport] = useState<{ url: string; nom: string; taille: number } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const controleurRef = useRef<AbortController | null>(null);
    const apercuRef = useRef<string | null>(null);

    const urlApercu = resoudreImage(valeur);

    const nettoyerApercu = () => {
        if (apercuRef.current) URL.revokeObjectURL(apercuRef.current);
        apercuRef.current = null;
    };

    useEffect(
        () => () => {
            controleurRef.current?.abort();
            if (apercuRef.current) URL.revokeObjectURL(apercuRef.current);
        },
        [],
    );

    const traiterFichier = async (fichier: File) => {
        setErreur(null);
        const extension = fichier.name.split(".").pop()?.toLowerCase() ?? "";
        const type =
            fichier.type && fichier.type !== "application/octet-stream"
                ? fichier.type
                : (TYPES_PAR_EXTENSION[extension] ?? fichier.type);
        if (!TYPES_IMAGE_ACCEPTES.includes(type as (typeof TYPES_IMAGE_ACCEPTES)[number])) {
            setErreur(MESSAGE_FORMAT);
            return;
        }
        if (fichier.size === 0) {
            setErreur("Le fichier est vide.");
            return;
        }
        if (fichier.size > TAILLE_MAX_IMAGE) {
            setErreur(`Image trop volumineuse (${formaterTaille(fichier.size)}) : 10 Mo maximum.`);
            return;
        }

        controleurRef.current?.abort();
        const controleur = new AbortController();
        controleurRef.current = controleur;
        nettoyerApercu();
        const apercu = URL.createObjectURL(fichier);
        apercuRef.current = apercu;
        setTeleversement({ nom: fichier.name, pourcentage: 0, apercu });
        onTeleversement?.(true);
        try {
            const resultat = await televerserImage(fichier, {
                signal: controleur.signal,
                surProgression: (pourcentage) => setTeleversement((etat) => (etat ? { ...etat, pourcentage } : etat)),
            });
            onChange(resultat.url);
            setDernierImport({ url: resultat.url, nom: resultat.nom, taille: resultat.taille });
        } catch (e) {
            if (!(e instanceof DOMException && e.name === "AbortError")) {
                setErreur(e instanceof Error ? e.message : "Téléversement impossible");
            }
        } finally {
            if (controleurRef.current === controleur) {
                setTeleversement(null);
                onTeleversement?.(false);
                nettoyerApercu();
            }
        }
    };

    // Ctrl+V n'importe où dans le formulaire : une capture dans le presse-papiers est importée directement.
    useEffect(() => {
        const coller = (evenement: ClipboardEvent) => {
            const fichier = Array.from(evenement.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
            if (!fichier) return;
            evenement.preventDefault();
            void traiterFichier(fichier);
        };
        window.addEventListener("paste", coller);
        return () => window.removeEventListener("paste", coller);
    });

    const deposer = (evenement: DragEvent) => {
        evenement.preventDefault();
        setSurvol(false);
        const fichiers = Array.from(evenement.dataTransfer.files);
        const image = fichiers.find((f) => f.type.startsWith("image/") || TYPES_PAR_EXTENSION[f.name.split(".").pop()?.toLowerCase() ?? ""]);
        if (image) void traiterFichier(image);
        else if (fichiers.length > 0) setErreur(MESSAGE_FORMAT);
    };

    const parcourir = () => inputRef.current?.click();

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sky text-sm">Image du projet</span>

            <input
                ref={inputRef}
                type="file"
                accept={TYPES_IMAGE_ACCEPTES.join(",")}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
                onChange={(evenement) => {
                    const fichier = evenement.target.files?.[0];
                    if (fichier) void traiterFichier(fichier);
                    evenement.target.value = "";
                }}
            />

            <div
                role="button"
                tabIndex={0}
                aria-label="Importer une image : cliquez pour parcourir, glissez-déposez un fichier ou collez une capture avec Ctrl+V"
                onClick={parcourir}
                onKeyDown={(evenement) => {
                    if (evenement.key === "Enter" || evenement.key === " ") {
                        evenement.preventDefault();
                        parcourir();
                    }
                }}
                onDragOver={(evenement) => {
                    evenement.preventDefault();
                    setSurvol(true);
                }}
                onDragLeave={() => setSurvol(false)}
                onDrop={deposer}
                className={`relative flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed px-4 py-5 text-center transition-all duration-300 ${
                    survol ? "border-sky bg-deep/50 shadow-lg shadow-sky/20" : "border-ice/25 bg-abyss/40 hover:border-sky/60 hover:bg-deep/30"
                }`}
            >
                {televersement ? (
                    <>
                        <img src={televersement.apercu} alt="" className="max-h-40 max-w-full rounded-lg object-contain opacity-60" />
                        <div className="w-full max-w-xs">
                            <p className="truncate text-ice/80 text-xs">{televersement.nom}</p>
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ice/15">
                                <div className="h-full rounded-full bg-sky transition-all duration-200" style={{ width: `${televersement.pourcentage}%` }} />
                            </div>
                            <p className="mt-1.5 text-sky text-xs">Téléversement… {televersement.pourcentage}%</p>
                        </div>
                    </>
                ) : urlApercu ? (
                    <img
                        src={urlApercu}
                        alt="Aperçu de l'image du projet"
                        className="max-h-44 max-w-full rounded-lg object-contain drop-shadow-[0_10px_18px_rgba(0,29,57,0.55)]"
                    />
                ) : valeur ? (
                    <>
                        <FileImage size={32} className="text-sky" />
                        <p className="max-w-full truncate text-ice text-sm">{valeur}</p>
                        <p className="text-ice/50 text-xs">Fichier local du site public — aperçu visible sur le site</p>
                    </>
                ) : (
                    <>
                        <CloudUpload size={32} className={`transition-colors ${survol ? "text-sky" : "text-ice/50"}`} />
                        <p className="text-ice text-sm">
                            Glissez une image ici, ou <span className="text-sky underline underline-offset-2">parcourez vos fichiers</span>
                        </p>
                        <p className="text-ice/50 text-xs">Capture d'écran : collez directement avec Ctrl+V</p>
                    </>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {televersement ? (
                    <button
                        type="button"
                        onClick={() => controleurRef.current?.abort()}
                        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-ice/25 px-3 py-1.5 text-ice/80 text-xs transition-colors hover:border-sky hover:text-sky"
                    >
                        <X size={13} /> Annuler le téléversement
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={parcourir}
                            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-ice/25 px-3 py-1.5 text-ice/80 text-xs transition-colors hover:border-sky hover:text-sky"
                        >
                            <CloudUpload size={13} /> {valeur ? "Remplacer l'image" : "Choisir un fichier"}
                        </button>
                        {valeur && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange("");
                                    setDernierImport(null);
                                    setErreur(null);
                                }}
                                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-ice/25 px-3 py-1.5 text-ice/80 text-xs transition-colors hover:border-sky hover:text-sky"
                            >
                                <Trash2 size={13} /> Retirer
                            </button>
                        )}
                    </>
                )}
                <span className="text-ice/40 text-xs">PNG, JPEG, WebP, AVIF, GIF · 10 Mo max</span>
            </div>

            {dernierImport && dernierImport.url === valeur && !televersement && (
                <p className="flex items-center gap-1.5 text-sky text-xs">
                    <Check size={13} /> Image importée : {dernierImport.nom} ({formaterTaille(dernierImport.taille)})
                </p>
            )}

            <label className="mt-1 flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-ice/60 text-xs">
                    <Link2 size={12} /> Ou coller un lien / nom de fichier
                </span>
                <input
                    className="champ"
                    maxLength={500}
                    value={valeur}
                    onChange={(evenement) => onChange(evenement.target.value)}
                    placeholder="https://… ou cesaimag.png"
                />
            </label>

            {erreur && (
                <p className="rounded-lg border border-sky/40 bg-deep/50 px-3 py-2 text-ice text-sm" role="alert">
                    {erreur}
                </p>
            )}
        </div>
    );
};

export default ChampImage;