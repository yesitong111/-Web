/**
 * 音频管理模块
 * 负责背景音乐、点击音效和动画音效的管理
 * 兼容Chrome/Firefox主流浏览器
 * @module audio
 */

/**
 * 背景音乐对象
 * @type {HTMLAudioElement|null}
 */
let bgm = null;

/**
 * 点击音效对象
 * @type {HTMLAudioElement|null}
 */
let clickSound = null;

/**
 * 动画音效对象
 * @type {HTMLAudioElement|null}
 */
let animationSound = null;

/**
 * 音频加载状态
 * @type {boolean}
 */
let audioLoaded = {
    bgm: false,
    click: false,
    animation: false
};

/**
 * 初始化背景音乐
 * 加载bgm.MP3并设置为循环播放
 */
export function initBGM() {
    bgm = new Audio('../Web/bgm.MP3');
    bgm.loop = true; // 循环播放
    bgm.volume = 0.5; // 设置音量（0-1之间）
    bgm.preload = 'auto';
    
    bgm.addEventListener('loadeddata', () => {
        audioLoaded.bgm = true;
        console.log('背景音乐加载完成');
        tryPlayBGM();
    });
    
    bgm.addEventListener('canplaythrough', () => {
        audioLoaded.bgm = true;
        console.log('背景音乐可以播放');
        tryPlayBGM();
    });
    
    bgm.addEventListener('error', (e) => {
        console.warn('背景音乐加载失败:', e);
        audioLoaded.bgm = false;
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
 * 处理浏览器自动播放策略，需要用户交互才能播放
 */
export function tryPlayBGM() {
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

/**
 * 初始化点击音效
 * 加载play.MP3用于点击交互
 */
export function initClickSound() {
    clickSound = new Audio('../Web/play.MP3');
    clickSound.preload = 'auto';
    clickSound.volume = 0.7;
    
    clickSound.addEventListener('error', (e) => {
        console.warn('点击音效加载失败:', e);
        audioLoaded.click = false;
    });
    
    clickSound.addEventListener('canplaythrough', () => {
        audioLoaded.click = true;
        console.log('点击音效加载完成');
    });
    
    try {
        clickSound.load();
    } catch (err) {
        console.warn('点击音效load()失败:', err);
    }
}

/**
 * 播放点击音效
 * 在用户交互时播放，符合浏览器策略
 */
export function playClickSound() {
    if (clickSound && audioLoaded.click) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => {
            console.warn('点击音效播放失败:', err);
        });
    }
}

/**
 * 初始化动画音效
 * 加载voice.MP3用于动画播放
 */
export function initAnimationSound() {
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
        animationSound = new Audio(path);
        animationSound.preload = 'auto';
        
        animationSound.addEventListener('loadeddata', () => {
            audioLoaded.animation = true;
            console.log(`音频加载成功: ${path}`);
        });
        
        animationSound.addEventListener('canplaythrough', () => {
            audioLoaded.animation = true;
            console.log(`音频可以播放: ${path}`);
        });
        
        animationSound.addEventListener('error', (e) => {
            console.warn(`音频加载失败 (${path}):`, e);
            audioLoaded.animation = false;
            animationSound = null;
            
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
            animationSound.load();
        } catch (err) {
            console.warn(`音频load()失败 (${path}):`, err);
        }
    }
    
    // 开始尝试加载
    tryLoadAudio(audioPaths[currentPathIndex]);
}

/**
 * 播放动画音效
 * 在动画开始时播放
 */
export function playAnimationSound() {
    if (animationSound) {
        if (audioLoaded.animation) {
            animationSound.currentTime = 0; // 从头开始播放
            const playPromise = animationSound.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('音频播放成功');
                }).catch(err => {
                    console.warn('音频播放失败（可能需要用户交互）:', err);
                    // 如果播放失败，尝试重新加载
                    if (animationSound.readyState === 0) {
                        animationSound.load();
                    }
                });
            }
        } else {
            // 如果音频未加载完成，尝试重新加载
            console.log('音频未加载完成，尝试重新加载...');
            animationSound.load();
            animationSound.addEventListener('canplaythrough', () => {
                audioLoaded.animation = true;
                animationSound.currentTime = 0;
                animationSound.play().catch(err => {
                    console.warn('音频播放失败:', err);
                });
            }, { once: true });
        }
    } else {
        console.warn('音频对象不存在，请检查voice.MP3文件路径');
    }
}

/**
 * 暂停动画音效
 */
export function pauseAnimationSound() {
    if (animationSound && !animationSound.paused) {
        animationSound.pause();
    }
}

/**
 * 停止并重置动画音效
 */
export function stopAnimationSound() {
    if (animationSound) {
        animationSound.pause();
        animationSound.currentTime = 0; // 重置到开头
    }
}

