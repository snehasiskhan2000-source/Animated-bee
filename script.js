const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Brighter lighting so the colors pop
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let beeModel;
const loader = new THREE.GLTFLoader();

loader.load('bee.glb', function (gltf) {
    beeModel = gltf.scene;
    
    // IMPORTANT: IF YOUR BEE IS INVISIBLE, CHANGE THESE NUMBERS.
    // Try 10, 10, 10 if it's too small. Try 0.01, 0.01, 0.01 if it's too big.
    beeModel.scale.set(50, 50, 50); 
    
    // Start position (Hero section: Right side)
    beeModel.position.set(3, 0, 0); 
    scene.add(beeModel);

    gsap.registerPlugin(ScrollTrigger);

    // Timeline for all animations connected to scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // 1. Hero to About (Move left, rotate)
    tl.to(beeModel.position, { x: -3, y: -0.5, ease: "power1.inOut" }, 0)
      .to(beeModel.rotation, { y: Math.PI, x: 0.2, ease: "power1.inOut" }, 0);

    // 2. About to Gallery (Move center, rotate back)
    tl.to(beeModel.position, { x: 0, y: 1, ease: "power1.inOut" }, 0.5)
      .to(beeModel.rotation, { y: Math.PI * 2, x: -0.2, ease: "power1.inOut" }, 0.5);

    // 3. Gallery to Contact (Move right, final pose)
    tl.to(beeModel.position, { x: 3, y: 0, ease: "power1.inOut" }, 1)
      .to(beeModel.rotation, { y: Math.PI * 2.5, x: 0, ease: "power1.inOut" }, 1);
});

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    if(beeModel) {
        // Optional: Adds a gentle floating effect even when not scrolling
        beeModel.position.y += Math.sin(Date.now() * 0.001) * 0.002;
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
