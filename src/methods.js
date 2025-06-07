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

// 添加消息数组
const messages = [
  "每天一天都好想你呀，真的要等一个月吗？",
  "琪仔呀 我每天都在看微信和小红书 好想你能给我发消息",
  "我打算把想发送的信息都写下来，以后有机会再给你看！",
  "我和主管请到假啦！我和他说我要去save my marriage 他当时就答应了！",
  "我和我娘找了好久的护照 哈哈哈 好菜 最后还是被我找到了！差一点就失败了",
  "其实第二天的时候我就去看了机票，但是发现银行卡里的钱因为交了各种费用只有2000多，信用卡还欠着2000多..",
  "去公司那天发了工资，刚好够机票钱，当天下午就和主管请假了",
  "今天只睡了4个小时 呜呜呜 在写了小红书文案 一边改一遍哭",
  "培培我真的好想你",
  "小宝啊 时间过的好慢啊 每天感觉都好久 我每天什么事情都做不下去",
  "睡觉也不怎么能睡了 每天只有3-4个小时的睡眠",
  "我想到一件我可以做的事情 我在给那个网页加点新的东西 希望你能喜欢",
  "顺便把之前生日日期的那个bug给改了",
  "我查了一圈 你iphoneX ipad的通讯录 照片 网页什么的根本找不到你同学的联系方式",
  "刚刚联系大叔让他叫瓜子帮我约你出来 结果瓜子自己去了日本！好烦啊",
  "加不上青丝微信 大叔也不理我了 等了1个多小时了",
  "收到你的小红书评论啦！开心！",
  "想了好久 本来想直接约你去洛阳去老君山的。但是好像太赶了",
  "我决定把这些我想说的话也做进app里面 就是不知道时间还够不够",
  "今天晚上凌晨的飞机 和你一样的那一班呢！",
  "前几天都颓废啊 3天瘦了1公斤多了 今天终于好一些了！",
  "加油冲冲冲！开始coding!",
];

export { getAllImages, messages };
