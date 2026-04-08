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
    console.log('Gemini response:', JSON.stringify(data));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Nu am putut genera.';
    res.status(200).json({ result: text });
  } catch (err) {
    console.log('Error:', err.message);
    res.status(500).json({ result: 'Eroare: ' + err.message });
  }
}
