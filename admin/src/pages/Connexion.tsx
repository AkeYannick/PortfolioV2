import { useState, type FormEvent } from "react";
import { KeyRound, LockKeyholeOpen, Mail } from "lucide-react";
import ChargementPage from "../composants/ChargementPage";
import { useAuth } from "../auth";

const Connexion = () => {
    const { connexion } = useAuth();
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState<string | null>(null);

    const soumettre = async (evenement: FormEvent) => {
        evenement.preventDefault();
        setEnvoi(true);
        setErreur(null);
        try {
            await connexion(email.trim(), motDePasse);
        } catch (e) {
            setErreur(e instanceof Error ? e.message : "Connexion impossible");
            setMotDePasse("");
        } finally {
            setEnvoi(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-abyss px-4 py-10">
            <ChargementPage visible={envoi} message="Vérification des identifiants…" />
            <div className="w-full max-w-md">
                <p className="font-serif text-sky mb-2 text-center">Portfolio — administration</p>
                <h1 className="font-serif font-extrabold text-ice text-4xl sm:text-5xl text-center mb-3">Connexion</h1>
                <p className="text-ice/60 text-center mb-10 text-sm">
                    Gérez les projets affichés sur le site. Accès réservé.
                </p>

                <form onSubmit={soumettre} className="flex flex-col gap-7">
                    <label className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-sky text-sm">
                            <Mail size={15} /> E-mail
                        </span>
                        <input
                            className="champ"
                            type="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="vous@exemple.com"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-sky text-sm">
                            <KeyRound size={15} /> Mot de passe
                        </span>
                        <input
                            className="champ"
                            type="password"
                            autoComplete="current-password"
                            required
                            minLength={8}
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            placeholder="••••••••"
                        />
                    </label>

                    {erreur && (
                        <p className="rounded-lg border border-sky/40 bg-deep/50 px-3 py-2 text-sm text-ice" role="alert">
                            {erreur}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={envoi}
                        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-sky px-6 py-3 font-serif font-bold text-abyss transition-all duration-300 hover:bg-ice disabled:cursor-wait disabled:opacity-60"
                    >
                        <LockKeyholeOpen size={18} />
                        {envoi ? "VÉRIFICATION…" : "SE CONNECTER"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Connexion;
