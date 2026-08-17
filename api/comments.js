import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // 1. 获取评论列表 (GET)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('box_status')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // 2. 提交新评论 (POST)
  if (req.method === 'POST') {
    const { rating, comment } = req.body || {};
    const { data, error } = await supabase
      .from('box_status')
      .insert([{ rating: Number(rating) || 5, comment: String(comment || '') }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true, data: data[0] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
