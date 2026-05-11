/**
 * Three.js流水线展示页面 - 主入口文件
 * 兼容Chrome/Firefox主流浏览器
 * 采用模块化设计，按功能拆分场景、模型、交互模块
 * 
 * @module main
 * @requires three
 * @requires OrbitControls
 * @requires GLTFLoader
 * @requires EffectComposer
 * @requires RenderPass
 * @requires UnrealBloomPass
 * @requires OutputPass
 */

// ========== 导入Three.js核心库 ==========
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

// ========== 导入自定义模块 ==========
// 注意：模块化函数已创建，但为保持向后兼容，主文件中仍保留原有函数
// 未来可逐步迁移到模块化版本

// 纹理模块（已创建，但主文件中保留原有实现以保持兼容性）
// import * as TextureModule from './modules/textures.js';

// 音频模块（已创建，但主文件中保留原有实现以保持兼容性）
// import * as AudioModule from './modules/audio.js';

// 光照模块（已创建，但主文件中保留原有实现以保持兼容性）
// import * as LightingModule from './modules/lighting.js';

// 后期处理模块（已创建，但主文件中保留原有实现以保持兼容性）
// import * as PostProcessingModule from './modules/postprocessing.js';

// 交互模块（已创建，但主文件中保留原有实现以保持兼容性）
// import * as InteractionModule from './modules/interaction.js';

// ========== 场景初始化 ==========
/**
 * Three.js场景对象
 * 包含所有3D对象（模型、环境、灯光等）
 * @type {THREE.Scene}
 */
const scene = new THREE.Scene();

// ========== 纹理创建函数（已移至modules/textures.js，此处保留以兼容旧代码） ==========
// 注意：纹理函数已模块化，建议使用导入的版本
// 以下函数保留用于向后兼容，但建议使用模块版本

/**
 * 创建地面瓷砖纹理（已废弃，请使用modules/textures.js中的版本）
 * @deprecated 请使用从modules/textures.js导入的版本
 */
function createFloorTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // 基础灰色背景
    ctx.fillStyle = '#7a7a7a';
    ctx.fillRect(0, 0, 512, 512);
    
    const tileSize = 96;
    const groutWidth = 2;
    
    // 绘制瓷砖网格
    for (let y = 0; y < 512; y += tileSize) {
        for (let x = 0; x < 512; x += tileSize) {
            // 瓷砖主体（带轻微变化）
            const variation = Math.random() * 0.1;
            ctx.fillStyle = `rgba(${122 + variation * 20}, ${122 + variation * 20}, ${122 + variation * 20}, 1)`;
            ctx.fillRect(x + groutWidth, y + groutWidth, tileSize - groutWidth * 2, tileSize - groutWidth * 2);
            
            // 添加瓷砖纹理细节
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            for (let i = 0; i < 3; i++) {
                const px = x + groutWidth + Math.random() * (tileSize - groutWidth * 2);
                const py = y + groutWidth + Math.random() * (tileSize - groutWidth * 2);
                ctx.fillRect(px, py, 2, 2);
            }
        }
    }
    
    // 绘制接缝线
    ctx.strokeStyle = '#5a5a5a';
    ctx.lineWidth = groutWidth;
    for (let i = 0; i <= 512; i += tileSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.needsUpdate = true;
    
    return texture;
}

// 创建金属纹理
function createMetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // 基础金属色
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.5, '#a0a0a0');
    gradient.addColorStop(1, '#d0d0d0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // 添加金属划痕和磨损效果
    ctx.strokeStyle = 'rgba(80, 80, 80, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        const x1 = Math.random() * 512;
        const y1 = Math.random() * 512;
        const x2 = x1 + (Math.random() - 0.5) * 100;
        const y2 = y1 + (Math.random() - 0.5) * 100;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    // 添加高光点
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 5 + 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.needsUpdate = true;
    
    return texture;
}

