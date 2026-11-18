export default async function handler(req, res) {
  try {
    const [bootstrapRes, fixturesRes] = await Promise.all([
      fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }),
      fetch('https://fantasy.premierleague.com/api/fixtures/', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      })
    ]);

    if (!bootstrapRes.ok || !fixturesRes.ok) {
      return res.status(502).json({ error: 'Official Premier League feed temporarily unavailable' });
    }

    const bootstrap = await bootstrapRes.json();
    const rawFixtures = await fixturesRes.json();

    const teamById = new Map(
      (bootstrap.teams || []).map((t) => [
        t.id,
        { name: t.name, short_name: t.short_name }
      ])
    );

    const mapped = (rawFixtures || [])
      .filter((f) => f.event && f.kickoff_time)
      .map((f) => {
        const home = teamById.get(f.team_h);
        const away = teamById.get(f.team_a);
        return {
          round_number: Number(f.event),
          home_name: home?.name || '',
          home_short: home?.short_name || '',
          away_name: away?.name || '',
          away_short: away?.short_name || '',
          kickoff_utc: f.kickoff_time,
          finished: Boolean(f.finished),
          home_score: f.team_h_score,
          away_score: f.team_a_score
        };
      });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ fixtures: mapped });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Failed to fetch EPL fixtures' });
  }
}