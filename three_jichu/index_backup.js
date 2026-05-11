import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// 创建厂房环境
function createFactoryEnvironment() {
    console.log('开始创建厂房环境...');
    
    // 创建钢结构框架
    createFactoryStructure();
    
    // 创建地面
    createFactoryFloor();
    
    // 创建墙体和窗户
    createWallsAndWindows();
    
    // 创建工业设备
    createIndustrialEquipment();
    
    // 创建照明系统
    createLightingSystem();
    
    console.log('厂房环境创建完成');
}

// 创建钢结构框架
function createFactoryStructure() {
    const steelGroup = new THREE.Group();
    
    // 立柱 (8根)
    const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.6, 12, 8);
    const steelMaterial = new THREE.MeshPhongMaterial({ color: 0x8B8B83 });
    
    const pillarPositions = [
        [-18, 0, -13], [-18, 0, 13], [18, 0, -13], [18, 0, 13], // 四个角
        [0, 0, -13], [0, 0, 13], [-18, 0, 0], [18, 0, 0] // 内部和中间
    ];
    
    pillarPositions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeometry, steelMaterial);
        pillar.position.set(pos[0], pos[1] + 6, pos[2]);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        steelGroup.add(pillar);
    });
    
    // 立柱底座
    const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 8);
    pillarPositions.forEach(pos => {
        const base = new THREE.Mesh(baseGeometry, steelMaterial);
        base.position.set(pos[0], pos[1] + 0.15, pos[2]);
        base.castShadow = true;
        base.receiveShadow = true;
        steelGroup.add(base);
    });
    
    // 主梁 (连接立柱)
    const beamGeometry = new THREE.BoxGeometry(1, 0.8, 30);
    
    // 横向主梁
    const beams = [
        { pos: [-18, 12, 0], rot: [0, 0, 0] },
        { pos: [18, 12, 0], rot: [0, 0, 0] },
        { pos: [0, 12, 0], rot: [0, 0, 0] },
        { pos: [0, 12, -13], rot: [0, Math.PI/2, 0] },
        { pos: [0, 12, 13], rot: [0, Math.PI/2, 0] }
    ];
    
    beams.forEach(beam => {
        const mainBeam = new THREE.Mesh(beamGeometry, steelMaterial);
        mainBeam.position.set(beam.pos[0], beam.pos[1], beam.pos[2]);
        mainBeam.rotation.set(beam.rot[0], beam.rot[1], beam.rot[2]);
        mainBeam.castShadow = true;
        mainBeam.receiveShadow = true;
        steelGroup.add(mainBeam);
    });
    
    scene.add(steelGroup);
}

// 创建工厂地面
function createFactoryFloor() {
    const floorGeometry = new THREE.PlaneGeometry(40, 30);
    
    // 创建网格纹理
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // 背景色
    ctx.fillStyle = '#6B6B6B';
    ctx.fillRect(0, 0, 512, 512);
    
    // 网格线
    ctx.strokeStyle = '#8B8B83';
    ctx.lineWidth = 1;
    
    const gridSize = 32;
    for (let i = 0; i <= 512; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
    }
    
    // 添加一些磨损效果
    ctx.fillStyle = 'rgba(139, 139, 131, 0.3)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const width = Math.random() * 50 + 10;
        const height = Math.random() * 30 + 5;
        ctx.fillRect(x, y, width, height);
    }
    
    const floorTexture = new THREE.CanvasTexture(canvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(2, 2);
    
    const floorMaterial = new THREE.MeshPhongMaterial({ 
        map: floorTexture,
        side: THREE.DoubleSide 
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // 地面边缘
    const edgeGeometry1 = new THREE.BoxGeometry(40, 1, 1);
    const edgeGeometry2 = new THREE.BoxGeometry(1, 1, 30);
    const edgeMaterial = new THREE.MeshPhongMaterial({ color: 0x8B8B83 });
    
    const edge1 = new THREE.Mesh(edgeGeometry1, edgeMaterial);
    edge1.position.set(0, 0.5, -15);
    edge1.receiveShadow = true;
    scene.add(edge1);
    
    const edge2 = new THREE.Mesh(edgeGeometry1, edgeMaterial);
    edge2.position.set(0, 0.5, 15);
    edge2.receiveShadow = true;
    scene.add(edge2);
    
    const edge3 = new THREE.Mesh(edgeGeometry2, edgeMaterial);
    edge3.position.set(-20, 0.5, 0);
    edge3.receiveShadow = true;
    scene.add(edge3);
    
    const edge4 = new THREE.Mesh(edgeGeometry2, edgeMaterial);
    edge4.position.set(20, 0.5, 0);
    edge4.receiveShadow = true;
    scene.add(edge4);
}

// 创建墙体和窗户
function createWallsAndWindows() {
    // 创建墙体
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xF5F5F5 });
    
    // 前墙和后墙
    const frontWallGeometry = new THREE.BoxGeometry(40, 8, 0.5);
    const backWallGeometry = new THREE.BoxGeometry(40, 8, 0.5);
    
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(0, 4, -15);
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;
    scene.add(frontWall);
    
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 4, 15);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);
    
    // 侧墙
    const sideWallGeometry = new THREE.BoxGeometry(0.5, 8, 30);
    
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-20, 4, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(20, 4, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    
    // 创建窗户
    createWindows();
}

