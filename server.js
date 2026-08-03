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
  res.json({ status: 'online', message: 'PhoneBox 服务器运行正常！' });
});

// 3. 核心：处理留言提交
const handleCommentSubmit = async (req, res) => {
  try {
    const rating = req.body.rating || req.body.stars || 5;
    const comment = req.body.comment || req.body.text || req.body.content || '无内容';

    const { data, error } = await supabase
      .from('box_status')
      .insert([{ rating, comment }]);

    if (error) throw error;
    res.json({ success: true, message: '留言已成功保存！', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 兼容所有提交路径
app.post('/api/comments', handleCommentSubmit);
app.post('/comments', handleCommentSubmit);
app.post('/api/feedback', handleCommentSubmit);
app.post('/api/reviews', handleCommentSubmit);

// 4. 核心：处理获取留言列表 (修复 404 报错)
// 4. 处理获取留言列表 (带完整容错机制)
app.get('/api/reviews', async (req, res) => {
  try {
    // 检查环境变量是否存在
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.log('未配置 Supabase 环境变量');
      return res.json([]); 
    }

    const { data, error } = await supabase
      .from('box_status')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase 查询错误:', error.message);
      return res.json([]); // 即使数据库报错，也返回空数组，绝不抛出 500
    }

    res.json(data || []);
  } catch (err) {
    console.error('服务器内部错误:', err.message);
    res.json([]); // 兜底返回空数组
  }
});
