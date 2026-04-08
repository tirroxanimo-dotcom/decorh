export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { ocazie, stil, detalii } = req.body;
  const prompt = 'Genereaza o idee de aranjament floral pentru: ' +
    (ocazie ? 'Ocazia: ' + ocazie + '. ' : '') +
    (stil ? 'Stil: ' + stil + '. ' : '') +
    (detalii ? 'Detalii: ' + detalii : '') +
    ' Raspunde in romana in 3-4 propozitii.';
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await r.json();
    if (data.error) return res.status(200).json({ result: 'Eroare Gemini: ' + data.error.message });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Raspuns gol de la Gemini.';
    res.status(200).json({ result: text });
  } catch (err) {
    res.status(200).json({ result: 'Eroare: ' + err.message });
  }
}
