const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
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
app.listen(PORT, () => {
  console.log(`服务器启动成功，运行