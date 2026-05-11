/**
 * 纹理创建模块
 * 负责创建各种程序化纹理，包括地面瓷砖、金属纹理、墙面标识等
 * 兼容Chrome/Firefox主流浏览器
 * @module textures
 */

import * as THREE from 'three';

/**
 * 创建地面瓷砖纹理
 * 生成带接缝的瓷砖网格纹理，支持重复平铺
 * @returns {THREE.CanvasTexture} 瓷砖纹理对象
 */
export function createFloorTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // 基础灰色背景
    ctx.fillStyle = '#7a7a7a';
    ctx.fillRect(0, 0, 512, 512);
    
    const tileSize = 64;
    const groutWidth = 2;
    
    // 绘制瓷砖网格
    for (let y = 0; y < 512; y += tileSize) {
        for (let x = 0; x < 512; x += tileSize) {
            // 瓷砖主体（带轻微变化，增加真实感）
            const variation = Math.random() * 0.1;
            ctx.fillStyle = `rgba(${122 + variation * 20}, ${122 + variation * 20}, ${122 + variation * 20}, 1)`;
            ctx.fillRect(x + groutWidth, y + groutWidth, tileSize - groutWidth * 2, tileSize - groutWidth * 2);
            
            // 添加瓷砖纹理细节（模拟磨损和污渍）
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            for (let i = 0; i < 3; i++) {
                const px = x + groutWidth + Math.random() * (tileSize - groutWidth * 2);
                const py = y + groutWidth + Math.random() * (tileSize - groutWidth * 2);
                ctx.fillRect(px, py, 2, 2);
            }
        }
    }
    
    // 绘制接缝线（模拟瓷砖之间的缝隙）
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
    texture.repeat.set(8, 8);  // 设置纹理重复次数
    texture.needsUpdate = true;
    
    return texture;
}

/**
 * 创建金属纹理
 * 生成带有划痕、磨损和高光效果的金属质感纹理
 * @returns {THREE.CanvasTexture} 金属纹理对象
 */
export function createMetalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // 基础金属色渐变
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
    
    // 添加高光点（模拟金属反光）
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

/**
 * 创建墙面标识纹理
 * 生成带有安全标识、警告标识和编号的墙面纹理
 * @returns {THREE.CanvasTexture} 墙面标识纹理对象
 */
export function createWallLabelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // 基础墙面颜色（浅灰白色）
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, 512, 512);
    
    // 添加墙面纹理（轻微的不规则，增加真实感）
    for (let y = 0; y < 512; y += 4) {
        const variation = Math.sin(y / 20) * 2;
        ctx.fillStyle = `rgba(${245 + variation}, ${245 + variation}, ${245 + variation}, 1)`;
        ctx.fillRect(0, y, 512, 2);
    }
    
    // 添加安全标识和警告标识
    // 安全出口标识（绿色）
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(50, 50, 80, 80);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('EXIT', 60, 100);
    
    // 警告标识（黄色）
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    ctx.moveTo(400, 50);
    ctx.lineTo(450, 50);
    ctx.lineTo(425, 100);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('!', 415, 85);
    
    // 添加编号标识
    ctx.fillStyle = '#333333';
    ctx.font = '16px Arial';
    ctx.fillText('A-01', 50, 200);
    ctx.fillText('A-02', 50, 250);
    
    // 添加网格线（轻微，增加工业感）
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 512; i += 64) {
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
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;
    
    return texture;
}

/**
 * 创建黄黑警戒线纹理
 * 生成黄黑相间的条纹纹理，用于安全警戒线
 * @returns {THREE.CanvasTexture} 警戒线纹理对象
 */
export function createWarningTapeTexture() {
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
