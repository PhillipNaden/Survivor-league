import { supabase } from './supabase'; // Adjust path if needed

// 1. Create a league AND auto-join the creator as player #1
export async function createLeague({ name, startingLives = 1, userId }) {
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .insert({
      name,
      invite_code: inviteCode,
      starting_lives: startingLives,
      created_by: userId,
    })
    .select()
    .single();

  if (leagueError) throw leagueError;

  // Automatically add creator to league_members
  const { error: memberError } = await supabase.from('league_members').insert({
    league_id: league.id,
    user_id: userId,
    lives: startingLives,
    status: 'active',
  });

  if (memberError) throw memberError;

  return league;
}

// 2. Join an existing league using an invite code
export async function joinLeagueByCode({ inviteCode, userId }) {
  const { data: league, error: findError } = await supabase
    .from('leagues')
    .select('*')
    .eq('invite_code', inviteCode.trim().toUpperCase())
    .single();

  if (findError || !league) {
    throw new Error('Invalid invite code. Check with your league admin.');
  }

  const { error: joinError } = await supabase.from('league_members').insert({
    league_id: league.id,
    user_id: userId,
    lives: league.starting_lives,
    status: 'active',
  });

  if (joinError) {
    if (joinError.code === '23505') {
      throw new Error('You have already joined this league.');
    }
    throw joinError;
  }

  return league;
}

// 3. Submit or change a tip for a round
export async function submitPick({ leagueId, userId, roundNumber, teamId }) {
  const { data, error } = await supabase
    .from('picks')
    .upsert(
      {
        league_id: leagueId,
        user_id: userId,
        round_number: roundNumber,
        team_id: teamId,
        status: 'pending',
      },
      { onConflict: 'league_id,user_id,round_number' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 4. Fetch full league board (members + profiles + picks + team details)
export async function getLeagueBoard(leagueId) {
  const [membersRes, picksRes] = await Promise.all([
    supabase
      .from('league_members')
      .select('*, profiles(username, avatar_url)')
      .eq('league_id', leagueId)
      .order('lives', { ascending: false }),

    supabase
      .from('picks')
      .select('*, teams(name, short_name, logo_url)')
      .eq('league_id', leagueId),
  ]);

  if (membersRes.error) throw membersRes.error;
  if (picksRes.error) throw picksRes.error;

  return {
    members: membersRes.data,
    picks: picksRes.data,
  };
}