// 创建墙面标识纹理
// 创建厂房墙面纹理
function createWallLabelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // 基础混凝土墙面颜色（灰白色）
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, 512, 512);
    
    // 添加混凝土墙面质感（减少密度）
    for (let y = 0; y < 512; y += 4) {
        const variation = Math.sin(y / 30) * 3 + Math.random() * 2;
        ctx.fillStyle = `rgba(${232 + variation}, ${232 + variation}, ${232 + variation}, 0.8)`;
        ctx.fillRect(0, y, 512, 2);
    }
    
    // 添加墙板连接线和螺栓（减少密度）
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 2;
    
    // 水平分隔线（模拟墙板连接，间距增加到128像素）
    for (let y = 128; y < 512; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
        
        // 在分隔线上添加螺栓（每64像素一个）
        for (let x = 64; x < 512; x += 64) {
            ctx.fillStyle = '#666666';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // 螺栓十字槽
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - 2, y);
            ctx.lineTo(x + 2, y);
            ctx.moveTo(x, y - 2);
            ctx.lineTo(x, y + 2);
            ctx.stroke();
        }
    }
    
    // 垂直分隔线（间距增加到128像素）
    for (let x = 128; x < 512; x += 128) {
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
    }
    
    // 主要安全标识 - 安全出口（绿色）
    ctx.fillStyle = '#00aa00';
    ctx.fillRect(180, 150, 120, 100);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(180, 150, 120, 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('安全出口', 240, 190);
    ctx.font = 'bold 16px Arial';
    ctx.fillText('SAFETY EXIT', 240, 215);
    
    // 警告标识（黄色三角形）
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.moveTo(340, 150);
    ctx.lineTo(380, 150);
    ctx.lineTo(360, 190);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', 360, 175);
    
    // 厂房编号标识（大型）
    ctx.fillStyle = '#0066cc';
    ctx.fillRect(80, 320, 140, 80);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 320, 140, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('厂房A区', 150, 355);
    ctx.font = 'bold 18px Arial';
    ctx.fillText('FACTORY A', 150, 380);
    
    // 危险标识（红色）
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(280, 320, 100, 80);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(280, 320, 100, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('DANGER', 330, 355);
    
    // 添加少量墙面板纹理细节
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const length = Math.random() * 15 + 5;
        const angle = Math.random() * Math.PI * 2;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;
    
    return texture;
}

// 创建天空盒
function createSkybox() {
    const skyGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
    
    // 创建工厂环境天空盒纹理（程序化生成）
    const loader = new THREE.TextureLoader();
    const skyMaterials = [];
    
    // 为每个面创建工厂环境色
    const colors = [
        0x87CEEB, // 顶部 - 天空蓝
        0x708090, // 底部 - 地面灰
        0xB0C4DE, // 右 - 浅钢蓝
        0xB0C4DE, // 左 - 浅钢蓝
        0xC0C0C0, // 前 - 银色
        0xC0C0C0  // 后 - 银色
    ];
    
    for (let i = 0; i < 6; i++) {
        // 创建渐变纹理
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        const color = new THREE.Color(colors[i]);
        const r = Math.floor(color.r * 255);
        const g = Math.floor(color.g * 255);
        const b = Math.floor(color.b * 255);
        
        // 创建渐变
        let gradient;
        if (i === 0) { // 顶部 - 天空
            gradient = ctx.createLinearGradient(0, 0, 0, 512);
            gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
            gradient.addColorStop(1, `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`);
        } else if (i === 1) { // 底部
            gradient = ctx.createLinearGradient(0, 0, 0, 512);
            gradient.addColorStop(0, `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`);
            gradient.addColorStop(1, `rgb(${r}, ${g}, ${b})`);
        } else {
            gradient = ctx.createLinearGradient(0, 0, 512, 512);
            gradient.addColorStop(0, `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`);
            gradient.addColorStop(1, `rgb(${r}, ${g}, ${b})`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // 添加云朵效果（仅顶部）
        if (i === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let j = 0; j < 10; j++) {
                const x = Math.random() * 512;
                const y = Math.random() * 200;
                const radius = Math.random() * 50 + 20;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        skyMaterials.push(new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        }));
    }
    
    const skybox = new THREE.Mesh(skyGeometry, skyMaterials);
    scene.add(skybox);
}

// 存储场景元素引用，以便后续调整
let sceneElements = {
    floor: null,
    walls: [],
    pillars: [],
    beams: [],
    ducts: [],
    lights: [],
    safetyZone: null,  // 绿色安全区域
    warningTape: []    // 黄黑警戒线条带
};

// 创建绿色安全区域和黄黑警戒线
function createSafetyZone(modelCenter, modelSize) {
    // 移除旧的安全区域和警戒线
    if (sceneElements.safetyZone) {
        scene.remove(sceneElements.safetyZone);
        sceneElements.safetyZone.geometry.dispose();
        sceneElements.safetyZone.material.dispose();
        sceneElements.safetyZone = null;
    }
    
    sceneElements.warningTape.forEach(tape => {
        scene.remove(tape);
        tape.geometry.dispose();
        tape.material.dispose();
    });
    sceneElements.warningTape = [];
    
    // 计算安全区域尺寸（比模型稍大一些，留出安全边距）
    const safetyMargin = 2.0; // 安全边距
    const zoneWidth = modelSize.x + safetyMargin * 2;
    const zoneDepth = modelSize.z + safetyMargin * 2;
    
    // 创建绿色安全区域（稍微高于地面，避免z-fighting）
    const safetyZoneGeometry = new THREE.PlaneGeometry(zoneWidth, zoneDepth);
    const safetyZoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x4CAF50, // 绿色
        roughness: 0.8,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
    
    const safetyZone = new THREE.Mesh(safetyZoneGeometry, safetyZoneMaterial);
    safetyZone.rotation.x = -Math.PI / 2;
    safetyZone.position.set(modelCenter.x, 0.01, modelCenter.z); // 稍微高于地面
    safetyZone.receiveShadow = true;
    scene.add(safetyZone);
    sceneElements.safetyZone = safetyZone;
    
    // 创建黄黑相间的警戒线条带
    const tapeWidth = 0.3; // 警戒线宽度
    const tapeHeight = 0.02; // 警戒线高度（稍微突出地面）
    const stripeWidth = 0.2; // 每个条纹的宽度
    
    // 创建黄黑条纹纹理
    function createWarningTapeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // 绘制黄黑相间的条纹
        const numStripes = 8;
        const stripeWidthPx = canvas.width / numStripes;
        
        for (let i = 0; i < numStripes; i++) {
            if (i % 2 === 0) {
                ctx.fillStyle = '#FFD700'; // 黄色
            } else {
                ctx.fillStyle = '#000000'; // 黑色
            }
            ctx.fillRect(i * stripeWidthPx, 0, stripeWidthPx, canvas.height);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        texture.needsUpdate = true;
        
        return texture;
    }
    
    const warningTapeTexture = createWarningTapeTexture();
    const warningTapeMaterial = new THREE.MeshStandardMaterial({
        map: warningTapeTexture,
        roughness: 0.7,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
    
    // 计算警戒线的位置（围绕绿色区域）
    const halfZoneWidth = zoneWidth / 2;
    const halfZoneDepth = zoneDepth / 2;
    const tapeOffset = tapeWidth / 2; // 警戒线中心到绿色区域边缘的距离
    
    // 前边警戒线（Z负方向）
    const frontTape = new THREE.Mesh(
        new THREE.BoxGeometry(zoneWidth + tapeWidth * 2, tapeHeight, tapeWidth),
        warningTapeMaterial.clone()
    );
    frontTape.position.set(
        modelCenter.x,
        tapeHeight / 2,
        modelCenter.z - halfZoneDepth - tapeOffset
    );
    scene.add(frontTape);
    sceneElements.warningTape.push(frontTape);
    
    // 后边警戒线（Z正方向）
    const backTape = new THREE.Mesh(
        new THREE.BoxGeometry(zoneWidth + tapeWidth * 2, tapeHeight, tapeWidth),
        warningTapeMaterial.clone()
    );
    backTape.position.set(
        modelCenter.x,
        tapeHeight / 2,
        modelCenter.z + halfZoneDepth + tapeOffset
    );
    scene.add(backTape);
    sceneElements.warningTape.push(backTape);
    
    // 左边警戒线（X负方向）
    const leftTape = new THREE.Mesh(
        new THREE.BoxGeometry(tapeWidth, tapeHeight, zoneDepth),
        warningTapeMaterial.clone()
    );
    leftTape.position.set(
        modelCenter.x - halfZoneWidth - tapeOffset,
        tapeHeight / 2,
        modelCenter.z
    );
    scene.add(leftTape);
    sceneElements.warningTape.push(leftTape);
    
    // 右边警戒线（X正方向）
    const rightTape = new THREE.Mesh(
        new THREE.BoxGeometry(tapeWidth, tapeHeight, zoneDepth),
        warningTapeMaterial.clone()
    );
    rightTape.position.set(
        modelCenter.x + halfZoneWidth + tapeOffset,
        tapeHeight / 2,
        modelCenter.z
    );
    scene.add(rightTape);
    sceneElements.warningTape.push(rightTape);
    
    console.log('安全区域和警戒线创建完成');
}

// 创建真实厂房环境（根据模型尺寸动态调整）
function createBasicFactoryEnvironment(modelSize = null) {
    console.log('创建真实厂房环境...');
    
    // 创建天空盒（尺寸固定，足够大）
    createSkybox();
    
    // 根据模型尺寸计算场景尺寸，如果没有模型尺寸则使用默认值
    let floorWidth, floorDepth, wallHeight, wallOffset;
    
    if (modelSize) {
        // 根据模型尺寸计算场景尺寸，留出足够的边距（模型周围留出模型尺寸的2.0倍空间）
        const marginX = modelSize.x * 2.0;
        const marginZ = modelSize.z * 2.0;
        floorWidth = Math.max(modelSize.x + marginX, 20); // 最小20单位
        floorDepth = Math.max(modelSize.z + marginZ, 20); // 最小20单位
        wallHeight = Math.max(modelSize.y * 1.5, 8); // 墙高至少是模型高度的1.5倍，最小8单位
        wallOffset = Math.max(marginX * 0.5, 3); // 这会计算为 Math.max(modelSize.x * 0.75, 3)
        wallOffset = 3; // 无论模型大小，墙体偏移量固定为3，确保与地面贴合
        wallOffset = 3; // 无论模型大小，墙体偏移量固定为3，确保与地面贴合
    } else {
        // 默认尺寸（较小，等待模型加载后调整）
        floorWidth = 30;
        floorDepth = 30;
        // 动态计算场景尺寸
        wallHeight = 8;
        wallOffset = 3; // 无论模型大小，墙体偏移量固定为3，确保与地面贴合
        
        console.log(`场景尺寸: ${floorWidth} x ${floorDepth}, 墙高: ${wallHeight}`);
    }
    
    console.log(`场景尺寸: ${floorWidth} x ${floorDepth}, 墙高: ${wallHeight}`);
    
    // ========== 地面（带瓷砖纹理） ==========
    const floorTileTexture = createFloorTileTexture();
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTileTexture,
        roughness: 0.7,
        metalness: 0.1,
        color: 0xffffff
    });
    
    // 如果已有地面，先移除
    if (sceneElements.floor) {
        scene.remove(sceneElements.floor);
        sceneElements.floor.geometry.dispose();
        sceneElements.floor.material.dispose();
    }
    
    const floorGeometry = new THREE.PlaneGeometry(floorWidth, floorDepth);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    sceneElements.floor = floor;
    
    // ========== 墙面（带标识纹理） ==========
    // 移除旧墙面
    sceneElements.walls.forEach(wall => {
        scene.remove(wall);
        wall.geometry.dispose();
        if (wall.material) {
            if (Array.isArray(wall.material)) {
                wall.material.forEach(mat => {
                    if (mat.map) mat.map.dispose();
                    mat.dispose();
                });
            } else {
                if (wall.material.map) wall.material.map.dispose();
                wall.material.dispose();
            }
        }
    });
    sceneElements.walls = [];
    
    const halfWidth = floorWidth / 2;
    const halfDepth = floorDepth / 2;
    const wallThickness = 0.8; // 增加墙体厚度，更像图2中的样式
    
    // 重新设计墙体系统：使用更简单可靠的方法
    // 墙体底部与地面贴合（y=0），顶部在y=wallHeight
    const wallCenterY = wallHeight / 2; // 墙的中心Y位置，应该是wallHeight/2
    console.log(`墙体中心Y位置: ${wallCenterY}, 墙高: ${wallHeight}`);
    
    // 调整墙体偏移量，减少多余空间
    const adjustedWallOffset = 0.1; // 减少墙体偏移量，使墙体更靠近中间
    
    // 定义墙体的外边界（墙体中心线位置）
    const wallOuterX = halfWidth + adjustedWallOffset + wallThickness / 2;  // 右墙中心X
    const wallOuterZ = halfDepth + adjustedWallOffset + wallThickness / 2;  // 后墙中心Z
    const wallInnerX = -halfWidth - adjustedWallOffset - wallThickness / 2; // 左墙中心X
    const wallInnerZ = -halfDepth - adjustedWallOffset - wallThickness / 2;  // 前墙中心Z
    
    // 计算墙体尺寸：确保完全覆盖，无间隙
    // 前后墙宽度：从最左到最右，完全覆盖
    const frontBackWallWidth = wallOuterX - wallInnerX;
    // 左右墙长度：从最前到最后，完全覆盖
    const leftRightWallLength = wallOuterZ - wallInnerZ;
    
    // 贴图比例：保持文字和图案不变形
    const textureUnitsPerMeter = 0.5; // 调整贴图比例，避免过度拉伸
    
    // 创建基础墙体材质
    const wallBaseTexture = createWallLabelTexture();
    
    // 前墙（Z负方向，最前面）
    const frontWallTexture = wallBaseTexture.clone();
    frontWallTexture.wrapS = THREE.RepeatWrapping;
    frontWallTexture.wrapT = THREE.RepeatWrapping;
    frontWallTexture.repeat.set(frontBackWallWidth * textureUnitsPerMeter, wallHeight * textureUnitsPerMeter);
    
    const frontWallMaterial = new THREE.MeshStandardMaterial({
        map: frontWallTexture,
        roughness: 0.8,
        metalness: 0.0,
        color: 0xffffff
    });
    
    const frontWallGeometry = new THREE.BoxGeometry(frontBackWallWidth, wallHeight, wallThickness);
    const frontWall = new THREE.Mesh(frontWallGeometry, frontWallMaterial);
    frontWall.position.set((wallInnerX + wallOuterX) / 2, wallCenterY, wallInnerZ + 0.1); // 使用新的偏移量，微调向中间
    frontWall.receiveShadow = true;
    frontWall.castShadow = true;
    scene.add(frontWall);
    sceneElements.walls.push(frontWall);
    
    // 后墙（Z正方向，最后面）
    const backWallTexture = wallBaseTexture.clone();
    backWallTexture.wrapS = THREE.RepeatWrapping;
    backWallTexture.wrapT = THREE.RepeatWrapping;
    backWallTexture.repeat.set(frontBackWallWidth * textureUnitsPerMeter, wallHeight * textureUnitsPerMeter);
    
    const backWallMaterial = new THREE.MeshStandardMaterial({
        map: backWallTexture,
        roughness: 0.8,
        metalness: 0.0,
        color: 0xffffff
    });
    
    const backWallGeometry = new THREE.BoxGeometry(frontBackWallWidth, wallHeight, wallThickness);
    const backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
    backWall.position.set((wallInnerX + wallOuterX) / 2, wallCenterY, wallOuterZ - 0.1); // 使用新的偏移量，微调向中间
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    scene.add(backWall);
    sceneElements.walls.push(backWall);
    
    // 左墙（X负方向）
    const leftWallTexture = wallBaseTexture.clone();
    leftWallTexture.wrapS = THREE.RepeatWrapping;
    leftWallTexture.wrapT = THREE.RepeatWrapping;
    leftWallTexture.repeat.set(leftRightWallLength * textureUnitsPerMeter, wallHeight * textureUnitsPerMeter);
    
    const leftWallMaterial = new THREE.MeshStandardMaterial({
        map: leftWallTexture,
        roughness: 0.8,
        metalness: 0.0,
        color: 0xffffff
    });
    
    const leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, leftRightWallLength);
    const leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.position.set(wallInnerX + 0.1, wallCenterY, (wallInnerZ + wallOuterZ) / 2); // 使用新的偏移量，微调向中间
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    scene.add(leftWall);
    sceneElements.walls.push(leftWall);
    
    // 右墙（X正方向）
    const rightWallTexture = wallBaseTexture.clone();
    rightWallTexture.wrapS = THREE.RepeatWrapping;
    rightWallTexture.wrapT = THREE.RepeatWrapping;
    rightWallTexture.repeat.set(leftRightWallLength * textureUnitsPerMeter, wallHeight * textureUnitsPerMeter);
    
    const rightWallMaterial = new THREE.MeshStandardMaterial({
        map: rightWallTexture,
        roughness: 0.8,
        metalness: 0.0,
        color: 0xffffff
    });
    
    const rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, leftRightWallLength);
    const rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.position.set(wallOuterX - 0.1, wallCenterY, (wallInnerZ + wallOuterZ) / 2); // 使用新的偏移量，微调向中间
    rightWall.receiveShadow = true;
    rightWall.castShadow = true;
    scene.add(rightWall);
    sceneElements.walls.push(rightWall);
    
    // ========== 添加门（在前墙或右墙） ==========
    const doorWidth = 3.0;  // 门宽度
    const doorHeight = 2.5; // 门高度
    const doorY = doorHeight / 2; // 门底部在地面，中心Y位置
    
    // 门框材质（深色，与墙体区分）
    const doorFrameMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4a4a,
        roughness: 0.6,
        metalness: 0.1
    });
    
    // 门板材质（浅色）
    const doorPanelMaterial = new THREE.MeshStandardMaterial({
        color: 0xd0d0d0,
        roughness: 0.7,
        metalness: 0.0
    });
    
    // 在前墙添加门（位置稍微偏右）
    const doorX = halfWidth * 0.3; // 门在右侧
    const doorZ = wallInnerZ + wallThickness / 2 + 0.01; // 门稍微突出墙面
    
    // 门框（上、左、右）
    const doorFrameThickness = 0.15;
    const doorFrameWidth = doorWidth + doorFrameThickness * 2;
    const doorFrameHeight = doorHeight + doorFrameThickness;
    
    // 上门框
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(doorFrameWidth, doorFrameThickness, wallThickness * 0.3),
        doorFrameMaterial
    );
    topFrame.position.set(doorX, doorHeight + doorFrameThickness / 2, doorZ);
    scene.add(topFrame);
    sceneElements.walls.push(topFrame);
    
    // 左门框
    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(doorFrameThickness, doorHeight, wallThickness * 0.3),
        doorFrameMaterial
    );
    leftFrame.position.set(doorX - doorWidth / 2 - doorFrameThickness / 2, doorY, doorZ);
    scene.add(leftFrame);
    sceneElements.walls.push(leftFrame);
    
    // 右门框
    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(doorFrameThickness, doorHeight, wallThickness * 0.3),
        doorFrameMaterial
    );
    rightFrame.position.set(doorX + doorWidth / 2 + doorFrameThickness / 2, doorY, doorZ);
    scene.add(rightFrame);
    sceneElements.walls.push(rightFrame);
    
    // 门板（可以打开的部分）
    const doorPanel = new THREE.Mesh(
        new THREE.BoxGeometry(doorWidth, doorHeight, wallThickness * 0.2),
        doorPanelMaterial
    );
    doorPanel.position.set(doorX, doorY, doorZ + wallThickness * 0.15);
    doorPanel.castShadow = true;
    doorPanel.receiveShadow = true;
    scene.add(doorPanel);
    sceneElements.walls.push(doorPanel);
    
    // 门把手（小圆柱）
    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8);
    const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2
    });
    const doorHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    doorHandle.rotation.z = Math.PI / 2;
    doorHandle.position.set(doorX + doorWidth / 2 - 0.2, doorY, doorZ + wallThickness * 0.25);
    scene.add(doorHandle);
    sceneElements.walls.push(doorHandle);
    
    // ========== 钢结构支撑柱（使用Cylinder几何体 + 金属纹理） ==========
    const metalTexture = createMetalTexture();
    const metalMaterial = new THREE.MeshStandardMaterial({
        map: metalTexture,
        roughness: 0.3,
        metalness: 0.9,
        color: 0xc0c0c0
    });
    
    // 移除旧支撑柱
    sceneElements.pillars.forEach(pillar => {
        scene.remove(pillar);
        pillar.geometry.dispose();
        pillar.material.dispose();
    });
    sceneElements.pillars = [];
    
    // 根据场景尺寸动态计算支撑柱位置
    const pillarSpacing = Math.min(floorWidth, floorDepth) / 4; // 柱子间距
    const pillarPositions = [
        [-halfWidth * 0.6, 0, -halfDepth * 0.6],
        [halfWidth * 0.6, 0, -halfDepth * 0.6],
        [-halfWidth * 0.6, 0, halfDepth * 0.6],
        [halfWidth * 0.6, 0, halfDepth * 0.6]
    ];
    
    // 如果场景较大，添加更多支撑柱
    if (floorWidth > 30 || floorDepth > 30) {
        pillarPositions.push(
            [-halfWidth * 0.3, 0, -halfDepth * 0.6],
            [halfWidth * 0.3, 0, -halfDepth * 0.6],
            [-halfWidth * 0.3, 0, halfDepth * 0.6],
            [halfWidth * 0.3, 0, halfDepth * 0.6]
        );
    }
    
    pillarPositions.forEach(pos => {
        // 主柱体（圆柱）
        const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, wallHeight, 16);
        const pillar = new THREE.Mesh(pillarGeometry, metalMaterial);
        pillar.position.set(pos[0], wallHeight / 2, pos[2]);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.add(pillar);
        sceneElements.pillars.push(pillar);
        
        // 柱顶连接板（Box）
        const capGeometry = new THREE.BoxGeometry(1, 0.2, 1);
        const cap = new THREE.Mesh(capGeometry, metalMaterial);
        cap.position.set(pos[0], wallHeight + 0.1, pos[2]);
        cap.castShadow = true;
        scene.add(cap);
        sceneElements.pillars.push(cap);
    });
    
    // ========== 横梁（使用Box几何体 + 金属纹理） ==========
    const beamMaterial = metalMaterial.clone();
    beamMaterial.roughness = 0.4;
    
    // 移除旧横梁
    sceneElements.beams.forEach(beam => {
        scene.remove(beam);
        beam.geometry.dispose();
        beam.material.dispose();
    });
    sceneElements.beams = [];
    
    const beamY = wallHeight - 0.5;
    
    // 横向横梁
    const horizontalBeams = [
        { pos: [0, beamY, -halfDepth * 0.6], size: [floorWidth * 0.8, 0.3, 0.3] },
        { pos: [0, beamY, halfDepth * 0.6], size: [floorWidth * 0.8, 0.3, 0.3] },
        { pos: [0, beamY, 0], size: [floorWidth * 0.8, 0.3, 0.3] }
    ];
    
    horizontalBeams.forEach(beam => {
        const beamGeometry = new THREE.BoxGeometry(...beam.size);
        const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial);
        beamMesh.position.set(...beam.pos);
        beamMesh.castShadow = true;
        scene.add(beamMesh);
        sceneElements.beams.push(beamMesh);
    });
    
    // 纵向横梁
    const verticalBeams = [
        { pos: [-halfWidth * 0.6, beamY, 0], size: [0.3, 0.3, floorDepth * 0.8] },
        { pos: [halfWidth * 0.6, beamY, 0], size: [0.3, 0.3, floorDepth * 0.8] }
    ];
    
    verticalBeams.forEach(beam => {
        const beamGeometry = new THREE.BoxGeometry(...beam.size);
        const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial);
        beamMesh.position.set(...beam.pos);
        beamMesh.castShadow = true;
        scene.add(beamMesh);
        sceneElements.beams.push(beamMesh);
    });
    
    // ========== 通风管道（使用Cylinder和Extrude几何体） ==========
    const ductMaterial = new THREE.MeshStandardMaterial({
        map: metalTexture,
        roughness: 0.5,
        metalness: 0.7,
        color: 0xa0a0a0
    });
    
    // 移除旧通风管道
    sceneElements.ducts.forEach(duct => {
        scene.remove(duct);
        duct.geometry.dispose();
        duct.material.dispose();
    });
    sceneElements.ducts = [];
    
    // 水平通风管道（根据场景尺寸调整）
    const ductLength = Math.min(floorWidth, floorDepth) * 0.6;
    const ductGeometry = new THREE.CylinderGeometry(0.8, 0.8, ductLength, 16);
    const ductY = wallHeight * 0.8;
    
    const duct1 = new THREE.Mesh(ductGeometry, ductMaterial);
    duct1.rotation.z = Math.PI / 2;
    duct1.position.set(-halfWidth * 0.3, ductY, 0);
    duct1.castShadow = true;
    scene.add(duct1);
    sceneElements.ducts.push(duct1);
    
    const duct2 = new THREE.Mesh(ductGeometry, ductMaterial);
    duct2.rotation.z = Math.PI / 2;
    duct2.position.set(halfWidth * 0.3, ductY, 0);
    duct2.castShadow = true;
    scene.add(duct2);
    sceneElements.ducts.push(duct2);
    
    // 通风口（使用Lathe几何体创建圆形通风口）
    const ventShape = new THREE.Shape();
    ventShape.moveTo(0, 0);
    ventShape.lineTo(0.1, 0);
    ventShape.lineTo(0.1, 0.05);
    ventShape.lineTo(0, 0.05);
    ventShape.lineTo(0, 0);
    
    const ventGeometry = new THREE.LatheGeometry(ventShape.getPoints(), 16);
    const ventMaterial = new THREE.MeshStandardMaterial({
        map: metalTexture,
        roughness: 0.2,
        metalness: 0.95,
        color: 0xb0b0b0
    });
    
    const vent1 = new THREE.Mesh(ventGeometry, ventMaterial);
    vent1.scale.set(8, 8, 8);
    vent1.position.set(-halfWidth * 0.3, ductY, -halfDepth * 0.4);
    vent1.castShadow = true;
    scene.add(vent1);
    sceneElements.ducts.push(vent1);
    
    const vent2 = new THREE.Mesh(ventGeometry, ventMaterial);
    vent2.scale.set(8, 8, 8);
    vent2.position.set(halfWidth * 0.3, ductY, halfDepth * 0.4);
    vent2.castShadow = true;
    scene.add(vent2);
    sceneElements.ducts.push(vent2);
    
    // ========== 照明设备（使用Box和Cylinder组合） ==========
    const lightFixtureMaterial = new THREE.MeshStandardMaterial({
        map: metalTexture,
        roughness: 0.3,
        metalness: 0.8,
        color: 0xd0d0d0
    });
    
    // 移除旧照明设备
    sceneElements.lights.forEach(light => {
        if (light.mesh) {
            scene.remove(light.mesh);
            light.mesh.geometry.dispose();
            light.mesh.material.dispose();
        }
        if (light.spotLight) {
            scene.remove(light.spotLight);
            scene.remove(light.spotLight.target);
        }
        if (light.pointLight) {
            scene.remove(light.pointLight);
        }
    });
    sceneElements.lights = [];
    // 清空聚光灯数组
    spotLights = [];
    
    // 根据场景尺寸动态计算照明位置
    const lightY = wallHeight * 0.85;
    const lightSpacing = Math.min(floorWidth, floorDepth) / 3;
    const lightPositions = [
        [-halfWidth * 0.4, lightY, -halfDepth * 0.4],
        [halfWidth * 0.4, lightY, -halfDepth * 0.4],
        [-halfWidth * 0.4, lightY, halfDepth * 0.4],
        [halfWidth * 0.4, lightY, halfDepth * 0.4],
        [0, lightY, 0]
    ];
    
    lightPositions.forEach(pos => {
        // 灯罩（Box）- 更真实的车间顶灯外观
        const fixtureGeometry = new THREE.BoxGeometry(2.5, 0.4, 1.2);
        const fixture = new THREE.Mesh(fixtureGeometry, lightFixtureMaterial);
        fixture.position.set(pos[0], pos[1], pos[2]);
        fixture.castShadow = true;
        fixture.receiveShadow = true;
        scene.add(fixture);
        
        // 添加聚光灯（模拟车间顶灯，更贴合实际光照效果）
        // 调整参数使其更贴合车间环境：角度更宽，衰减更自然
        const lightDistance = Math.max(floorWidth, floorDepth) * 0.6;
        const spotLight = new THREE.SpotLight(
            0xffffff,           // 颜色：白色
            2.0,                // 强度：增强亮度，贴合车间环境
            lightDistance,      // 距离：根据场景尺寸调整
            Math.PI / 4,        // 角度：45度，更宽的照射范围
            0.4,                // 衰减：更平滑的衰减
            1.5                 // 衰减指数：更自然的衰减曲线
        );
        spotLight.position.set(pos[0], pos[1] - 0.3, pos[2]);
        // 聚光灯目标指向地面，稍微向前倾斜，模拟实际顶灯照射
        spotLight.target.position.set(pos[0] * 0.8, 0, pos[2] * 0.8);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 0.1;
        spotLight.shadow.camera.far = lightDistance;
        spotLight.shadow.bias = -0.0001;
        spotLight.shadow.normalBias = 0.02;
        scene.add(spotLight);
        scene.add(spotLight.target);
        spotLights.push(spotLight);
        
        // 添加点光源（补充照明，产生柔和的全局光照）
        const pointLight = new THREE.PointLight(
            0xffffff, 
            0.4,                // 降低强度，避免过亮
            lightDistance * 0.5  // 较小的范围，只影响局部
        );
        pointLight.position.set(pos[0], pos[1] - 0.5, pos[2]);
        pointLight.castShadow = false; // 点光源不投射阴影，减少性能消耗
        scene.add(pointLight);
        
        sceneElements.lights.push({ mesh: fixture, spotLight: spotLight, pointLight: pointLight });
    });
    
    // 移除旧设备指示灯
    indicatorLights.forEach(indicator => {
        if (indicator.mesh) {
            scene.remove(indicator.mesh);
            indicator.mesh.geometry.dispose();
            indicator.mesh.material.dispose();
        }
        if (indicator.light) {
            scene.remove(indicator.light);
        }
    });
    indicatorLights = [];
    
    // 添加设备指示灯（带辉光效果，更贴合场景）
    // 将指示灯放置在更合理的位置（靠近设备区域，而不是墙上）
    const indicatorPositions = [
        [halfWidth * -0.083, 1.5, -halfDepth * 0.155],  // 运行指示灯（绿色）- 靠近设备
        [halfWidth * -0.083, 1.5, -0.58],                  // 警告指示灯（黄色）- 设备中心
        [-halfWidth * -0.099, 1.8, halfDepth * 0.22]   // 状态指示灯（蓝色，索引为2）添加90度z轴旋转，保持其他指示灯不变
    ];
    
    const indicatorColors = [0x00ff00, 0xffff00, 0x0080ff];
    
    indicatorPositions.forEach((pos, index) => {
        // 指示灯几何体（小圆柱）- 更贴合实际设备指示灯大小
        const indicatorGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
        const indicatorMaterial = new THREE.MeshStandardMaterial({
            color: indicatorColors[index],
            emissive: indicatorColors[index],
            emissiveIntensity: 1.8, // 适中的自发光强度，更贴合实际
            metalness: 0.0,
            roughness: 0.2
        });
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.rotation.x = Math.PI / 2;
        // 为状态指示灯（蓝色）添加额外的90度旋转
        if (index === 2) { // 蓝色状态指示灯
            indicator.rotation.z = Math.PI / 2; // 绕z轴旋转90度
        }
        indicator.position.set(pos[0], pos[1], pos[2]);
        indicator.layers.enable(1); // 启用bloom层，产生辉光效果
        scene.add(indicator);
        
        // 指示灯点光源（产生局部高光，更贴合实际效果）
        // 调整亮度和范围，使其更贴合设备指示灯的实际情况
        const indicatorLight = new THREE.PointLight(
            indicatorColors[index], 
            0.8,    // 降低强度，避免过亮
            3.0     // 较小的范围，只影响指示灯周围的小区域
        );
        indicatorLight.position.set(pos[0], pos[1], pos[2]);
        indicatorLight.castShadow = false;
        indicatorLight.decay = 2; // 更快的衰减，使光照更集中
        scene.add(indicatorLight);
        
        indicatorLights.push({ mesh: indicator, light: indicatorLight });
    });
    
    console.log('真实厂房环境创建完成');
}

