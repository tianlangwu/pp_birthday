// 1. 在组件顶部添加这个函数来获取所有图片
const getAllImages = async () => {
  const images = [];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

  // 尝试加载图片，从1开始递增直到找不到为止
  for (let i = 1; i <= 46; i++) {
    // 最多尝试100张
    let found = false;

    for (const ext of imageExtensions) {
      try {
        const imagePath = `/pp_birthday/images/p${i}.${ext}`;
        console.log("Testing image:", imagePath);
        // 测试图片是否存在
        const response = await fetch(imagePath, { method: "HEAD" });
        if (response.ok) {
          images.push(imagePath);
          found = true;
          console.log("Image found:", imagePath);
          break;
        }
      } catch (error) {
        // console.log("Image not found:", error);
        // 图片不存在，继续尝试下一个扩展名
      }
    }

    // 如果连续5张图片都不存在，就停止搜索
    if (!found) {
      const consecutiveNotFound = i - images.length;
      if (consecutiveNotFound > 5) break;
    }
  }

  return images;
};

export { getAllImages };
