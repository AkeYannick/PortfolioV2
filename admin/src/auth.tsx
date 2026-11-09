import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { connexion as connexionApi, lireJeton, oublierJeton, verifierSession } from "./api";

type ValeurAuth = {
    email: string | null;
    /** Tant que la session n'est pas vérifiée, l'affichage reste sur un chargement. */
    verification: boolean;
    connexion: (email: string, motDePasse: string) => Promise<void>;
    deconnexion: () => void;
};

const Contexte = createContext<ValeurAuth | null>(null);

/** Le jeton dure 15 min : on le revalide régulièrement pour éviter les erreurs 401 en plein travail. */
const INTERVALLE_VERIFICATION = 120_000;

export function FournisseurAuth({ children }: { children: ReactNode }) {
    const [email, setEmail] = useState<string | null>(null);
    const [verification, setVerification] = useState(true);

    useEffect(() => {
        if (!lireJeton()) {
            setVerification(false);
            return;
        }
        verifierSession()
            .then((porteur) => setEmail(porteur.email))
            .catch(() => setEmail(null))
            .finally(() => setVerification(false));
    }, []);

    useEffect(() => {
        if (!email) return;
        const minute = window.setInterval(() => {
            verifierSession().catch(() => setEmail(null));
        }, INTERVALLE_VERIFICATION);
        return () => window.clearInterval(minute);
    }, [email]);

    const connexion = useCallback(async (adresse: string, motDePasse: string) => {
        const session = await connexionApi(adresse, motDePasse);
        setEmail(session.email);
    }, []);

    const deconnexion = useCallback(() => {
        oublierJeton();
        setEmail(null);
    }, []);

    return <Contexte.Provider value={{ email, verification, connexion, deconnexion }}>{children}</Contexte.Provider>;
}

export function useAuth() {
    const valeur = useContext(Contexte);
    if (!valeur) throw new Error("useAuth doit être utilisé dans FournisseurAuth");
    return valeur;
}