// ========== 相机初始化 ==========
/**
 * 透视相机
 * 兼容Chrome/Firefox主流浏览器
 * @type {THREE.PerspectiveCamera}
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 3000);
camera.position.set(30, 20, 30);

// ========== 渲染器初始化 ==========
/**
 * WebGL渲染器
 * 兼容Chrome/Firefox主流浏览器
 * 启用抗锯齿、阴影映射和色调映射
 * @type {THREE.WebGLRenderer}
 */
const renderer = new THREE.WebGLRenderer({ 
    antialias: true,  // 抗锯齿，提升渲染质量
    alpha: true       // 支持透明背景
});
renderer.setPixelRatio(window.devicePixelRatio);  // 适配高DPI屏幕
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;  // 启用阴影映射
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // 使用软阴影，更真实
renderer.outputColorSpace = THREE.SRGBColorSpace;  // 使用sRGB颜色空间
renderer.toneMapping = THREE.ACESFilmicToneMapping; // 使用ACES色调映射，避免过曝
renderer.toneMappingExposure = 0.9; // 曝光度（稍微降低，避免过曝）

// ========== 后期处理效果 ==========
/**
 * 效果合成器
 * 用于添加后期处理效果（辉光、色调映射等）
 * 兼容Chrome/Firefox主流浏览器
 * @type {EffectComposer}
 */
