// Vercel serverless function. Uses Groq if GROQ_API_KEY is set, otherwise Anthropic.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { messages, system, search, json } = req.body || {};
  try {
    let text = '', src = new Set();
    if (process.env.GROQ_API_KEY) {
      const SEARCH_MODEL = process.env.MODEL || 'groq/compound';
      const FAST_MODEL = process.env.FAST_MODEL || 'llama-3.3-70b-versatile';
      const model = search ? SEARCH_MODEL : FAST_MODEL;
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model,
          messages: [...(system ? [{ role: 'system', content: system }] : []), ...messages],
          ...(search && model.startsWith('openai/gpt-oss') ? { tools: [{ type: 'browser_search' }] } : {})
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || r.status);
      const m = d.choices[0].message; text = m.content || '';
      (m.executed_tools || []).forEach(t => (t.search_results?.results || []).forEach(x => x.url && src.add(x.url)));
      (text.match(/https?:\/\/[^\s)"\]]+/g) || []).forEach(u => src.add(u));
    } else {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: process.env.MODEL || 'claude-sonnet-5-5', max_tokens: 4096, system, messages,
          ...(search ? { tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 10 }] } : {})
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error?.message || r.status);
      for (const b of d.content) {
        if (b.type === 'text') { text += b.text; (b.citations || []).forEach(c => c.url && src.add(c.url)); }
        if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) b.content.forEach(c => c.url && src.add(c.url));
      }
    }
    const out = { text, sources: [...src] };
    if (json) { const mm = text.match(/[\[{][\s\S]*[\]}]/); try { out.data = JSON.parse(mm[0]); } catch { out.data = null; } }
    res.status(200).json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
}
