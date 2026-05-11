/**
 * 后期处理模块
 * 负责创建和管理后期处理效果，如辉光、色调映射等
 * 兼容Chrome/Firefox主流浏览器
 * @module postprocessing
 */

import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

/**
 * 创建后期处理合成器
 * 包含渲染通道、辉光效果和输出通道
 * @param {THREE.WebGLRenderer} renderer - Three.js渲染器
 * @param {THREE.Scene} scene - Three.js场景
 * @param {THREE.Camera} camera - Three.js相机
 * @returns {EffectComposer} 返回效果合成器对象
 */
export function createPostProcessing(renderer, scene, camera) {
    // 设置渲染器色调映射
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // 使用ACES色调映射，避免过曝
    renderer.toneMappingExposure = 0.9; // 曝光度（稍微降低，避免过曝）
    
    // 创建效果合成器
    const composer = new EffectComposer(renderer);
    
    // 渲染通道
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    // 辉光效果（Bloom）- 用于设备指示灯和高光区域
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.2,    // strength - 辉光强度（适中，不会过强）
        0.4,    // radius - 辉光半径
        0.9     // threshold - 辉光阈值（只有亮度超过此值的区域才会产生辉光）
    );
    composer.addPass(bloomPass);
    
    // 输出通道（色调映射和颜色空间转换）
    const outputPass = new OutputPass();
    outputPass.toneMapping = THREE.ACESFilmicToneMapping; // ACES色调映射，避免过曝
    outputPass.toneMappingExposure = 0.9; // 稍微降低曝光，避免过亮
    composer.addPass(outputPass);
    
    return composer;
}

/**
 * 更新后期处理合成器尺寸
 * 在窗口大小改变时调用
 * @param {EffectComposer} composer - 效果合成器对象
 * @param {number} width - 新的宽度
 * @param {number} height - 新的高度
 */
export function resizePostProcessing(composer, width, height) {
    composer.setSize(width, height);
}

