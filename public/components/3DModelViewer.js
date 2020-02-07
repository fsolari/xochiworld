
function init() {
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        60000
    );
    camera.position.z = 20;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);

    // White directional light at half intensity shining from the top.
    var dirLight = new THREE.DirectionalLight(0xADFF9E, 1);
    dirLight.position.set(10, 10, 0);
    dirLight.position.multiplyScalar(100);
    scene.add(dirLight);

    // Texture Loading
    var textureLoader = new THREE.TextureLoader();
    crateTexture = textureLoader.load(
        "https://raw.githubusercontent.com/saucecode/threejs-demos/master/04_Textures/crate0/crate0_diffuse.png"
    );
    crateBumpMap = textureLoader.load(
        "https://raw.githubusercontent.com/saucecode/threejs-demos/master/04_Textures/crate0/crate0_bump.png"
    );
    crateNormalMap = textureLoader.load(
        "https://raw.githubusercontent.com/saucecode/threejs-demos/master/04_Textures/crate0/crate0_normal.png"
    );

    var material = new THREE.MeshNormalMaterial({
        color: "pink",
        metalness: 0.3,
        roughness: 0.8,
        //bumpMap: crateBumpMap
        // normalMap:crateNormalMap
    });

    // Add Custom Shader
    material.onBeforeCompile = function (shader) {
        shader.uniforms.time = { value: 0 };
        shader.vertexShader = "uniform float time;\n" + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",

            [
                "float theta = sin( time + position.y ) / 10.0;",
                "float c = cos( theta );",
                "float s = sin( theta );",
                "mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );",
                "vec3 transformed = vec3( position ) * m;",
                "vNormal = vNormal * m;"
            ].join("\n")
        );

        materialShader = shader;
    };

    var loader = new THREE.GLTFLoader();

    loader.load(
        "https://cdn.glitch.com/b0038684-388e-40ce-ad37-0d6043d3c9bf%2Fvedette%2B%2B2.glb?v=1580341450723",
        function (gltf) {
            var mesh = new THREE.Mesh(
                gltf.scene.children[0].geometry,
                material
            );
            var model = gltf.scene;
            var newMaterial = new THREE.MeshStandardMaterial({
                color: 0xADFF9E,
                roughness: 0,
                transparent: true,
                opacity: 0.8

            });
            model.traverse(o => {
                if (o.isMesh) o.material = newMaterial;
            });

            scene.add(gltf.scene);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    document.body.appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

}

function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
function animate() {
    requestAnimationFrame(animate);

    scene.rotation.x += 0.0005;

    scene.rotation.z += 0.0005;

    render();
}

function render() {
    if (materialShader) {
        materialShader.uniforms.time.value = performance.now() / 1000;
    }

    renderer.render(scene, camera);
}

