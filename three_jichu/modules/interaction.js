/**
 * 交互模块
 * 负责处理用户交互，包括点击检测、说明面板等
 * 兼容Chrome/Firefox主流浏览器
 * @module interaction
 */

import * as THREE from 'three';
import { playClickSound } from './audio.js';

/**
 * 创建说明面板的通用函数
 * @param {string} title - 面板标题
 * @param {string} content - 面板内容
 * @param {string} panelId - 面板ID
 */
export function createInfoPanel(title, content, panelId) {
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

/**
 * 创建流水线模型说明面板
 */
export function createModelInfoPanel() {
    createInfoPanel(
        '流水线工作区域',
        '整个系统的核心，包含自动化传送带和装配工作站。确保装配流程的完整性和精确控制，适合需要精确计时的工业生产环境。',
        'model-info-panel'
    );
}

/**
 * 创建指示灯说明面板
 */
export function createIndicatorInfoPanel() {
    createInfoPanel(
        '智能监控中心',
        '三色指示灯系统（绿、黄、蓝）提供实时的设备状态反馈。绿色表示正常运行，黄色提示需要注意，蓝色显示系统状态，为操作人员提供直观的状态监控界面。',
        'indicator-info-panel'
    );
}

/**
 * 创建安全区域说明面板
 */
export function createSafetyZoneInfoPanel() {
    createInfoPanel(
        '安全控制区域',
        '绿色安全区域配合黄黑警戒线，构成了完整的安全防护体系。这个设计遵循工业安全标准，确保操作人员在安全范围内工作，警戒线的醒目颜色有效防止意外进入危险区域。',
        'safety-zone-info-panel'
    );
}

/**
 * 初始化点击检测系统
 * 创建射线检测器并设置点击事件监听
 * @param {THREE.WebGLRenderer} renderer - Three.js渲染器
 * @param {THREE.Camera} camera - Three.js相机
 * @param {Object} objects - 可点击对象集合（模型、指示灯、安全区域等）
 * @returns {Function} 返回点击事件处理函数
 */
export function initClickDetection(renderer, camera, objects) {
    // 创建射线检测器
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    /**
     * 点击事件处理函数
     * @param {MouseEvent} event - 鼠标点击事件
     */
    function onMouseClick(event) {
        if (!objects.modelLoaded) return;
        
        // 计算鼠标位置（归一化到-1到1）
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // 更新射线
        raycaster.setFromCamera(mouse, camera);
        
        // 先检测是否点击到指示灯（优先级最高）
        if (objects.indicatorLights && objects.indicatorLights.length > 0) {
            for (let indicator of objects.indicatorLights) {
                if (indicator.mesh) {
                    const intersects = raycaster.intersectObject(indicator.mesh, false);
                    if (intersects.length > 0) {
                        playClickSound();
                        createIndicatorInfoPanel();
                        console.log('点击了状态指示灯');
                        return; // 点击到指示灯，直接返回
                    }
                }
            }
        }
        
        // 检测是否点击到安全区域或警戒线（优先级第二）
        // 先检测警戒线（因为警戒线在安全区域上方）
        if (objects.warningTape && objects.warningTape.length > 0) {
            for (let tape of objects.warningTape) {
                if (tape) {
                    const intersects = raycaster.intersectObject(tape, false);
                    if (intersects.length > 0) {
                        playClickSound();
                        createSafetyZoneInfoPanel();
                        console.log('点击了黄黑警戒线');
                        return; // 点击到警戒线，直接返回
                    }
                }
            }
        }
        
        // 检测是否点击到绿色安全区域
        if (objects.safetyZone) {
            const intersects = raycaster.intersectObject(objects.safetyZone, false);
            if (intersects.length > 0) {
                playClickSound();
                createSafetyZoneInfoPanel();
                console.log('点击了绿色安全区域');
                return; // 点击到安全区域，直接返回
            }
        }
        
        // 最后检测是否点击到模型
        if (objects.model) {
            const intersects = raycaster.intersectObject(objects.model, true);
            
            if (intersects.length > 0) {
                playClickSound();
                createModelInfoPanel();
                console.log('点击了流水线模型');
            }
        }
    }
    
    // 添加点击事件监听
    renderer.domElement.addEventListener('click', onMouseClick);
    
    return onMouseClick;
}

