import { useState, useRef, useEffect } from "react";
import { Gift, Package, KeyRound } from "lucide-react";

export default function BirthdayWheel() {
  // 从 localStorage 获取初始值
  const getInitialCardPack = () => {
    const savedCardPack = localStorage.getItem("birthdayCardPack");
    if (savedCardPack) {
      try {
        return JSON.parse(savedCardPack);
      } catch (e) {
        console.error("Error parsing card pack:", e);
        return [];
      }
    }
    return [];
  };

  const getInitialRemainingSpins = () => {
    const savedRemainingSpins = localStorage.getItem("birthdayRemainingSpins");
    if (savedRemainingSpins) {
      const spins = parseInt(savedRemainingSpins);
      if (!isNaN(spins)) {
        return spins;
      }
    }
    return 3; // 默认值
  };

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [remainingSpins, setRemainingSpins] = useState(
    getInitialRemainingSpins()
  );
  const [cardPack, setCardPack] = useState(getInitialCardPack());
  const [showCardPack, setShowCardPack] = useState(false);
  const [redeemingCard, setRedeemingCard] = useState(null);
  const [showRedeemEffect, setShowRedeemEffect] = useState(false);
  const wheelRef = useRef(null);

  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  // 新增：体验模式状态
  const [demoMode, setDemoMode] = useState(false);

  // Define rewards
  const rewards = [
    {
      emoji: "🛒",
      label: "逛IKEA",
      id: 1,
      description: "一起去啊起亚，喝最爱的咖啡，畅想一次全家大翻新！",
    },
    {
      emoji: "🈲",
      label: "不可描述",
      id: 2,
      description: "嘿嘿，这张卡片就不方便描述了，你懂的😉。",
    },
    {
      emoji: "🚗",
      label: "说走就走",
      id: 3,
      description: "来一场说做就走的旅行吧，现在，立刻，马上！",
    },
    {
      emoji: "👨‍🍳",
      label: "老公做饭",
      id: 4,
      description: "今天的大厨是你老公！不准叫外卖，不准糊弄～",
    },
    {
      emoji: "🧹",
      label: "家务全免",
      id: 5,
      description: "今天你就是小公主，所有家务小男仆包了！",
    },
    {
      emoji: "😎",
      label: "任性得瑟",
      id: 6,
      description: "想干嘛就干嘛，不讲道理的一天，得瑟起来！",
    },
    {
      emoji: "💘",
      label: "人设体验",
      id: 7,
      description:
        "选个设定（忠犬/霸总/病娇…），让'限定款'小菌完全代入他！说话、做事要符合人设，不准OOC～！",
    },
    {
      emoji: "🎮",
      label: "预算翻倍",
      id: 8,
      description: "本月预算翻倍啦！是时候给游戏老公充值一波了！",
    },
  ];

  const anglePerSegment = 360 / rewards.length;

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("birthdayCardPack", JSON.stringify(cardPack));
  }, [cardPack]);

  useEffect(() => {
    localStorage.setItem("birthdayRemainingSpins", remainingSpins.toString());
  }, [remainingSpins]);

  const spin = () => {
    // 允许在体验模式下无视剩余次数
    if (isSpinning || (!demoMode && remainingSpins <= 0)) return;

    setIsSpinning(true);

    let randomIndex = Math.floor(Math.random() * rewards.length);
    const existingIds = cardPack.map((card) => card.id.split("-")[0]);
    let attempts = 0;

    while (
      existingIds.includes(rewards[randomIndex].id.toString()) &&
      attempts < 10
    ) {
      randomIndex = Math.floor(Math.random() * rewards.length);
      attempts++;
    }

    const targetSegment = rewards.length - 1 - randomIndex;
    const baseRotation = currentRotation % 360;
    const targetAngle = targetSegment * anglePerSegment + anglePerSegment / 2;
    let newRotation = currentRotation - (baseRotation - targetAngle);
    newRotation += 360 * 5;

    setCurrentRotation(newRotation);

    setTimeout(() => {
      const result = rewards[randomIndex];
      setCurrentResult(result);
      createConfetti();

      // 只在非体验模式下减少次数
      if (!demoMode) {
        setRemainingSpins((prev) => prev - 1);
      }

      setTimeout(() => {
        setShowModal(true);
        setIsSpinning(false);
      }, 500);
    }, 5200);
  };

  const closeModal = () => {
    setShowModal(false);
    if (currentResult) {
      const rewardId = currentResult.id.toString();

      // 只在非体验模式下添加到卡包
      if (!demoMode) {
        // 如果已经抽中过，不再重复加入
        const alreadyExists = cardPack.some((card) =>
          card.id.startsWith(rewardId)
        );

        if (!alreadyExists) {
          setCardPack((prev) => [
            ...prev,
            {
              ...currentResult,
              dateAdded: new Date().toISOString(),
              id: `${rewardId}-${Date.now()}`,
            },
          ]);
        }
      }
    }
  };

  const toggleCardPack = () => {
    setShowCardPack((prev) => !prev);
  };

  const redeemCard = (cardId) => {
    // Find the card to redeem
    const cardToRedeem = cardPack.find((card) => card.id === cardId);
    if (!cardToRedeem) return;

    // Show redeem effect
    setRedeemingCard(cardToRedeem);
    setShowRedeemEffect(true);
    createConfetti();

    // After effect completes, remove card from pack
    setTimeout(() => {
      setCardPack((prev) => {
        const newCardPack = prev.filter((card) => card.id !== cardId);
        return newCardPack;
      });
      setShowRedeemEffect(false);
      setRedeemingCard(null);
    }, 2000);
  };

  const createConfetti = () => {
    const colors = ["#e91e63", "#00bcd4", "#ffc107", "#4caf50", "#9c27b0"];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.opacity = Math.random() + 0.5;
      if (Math.random() > 0.5) {
        confetti.style.borderRadius = "50%";
      } else {
        confetti.style.width = Math.random() * 5 + 5 + "px";
        confetti.style.height = Math.random() * 5 + 5 + "px";
      }

      document.body.appendChild(confetti);
      const animation = confetti.animate(
        [
          {
            transform: `translate(${Math.random() * 20 - 10}px, 0)`,
            opacity: 1,
          },
          {
            transform: `translate(${Math.random() * 300 - 150}px, ${
              window.innerHeight
            }px) rotate(${Math.random() * 1000}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: Math.random() * 3000 + 2000,
          easing: "cubic-bezier(0.2, 1, 0.2, 1)",
        }
      );
      animation.onfinish = () => confetti.remove();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
  };

  // 切换体验模式
  const toggleDemoMode = () => {
    setDemoMode((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen w-full">
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
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.05);
          }
        }
        @keyframes redeem-effect {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.7;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .redeem-effect {
          animation: redeem-effect 1.5s ease-out forwards;
        }
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: gold;
          border-radius: 50%;
          opacity: 0;
          animation: sparkle 1s ease-out forwards;
        }
        @keyframes sparkle {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }
      `}</style>

      {/* Main Content */}

      <div className="flex flex-col items-center justify-center min-h-screen p-5">
        <h1 className="text-3xl font-bold text-pink-700 mb-6 mt-4">
          快乐星球 抽卡轮盘
        </h1>

        {/* Demo Mode Toggle */}
        <div
          className={`absolute top-20 left-4 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
            demoMode ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={toggleDemoMode}
          style={{ cursor: "pointer" }}
        >
          {demoMode ? "体验模式：开启" : "体验模式：关闭"}
        </div>

        {/* Card Pack Button */}
        <button
          onClick={toggleCardPack}
          className="card-pack-button absolute top-4 right-4 p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 flex items-center justify-center"
        >
          <Package size={24} />
          <span className="absolute -top-1 -right-1 bg-white text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {cardPack.length}
          </span>
        </button>
        <button
          onClick={() => setShowAdminPrompt(true)}
          className="absolute top-4 left-4 p-3 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 transition-all duration-300 flex items-center justify-center"
        >
          <KeyRound size={24} />
        </button>

        {/* Remaining Spins Indicator */}
        <div className="mb-12 text-pink-700 font-medium">
          {demoMode ? (
            <span>体验模式 - 不消耗次数</span>
          ) : (
            <span>剩余抽卡次数: {remainingSpins}</span>
          )}
        </div>

        {/* Wheel Container */}
        <div className="relative w-80 h-80 md:w-96 md:h-96 mb-6">
          {/* Pointer */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
            <div
              className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white rounded-t-full shadow-lg"
              style={{
                clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
              }}
            ></div>
          </div>
          {/* Wheel Body */}
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full border-8 border-white shadow-lg overflow-hidden transition-transform duration-[5000ms]"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              position: "relative",
            }}
          >
            {/* Fixed wheel segments using conic gradient */}
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(
                    #fce4ec 0deg ${anglePerSegment}deg,
                    #f8bbd0 ${anglePerSegment}deg ${anglePerSegment * 2}deg,
                    #fce4ec ${anglePerSegment * 2}deg ${anglePerSegment * 3}deg,
                    #f8bbd0 ${anglePerSegment * 3}deg ${anglePerSegment * 4}deg,
                    #fce4ec ${anglePerSegment * 4}deg ${anglePerSegment * 5}deg,
                    #f8bbd0 ${anglePerSegment * 5}deg ${anglePerSegment * 6}deg,
                    #fce4ec ${anglePerSegment * 6}deg ${anglePerSegment * 7}deg,
                    #f8bbd0 ${anglePerSegment * 7}deg ${anglePerSegment * 8}deg
                  )`,
              }}
            ></div>

            {/* Text labels */}
            {rewards.map((reward, index) => {
              const rotation = index * anglePerSegment;
              const labelRotation = rotation + anglePerSegment / 2;
              return (
                <div
                  key={index}
                  className="absolute w-full h-full top-0 left-0"
                  style={{
                    transformOrigin: "center",
                    transform: `rotate(${labelRotation}deg)`,
                  }}
                >
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-2xl mb-1">{reward.emoji}</div>
                    <div className="text-sm font-medium">{reward.label}</div>
                  </div>
                </div>
              );
            })}

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 z-10 border-4 border-pink-100"></div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={isSpinning || (!demoMode && remainingSpins <= 0)}
          className={`mt-6 px-8 py-3 text-lg font-semibold bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            isSpinning || (!demoMode && remainingSpins <= 0)
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-pink-600 hover:transform hover:-translate-y-1 hover:shadow-xl"
          }`}
        >
          <span>
            {demoMode
              ? "体验抽卡"
              : remainingSpins > 0
              ? "抽卡一次"
              : "次数已用完"}
          </span>
          <Gift size={20} />
        </button>

        {/* 底部声明 */}
        <div className="text-center text-xs text-gray-500 mt-8 opacity-70">
          活动最终解释权归菌小菌所有
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-white to-pink-50 p-8 rounded-2xl shadow-xl text-center max-w-md w-11/12 transform scale-100 transition-transform duration-300 border-2 border-pink-200"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: "0 10px 40px rgba(233, 30, 99, 0.2)",
            }}
          >
            {/* 奖励图标 */}
            <div className="relative mb-6 mt-2">
              <div
                className="absolute inset-0 bg-pink-300 rounded-full opacity-20 animate-ping"
                style={{ animationDuration: "3s" }}
              ></div>
              <span className="text-8xl block relative transform hover:scale-110 transition-transform cursor-default">
                {currentResult?.emoji}
              </span>
            </div>

            {/* 奖励标题 */}
            <div className="text-2xl font-bold text-pink-600 mb-4 relative">
              <span className="relative inline-block">
                恭喜你抽中：「{currentResult?.label}」
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
              </span>
            </div>

            {/* 奖励描述 */}
            <div className="text-lg text-gray-700 mb-6 bg-white bg-opacity-70 p-4 rounded-lg shadow-inner">
              {currentResult?.description}
            </div>

            {/* 体验模式提示 */}
            {demoMode && (
              <div className="mb-4 text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                很可惜，你正在使用体验版轮盘，无法保存奖励到卡包！
              </div>
            )}

            {/* 按钮 */}
            <button
              onClick={closeModal}
              className="mt-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto group"
            >
              <span>{demoMode ? "关闭" : "加入卡包"}</span>
              <svg
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* 底部解释权声明 */}
            <div className="mt-4 text-xs text-gray-500">
              奖励内容的最终解释权归菌小菌所有
            </div>

            {/* 底部装饰 */}
            <div className="mt-2 flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-pink-400" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card Pack Modal */}
      {showCardPack && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 px-[5%]"
          onClick={toggleCardPack}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto transform scale-100 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-pink-700">卡包</h2>
              <div className="text-sm text-gray-500">
                已收集: {cardPack.length}张
              </div>
            </div>

            {cardPack.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                卡包还是空的，快去抽卡吧~
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cardPack.map((card) => (
                  <div
                    key={card.id}
                    className="bg-gradient-to-r from-pink-50 to-blue-50 p-4 rounded-lg shadow-md flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="text-4xl mr-4">{card.emoji}</div>
                      <div>
                        <div className="font-bold text-pink-600">
                          {card.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {card.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          获得日期: {formatDate(card.dateAdded)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => redeemCard(card.id)}
                      className="px-3 py-1 bg-pink-500 text-white rounded-md text-sm font-medium hover:bg-pink-600 transition-colors duration-300"
                    >
                      兑换
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={toggleCardPack}
              className="mt-6 w-full py-3 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition-colors duration-300"
            >
              关闭
            </button>
            {!demoMode &&
              cardPack.some((card) =>
                card.id.startsWith(currentResult?.id?.toString())
              ) && (
                <div className="text-sm text-gray-500 mt-2">
                  * 你已经获得过这个奖励，将不会重复添加
                </div>
              )}

            {/* 解释权声明 */}
            <div className="text-xs text-gray-500 mt-4 text-center border-t border-gray-100 pt-3">
              所有奖励的兑换方式及内容最终解释权归菌小菌所有
            </div>
          </div>
        </div>
      )}

      {showAdminPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-72">
            <h3 className="text-lg font-semibold mb-2">管理员登录</h3>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full border p-2 mb-2"
            />
            {adminError && (
              <p className="text-red-500 text-sm mb-2">{adminError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => {
                  setShowAdminPrompt(false);
                  setAdminPassword("");
                  setAdminError("");
                }}
              >
                取消
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  if (adminPassword === "20250506") {
                    setRemainingSpins(remainingSpins + 1); // 你可以改成任意数量
                    setShowAdminPrompt(false);
                    setAdminPassword("");
                    setAdminError("");
                  } else {
                    setAdminError("密码错误");
                  }
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redeem Effect */}
      {showRedeemEffect && redeemingCard && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="bg-white p-8 rounded-xl shadow-xl text-center redeem-effect"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-8xl mb-4">{redeemingCard.emoji}</div>
            <div className="text-3xl font-bold text-pink-600">
              已兑换：{redeemingCard.label}
            </div>
            {/* Create sparkles effect */}
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const distance = 100 + Math.random() * 50;
              const delay = Math.random() * 0.5;
              const tx = Math.cos(angle) * distance;
              const ty = Math.sin(angle) * distance;
              return (
                <div
                  key={i}
                  className="sparkle"
                  style={{
                    "--tx": `${tx}px`,
                    "--ty": `${ty}px`,
                    animationDelay: `${delay}s`,
                    left: "50%",
                    top: "50%",
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
