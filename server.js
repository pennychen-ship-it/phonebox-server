const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const path = require('path');

// 托管当前目录下的静态文件 (比如 index.html, style.css 等)
app.use(express.static(path.join(__dirname, 'public'))); // 如果你的 html 在 public 文件夹
// 或者如果 HTML 就直接放在根目录下，用下面这行：
app.use(express.static(__dirname));
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // 托管 public 文件夹下的网页

// Supabase 初始化（环境变量获取）
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 基础测试接口
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'PhoneBox 服务器运行正常！' });
});

// 启动服务器
// 兼容 Vercel 环境和本地运行
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`服务器启动成功，运行在 http://localhost:${PORT}`);
    });
}

// 必须导出 app，Vercel 才能正常接管路由！
module.exports = app;
