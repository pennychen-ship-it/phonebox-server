const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// 托管根目录下的静态资源
app.use(express.static(__dirname));

// Supabase 初始化
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 根路由：返回根目录下的 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API 接口测试
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'PhoneBox 服务器运行正常！' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}

module.exports = app;