// 创建窗户
function createWindows() {
    const glassMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    // 前墙窗户
    const windowPositions = [-15, -5, 5, 15];
    windowPositions.forEach(x => {
        const windowGeometry = new THREE.PlaneGeometry(6, 3);
        const window = new THREE.Mesh(windowGeometry, glassMaterial);
        window.position.set(x, 4, -14.75);
        window.castShadow = false;
        scene.add(window);
    });
    
    // 后墙窗户
    windowPositions.forEach(x => {
        const windowGeometry = new THREE.PlaneGeometry(6, 3);
        const window = new THREE.Mesh(windowGeometry, glassMaterial);
        window.position.set(x, 4, 14.75);
        window.rotation.y = Math.PI;
        window.castShadow = false;
        scene.add(window);
    });
    
    // 侧墙窗户
    const sideWindowPositions = [-10, 0, 10];
    sideWindowPositions.forEach(z => {
        const windowGeometry = new THREE.PlaneGeometry(4, 3);
        
        const leftWindow = new THREE.Mesh(windowGeometry, glassMaterial);
        leftWindow.position.set(-19.75, 4, z);
        leftWindow.rotation.y = Math.PI / 2;
        scene.add(leftWindow);
        
        const rightWindow = new THREE.Mesh(windowGeometry, glassMaterial);
        rightWindow.position.set(19.75, 4, z);
        rightWindow.rotation.y = -Math.PI / 2;
        scene.add(rightWindow);
    });
}

