/**
 * 光照系统模块
 * 负责创建和管理场景中的各种光源
 * 包括环境光、方向光、聚光灯、点光源等
 * 兼容Chrome/Firefox主流浏览器
 * @module lighting
 */

import * as THREE from 'three';

/**
 * 创建多层光照系统
 * 模拟真实工厂环境的光照效果
 * @param {THREE.Scene} scene - Three.js场景对象
 * @returns {Object} 返回光源对象集合，包含各种光源的引用
 */
export function createLightingSystem(scene) {
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
    const spotLights = [];
    const indicatorLights = [];
    
    return {
        ambientLight,
        directionalLight,
        directionalLight2,
        directionalLight3,
        spotLights,
        indicatorLights
    };
}

/**
 * 创建车间顶灯
 * 使用聚光灯模拟车间顶灯效果
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {Array} lightPositions - 灯光位置数组
 * @param {number} wallHeight - 墙体高度
 * @param {number} floorWidth - 地面宽度
 * @param {number} floorDepth - 地面深度
 * @param {THREE.MeshStandardMaterial} lightFixtureMaterial - 灯罩材质
 * @param {Array} spotLights - 聚光灯数组引用
 * @returns {Array} 返回照明设备对象数组
 */
export function createWorkshopLights(scene, lightPositions, wallHeight, floorWidth, floorDepth, lightFixtureMaterial, spotLights) {
    const lights = [];
    const lightDistance = Math.max(floorWidth, floorDepth) * 0.6;
    
    lightPositions.forEach(pos => {
        // 灯罩（Box）- 更真实的车间顶灯外观
        const fixtureGeometry = new THREE.BoxGeometry(2.5, 0.4, 1.2);
        const fixture = new THREE.Mesh(fixtureGeometry, lightFixtureMaterial);
        fixture.position.set(pos[0], pos[1], pos[2]);
        fixture.castShadow = true;
        fixture.receiveShadow = true;
        scene.add(fixture);
        
        // 添加聚光灯（模拟车间顶灯，更贴合实际光照效果）
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
        
        lights.push({ mesh: fixture, spotLight: spotLight, pointLight: pointLight });
    });
    
    return lights;
}

/**
 * 创建设备指示灯
 * 创建三色指示灯系统（绿、黄、蓝）
 * @param {THREE.Scene} scene - Three.js场景对象
 * @param {Array} indicatorPositions - 指示灯位置数组
 * @param {Array} indicatorColors - 指示灯颜色数组
 * @param {Array} indicatorLights - 指示灯数组引用
 * @returns {Array} 返回指示灯对象数组
 */
export function createIndicatorLights(scene, indicatorPositions, indicatorColors, indicatorLights) {
    const indicators = [];
    
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
        const indicatorLight = new THREE.PointLight(
            indicatorColors[index], 
            0.8,    // 降低强度，避免过亮
            3.0     // 较小的范围，只影响指示灯周围的小区域
        );
        indicatorLight.position.set(pos[0], pos[1], pos[2]);
        indicatorLight.castShadow = false;
        indicatorLight.decay = 2; // 更快的衰减，使光照更集中
        scene.add(indicatorLight);
        
        indicators.push({ mesh: indicator, light: indicatorLight });
        indicatorLights.push({ mesh: indicator, light: indicatorLight });
    });
    
    return indicators;
}

