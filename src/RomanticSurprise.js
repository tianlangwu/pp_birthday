import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllImages } from "./methods";

const RomanticSurprise = () => {
  const navigate = useNavigate();
  const [surpriseMode, setSurpriseMode] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [hideUI, setHideUI] = useState(false);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  useEffect(() => {
    // 创建音频对象
    const audio = new Audio("/pp_birthday/audio/世间始终你最好.mp3"); // 你需要将音乐文件放在这个路径
    audio.loop = true; // 循环播放
    audio.volume = 0.7; // 设置音量
    setAudioRef(audio);

    // 组件卸载时清理
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // 2. 修改 closeSurprise 函数，改名为 toggleUI
  const toggleUI = () => {
    // 切换UI显示状态
    setHideUI(!hideUI);

    // 动态修改照片墙的样式
    const photoWall = document.querySelector(".photo-wall");
    const photoOverlay = document.querySelector(".photo-overlay");

    if (photoWall && photoOverlay) {
      if (!hideUI) {
        // 当前要隐藏UI时
        photoWall.style.zIndex = "10000";
        photoOverlay.style.backdropFilter = "none";
      } else {
        // 当前要显示UI时，恢复原样
        photoWall.style.zIndex = "-1";
        photoOverlay.style.backdropFilter = "blur(2px)";
      }
    }
  };

  // 模拟体验模式
  const isExperienceMode = true;

  // 模拟照片数组（实际使用时替换为真实照片URL）
  const [photos, setPhotos] = useState([]);

  // 3. 添加初始化照片的 useEffect
  useEffect(() => {
    const initPhotos = async () => {
      const allImages = await getAllImages();
      if (allImages.length > 0) {
        // 随机打乱数组
        // const shuffledImages = [...allImages].sort(() => Math.random() - 0.5);
        setPhotos(allImages);
      } else {
        // 如果没找到图片，使用默认图片
        setPhotos([
          "https://picsum.photos/400/600?random=1",
          "https://picsum.photos/400/600?random=2",
          "https://picsum.photos/400/600?random=3",
        ]);
      }
    };

    initPhotos();
  }, []);

  useEffect(() => {
    console.log("photos:", photos);
  }, [photos]);

  // useEffect(() => {
  //   if (photos.length === 0) return;

  //   const interval = setInterval(() => {
  //     setCurrentPhotoIndex((prev) => {
  //       // 顺序切换：从 0 到 photos.length - 1，循环播放
  //       return (prev + 1) % photos.length;
  //     });
  //   }, 3000); // 每 3 秒切换一张

  //   return () => clearInterval(interval);
  // }, [photos.length]);

  useEffect(() => {
    if (photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => {
        // 随机选择下一张图片（确保不是当前图片）
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * photos.length);
        } while (nextIndex === prev && photos.length > 1);

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [photos.length]);

  // 3. 修改 triggerSurprise 函数，添加音乐播放
  const triggerSurprise = () => {
    if (!surpriseMode) return;

    setShowSurprise(true);
    setAnimationStage(1);

    // 播放音乐
    if (audioRef) {
      audioRef
        .play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((error) => {
          console.log("音频播放失败:", error);
        });
    }

    // 动画序列
    setTimeout(() => setAnimationStage(2), 2000);
    setTimeout(() => setAnimationStage(3), 4000);
    setTimeout(() => setAnimationStage(4), 5500);
    setTimeout(() => setAnimationStage(5), 7000);
  };

  const goBackHome = () => {
    setShowSurprise(false);
    setAnimationStage(0);

    // 停止音乐
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
      setIsMusicPlaying(false);
    }

    navigate("/");
  };

  // 5. 新增静音切换函数
  const toggleMute = () => {
    if (audioRef) {
      if (isMusicPlaying) {
        audioRef.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef
          .play()
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch((error) => {
            console.log("音频播放失败:", error);
          });
      }
    }
  };
  return (
    <div className="main-container">
      {/* 照片墙背景 */}
      <div className="photo-wall">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`photo-item ${
              index === currentPhotoIndex ? "active" : ""
            }`}
            style={{
              backgroundImage: `url(${photo})`,
            }}
          />
        ))}
        <div className="photo-overlay" onClick={toggleUI} />
      </div>

      {/* 主要内容 */}
      <div className="content-wrapper">
        {/* 返回首页按钮 */}
        <div className="header-buttons">
          <button className="home-button" onClick={goBackHome}>
            🏠 返回首页
          </button>
        </div>

        {/* 控制面板 */}
        {isExperienceMode && (
          <div className="control-panel">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={surpriseMode}
                onChange={(e) => setSurpriseMode(e.target.checked)}
              />
              <div className="slider">
                <div className="slider-thumb" />
              </div>
              <span className="toggle-label">💕 限定惊喜模式</span>
            </label>

            {surpriseMode && (
              <div className="surprise-hint">
                ✨ 惊喜模式已开启！转动轮盘将触发特别的惊喜...
              </div>
            )}
          </div>
        )}

        {/* 模拟轮盘按钮 */}
        <div className="wheel-container">
          <button
            onClick={triggerSurprise}
            disabled={!surpriseMode}
            className={`wheel-button ${surpriseMode ? "active" : "disabled"}`}
          >
            🎰 转动轮盘
          </button>
        </div>
      </div>

      {/* 惊喜动画覆盖层 */}
      {showSurprise && (
        <div className="surprise-overlay">
          {/* 照片墙背景 - 惊喜页面也有 */}
          <div className="photo-wall">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`photo-item ${
                  index === currentPhotoIndex ? "active" : ""
                }`}
                style={{
                  backgroundImage: `url(${photo})`,
                }}
              />
            ))}
            <div className="photo-overlay surprise-photo-overlay" />
          </div>

          <button className="mute-button" onClick={toggleMute}>
            {isMusicPlaying ? "🔊" : "🔇"}
          </button>

          {/* 返回首页按钮（在惊喜界面） */}
          <button className="home-button-surprise" onClick={goBackHome}>
            🏠 返回首页
          </button>

          {/* 星空背景 */}
          <div className="starry-sky">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* 航线显示 */}
          {animationStage >= 3 && (
            <div className="flight-route">
              <div className="city-label wuhan">多伦多</div>
              <div className="flight-path" />
              <div className="city-label toronto">武汉</div>
            </div>
          )}

          {/* 飞机动画 */}
          {animationStage >= 1 && animationStage <= 3 && (
            <div className={`airplane stage-${animationStage}`}>✈️</div>
          )}

          {/* 卡片出现 */}
          {animationStage >= 4 && (
            <div className="surprise-card">
              <div className="gift-icon">🎁</div>
              <h2 className="card-title">召唤小菌</h2>
              <p className="card-text">
                恭喜获得限定惊喜！此卡在获得时将自动使用！
              </p>
            </div>
          )}

          {/* 最终惊喜文字 */}
          {animationStage >= 5 && (
            <div className="final-surprise">
              <h1 className="surprise-title">🎉 惊喜！我回来了！ 🎉</h1>
              <p className="surprise-subtitle">
                想你了，所以偷偷多伦多飞回来找你 💕
              </p>

              <button className="return-button" onClick={toggleUI}>
                💕 显示照片墙
              </button>

              {/* 飘落的爱心 */}
              <div className="falling-hearts">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="heart"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${3 + Math.random() * 2}s`,
                    }}
                  >
                    💕
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .main-container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .mute-button {
          z-index: 9999;
          position: absolute;
          top: 5vw;
          right: 5vw;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 6vw;
          width: 12vw;
          height: 10vw;
          border-radius: 50%;
          cursor: pointer;
          backdrop-filter: blur(10px);
          touch-action: manipulation;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        /* 照片墙背景 */
        .photo-wall {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .photo-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: contain; /* 从 cover 改为 contain */
          background-position: center;
          background-repeat: no-repeat; /* 添加这行防止重复 */
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
        .photo-item.active {
          opacity: 1;
        }

        .photo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(2px);
        }

        .surprise-photo-overlay {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(3px);
        }

        /* 主要内容 */
        .content-wrapper {
          position: relative;
          z-index: 1;
          padding: 4vw;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header-buttons {
          margin-bottom: 5vw;
        }

        .home-button {
          padding: 3vw 6vw;
          font-size: 4vw;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 6vw;
          cursor: pointer;
          box-shadow: 0 2vw 4vw rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          touch-action: manipulation;
        }

        .home-button:active {
          transform: translateY(1vw);
          box-shadow: 0 1vw 2vw rgba(102, 126, 234, 0.4);
        }

        /* 控制面板 */
        .control-panel {
          background: linear-gradient(135deg, #ff9a9e, #fecfef);
          padding: 5vw;
          border-radius: 4vw;
          margin-bottom: 5vw;
          box-shadow: 0 2vw 8vw rgba(255, 154, 158, 0.3);
        }

        .toggle-switch {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .toggle-switch input {
          display: none;
        }

        .slider {
          width: 12vw;
          height: 6vw;
          background: #ddd;
          border-radius: 6vw;
          position: relative;
          transition: all 0.3s ease;
          margin-right: 4vw;
        }

        .toggle-switch input:checked + .slider {
          background: #ff6b6b;
        }

        .slider-thumb {
          width: 5vw;
          height: 5vw;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 0.5vw;
          left: 0.5vw;
          transition: all 0.3s ease;
          box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.2);
        }

        .toggle-switch input:checked + .slider .slider-thumb {
          left: 6.5vw;
        }

        .toggle-label {
          font-size: 4.5vw;
          font-weight: 600;
          color: #333;
          text-shadow: 0 0.5vw 1vw rgba(255, 255, 255, 0.8);
        }

        .surprise-hint {
          margin-top: 4vw;
          padding: 3vw;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 2vw;
          font-size: 3.5vw;
          color: #666;
          animation: pulse 2s infinite;
        }

        /* 轮盘容器 */
        .wheel-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .wheel-button {
          padding: 4vw 8vw;
          font-size: 5vw;
          border: none;
          border-radius: 6vw;
          cursor: pointer;
          transition: all 0.3s ease;
          touch-action: manipulation;
        }

        .wheel-button.active {
          background: linear-gradient(45deg, #ff6b6b, #ffa500);
          color: white;
          box-shadow: 0 2vw 4vw rgba(255, 107, 107, 0.4);
          transform: scale(1);
        }

        .wheel-button.active:active {
          transform: scale(0.95);
        }

        .wheel-button.disabled {
          background: #ccc;
          color: #999;
          cursor: not-allowed;
          transform: scale(0.95);
        }

        /* 惊喜覆盖层 */
        .surprise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          animation: fadeIn 1s ease-in;
        }

        .close-button {
          z-index: 9999;
          position: absolute;
          top: 5vw;
          right: 5vw;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 6vw;
          width: 10vw;
          height: 10vw;
          border-radius: 50%;
          cursor: pointer;
          touch-action: manipulation;
        }

        .home-button-surprise {
          z-index: 9999;
          position: absolute;
          top: 5vw;
          left: 5vw;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 3.5vw;
          padding: 2vw 4vw;
          border-radius: 5vw;
          cursor: pointer;
          backdrop-filter: blur(10px);
          touch-action: manipulation;
        }

        /* 星空背景 */
        .starry-sky {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.3;
        }

        .star {
          position: absolute;
          width: 0.5vw;
          height: 0.5vw;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s infinite;
        }

        /* 航线显示 - 调整位置向上移动 */
        .flight-route {
          position: absolute;
          top: 15%; /* 从25%改为15% */
          left: 10%;
          right: 10%;
          height: 8vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          opacity: 0;
          animation: routeAppear 2s ease-in forwards;
        }

        .city-label {
          color: white;
          font-size: 4vw;
          font-weight: bold;
          text-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.5);
          padding: 2vw 3vw;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2vw;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          white-space: nowrap;
        }

        .wuhan {
          /* 武汉在左边 */
        }

        .toronto {
          /* 多伦多在右边 */
        }

        .flight-path {
          flex: 1;
          height: 0.8vw;
          background: linear-gradient(90deg, #ff6b6b, #ffa500);
          margin: 0 4vw;
          border-radius: 1vw;
          position: relative;
          animation: pathGlow 2s infinite alternate;
        }

        .flight-path::before {
          content: "";
          position: absolute;
          top: 50%;
          right: -2vw;
          width: 0;
          height: 0;
          border-left: 3vw solid #ffa500;
          border-top: 1.5vw solid transparent;
          border-bottom: 1.5vw solid transparent;
          transform: translateY(-50%);
        }

        /* 飞机动画 - 调整位置 */
        .airplane {
          position: absolute;
          font-size: 8vw;
          z-index: 10;
        }

        .airplane.stage-1 {
          animation: flyAcross 2s ease-in-out;
        }

        .airplane.stage-2 {
          animation: flyCircle 2s ease-in-out;
        }

        .airplane.stage-3,
        .airplane.stage-4,
        .airplane.stage-5 {
          animation: landing 1.5s ease-out forwards;
          top: 30%; /* 从40%改为30% */
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* 惊喜卡片 - 调整位置 */
        .surprise-card {
          background: linear-gradient(145deg, #ff9a9e, #fecfef);
          padding: 8vw;
          border-radius: 5vw;
          text-align: center;
          box-shadow: 0 5vw 10vw rgba(0, 0, 0, 0.3);
          animation: cardAppear 1s ease-out;
          border: 0.8vw solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          max-width: 80vw;
          position: absolute;
          top: 45%; /* 添加绝对定位，让卡片在上半部分 */
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .gift-icon {
          font-size: 15vw;
          margin-bottom: 5vw;
          animation: bounce 2s infinite;
        }

        .card-title {
          color: #333;
          margin-bottom: 4vw;
          font-size: 7vw;
          text-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.1);
        }

        .card-text {
          color: #666;
          font-size: 4vw;
          line-height: 1.6;
          margin: 0;
        }

        /* 最终惊喜 - 调整位置向下移动 */
        .final-surprise {
          position: absolute;
          bottom: 10%; /* 从20%改为10% */
          left: 5%;
          right: 5%;
          text-align: center;
          animation: finalSurprise 2s ease-out;
        }

        .surprise-title {
          color: white;
          font-size: 8vw;
          text-shadow: 0 0 5vw rgba(255, 255, 255, 0.5);
          margin-bottom: 4vw;
          animation: glow 2s infinite alternate;
        }

        .surprise-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 4.5vw;
          text-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.3);
          margin-bottom: 5vw;
          line-height: 1.6;
        }

        .return-button {
          padding: 3vw 6vw;
          font-size: 4vw;
          background: linear-gradient(45deg, #ff6b6b, #ffa500);
          color: white;
          border: none;
          border-radius: 6vw;
          cursor: pointer;
          box-shadow: 0 2vw 4vw rgba(255, 107, 107, 0.4);
          transition: all 0.3s ease;
          animation: buttonGlow 2s infinite alternate;
          touch-action: manipulation;
        }

        .return-button:active {
          transform: scale(0.95);
        }

        /* 飘落的爱心 */
        .falling-hearts {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .heart {
          position: absolute;
          font-size: 5vw;
          color: #ff6b6b;
          animation: heartFall 3s infinite linear;
          top: -10vw;
        }

        /* 动画定义 */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes flyAcross {
          0% {
            transform: translateX(-100vw) translateY(10vw) rotate(0deg);
          }
          100% {
            transform: translateX(50vw) translateY(-10vw) rotate(15deg);
          }
        }

        @keyframes flyCircle {
          0% {
            transform: translateX(50vw) translateY(-10vw) rotate(15deg);
          }
          25% {
            transform: translateX(60vw) translateY(0vw) rotate(90deg);
          }
          50% {
            transform: translateX(50vw) translateY(10vw) rotate(180deg);
          }
          75% {
            transform: translateX(40vw) translateY(0vw) rotate(270deg);
          }
          100% {
            transform: translateX(50vw) translateY(-5vw) rotate(360deg);
          }
        }

        @keyframes landing {
          0% {
            transform: translateX(50vw) translateY(-5vw) rotate(360deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }

        @keyframes cardAppear {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5) rotateY(90deg);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotateY(0deg);
          }
        }

        @keyframes finalSurprise {
          0% {
            opacity: 0;
            transform: translateY(10vw);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5vw);
          }
          60% {
            transform: translateY(-2vw);
          }
        }

        @keyframes glow {
          from {
            text-shadow: 0 0 5vw rgba(255, 255, 255, 0.5);
          }
          to {
            text-shadow: 0 0 8vw rgba(255, 255, 255, 0.8),
              0 0 10vw rgba(255, 107, 107, 0.5);
          }
        }

        @keyframes buttonGlow {
          from {
            box-shadow: 0 2vw 4vw rgba(255, 107, 107, 0.4);
          }
          to {
            box-shadow: 0 3vw 6vw rgba(255, 107, 107, 0.6),
              0 0 8vw rgba(255, 165, 0, 0.3);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes heartFall {
          0% {
            transform: translateY(-10vw) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }

        @keyframes routeAppear {
          0% {
            opacity: 0;
            transform: translateY(5vw);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pathGlow {
          from {
            box-shadow: 0 0 2vw rgba(255, 107, 107, 0.5);
          }
          to {
            box-shadow: 0 0 4vw rgba(255, 107, 107, 0.8);
          }
        }

        /* 响应式设计 */
        /* 响应式设计 - 完全替换原有的 @media (min-width: 768px) 部分 */
        @media (min-width: 768px) {
          /* 桌面端基础设置 */
          .content-wrapper {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }

          .mute-button {
            width: 48px;
            height: 40px;
            font-size: 24px;
            border-radius: 50%;
          }

          /* 按钮尺寸调整 */
          .home-button {
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 25px;
          }

          .home-button-surprise {
            z-index: 9999;
            padding: 8px 16px;
            font-size: 14px;
            border-radius: 20px;
          }

          .close-button {
            z-index: 9999;
            width: 40px;
            height: 40px;
            font-size: 24px;
          }

          /* 控制面板 */
          .control-panel {
            padding: 20px;
            border-radius: 15px;
          }

          .toggle-label {
            font-size: 18px;
          }

          .slider {
            width: 48px;
            height: 24px;
            border-radius: 24px;
            margin-right: 16px;
          }

          .slider-thumb {
            width: 20px;
            height: 20px;
            top: 2px;
            left: 2px;
          }

          .toggle-switch input:checked + .slider .slider-thumb {
            left: 26px;
          }

          .surprise-hint {
            padding: 12px;
            font-size: 14px;
            border-radius: 8px;
          }

          /* 轮盘按钮 */
          .wheel-button {
            padding: 20px 40px;
            font-size: 20px;
            border-radius: 30px;
          }

          /* 航线显示 - 桌面端优化 */
          .flight-route {
            top: 25%;
            left: 15%;
            right: 15%;
            height: 60px;
          }

          .city-label {
            font-size: 16px;
            padding: 8px 16px;
            border-radius: 8px;
          }

          .flight-path {
            height: 4px;
            margin: 0 20px;
          }

          .flight-path::before {
            right: -8px;
            border-left: 12px solid #ffa500;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
          }

          /* 飞机动画 - 桌面端位置调整 */
          .airplane {
            font-size: 32px;
          }

          .airplane.stage-3,
          .airplane.stage-4,
          .airplane.stage-5 {
            top: 35%;
          }

          /* 星星大小调整 */
          .star {
            width: 2px;
            height: 2px;
          }

          /* 惊喜卡片 - 桌面端优化 */
          .surprise-card {
            padding: 30px;
            border-radius: 20px;
            max-width: 400px;
            top: 45%;
            border: 3px solid rgba(255, 255, 255, 0.3);
          }

          .gift-icon {
            font-size: 60px;
            margin-bottom: 20px;
          }

          .card-title {
            font-size: 28px;
            margin-bottom: 16px;
          }

          .card-text {
            font-size: 16px;
          }

          /* 最终惊喜 - 桌面端位置和样式 */
          .final-surprise {
            bottom: 15%;
            left: 10%;
            right: 10%;
          }

          .surprise-title {
            font-size: 36px;
            margin-bottom: 16px;
          }

          .surprise-subtitle {
            font-size: 18px;
            margin-bottom: 20px;
          }

          .return-button {
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 25px;
          }

          /* 飘落爱心大小调整 */
          .heart {
            font-size: 20px;
          }
        }

        /* 添加大屏幕优化 */
        @media (min-width: 1200px) {
          .content-wrapper {
            max-width: 1000px;
          }

          .surprise-card {
            max-width: 500px;
          }

          .flight-route {
            left: 20%;
            right: 20%;
          }

          .final-surprise {
            left: 15%;
            right: 15%;
          }
        }
      `}</style>
    </div>
  );
};

export default RomanticSurprise;