// 创建工业设备
function createIndustrialEquipment() {
    console.log('创建工业设备...');
    
    const equipmentGroup = new THREE.Group();
    
    // 创建垂直管道
    const pipePositions = [
        { pos: [-15, 0, -10], radius: 0.8, height: 8 },
        { pos: [15, 0, -10], radius: 0.8, height: 8 },
        { pos: [-15, 0, 10], radius: 0.8, height: 8 },
        { pos: [15, 0, 10], radius: 0.8, height: 8 }
    ];
    
    pipePositions.forEach(pipe => {
        const pipeGeometry = new THREE.CylinderGeometry(pipe.radius, pipe.radius, pipe.height, 8);
        const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x4A4A4A });
        const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
        pipe.position.set(pipe.pos[0], pipe.pos[1] + pipe.height/2, pipe.pos[2]);
        pipe.castShadow = true;
        pipe.receiveShadow = true;
        equipmentGroup.add(pipe);
    });
    
    // 创建储罐
    const tankPositions = [
        { pos: [-12, 0, 0], radius: 2.5, height: 6 },
        { pos: [12, 0, 0], radius: 2.5, height: 6 }
    ];
    
    tankPositions.forEach(tank => {
        // 储罐主体
        const tankGeometry = new THREE.CylinderGeometry(tank.radius, tank.radius, tank.height, 16);
        const tankMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
        const tank = new THREE.Mesh(tankGeometry, tankMaterial);
        tank.position.set(tank.pos[0], tank.pos[1] + tank.height/2, tank.pos[2]);
        tank.castShadow = true;
        tank.receiveShadow = true;
        equipmentGroup.add(tank);
        
        // 储罐支架
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + Math.PI / 4;
            const bracketGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
            const bracket = new THREE.Mesh(bracketGeometry, tankMaterial);
            bracket.position.set(
                tank.pos[0] + Math.cos(angle) * (tank.radius + 1),
                2,
                tank.pos[2] + Math.sin(angle) * (tank.radius + 1)
            );
            bracket.castShadow = true;
            bracket.receiveShadow = true;
            equipmentGroup.add(bracket);
        }
        
        // 顶部结构
        const topGeometry = new THREE.CylinderGeometry(tank.radius * 0.8, tank.radius * 0.8, 0.5, 16);
        const top = new THREE.Mesh(topGeometry, tankMaterial);
        top.position.set(tank.pos[0], tank.pos[1] + tank.height + 0.25, tank.pos[2]);
        top.castShadow = true;
        top.receiveShadow = true;
        equipmentGroup.add(top);
    });
    
    // 创建控制柜
    const controlCabinet = new THREE.Group();
    
    // 主体
    const cabinetBodyGeometry = new THREE.BoxGeometry(4, 6, 2.5);
    const cabinetBody = new THREE.Mesh(cabinetBodyGeometry, new THREE.MeshPhongMaterial({ color: 0x708090 }));
    cabinetBody.position.set(0, 3, 0);
    cabinetBody.castShadow = true;
    cabinetBody.receiveShadow = true;
    controlCabinet.add(cabinetBody);
    
    // 门
    const doorGeometry = new THREE.BoxGeometry(3.8, 5.5, 0.1);
    const door = new THREE.Mesh(doorGeometry, new THREE.MeshPhongMaterial({ color: 0x2F4F4F }));
    door.position.set(0, 3, 1.3);
    door.castShadow = true;
    door.receiveShadow = true;
    controlCabinet.add(door);
    
    // 指示灯
    const indicatorPositions = [
        { pos: [-1, 4.5, 1.35], color: 0x00FF00 },
        { pos: [0, 4.5, 1.35], color: 0xFFFF00 },
        { pos: [1, 4.5, 1.35], color: 0xFF0000 }
    ];
    
    indicatorPositions.forEach(indicator => {
        const lightGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const lightMaterial = new THREE.MeshPhongMaterial({ 
            color: indicator.color,
            emissive: indicator.color,
            emissiveIntensity: 0.3
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(indicator.pos[0], indicator.pos[1], indicator.pos[2]);
        controlCabinet.add(light);
    });
    
    controlCabinet.position.set(0, 0, -8);
    equipmentGroup.add(controlCabinet);
    
    scene.add(equipmentGroup);
}

// 创建照明系统
function createLightingSystem() {
    console.log('创建照明系统...');
    
    // 主天窗光源（模拟自然光）
    const skylight = new THREE.DirectionalLight(0xffffff, 0.6);
    skylight.position.set(0, 20, 0);
    skylight.target.position.set(0, 0, 0);
    skylight.castShadow = true;
    
    // 设置阴影参数
    skylight.shadow.mapSize.width = 2048;
    skylight.shadow.mapSize.height = 2048;
    skylight.shadow.camera.near = 0.5;
    skylight.shadow.camera.far = 50;
    skylight.shadow.camera.left = -25;
    skylight.shadow.camera.right = 25;
    skylight.shadow.camera.top = 25;
    skylight.shadow.camera.bottom = -25;
    
    scene.add(skylight);
    scene.add(skylight.target);
    
    // 工厂顶灯
    const pointLightPositions = [
        [-15, 8, -10], [-15, 8, 0], [-15, 8, 10],
        [0, 8, -10], [0, 8, 0], [0, 8, 10],
        [15, 8, -10], [15, 8, 0], [15, 8, 10]
    ];
    
    pointLightPositions.forEach(pos => {
        const pointLight = new THREE.PointLight(0xffffff, 0.4, 25);
        pointLight.position.set(pos[0], pos[1], pos[2]);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 512;
        pointLight.shadow.mapSize.height = 512;
        scene.add(pointLight);
        
        // 添加灯具外壳
        const lampGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 8);
        const lampMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
        lamp.position.set(pos[0], pos[1] - 0.2, pos[2]);
        lamp.castShadow = false;
        scene.add(lamp);
    });
    
    // 设备工作灯
    const workLight1 = new THREE.SpotLight(0xffffff, 0.8, 20);
    workLight1.position.set(10, 6, 0);
    workLight1.target.position.set(0, 0, 0);
    workLight1.angle = Math.PI / 4;
    workLight1.penumbra = 0.3;
    workLight1.castShadow = true;
    workLight1.shadow.mapSize.width = 1024;
    workLight1.shadow.mapSize.height = 1024;
    scene.add(workLight1);
    scene.add(workLight1.target);
    
    const workLight2 = new THREE.SpotLight(0xffffff, 0.8, 20);
    workLight2.position.set(-10, 6, 0);
    workLight2.target.position.set(0, 0, 0);
    workLight2.angle = Math.PI / 4;
    workLight2.penumbra = 0.3;
    workLight2.castShadow = true;
    workLight2.shadow.mapSize.width = 1024;
    workLight2.shadow.mapSize.height = 1024;
    scene.add(workLight2);
    scene.add(workLight2.target);
    
    console.log('照明系统创建完成');
}

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 3000);
camera.position.set(200, 200, 200);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// 添加基础照明
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 添加主方向光
const mainDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
mainDirectionalLight.position.set(30, 50, 30);
mainDirectionalLight.castShadow = true;

