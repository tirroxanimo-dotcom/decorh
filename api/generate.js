export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { ocazie, stil, detalii } = req.body;
  const prompt = 'Esti un expert in aranjamente florale pentru floraria DecorH. Genereaza o idee creativa de aranjament floral pentru:' +
    (ocazie ? ' Ocazia: ' + ocazie + '.' : '') +
    (stil ? ' Stil: ' + stil + '.' : '') +
    (detalii ? ' Detalii: ' + detalii + '.' : '') +
    ' Raspunde in romana in 3-4 propozitii poetice si inspirationale.';
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300
      })
    });
    const data = await r.json();
    if (data.error) return res.status(200).json({ result: 'Eroare: ' + data.error.message });
    const text = data.choices?.[0]?.message?.content || 'Nu am putut genera.';
    res.status(200).json({ result: text });
  } catch (err) {
    res.status(200).json({ result: 'Eroare: ' + err.message });
  }
}
