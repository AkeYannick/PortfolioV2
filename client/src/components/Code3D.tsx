import { useEffect, useRef } from "react";
import * as THREE from "three";

type Lang = {
    name: string;
    /** Couleur de marque du langage (bordure, halo, salutation) */
    brand: string;
    /** Teinte claire dérivée pour les mots-clés */
    tint: string;
    keywords: string[];
    lines: (s: string) => string[];
};

// Salutation selon l'heure locale : Bonjour le jour, Bonsoir après 18h.
const salutation = () => {
    const h = new Date().getHours();
    return h >= 6 && h < 18 ? "Bonjour" : "Bonsoir";
};

const LANGS: Lang[] = [
    {
        name: "moi.js",
        brand: "#F7DF1E", // jaune JavaScript
        tint: "#FFE680",
        keywords: ["const", "let", "return", "function", "if", "else", "new", "export", "import", "from"],
        lines: () => [
            "const moi = {",
            '  nom: "AKE Donovane",',
            '  metier: "Developpeur",',
            '  stack: ["React","Flutter"],',
            "};",
            "",
            "function saluer(h) {",
            '  if (h >= 18)',
            '    return "Bonsoir";',
            '  return "Bonjour";',
            "}",
            "",
            "const h = new Date();",
            "const s = saluer(h);",
            "// Je suis AKE Donovane,",
            "// Dev Full-Stack a Abidjan",
        ],
    },
    {
        name: "moi.php",
        brand: "#777BB4", // indigo PHP
        tint: "#A9ADE0",
        keywords: ["function", "return", "new", "if", "else", "echo", "use"],
        lines: () => [
            "<?php",
            "function saluer() {",
            '    $h = (int) date("H");',
            "    if ($h >= 18) {",
            '        return "Bonsoir";',
            "    }",
            '    return "Bonjour";',
            "}",
            "",
            "echo saluer();",
            'echo "Je suis AKE',
            '  Donovane, Dev Web";',
            "# Abidjan, Cote d'Ivoire",
        ],
    },
    {
        name: "main.dart",
        brand: "#00B0FF", // bleu Dart
        tint: "#80D8FF",
        keywords: ["class", "extends", "return", "const", "void", "final", "Widget", "String", "int"],
        lines: () => [
            "void main() => runApp(App());",
            "",
            "class Moi extends",
            "    StatelessWidget {",
            '  final nom = "AKE Donovane";',
            '  final ville = "Abidjan";',
            "",
            "  String saluer(int h) {",
            '    if (h >= 18)',
            '      return "Bonsoir";',
            '    return "Bonjour";',
            "  }",
            "  // Je suis AKE Donovane,",
            "  // Dev Full-Stack",
            "}",
        ],
    },
];

const CANVAS_W = 1280;
const LINE_H = 90;
const FONT = '500 64px "Consolas", "Courier New", monospace';
const CODE_TOP = 300;
/** Hauteur d'un bloc (en-tête + salutation + 16 lignes de code) ; le canvas en contient 2 pour une boucle sans couture. */
const BLOCK_H = CODE_TOP + 16 * LINE_H;
const CANVAS_H = BLOCK_H * 2;

/** Colorise une ligne de code : commentaire, chaîne, mot-clé, texte courant. */
function tokenize(line: string, lang: Lang): { text: string; color: string }[] {
    const tokens: { text: string; color: string }[] = [];
    const isComment = line.trimStart().startsWith("//") || line.trimStart().startsWith("#");
    if (isComment) return [{ text: line, color: "#5E7A94" }];

    const inline = line.indexOf("//");
    if (inline > 0) {
        tokens.push(...tokenize(line.slice(0, inline), lang));
        tokens.push({ text: line.slice(inline), color: "#5E7A94" });
        return tokens;
    }

    const re = /"[^"]*"|'[^']*'|\b\w+\b|\s+|[^\s\w"']+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
        const t = m[0];
        let color = "#BDD8E9";
        if (/^["']/.test(t)) color = lang.tint;
        else if (/^\s+$/.test(t)) color = "transparent";
        else if (lang.keywords.includes(t)) color = lang.brand;
        tokens.push({ text: t, color });
    }
    return tokens;
}