// 优化阴影设置
mainDirectionalLight.shadow.mapSize.width = 2048;
mainDirectionalLight.shadow.mapSize.height = 2048;
mainDirectionalLight.shadow.camera.near = 0.5;
mainDirectionalLight.shadow.camera.far = 200;
mainDirectionalLight.shadow.camera.left = -80;
mainDirectionalLight.shadow.camera.right = 80;
mainDirectionalLight.shadow.camera.top = 80;
mainDirectionalLight.shadow.camera.bottom = -80;
mainDirectionalLight.shadow.bias = -0.0001;
mainDirectionalLight.shadow.normalBias = 0.05;

scene.add(mainDirectionalLight);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10000;
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;
controls.screenSpacePanning = false;
controls.autoRotate = false;
controls.autoRotateSpeed = 2.0;

// 保存初始视角位置
let initialCameraPosition = camera.position.clone();
let initialControlsTarget = controls.target.clone();
let modelLoaded = false;

// 动画控制相关变量
let isAnimationPlaying = false;
let animationSpeed = 1.0;

// 将渲染器添加到容器
const container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);

// GLB模型加载
const loader = new GLTFLoader();
let mixer = null;
let actions = [];

// 检查模型文件路径
const modelPath = '../Web/assemblyline.glb';

loader.load(modelPath, function(gltf) {
    try {
        const model = gltf.scene;
        scene.add(model);
        
        // 遍历模型中的所有mesh，确保它们能投射和接收阴影
        model.traverse(function(child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // 确保材质支持阴影
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => {
                            if (material) {
                                material.needsUpdate = true;
                            }
                        });
                    } else {
                        child.material.needsUpdate = true;
                    }
                }
            }
        });
        
        // 调整模型位置，让它"坐"在地面上
        const box = new THREE.Box3().setFromObject(model);
        const minY = box.min.y;
        model.position.y -= minY;
        
        // 重新计算调整后的边界框
        const adjustedBox = new THREE.Box3().setFromObject(model);
        const center = adjustedBox.getCenter(new THREE.Vector3());
        const size = adjustedBox.getSize(new THREE.Vector3());
        
        // 如果模型包含动画
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
                action.paused = true;
                actions.push(action);
            });
            
            console.log(`加载了 ${gltf.animations.length} 个动画`);
        }
        
        // 计算合适的相机距离 - 适配新的厂房尺寸
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.2; // 增加相机距离以适应厂房环境
        
        // 根据厂房尺寸调整相机位置 (40x30的厂房)
        camera.position.set(center.x + cameraZ * 0.7, center.y + cameraZ * 0.5, center.z + cameraZ * 0.7);
        camera.lookAt(center);
        
        controls.target.copy(center);
        controls.update();
        
        initialCameraPosition = camera.position.clone();
        initialControlsTarget = controls.target.clone();
        modelLoaded = true;
        
        updateStatusUI();
        console.log('模型加载成功:', modelPath);
        console.log('模型尺寸:', size);
        console.log('模型中心:', center);
        
    } catch (error) {
        console.error('模型处理错误:', error);
        showError('模型处理过程中出现错误');
    }
}, function(error) {
    console.error('GLB文件加载失败:', error);
    console.log('尝试加载路径:', modelPath);
    
    // 显示错误信息
    showError('模型加载失败，请检查文件路径和格式');
}, function(progress) {
    console.log('加载进度:', (progress.loaded / progress.total * 100).toFixed(1) + '%');
});

