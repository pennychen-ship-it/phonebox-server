const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// 托管 public 文件夹下的静态资源
app.use(express.static(path.join(__dirname, 'public')));

// Supabase 初始化
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 根路由：返回 public 目录下的 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API 接口测试
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'PhoneBox 服务器运行正常！' });
});

// 本地开发调试使用
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}

// 必须放在最后一行：导出 app 供 Vercel 使用
module.exports = app;
