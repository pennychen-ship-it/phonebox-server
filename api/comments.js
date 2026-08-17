import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rating, comment } = req.body || {};

  // 明确写入 box_status 表
  const { data, error } = await supabase
    .from('box_status')
    .insert([{ rating: Number(rating) || 5, comment: String(comment || '') }])
    .select();

  if (error) {
    console.error('Supabase Error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, data });
}