/** Peint un bloc (en-tête + salutation + code) ; répété deux fois pour le défilement en boucle. */
function drawBlock(ctx: CanvasRenderingContext2D, lang: Lang, s: string, oy: number) {
    ctx.fillStyle = "#001D39";
    ctx.fillRect(0, oy, CANVAS_W, BLOCK_H);

    // Bordure du bloc, couleur de marque
    ctx.strokeStyle = lang.brand;
    ctx.lineWidth = 12;
    ctx.strokeRect(14, oy + 14, CANVAS_W - 28, BLOCK_H - 28);

    // Barre de titre
    ctx.fillStyle = "#0A4174";
    ctx.fillRect(14, oy + 14, CANVAS_W - 28, 132);
    ctx.fillStyle = lang.brand;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(92 + i * 92, oy + 80, 23, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.font = "600 58px monospace";
    ctx.fillStyle = "#BDD8E9";
    ctx.fillText(lang.name, 390, oy + 100);

    // Salutation + présentation, en couleur de marque
    ctx.font = "700 64px monospace";
    ctx.fillStyle = lang.brand;
    ctx.fillText(`${s}, je suis AKE Donovane`, 64, oy + CODE_TOP - 74);

    // Code
    ctx.font = FONT;
    let y = oy + CODE_TOP + 12;
    for (const line of lang.lines(s)) {
        let x = 64;
        for (const token of tokenize(line, lang)) {
            if (token.color === "transparent") {
                x += ctx.measureText(token.text).width;
                continue;
            }
            ctx.fillStyle = token.color;
            ctx.fillText(token.text, x, y);
            x += ctx.measureText(token.text).width;
        }
        y += LINE_H;
    }
}

function drawStrip(lang: Lang, s: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d")!;
    drawBlock(ctx, lang, s, 0);
    drawBlock(ctx, lang, s, BLOCK_H);
    return canvas;
}

/**
 * Trois cartes verticales (JavaScript, PHP, Dart) flottant en 3D :
 * le code défile en continu (boucle sans couture via une texture répétée),
 * chaque carte affiche la salutation du moment et la présentation,
 * bordure/halo aux couleurs de marque du langage.
 */
const Code3D = ({ className = "" }: { className?: string }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const disposables: { dispose: () => void }[] = [];
        const panels: { mesh: THREE.Mesh; glow: THREE.Mesh; phase: number }[] = [];
        const textures: { texture: THREE.CanvasTexture; lang: Lang }[] = [];
        const CARD_W = 3.0;
        const CARD_H = 4.4;
        const FOV_RAD = THREE.MathUtils.degToRad(45);

        LANGS.forEach((lang, i) => {
            const texture = new THREE.CanvasTexture(drawStrip(lang, salutation()));
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            // Fenêtre visible du ruban : à l'échelle exacte du canvas (1 px = CANVAS_W / CARD_W unités),
            // 2 blocs identiques défilent donc sans couture.
            texture.repeat.set(1, (CARD_H * CANVAS_W) / CARD_W / CANVAS_H);
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

            const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
            const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.97, side: THREE.DoubleSide });
            const mesh = new THREE.Mesh(geo, mat);
            group.add(mesh);
            disposables.push(texture, geo, mat);

            // Halo de couleur de marque derrière la carte
            const glowGeo = new THREE.PlaneGeometry(CARD_W + 0.34, CARD_H + 0.34);
            const glowMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(lang.brand),
                transparent: true,
                opacity: 0.22,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const glow = new THREE.Mesh(glowGeo, glowMat);
            group.add(glow);
            disposables.push(glowGeo, glowMat);

            panels.push({ mesh, glow, phase: i * 1.3 });
            textures.push({ texture, lang });
        });

        /**
         * Place les cartes et cale la caméra pour qu'elles remplissent le cadre :
         * éventail serré (cartes qui se chevauchent un peu) sur les conteneurs
         * étroits/verts, éventail ouvert dès qu'il y a de la largeur.
         */
        const applyLayout = () => {
            const w = mount.clientWidth;
            const h = Math.max(mount.clientHeight, 1);
            const aspect = w / h;
            const etroit = aspect < 1.4;
            const ecart = etroit ? CARD_W * 0.66 : CARD_W * 1.22;
            const inclinaison = etroit ? 0.55 : 0.4;

            panels.forEach((p, i) => {
                const x = (i - 1) * ecart;
                const z = i === 1 ? 0.7 : 0;
                const rotY = (1 - i) * inclinaison;
                p.mesh.position.set(x, 0, z);
                p.mesh.rotation.y = rotY;
                p.glow.position.set(x, 0, z - 0.07);
                p.glow.rotation.y = rotY;
            });

            const demiLargeur = ecart + (CARD_W + 0.4) / 2;
            const demiHauteur = CARD_H / 2 + 0.35;
            camera.aspect = aspect;
            camera.position.z =
                Math.max(demiLargeur / (Math.tan(FOV_RAD / 2) * aspect), demiHauteur / Math.tan(FOV_RAD / 2)) * 1.14;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        applyLayout();

        let mouseX = 0;
        let mouseY = 0;
        const onMouse = (e: MouseEvent) => {
            const rect = mount.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMouse, { passive: true });

        const onResize = () => applyLayout();
        window.addEventListener("resize", onResize);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const start = performance.now();
        const VITESSE = 0.055; // boucles par seconde (une boucle = 2 blocs de code)
        let raf = 0;

        const animate = () => {
            const t = (performance.now() - start) / 1000;
            if (!reduced) {
                group.rotation.y += (mouseX * 0.14 - group.rotation.y) * 0.05;
                group.rotation.x += (-mouseY * 0.08 - group.rotation.x) * 0.05;
                for (const p of panels) {
                    const y = Math.sin(t * 0.9 + p.phase) * 0.12;
                    p.mesh.position.y = y;
                    p.glow.position.y = y;
                }
                // Défilement continu du code vers le haut
                for (const { texture } of textures) {
                    texture.offset.y = (t * VITESSE) % 1;
                }
            }
            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };
        animate();

        // Le jour se lève ou tombe pendant la visite : on repeint les rubans.
        const refresh = window.setInterval(() => {
            const s = salutation();
            for (const { texture, lang } of textures) {
                texture.image = drawStrip(lang, s);
                texture.needsUpdate = true;
            }
        }, 30000);

        return () => {
            cancelAnimationFrame(raf);
            window.clearInterval(refresh);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("resize", onResize);
            mount.removeChild(renderer.domElement);
            disposables.forEach((d) => d.dispose());
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className={className} aria-hidden="true" />;
};

export default Code3D;
