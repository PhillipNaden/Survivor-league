export default async function handler(req, res) {
  const token = process.env.FOOTBALL_DATA_KEY || process.env.VITE_FOOTBALL_DATA_KEY;

  if (!token) {
    return res.status(500).json({
      error: 'Missing FOOTBALL_DATA_KEY in Vercel Environment Variables.'
    });
  }

  try {
    // Calling /competitions/PL/matches without ?season= automatically returns the current active EPL season (all 38 matchweeks)
    const response = await fetch('https://api.football-data.org/v4/competitions/PL/matches', {
      headers: {
        'X-Auth-Token': token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.message || `football-data.org returned HTTP ${response.status}`
      });
    }

    const mapped = (data.matches || [])
      .filter((m) => m.matchday && m.utcDate && m.homeTeam && m.awayTeam)
      .map((m) => ({
        round_number: Number(m.matchday),
        home_name: m.homeTeam.name || '',
        home_short: m.homeTeam.shortName || m.homeTeam.tla || '',
        home_tla: m.homeTeam.tla || '',
        away_name: m.awayTeam.name || '',
        away_short: m.awayTeam.shortName || m.awayTeam.tla || '',
        away_tla: m.awayTeam.tla || '',
        kickoff_utc: m.utcDate,
        status: m.status,
        winner: m.score?.winner || null
      }));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ fixtures: mapped });
  } catch (err) {
    return res.status(500).json({
      error: err?.message || 'Failed to reach football-data.org'
    });
  }
}