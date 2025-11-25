import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#car-canvas');
if (canvas) {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 5); 

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true, // Transparent background
        antialias: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding; 
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false; // Disable zoom for a cleaner experience
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0; // Slow, steady rotation

    // Load Model
const loader = new GLTFLoader();
loader.load(
    'assets/models/car.glb', 
    (gltf) => {
        const model = gltf.scene;
        
        // --- Auto-scaling and centering logic ---
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        
        model.position.sub(center); // Center the model at the origin
        
        const scaleFactor = 5.5 / size; // Adjust to make the model bigger or smaller
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        scene.add(model);
    },
    undefined,
    (error) => {
        console.error('An error happened while loading the model:', error);
    }
);

    // Animation Loop
    const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();

    // Responsiveness
    window.addEventListener('resize', () => {
        const container = canvas.parentElement;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Initial resize call to fit the container
    const initialResize = () => {
      const container = canvas.parentElement;
      if (container.clientWidth > 0) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };
    
    // Use a small delay to ensure container has dimensions
    setTimeout(initialResize, 100);
}