const composer = new EffectComposer(renderer);

/**
 * 渲染通道
 * 将场景渲染到纹理
 */
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

/**
 * 辉光效果（Bloom）
 * 用于设备指示灯和高光区域，产生真实的发光效果
 * @type {UnrealBloomPass}
 */
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.2,    // strength - 辉光强度（适中，不会过强）
    0.4,    // radius - 辉光半径
    0.9     // threshold - 辉光阈值（只有亮度超过此值的区域才会产生辉光）
);
composer.addPass(bloomPass);

/**
 * 输出通道
 * 色调映射和颜色空间转换，避免过曝
 * @type {OutputPass}
 */
const outputPass = new OutputPass();
outputPass.toneMapping = THREE.ACESFilmicToneMapping; // ACES色调映射，避免过曝
outputPass.toneMappingExposure = 0.9; // 稍微降低曝光，避免过亮
composer.addPass(outputPass);

// ========== 多层光照系统 ==========
// 环境光（基础照明，避免全黑）
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// 主方向光（模拟工厂顶部天窗/主照明）
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(30, 50, 30);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.left = -60;
directionalLight.shadow.camera.right = 60;
directionalLight.shadow.camera.top = 60;
directionalLight.shadow.camera.bottom = -60;
directionalLight.shadow.bias = -0.0001;
directionalLight.shadow.normalBias = 0.02;
scene.add(directionalLight);

