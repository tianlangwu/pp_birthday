// rename-photos.js
const fs = require("fs");
const path = require("path");

const imageFolder = "./public/images";
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

  const photoFiles = allFiles.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return (
      imageExtensions.includes(ext) && file.toLowerCase().includes("photo")
    );
  });

  if (photoFiles.length === 0) {
    console.log("⚠️ 没有找到包含 'photo' 的图片文件！");
    return;
  }

  console.log(`🔄 开始重命名 ${photoFiles.length} 个文件...`);

  const startIndex = 12;

  photoFiles.forEach((file, i) => {
    const ext = path.extname(file).toLowerCase();
    const newName = `p${startIndex + i}${ext}`;
    const oldPath = path.join(imageFolder, file);
    const newPath = path.join(imageFolder, newName);

    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ ${file} → ${newName}`);
    } catch (err) {
      console.log(`❌ 重命名失败: ${file} → ${newName}: ${err.message}`);
    }
  });

  console.log("🎉 所有包含 'photo' 的文件重命名完成！");
  console.log(`📁 文件夹路径: ${path.resolve(imageFolder)}`);
}

run();
