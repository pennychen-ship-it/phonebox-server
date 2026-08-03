const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// 托管前端静态页面
app.use(express.static(__dirname));

// Supabase 初始化
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. 主页面入口
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. 服务器测试接口
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'PhoneBox 服务器与数据库运行正常！' });
});

// 3. 核心：处理留言提交的统一函数
const handleCommentSubmit = async (req, res) => {
  try {
    const rating = req.body.rating || req.body.stars || 5;
    const comment = req.body.comment || req.body.text || req.body.content || '无内容';

    // 存入 Supabase 数据库 (box_status 表)
    const { data, error } = await supabase
      .from('box_status')
      .insert([{ rating, comment }]);

    if (error) throw error;
    res.json({ success: true, message: '留言已成功保存到数据库！', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. 兼容前端所有可能的请求路径
app.post('/api/comments', handleCommentSubmit);
app.post('/comments', handleCommentSubmit);
app.post('/api/feedback', handleCommentSubmit);
app.post('/feedback', handleCommentSubmit);

// 兼容 Vercel 环境与本地运行
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}

module.exports = app;