// 补充方向光（模拟侧窗照明，避免阴影过暗）
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-20, 30, -20);
scene.add(directionalLight2);

// 第三方向光（模拟另一侧窗照明，平衡光照）
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight3.position.set(20, 25, 20);
scene.add(directionalLight3);

// 存储聚光灯和点光源引用，用于后续调整
let spotLights = [];
let indicatorLights = [];

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;  // 减小最小距离，允许更近的缩放
controls.maxDistance = 500; // 增大最大距离，允许更远的缩放
controls.target.set(0, 0, 0);
controls.update();

// 保存初始视角
let initialCameraPosition = camera.position.clone();
let initialControlsTarget = controls.target.clone();

// 将渲染器添加到容器
const container = document.getElementById('canvas-container');
if (!container) {
    console.error('找不到canvas-container元素');
} else {
    container.appendChild(renderer.domElement);
}

// GLB模型加载
const loader = new GLTFLoader();
let mixer = null;
let actions = [];
let modelLoaded = false;
let model = null; // 保存模型引用，用于点击检测

// 检查模型文件路径
const modelPath = '../Web/assemblyline.glb';

console.log('开始加载模型...');

// 显示加载提示
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-family: Arial, sans-serif;
        z-index: 9999;
    `;
    loadingDiv.innerHTML = '<h3>正在加载模型...</h3>';
    document.body.appendChild(loadingDiv);
}

// 隐藏加载提示
function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        document.body.removeChild(loadingDiv);
    }
}

// 显示错误信息
function showError(message) {
    console.error('错误:', message);
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        font-family: Arial, sans-serif;
        z-index: 9999;
        max-width: 400px;
    `;
    errorDiv.innerHTML = `
        <h3>加载错误</h3>
        <p>${message}</p>
        <p>文件路径: ${modelPath}</p>
        <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 15px; background: white; color: red; border: none; border-radius: 5px; cursor: pointer;">关闭</button>
    `;
    document.body.appendChild(errorDiv);
    
    // 5秒后自动移除
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 10000);
}

