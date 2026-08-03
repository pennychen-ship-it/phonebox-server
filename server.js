const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// 托管前端静态文件
app.use(express.static(__dirname));

// 1. 读取 Supabase 数据库密钥
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. 根路由返回主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. 服务器运行状态测试
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'PhoneBox 服务器与数据库连接正常！' });
});

// 4. 【数据库接口】获取所有留言
app.get('/api/comments', async (req, res) => {
  const { data, error } = await supabase
    .from('box_status') // 对应你在 Supabase 建立的表名
    .select('*')
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 5. 【数据库接口】添加新留言
app.post('/api/comments', async (req, res) => {
  const { name, content } = req.body;
  const { data, error } = await supabase
    .from('box_status')
    .insert([{ name, content }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: '留言成功存入数据库！', data });
});

// 本地开发启动
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}

module.exports = app;
