// rename-photos.js
// 用法：在 React 项目根目录运行 `node rename-photos.js`

const fs = require("fs");
const path = require("path");

// 图片文件夹路径
const imageFolder = "./public/images";

// 支持的图片扩展名
const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".tiff",
  ".svg",
];

function run() {
  if (!fs.existsSync(imageFolder)) {
    console.error("❌ 图片文件夹不存在:", imageFolder);
    return;
  }

  const allFiles = fs.readdirSync(imageFolder);

  // 只处理图片文件（不区分大小写扩展名）
  const imageFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });

  if (imageFiles.length === 0) {
    console.log("⚠️ 没有找到图片文件！");
    return;
  }

  console.log(`🔄 开始重命名 ${imageFiles.length} 个文件...`);

  imageFiles.forEach((file, index) => {
    const oldPath = path.join(imageFolder, file);
    const ext = path.extname(file).toLowerCase(); // 小写扩展名
    const newName = `photo${index + 1}${ext}`;
    const newPath = path.join(imageFolder, newName);

    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ ${file} → ${newName}`);
    } catch (err) {
      console.log(`❌ 重命名失败: ${file} → ${newName}: ${err.message}`);
    }
  });

  console.log("🎉 所有文件重命名完成！");
  console.log(`📁 文件夹路径: ${path.resolve(imageFolder)}`);
}

run();
