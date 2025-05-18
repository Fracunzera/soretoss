// api/save-hash.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { fecha, hash, ganadores, suplentes, total } = req.body;

  const gistId = '316cdbc39891c3a9b56d89cf2f6bfa72';
  const token = process.env.GIST_TOKEN;

  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const gist = await response.json();

  const contenido = JSON.parse(gist.files['sorteos-verificados.json'].content || '[]');
  contenido.push({ fecha, hash, ganadores, suplentes, total });

  await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        'sorteos-verificados.json': {
          content: JSON.stringify(contenido, null, 2)
        }
      }
    })
  });

  res.status(200).json({ ok: true });
}