// 显示错误信息
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-family: Arial, sans-serif;
        z-index: 9999;
    `;
    errorDiv.innerHTML = `
        <h3>错误</h3>
        <p>${message}</p>
        <p>文件路径: ${modelPath}</p>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 5000);
}

// 动画控制函数
function playAnimation() {
    if (!modelLoaded || !mixer || actions.length === 0) {
        console.warn('动画尚未准备好');
        return;
    }
    
    console.log('开始播放动画');
    isAnimationPlaying = true;
    
    actions.forEach(action => {
        action.paused = false;
        action.timeScale = animationSpeed;
        action.play();
    });
    
    updateStatusUI();
}

function stopAnimation() {
    if (!modelLoaded || !mixer || actions.length === 0) {
        return;
    }
    
    console.log('停止动画');
    isAnimationPlaying = false;
    
    actions.forEach(action => {
        action.paused = true;
    });
    
    updateStatusUI();
}

function restartAnimation() {
    if (!modelLoaded || !mixer || actions.length === 0) {
        console.warn('动画尚未准备好');
        return;
    }
    
    console.log('重新开始动画');
    
    actions.forEach(action => {
        action.reset();
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.paused = true;
    });
    
    isAnimationPlaying = false;
    updateStatusUI();
}

function updateSpeed(speed) {
    animationSpeed = parseFloat(speed);
    console.log(`动画速度调整为: ${animationSpeed}x`);
    
    actions.forEach(action => {
        action.timeScale = animationSpeed;
    });
    
    const speedValue = document.getElementById('speedValue');
    if (speedValue) {
        speedValue.textContent = animationSpeed.toFixed(1);
    }
}

// 更新状态UI
function updateStatusUI() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    if (isAnimationPlaying) {
        if (statusDot) statusDot.classList.add('running');
        if (statusText) statusText.textContent = '设备运行中';
    } else {
        if (statusDot) statusDot.classList.remove('running');
        if (statusText) statusText.textContent = '设备已停止';
    }
}

// 将动画控制函数暴露到全局作用域
window.playAnimation = playAnimation;
window.stopAnimation = stopAnimation;
window.restartAnimation = restartAnimation;
window.updateSpeed = updateSpeed;

// 一键复位视角功能
function resetView() {
    if (modelLoaded) {
        animateCameraToPosition(initialCameraPosition, initialControlsTarget, 1000);
    } else {
        const defaultPosition = new THREE.Vector3(30, 20, 30); // 适配新厂房尺寸
        const defaultTarget = new THREE.Vector3(0, 0, 0);
        animateCameraToPosition(defaultPosition, defaultTarget, 1000);
    }
}

// 相机位置平滑过渡动画
function animateCameraToPosition(targetPosition, targetLookAt, duration) {
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = easeInOutCubic(progress);
        
        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
        
        const currentTarget = new THREE.Vector3().lerpVectors(startTarget, targetLookAt, easeProgress);
        controls.target.copy(currentTarget);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// 缓动函数
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// 将resetView函数暴露到全局作用域
window.resetView = resetView;

const clock = new THREE.Clock();

const animate = function () {
    requestAnimationFrame(animate);
    
    controls.update();
    
    if (mixer) {
        mixer.update(clock.getDelta());
        
        let allFinished = true;
        for (let action of actions) {
            if (action.time < action.getClip().duration) {
                allFinished = false;
                break;
            }
        }
        
        if (allFinished && isAnimationPlaying) {
            isAnimationPlaying = false;
            actions.forEach(action => {
                action.paused = true;
            });
            updateStatusUI();
        }
    }
    
    renderer.render(scene, camera);
};

animate();

// 响应屏幕尺寸变化
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('Three.js厂房环境初始化完成');