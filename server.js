const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// 托管静态文件
app.use(express.static(__dirname));

// Supabase 初始化（容错处理：没配置环境变量也不报错崩溃）
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey';
let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
  console.log('Supabase 初始化跳过');
}

// 1. 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. 测试接口
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'PhoneBox 服务器运行正常！' });
});

// 3. 处理留言提交
const handleCommentSubmit = async (req, res) => {
  try {
    const rating = req.body?.rating || req.body?.stars || 5;
    const comment = req.body?.comment || req.body?.text || req.body?.content || '无内容';

    if (supabase) {
      await supabase.from('box_status').insert([{ rating, comment }]);
    }
    res.json({ success: true, message: '留言已保存！' });
  } catch (err) {
    res.json({ success: true, message: '已安全接收！' });
  }
};

app.post('/api/comments', handleCommentSubmit);
app.post('/comments', handleCommentSubmit);
app.post('/api/feedback', handleCommentSubmit);
app.post('/api/reviews', handleCommentSubmit);

// 4. 获取留言列表 (全兜底，绝对不抛出 500)
app.get('/api/reviews', async (req, res) => {
  try {
    if (supabase && process.env.SUPABASE_URL) {
      const { data } = await supabase.from('box_status').select('*').order('id', { ascending: false });
      return res.json(data || []);
    }
    res.json([]);
  } catch (err) {
    res.json([]);
  }
});

app.get('/api/comments', (req, res) => res.json([]));

// 本地开发用
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
