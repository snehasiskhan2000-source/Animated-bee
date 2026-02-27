const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Brighter lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// --- THE RED BOX TEST ---
// If you see this spinning box but NO bee, your bee.glb file is corrupted or named wrong.
const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const testBox = new THREE.Mesh(boxGeometry, boxMaterial);
testBox.position.set(0, 2, 0); // Placed slightly higher than center
scene.add(testBox);
// ------------------------

let beeModel;
const loader = new THREE.GLTFLoader();

// Make SURE your file in GitHub is exactly "bee.glb" (all lowercase)
loader.load('bee.glb', function (gltf) {
    beeModel = gltf.scene;
    
    // Size adjustment
    beeModel.scale.set(0.8, 0.8, 0.8); 
    
    // Centered starting position so it doesn't get lost on mobile screens!
    beeModel.position.set(0, 0, 0); 
    scene.add(beeModel);

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // 1. Hero to About (Mobile-safe X values)
    tl.to(beeModel.position, { x: -1, y: -0.5, ease: "power1.inOut" }, 0)
      .to(beeModel.rotation, { y: Math.PI, x: 0.2, ease: "power1.inOut" }, 0);

    // 2. About to Gallery
    tl.to(beeModel.position, { x: 0, y: 1, ease: "power1.inOut" }, 0.5)
      .to(beeModel.rotation, { y: Math.PI * 2, x: -0.2, ease: "power1.inOut" }, 0.5);

    // 3. Gallery to Contact
    tl.to(beeModel.position, { x: 1, y: 0, ease: "power1.inOut" }, 1)
      .to(beeModel.rotation, { y: Math.PI * 2.5, x: 0, ease: "power1.inOut" }, 1);
});

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    
    // Spin the test box so we know the engine is running
    testBox.rotation.x += 0.01;
    testBox.rotation.y += 0.01;

    if(beeModel) {
        // Gentle floating effect for the bee
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