// 显示加载提示
showLoading();

loader.load(modelPath, 
    function(gltf) {
        try {
            console.log('模型加载成功');
            hideLoading();
            
            model = gltf.scene; // 保存模型引用
            scene.add(model);
            
            // 创建bloom层（用于辉光效果）
            const bloomLayer = new THREE.Layers();
            bloomLayer.set(1); // 使用第1层作为bloom层
            
            // 遍历模型中的所有mesh，确保它们能投射和接收阴影
            // 同时为高光材质（如金属、指示灯）启用bloom层
            model.traverse(function(child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // 如果材质有高自发光或金属属性，启用bloom层产生辉光
                    if (child.material) {
                        const material = Array.isArray(child.material) ? child.material[0] : child.material;
                        if (material.emissive && material.emissive.getHex() !== 0x000000) {
                            // 有自发光的材质启用bloom
                            child.layers.enable(1);
                        } else if (material.metalness && material.metalness > 0.7) {
                            // 高金属度的材质也启用bloom（产生金属高光辉光）
                            child.layers.enable(1);
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
            
            console.log('模型尺寸:', size);
            console.log('模型中心:', center);
            
            // 根据模型尺寸重新创建场景环境（保持合理比例）
            console.log('根据模型尺寸调整场景环境...');
            createBasicFactoryEnvironment(size);
            
            // 创建绿色安全区域和黄黑警戒线
            console.log('创建安全区域和警戒线...');
            createSafetyZone(center, size);
            
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
            
            // 计算适当的相机距离（考虑场景和模型尺寸）
            const sceneSize = Math.max(
                sceneElements.floor ? sceneElements.floor.geometry.parameters.width : size.x,
                sceneElements.floor ? sceneElements.floor.geometry.parameters.height : size.z
            );
            const maxDim = Math.max(size.x, size.y, size.z, sceneSize * 0.5);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.3; // 减小相机距离，使视角更接近模型（类似图中的视角）
            
            // 调整相机位置（以模型中心为焦点，采用等轴测俯视角度，类似图中视角）
            // 使用适中的高度和距离，形成等轴测视图效果，能看到模型和周围环境
            const cameraHeight = maxDim * 0.8; // 相机高度（适中的俯视角度）
            const cameraDistance = cameraZ * 0.7; // 相机距离（更近的距离）
            camera.position.set(
                center.x + cameraDistance * 0.7,  // X偏移（稍微偏右）
                center.y + cameraHeight,          // Y高度（俯视角度）
                center.z + cameraDistance * 0.7   // Z偏移（稍微偏前）
            );
            camera.lookAt(center);
            
            controls.target.copy(center);
            controls.update();
            
            initialCameraPosition = camera.position.clone();
            initialControlsTarget = controls.target.clone();
            modelLoaded = true;
            
            updateStatusUI();
            console.log('模型加载完成，场景已根据模型尺寸调整');
            
        } catch (error) {
            console.error('模型处理错误:', error);
            hideLoading();
            showError('模型处理过程中出现错误: ' + error.message);
        }
    },
    function(progress) {
        if (progress.lengthComputable) {
            const percent = (progress.loaded / progress.total * 100).toFixed(1);
            console.log('加载进度:', percent + '%');
        } else {
            console.log('加载进度: 计算中...');
        }
    },
    function(error) {
        console.error('GLB文件加载失败:', error);
        hideLoading();
        
        let errorMessage = '模型加载失败';
        if (error.message) {
            errorMessage += ': ' + error.message;
        }
        
        // 尝试检查文件是否存在
        fetch(modelPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            })
            .catch(() => {
                errorMessage += '<br>请检查文件路径是否正确';
            });
        
        showError(errorMessage);
    }
);

// 动画控制相关变量
let isAnimationPlaying = false;
let animationSpeed = 1.0;

// 音频控制
let audio = null;
let audioLoaded = false;

// 初始化音频
function initAudio() {
    // 尝试多个可能的路径
    const audioPaths = [
        '../Web/voice.MP3',  // 从three_jichu目录到Web目录
        './voice.MP3',       // 当前目录
        './Web/voice.MP3',   // 当前目录下的Web文件夹
        'voice.MP3'          // 直接文件名
    ];
    
    let currentPathIndex = 0;
    
    function tryLoadAudio(path) {
        console.log(`尝试加载音频: ${path}`);
        audio = new Audio(path);
        audio.preload = 'auto';
        
        audio.addEventListener('loadeddata', () => {
            audioLoaded = true;
            console.log(`音频加载成功: ${path}`);
        });
        
        audio.addEventListener('canplaythrough', () => {
            audioLoaded = true;
            console.log(`音频可以播放: ${path}`);
        });
        
        audio.addEventListener('error', (e) => {
            console.warn(`音频加载失败 (${path}):`, e);
            audioLoaded = false;
            audio = null;
            
            // 尝试下一个路径
            currentPathIndex++;
            if (currentPathIndex < audioPaths.length) {
                console.log(`尝试下一个路径...`);
                tryLoadAudio(audioPaths[currentPathIndex]);
            } else {
                console.error('所有音频路径都加载失败，请检查voice.MP3文件是否存在');
            }
        });
        
        // 尝试加载音频（load()不返回Promise，直接调用即可）
        try {
            audio.load();
        } catch (err) {
            console.warn(`音频load()失败 (${path}):`, err);
        }
    }
    
    // 开始尝试加载
    tryLoadAudio(audioPaths[currentPathIndex]);
}

// 初始化音频
initAudio();

// 动画控制函数
function playAnimation() {
    if (!modelLoaded || !mixer || actions.length === 0) {
        console.warn('动画尚未准备好');
        return;
    }
    
    console.log('开始播放动画');
    isAnimationPlaying = true;
    
    // 用户交互时尝试播放背景音乐
    tryPlayBGM();
    
    actions.forEach(action => {
        action.paused = false;
        action.timeScale = animationSpeed;
        action.play();
    });
    
    // 播放音频（在用户交互时播放，符合浏览器策略）
    if (audio) {
        if (audioLoaded) {
            audio.currentTime = 0; // 从头开始播放
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('音频播放成功');
                }).catch(err => {
                    console.warn('音频播放失败（可能需要用户交互）:', err);
                    // 如果播放失败，尝试重新加载
                    if (audio.readyState === 0) {
                        audio.load();
                    }
                });
            }
        } else {
            // 如果音频未加载完成，尝试重新加载
            console.log('音频未加载完成，尝试重新加载...');
            audio.load();
            audio.addEventListener('canplaythrough', () => {
                audioLoaded = true;
                audio.currentTime = 0;
                audio.play().catch(err => {
                    console.warn('音频播放失败:', err);
                });
            }, { once: true });
        }
    } else {
        console.warn('音频对象不存在，请检查voice.MP3文件路径');
    }
    
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
    
    // 暂停音频
    if (audio && !audio.paused) {
        audio.pause();
    }
    
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
    
    // 重置并停止音频
    if (audio) {
        audio.pause();
        audio.currentTime = 0; // 重置到开头
    }
    
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

// 一键复位视角功能
function resetView() {
    if (modelLoaded) {
        animateCameraToPosition(initialCameraPosition, initialControlsTarget, 1000);
    } else {
        const defaultPosition = new THREE.Vector3(30, 20, 30);
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
        } else {
            controls.update();
        }
    }
    
    animate();
}

