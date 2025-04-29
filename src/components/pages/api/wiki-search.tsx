import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { search, action = 'query', prop = 'extracts', format = 'json' } = req.query;

  if (!search) {
    return res.status(400).json({ error: 'Missing search term' });
  }

  const url = `https://es.wikipedia.org/w/api.php?${new URLSearchParams({
    action: action.toString(),
    format: format.toString(),
    prop: prop.toString(),
    exintro: "true",
    explaintext: "false",
    generator: "search",
    gsrlimit: "1",
    gsrsearch: search.toString(),
    gsrnamespace: "0",
    origin: "*" // (esto ya no importa en server-side)
  })}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching Wikipedia data" });
  }
}
