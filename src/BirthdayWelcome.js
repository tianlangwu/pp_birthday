import { useState, useEffect } from "react";
import { Heart, Star, Gift, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BirthdayWelcome() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [stars, setStars] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 创建气球动画
  useEffect(() => {
    const newBalloons = [];
    const colors = [
      "bg-pink-500",
      "bg-blue-400",
      "bg-purple-500",
      "bg-yellow-400",
      "bg-green-400",
    ];

    for (let i = 0; i < 15; i++) {
      newBalloons.push({
        id: i,
        left: `${Math.random() * 100}vw`,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 20 + 30,
      });
    }

    setBalloons(newBalloons);

    // 创建星星动画
    const newStars = [];
    for (let i = 0; i < 30; i++) {
      newStars.push({
        id: i,
        left: `${Math.random() * 100}vw`,
        top: `${Math.random() * 100}vh`,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 1,
        size: Math.random() * 10 + 5,
      });
    }

    setStars(newStars);
  }, []);

  const createConfetti = () => {
    const colors = [
      "#e91e63",
      "#00bcd4",
      "#ffc107",
      "#4caf50",
      "#9c27b0",
      "#ff5722",
      "#3f51b5",
    ];
    const confettiCount = windowSize.width < 768 ? 50 : 100; // 移动端减少粒子数量

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.opacity = Math.random() + 0.5;

      // 多样化的形状
      const shapeType = Math.floor(Math.random() * 3);
      if (shapeType === 0) {
        confetti.style.borderRadius = "50%"; // 圆形
      } else if (shapeType === 1) {
        confetti.style.width = Math.random() * 8 + 5 + "px";
        confetti.style.height = Math.random() * 8 + 5 + "px";
      } else {
        // 星形
        confetti.style.clipPath =
          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
        confetti.style.width = Math.random() * 12 + 8 + "px";
        confetti.style.height = Math.random() * 12 + 8 + "px";
      }

      document.body.appendChild(confetti);
      const animation = confetti.animate(
        [
          {
            transform: `translate(${
              Math.random() * 20 - 10
            }px, 0) rotate(0deg)`,
            opacity: 1,
          },
          {
            transform: `translate(${Math.random() * 400 - 200}px, ${
              window.innerHeight
            }px) rotate(${Math.random() * 1000}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: Math.random() * 4000 + 2000,
          easing: "cubic-bezier(0.2, 1, 0.2, 1)",
        }
      );
      animation.onfinish = () => confetti.remove();
    }
  };

  const startGacha = () => {
    createConfetti();
    setShowModal(true);

    // 模拟跳转，这里只是示例
    setTimeout(() => {
      setShowModal(false);
      // 在实际应用中，这里应该是 navigate("/birthday-wheel");
      navigate("/birthday-wheel");
    }, 3000);
  };

  // 基于屏幕尺寸计算装饰元素的位置和大小
  const isSmallScreen = windowSize.width < 768;
  const decorationSize = isSmallScreen ? "text-3xl" : "text-5xl";
  const edgeDistance = isSmallScreen ? 5 : 10;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Pacifico&family=ZCOOL+KuaiLe&display=swap");

        body {
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #fce4ec 0%, #e1f5fe 100%);
          font-family: "ZCOOL KuaiLe", "Segoe UI", -apple-system, system-ui,
            sans-serif;
          overflow-x: hidden;
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background-color: #f00;
          top: -10px;
          z-index: 90;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        @keyframes shine {
          0% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            transform: scale(1);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 105, 180, 0.8),
              0 0 30px rgba(255, 105, 180, 0.6);
            transform: scale(1.05);
          }
          100% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
            transform: scale(1);
          }
        }

        @keyframes balloon-float {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-20vh) rotate(10deg);
          }
        }

        @keyframes star-twinkle {
          0% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
        }

        @keyframes heart-beat {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.2);
          }
          40% {
            transform: scale(0.9);
          }
          60% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .balloon {
          position: fixed;
          bottom: 0;
          animation-name: balloon-float;
          animation-duration: 10s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          z-index: 5;
        }

        .balloon::before {
          content: "";
          position: absolute;
          width: 6px;
          height: 50px;
          background: rgba(0, 0, 0, 0.2);
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
        }

        .star {
          position: absolute;
          background-color: #ffd700;
          clip-path: polygon(
            50% 0%,
            61% 35%,
            98% 35%,
            68% 57%,
            79% 91%,
            50% 70%,
            21% 91%,
            32% 57%,
            2% 35%,
            39% 35%
          );
          animation-name: star-twinkle;
          animation-iteration-count: infinite;
          z-index: 4;
        }

        .heart-beat {
          animation: heart-beat 1.5s ease-in-out infinite;
        }

        .rotate {
          animation: rotate 4s linear infinite;
        }

        .glow-button {
          box-shadow: 0 0 10px rgba(236, 72, 153, 0.8),
            0 0 20px rgba(236, 72, 153, 0.6);
          transition: all 0.3s ease;
        }

        .glow-button:hover {
          box-shadow: 0 0 15px rgba(236, 72, 153, 1),
            0 0 30px rgba(236, 72, 153, 0.8), 0 0 45px rgba(236, 72, 153, 0.6);
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .modal-content {
          animation: scaleIn 0.5s ease;
        }
      `}</style>

      {/* 背景星星 */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* 气球 */}
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className={`balloon ${balloon.color} rounded-full`}
          style={{
            left: balloon.left,
            width: balloon.size,
            height: 1.3 * balloon.size,
            animationDelay: `${balloon.delay}s`,
            animationDuration: `${10 + balloon.delay * 2}s`,
          }}
        />
      ))}

      <div className="fixed inset-0 flex flex-col items-center justify-center z-20 bg-gradient-to-br from-pink-100 to-blue-100 bg-opacity-80 px-4 md:px-[5%]">
        {/* 3D翻转卡片效果 */}
        <div
          className="relative mb-6 transform transition-all duration-1000 hover:rotate-y-180 cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div
            className="text-5xl md:text-8xl transform transition-transform duration-1000 hover:scale-110"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            🎂
          </div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-5xl md:text-8xl opacity-0 hover:opacity-100 transition-opacity duration-500">
            ✨
          </div>
        </div>
        <h1
          className="text-3xl md:text-5xl font-bold text-pink-600 mb-4 md:mb-6 text-center px-2 md:px-4"
          style={{
            fontFamily: "'ZCOOL KuaiLe', cursive",
            animation: "shine 2s ease-in-out infinite",
          }}
        >
          生日快乐！
        </h1>
        <p
          className="text-xl md:text-2xl text-pink-500 mb-4 md:mb-6 text-center"
          style={{
            fontFamily: "'ZCOOL KuaiLe', cursive",
          }}
        >
          {new Date().toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="flex items-center justify-center mb-4 md:mb-6 px-2">
          <Heart
            className="text-pink-500 mx-2 heart-beat"
            size={isSmallScreen ? 20 : 28}
          />
          <p
            className="text-xl md:text-2xl text-pink-600 text-center max-w-md px-2 md:px-4"
            style={{ fontFamily: "'ZCOOL KuaiLe', sans-serif" }}
          >
            {"祝 wuli外星公主"}
            <br />
            {"欧皇附体不再非，谷子出手身价飞！"}
          </p>
          <Heart
            className="text-pink-500 mx-2 heart-beat"
            size={isSmallScreen ? 20 : 28}
          />
        </div>
        <button
          onClick={startGacha}
          className="px-6 py-3 md:px-12 md:py-5 text-lg md:text-2xl font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 glow-button flex items-center"
        >
          <Gift className="mr-2" size={isSmallScreen ? 20 : 24} />
          开起生日小惊喜 ✨
        </button>

        {/* 装饰元素 - 带有更多动画 - 现在使用响应式定位 */}
        <div
          className={`absolute ${decorationSize}`}
          style={{
            top: `${edgeDistance}%`,
            left: `${edgeDistance}%`,
            animation:
              "float 4s ease-in-out infinite, rotate 8s linear infinite",
          }}
        >
          🎁
        </div>
        <div
          className={`absolute ${decorationSize}`}
          style={{
            bottom: `${edgeDistance}%`,
            right: `${edgeDistance}%`,
            animation: "float 3.5s ease-in-out infinite",
          }}
        >
          🎈
        </div>
        <div
          className={`absolute ${decorationSize}`}
          style={{
            top: `${edgeDistance}%`,
            right: `${edgeDistance}%`,
            animation: "float 5s ease-in-out infinite",
          }}
        >
          🎉
        </div>
        <div
          className={`absolute ${decorationSize}`}
          style={{
            bottom: `${edgeDistance}%`,
            left: `${edgeDistance}%`,
            animation: "float 4.5s ease-in-out infinite",
          }}
        >
          🥂
        </div>

        {/* 只在桌面端显示额外装饰 */}
        {!isSmallScreen && (
          <>
            <div className="absolute top-1/4 left-1/4 heart-beat">
              <Star color="#FFD700" size={24} />
            </div>
            <div className="absolute bottom-1/4 right-1/4 rotate">
              <PartyPopper color="#FF1493" size={28} />
            </div>
          </>
        )}
      </div>

      {/* 弹窗效果 */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content bg-white rounded-xl p-6 md:p-8 max-w-md mx-4 text-center">
            <PartyPopper
              className="mx-auto mb-4 text-pink-500"
              size={isSmallScreen ? 36 : 48}
            />
            <h2 className="text-xl md:text-2xl font-bold text-pink-600 mb-3 md:mb-4">
              惊喜即将开始！
            </h2>
            <p className="text-gray-700 mb-2">正在为您准备生日大转盘...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-pink-500 h-2.5 rounded-full animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