// 缓动函数
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// 将函数暴露到全局作用域（确保在模块加载时就能访问）
// 使用立即执行，确保函数定义后立即暴露
(function() {
window.playAnimation = playAnimation;
window.stopAnimation = stopAnimation;
window.restartAnimation = restartAnimation;
window.updateSpeed = updateSpeed;
window.resetView = resetView;
})();

const clock = new THREE.Clock();

const animate = function () {
    requestAnimationFrame(animate);
    
    controls.update();
    
    if (mixer) {
        mixer.update(clock.getDelta());
        
        // 控制蓝色状态指示灯闪烁（在动画0~1.75秒之间）
        if (isAnimationPlaying && actions.length > 0) {
            const currentTime = actions[0].time; // 获取当前动画时间
            const blinkStartTime = 0;
            const blinkEndTime = 1.75;
            
            // 检查是否在闪烁时间段内
            if (currentTime >= blinkStartTime && currentTime <= blinkEndTime) {
                // 计算闪烁频率（每秒闪烁2次，即0.5秒一个周期）
                const blinkFrequency = 2.0; // 每秒闪烁次数
                const blinkCycle = (currentTime * blinkFrequency * Math.PI * 2);
                // 使用正弦波实现平滑闪烁（0到1之间变化）
                const blinkIntensity = (Math.sin(blinkCycle) + 1) / 2; // 0到1之间
                // 将闪烁强度映射到0.3到1.8之间（从较暗到正常亮度）
                const minIntensity = 0.3;
                const maxIntensity = 1.8;
                const targetIntensity = minIntensity + (maxIntensity - minIntensity) * blinkIntensity;
                
                // 更新蓝色状态指示灯（索引为2）
                if (indicatorLights.length > 2 && indicatorLights[2]) {
                    const blueIndicator = indicatorLights[2];
                    if (blueIndicator.mesh && blueIndicator.mesh.material) {
                        // 更新自发光强度
                        blueIndicator.mesh.material.emissiveIntensity = targetIntensity;
                    }
                    if (blueIndicator.light) {
                        // 更新点光源强度（同步闪烁）
                        const lightMinIntensity = 0.2;
                        const lightMaxIntensity = 0.8;
                        blueIndicator.light.intensity = lightMinIntensity + (lightMaxIntensity - lightMinIntensity) * blinkIntensity;
                    }
                }
            } else {
                // 不在闪烁时间段，恢复正常亮度
                if (indicatorLights.length > 2 && indicatorLights[2]) {
                    const blueIndicator = indicatorLights[2];
                    if (blueIndicator.mesh && blueIndicator.mesh.material) {
                        blueIndicator.mesh.material.emissiveIntensity = 1.8; // 恢复正常亮度
                    }
                    if (blueIndicator.light) {
                        blueIndicator.light.intensity = 0.8; // 恢复正常亮度
                    }
                }
            }
        } else {
            // 动画未播放时，恢复正常亮度
            if (indicatorLights.length > 2 && indicatorLights[2]) {
                const blueIndicator = indicatorLights[2];
                if (blueIndicator.mesh && blueIndicator.mesh.material) {
                    blueIndicator.mesh.material.emissiveIntensity = 1.8;
                }
                if (blueIndicator.light) {
                    blueIndicator.light.intensity = 0.8;
                }
            }
        }
        
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
            
            // 动画结束时停止音频（即使音频没放完）
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0; // 重置到开头
            }
            
            updateStatusUI();
        }
    }
    
    // 使用后期处理合成器渲染
    composer.render();
};

// 响应屏幕尺寸变化
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 更新后期处理合成器尺寸
    composer.setSize(window.innerWidth, window.innerHeight);
});

// ========== 音频管理（已移至modules/audio.js，此处保留以兼容旧代码） ==========
/**
 * 背景音乐对象
 * 注意：音频管理已模块化，建议使用modules/audio.js中的函数
 * @type {HTMLAudioElement|null}
 * @deprecated 请使用从modules/audio.js导入的函数
 */
let bgm = null;

