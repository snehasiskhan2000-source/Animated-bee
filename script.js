// 1. Basic Three.js Setup
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Add Lighting (Crucial for .glb files)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3. Load Your Bee Model
let beeModel;
const loader = new THREE.GLTFLoader();

loader.load('bee.glb', function (gltf) {
    beeModel = gltf.scene;
    
    // Initial position of the bee
    beeModel.position.set(2, 0, 0); 
    beeModel.scale.set(0.5, 0.5, 0.5); // Adjust this if your bee is too big/small
    
    scene.add(beeModel);

    // 4. Set up Scroll Animations using GSAP once the model is loaded
    gsap.registerPlugin(ScrollTrigger);

    // Animate to Section 2
    gsap.to(beeModel.rotation, {
        y: Math.PI * 2, // Rotates 360 degrees
        x: 0.5,
        scrollTrigger: {
            trigger: ".about",
            start: "top bottom",
            end: "top top",
            scrub: 1, // Smooth scrolling effect
        }
    });

    gsap.to(beeModel.position, {
        x: -2, // Moves bee to the left
        y: -1,
        scrollTrigger: {
            trigger: ".about",
            start: "top bottom",
            end: "top top",
            scrub: 1,
        }
    });
});

camera.position.z = 5;

// 5. Render Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle Window Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
