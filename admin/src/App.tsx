import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ChargementPage from "./composants/ChargementPage";
import { FournisseurAuth, useAuth } from "./auth";
import Connexion from "./pages/Connexion";
import TableauDeBord from "./pages/TableauDeBord";

function Protege({ children }: { children: ReactNode }) {
    const { email, verification } = useAuth();
    return (
        <>
            <ChargementPage visible={verification} message="Vérification de la session…" />
            {verification ? null : email ? children : <Navigate to="/connexion" replace />}
        </>
    );
}

/** Sur /connexion : si la session est encore valide, on retourne directement au tableau de bord. */
function PageConnexion() {
    const { email, verification } = useAuth();
    return (
        <>
            <ChargementPage visible={verification} message="Vérification de la session…" />
            {verification ? null : email ? <Navigate to="/" replace /> : <Connexion />}
        </>
    );
}

export default function App() {
    return (
        <FournisseurAuth>
            <BrowserRouter>
                <Routes>
                    <Route path="/connexion" element={<PageConnexion />} />
                    <Route
                        path="/"
                        element={
                            <Protege>
                                <TableauDeBord />
                            </Protege>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </FournisseurAuth>
    );
}
