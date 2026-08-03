const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 托管 public 文件夹下的静态资源
app.use(express.static(path.join(__dirname, 'public')));

// Supabase 初始化（环境变量获取）
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 根路由：返回 public 目录下的 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 基础测试接口
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'PhoneBox 服务器运行正常！' });
});

// 兼容 Vercel 环境和本地运行
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`服务器启动成功，运行在 http://localhost:${PORT}`);
  });
}

// 导出 app 供 Vercel 使用
module.exports = app;
