import { useEffect, useRef } from "react";
import * as THREE from "three";

type Scene3DProps = {
    className?: string;
    /** Affiche la carte de la Côte d'Ivoire au centre du globe */
    ivoryCoast?: boolean;
};

const GLOBE_RADIUS = 5.2;
const DOT_COUNT = 1600;
const ARC_COUNT = 18;

// Contours réels de la Côte d'Ivoire (Natural Earth, simplifié), projection équirectangulaire
const COTE_IVOIRE_PATH =
    "M12 6.9L14 5.5L18.3 7.8L30.3 8L33.2 3.4L35.9 3.7L40.3 2L42.7 8.6L46.4 6.7L52.8 4.4L59.7 7.8L62.5 12.9L69.4 16.2L74.9 12.3L82.1 11.7L92.8 15.7L96.9 37.8L90.3 50.8L86.3 68.3L93 81.7L92.3 87.8L85.3 88L74.4 84.9L64.5 85.1L46.1 87.8L35.3 92.3L19.9 98L16.9 97.6L18.1 84.8L19.6 82.9L19.2 76.8L12.6 70.3L7.7 69.2L3.1 65L6.5 58.1L4.9 50.6L5.7 46L8.1 46L9 39.3L7.8 36.3L9.3 34.1L15.1 32.2L11.3 19.8L7.7 13.4L8.9 8.1L12 6.9Z";

/**
 * Globe 3D "monde connecté" : sphère de points (spirale de Fibonacci),
 * arcs de connexion lumineux entre points avec impulsions voyageant le
 * long des arcs, rotation lente et parallaxe suivant la souris.
 * Optionnellement, la carte de la Côte d'Ivoire s'affiche en surimpression
 * au centre du globe.
 */
const Scene3D = ({ className = "", ivoryCoast = false }: Scene3DProps) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x001d39, 13, 26);

        const camera = new THREE.PerspectiveCamera(
            55,
            mount.clientWidth / Math.max(mount.clientHeight, 1),
            0.1,
            100
        );
        camera.position.z = 14;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const globe = new THREE.Group();
        scene.add(globe);

        const disposables: { dispose: () => void }[] = [];

        // Océan : sphère translucide en fond
        const oceanGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 48);
        const oceanMat = new THREE.MeshBasicMaterial({
            color: 0x0a4174,
            transparent: true,
            opacity: 0.22,
            depthWrite: false,
        });
        globe.add(new THREE.Mesh(oceanGeo, oceanMat));
        disposables.push(oceanGeo, oceanMat);

        // Graticule très discret pour la structure
        const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.995, 24, 16);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x49769f,
            wireframe: true,
            transparent: true,
            opacity: 0.07,
        });
        globe.add(new THREE.Mesh(wireGeo, wireMat));
        disposables.push(wireGeo, wireMat);

        // Points de la sphère (spirale de Fibonacci)
        const positions = new Float32Array(DOT_COUNT * 3);
        const dots: THREE.Vector3[] = [];
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < DOT_COUNT; i++) {
            const y = 1 - (i / (DOT_COUNT - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = golden * i;
            const p = new THREE.Vector3(
                Math.cos(theta) * r,
                y,
                Math.sin(theta) * r
            ).multiplyScalar(GLOBE_RADIUS + 0.03);
            dots.push(p);
            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;
        }
        const dotsGeo = new THREE.BufferGeometry();
        dotsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const dotsMat = new THREE.PointsMaterial({
            color: 0x7bbde8,
            size: 0.05,
            transparent: true,
            opacity: 0.85,
            sizeAttenuation: true,
        });
        globe.add(new THREE.Points(dotsGeo, dotsMat));
        disposables.push(dotsGeo, dotsMat);

        // Arcs de connexion + nœuds + impulsions
        const arcColors = [0x7bbde8, 0xbdd8e9, 0x6ea2b3];
        const pulses: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; speed: number; offset: number }[] = [];

        for (let i = 0; i < ARC_COUNT; i++) {
            const a = dots[Math.floor(Math.random() * DOT_COUNT)];
            const b = dots[Math.floor(Math.random() * DOT_COUNT)];
            if (a === b) continue;

            const dist = a.distanceTo(b);
            const mid = a.clone().add(b).multiplyScalar(0.5).normalize()
                .multiplyScalar(GLOBE_RADIUS + dist * 0.35);
            const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());

            const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
            const lineMat = new THREE.LineBasicMaterial({
                color: arcColors[i % arcColors.length],
                transparent: true,
                opacity: 0.4,
                blending: THREE.AdditiveBlending,
            });
            globe.add(new THREE.Line(lineGeo, lineMat));
            disposables.push(lineGeo, lineMat);

            // Nœuds aux extrémités
            const nodeGeo = new THREE.SphereGeometry(0.075, 8, 8);
            const nodeMat = new THREE.MeshBasicMaterial({ color: 0xbdd8e9 });
            for (const p of [a, b]) {
                const node = new THREE.Mesh(nodeGeo, nodeMat);
                node.position.copy(p);
                globe.add(node);
            }
            disposables.push(nodeGeo, nodeMat);

            // Impulsion voyageant le long de l'arc
            const pulseGeo = new THREE.SphereGeometry(0.1, 8, 8);
            const pulseMat = new THREE.MeshBasicMaterial({ color: 0xbdd8e9 });
            const pulse = new THREE.Mesh(pulseGeo, pulseMat);
            globe.add(pulse);
            disposables.push(pulseGeo, pulseMat);
            pulses.push({
                mesh: pulse,
                curve,
                speed: 0.12 + Math.random() * 0.2,
                offset: Math.random(),
            });
        }

        // Parallaxe souris
        let mouseX = 0;
        let mouseY = 0;
        const onMouse = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMouse, { passive: true });

        const onResize = () => {
            camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener("resize", onResize);

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const startTime = performance.now();
        let raf = 0;

        const animate = () => {
            const t = (performance.now() - startTime) / 1000;
            if (!reduced) {
                globe.rotation.y = t * 0.08;
                globe.rotation.x += (mouseY * 0.12 - globe.rotation.x) * 0.04;
                camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.03;
                camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.03;
                camera.lookAt(0, 0, 0);

                for (const p of pulses) {
                    const k = (t * p.speed + p.offset) % 1;
                    p.mesh.position.copy(p.curve.getPoint(k));
                    p.mesh.scale.setScalar(0.7 + Math.sin(k * Math.PI) * 0.6);
                }
            }
            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("resize", onResize);
            mount.removeChild(renderer.domElement);
            disposables.forEach((d) => d.dispose());
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={mountRef} className={className} aria-hidden="true">
            {ivoryCoast && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-float">
                        <svg
                            viewBox="0 0 100 100"
                            className="w-[26vmin] h-[26vmin] sm:w-[30vmin] sm:h-[30vmin] drop-shadow-[0_0_28px_rgba(123,189,232,0.55)]"
                        >
                            <defs>
                                <linearGradient id="ciGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#7BBDE8" />
                                    <stop offset="100%" stopColor="#4E8EA2" />
                                </linearGradient>
                            </defs>
                            <path
                                d={COTE_IVOIRE_PATH}
                                fill="url(#ciGrad)"
                                fillOpacity="0.9"
                                stroke="#BDD8E9"
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scene3D;