/**
 * 初始化背景音乐
 * 兼容Chrome/Firefox浏览器
 * 注意：已创建模块化版本（modules/audio.js），但为保持兼容性保留此实现
 */
function initBGM() {
    bgm = new Audio('../Web/bgm.MP3');
    bgm.loop = true; // 循环播放
    bgm.volume = 0.5; // 设置音量（0-1之间）
    bgm.preload = 'auto';
    
    bgm.addEventListener('loadeddata', () => {
        console.log('背景音乐加载完成');
        // 尝试自动播放（可能需要用户交互）
        tryPlayBGM();
    });
    
    bgm.addEventListener('canplaythrough', () => {
        console.log('背景音乐可以播放');
        // 再次尝试播放
        tryPlayBGM();
    });
    
    bgm.addEventListener('error', (e) => {
        console.warn('背景音乐加载失败:', e);
    });
    
    // 尝试加载音频
    try {
        bgm.load();
    } catch (err) {
        console.warn('背景音乐load()失败:', err);
    }
}

/**
 * 尝试播放背景音乐
 * 处理浏览器自动播放策略（Chrome/Firefox需要用户交互）
 */
function tryPlayBGM() {
    if (bgm && bgm.readyState >= 2) { // HAVE_CURRENT_DATA 或更高
        const playPromise = bgm.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('背景音乐播放成功');
            }).catch(err => {
                // 静默失败，等待用户交互
                console.log('背景音乐等待用户交互后播放');
            });
        }
    }
}

// ========== 点击检测和说明面板 ==========
// 点击音效
let clickSound = null;

// 初始化点击音效
function initClickSound() {
    clickSound = new Audio('../Web/play.MP3');
    clickSound.preload = 'auto';
    clickSound.volume = 0.7;
    
    clickSound.addEventListener('error', (e) => {
        console.warn('点击音效加载失败:', e);
    });
    
    try {
        clickSound.load();
    } catch (err) {
        console.warn('点击音效load()失败:', err);
    }
}

// 创建说明面板的通用函数
function createInfoPanel(title, content, panelId) {
    // 移除已存在的面板
    const existingPanel = document.getElementById(panelId);
    if (existingPanel) {
        existingPanel.remove();
    }
    
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(30, 30, 30, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(102, 126, 234, 0.5);
        min-width: 400px;
        max-width: 600px;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // 添加淡入动画（如果还没有）
    if (!document.getElementById('fadeIn-animation')) {
        const style = document.createElement('style');
        style.id = 'fadeIn-animation';
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #667eea; margin: 0; font-size: 24px; font-weight: 600;">${title}</h2>
            <button class="close-info-btn" style="
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: #fff;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                line-height: 1;
                transition: all 0.3s ease;
            ">×</button>
        </div>
        <p style="color: #e0e0e0; line-height: 1.8; font-size: 16px; margin: 0;">
            ${content}
        </p>
    `;
    
    document.body.appendChild(panel);
    
    // 关闭按钮事件
    const closeBtn = panel.querySelector('.close-info-btn');
    closeBtn.addEventListener('click', () => {
        panel.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            panel.remove();
        }, 300);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 107, 107, 0.3)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    // 点击面板外部关闭
    panel.addEventListener('click', (e) => {
        if (e.target === panel) {
            panel.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                panel.remove();
            }, 300);
        }
    });
    
    // 添加淡出动画（如果还没有）
    if (!document.getElementById('fadeOut-animation')) {
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.id = 'fadeOut-animation';
        fadeOutStyle.textContent = `
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
            }
        `;
        document.head.appendChild(fadeOutStyle);
    }
}

// 创建流水线模型说明面板
function createModelInfoPanel() {
    createInfoPanel(
        '流水线工作区域',
        '整个系统的核心，包含自动化传送带和装配工作站。确保装配流程的完整性和精确控制，适合需要精确计时的工业生产环境。',
        'model-info-panel'
    );
}

// 创建指示灯说明面板
function createIndicatorInfoPanel() {
    createInfoPanel(
        '智能监控中心',
        '三色指示灯系统（绿、黄、蓝）提供实时的设备状态反馈。绿色表示正常运行，黄色提示需要注意，蓝色显示系统状态，为操作人员提供直观的状态监控界面。',
        'indicator-info-panel'
    );
}

// 创建安全区域说明面板
function createSafetyZoneInfoPanel() {
    createInfoPanel(
        '安全控制区域',
        '绿色安全区域配合黄黑警戒线，构成了完整的安全防护体系。这个设计遵循工业安全标准，确保操作人员在安全范围内工作，警戒线的醒目颜色有效防止意外进入危险区域。',
        'safety-zone-info-panel'
    );
}

// 创建射线检测器
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 点击事件处理
function onMouseClick(event) {
    if (!modelLoaded) return;
    
    // 计算鼠标位置（归一化到-1到1）
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // 更新射线
    raycaster.setFromCamera(mouse, camera);
    
    // 先检测是否点击到指示灯（优先级最高）
    if (indicatorLights && indicatorLights.length > 0) {
        for (let indicator of indicatorLights) {
            if (indicator.mesh) {
                const intersects = raycaster.intersectObject(indicator.mesh, false);
                if (intersects.length > 0) {
                    // 播放音效
                    if (clickSound) {
                        clickSound.currentTime = 0;
                        clickSound.play().catch(err => {
                            console.warn('点击音效播放失败:', err);
                        });
                    }
                    // 显示指示灯说明面板
                    createIndicatorInfoPanel();
                    console.log('点击了状态指示灯');
                    return; // 点击到指示灯，直接返回
                }
            }
        }
    }
    
    // 检测是否点击到安全区域或警戒线（优先级第二）
    // 先检测警戒线（因为警戒线在安全区域上方）
    if (sceneElements.warningTape && sceneElements.warningTape.length > 0) {
        for (let tape of sceneElements.warningTape) {
            if (tape) {
                const intersects = raycaster.intersectObject(tape, false);
                if (intersects.length > 0) {
                    // 播放音效
                    if (clickSound) {
                        clickSound.currentTime = 0;
                        clickSound.play().catch(err => {
                            console.warn('点击音效播放失败:', err);
                        });
                    }
                    // 显示安全区域说明面板
                    createSafetyZoneInfoPanel();
                    console.log('点击了黄黑警戒线');
                    return; // 点击到警戒线，直接返回
                }
            }
        }
    }
    
    // 检测是否点击到绿色安全区域
    if (sceneElements.safetyZone) {
        const intersects = raycaster.intersectObject(sceneElements.safetyZone, false);
        if (intersects.length > 0) {
            // 播放音效
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(err => {
                    console.warn('点击音效播放失败:', err);
                });
            }
            // 显示安全区域说明面板
            createSafetyZoneInfoPanel();
            console.log('点击了绿色安全区域');
            return; // 点击到安全区域，直接返回
        }
    }
    
    // 最后检测是否点击到模型
    if (model) {
        const intersects = raycaster.intersectObject(model, true);
        
        if (intersects.length > 0) {
            // 播放音效
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(err => {
                    console.warn('点击音效播放失败:', err);
                });
            }
            
            // 显示模型说明面板
            createModelInfoPanel();
            
            console.log('点击了流水线模型');
        }
    }
}

// 添加点击事件监听
renderer.domElement.addEventListener('click', onMouseClick);

// 初始化环境并启动动画
try {
    createBasicFactoryEnvironment();
    animate();
    initBGM(); // 初始化背景音乐
    initClickSound(); // 初始化点击音效
    console.log('Three.js初始化完成');
} catch (error) {
    console.error('初始化错误:', error);
    showError('初始化失败: ' + error.message);
}