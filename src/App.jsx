import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import {
  Heart,
  Trophy,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Calendar,
  Lock,
  Swords,
  PlusCircle,
  LogIn,
  LogOut,
  X,
  Menu,
  Pin,
  AlertCircle,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';

const FALLBACK_TEAMS = {
  NRL: [
    { id: 'nrl-1', name: 'Brisbane Broncos', short_code: 'BRI', league: 'NRL' },
    { id: 'nrl-2', name: 'Canberra Raiders', short_code: 'CAN', league: 'NRL' },
    { id: 'nrl-3', name: 'Canterbury-Bankstown Bulldogs', short_code: 'CBY', league: 'NRL' },
    { id: 'nrl-4', name: 'Cronulla-Sutherland Sharks', short_code: 'CRO', league: 'NRL' },
    { id: 'nrl-5', name: 'Dolphins', short_code: 'DOL', league: 'NRL' },
    { id: 'nrl-6', name: 'Gold Coast Titans', short_code: 'GLD', league: 'NRL' },
    { id: 'nrl-7', name: 'Manly Warringah Sea Eagles', short_code: 'MAN', league: 'NRL' },
    { id: 'nrl-8', name: 'Melbourne Storm', short_code: 'MST', league: 'NRL' },
    { id: 'nrl-9', name: 'New Zealand Warriors', short_code: 'NZW', league: 'NRL' },
    { id: 'nrl-10', name: 'Newcastle Knights', short_code: 'NCL', league: 'NRL' },
    { id: 'nrl-11', name: 'North Queensland Cowboys', short_code: 'NQL', league: 'NRL' },
    { id: 'nrl-12', name: 'Parramatta Eels', short_code: 'PAR', league: 'NRL' },
    { id: 'nrl-13', name: 'Penrith Panthers', short_code: 'PEN', league: 'NRL' },
    { id: 'nrl-14', name: 'South Sydney Rabbitohs', short_code: 'SOU', league: 'NRL' },
    { id: 'nrl-15', name: 'St. George Illawarra Dragons', short_code: 'SGI', league: 'NRL' },
    { id: 'nrl-16', name: 'Sydney Roosters', short_code: 'SYR', league: 'NRL' },
    { id: 'nrl-17', name: 'Wests Tigers', short_code: 'WST', league: 'NRL' }
  ],
  AFL: [
    { id: 'afl-1', name: 'Adelaide Crows', short_code: 'ADE', league: 'AFL' },
    { id: 'afl-2', name: 'Brisbane Lions', short_code: 'BRL', league: 'AFL' },
    { id: 'afl-3', name: 'Carlton Blues', short_code: 'CAR', league: 'AFL' },
    { id: 'afl-4', name: 'Collingwood Magpies', short_code: 'COL', league: 'AFL' },
    { id: 'afl-5', name: 'Essendon Bombers', short_code: 'ESS', league: 'AFL' },
    { id: 'afl-6', name: 'Fremantle Dockers', short_code: 'FRE', league: 'AFL' },
    { id: 'afl-7', name: 'Geelong Cats', short_code: 'GEE', league: 'AFL' },
    { id: 'afl-8', name: 'Gold Coast Suns', short_code: 'GCS', league: 'AFL' },
    { id: 'afl-9', name: 'GWS Giants', short_code: 'GWS', league: 'AFL' },
    { id: 'afl-10', name: 'Hawthorn Hawks', short_code: 'HAW', league: 'AFL' },
    { id: 'afl-11', name: 'Melbourne Demons', short_code: 'MEL', league: 'AFL' },
    { id: 'afl-12', name: 'North Melbourne Kangaroos', short_code: 'NTH', league: 'AFL' },
    { id: 'afl-13', name: 'Port Adelaide Power', short_code: 'PTA', league: 'AFL' },
    { id: 'afl-14', name: 'Richmond Tigers', short_code: 'RIC', league: 'AFL' },
    { id: 'afl-15', name: 'St Kilda Saints', short_code: 'STK', league: 'AFL' },
    { id: 'afl-16', name: 'Sydney Swans', short_code: 'SYD', league: 'AFL' },
    { id: 'afl-17', name: 'West Coast Eagles', short_code: 'WCE', league: 'AFL' },
    { id: 'afl-18', name: 'Western Bulldogs', short_code: 'WBD', league: 'AFL' }
  ],
  EPL: [
    { id: 'epl-1', name: 'AFC Bournemouth', short_code: 'BOU', league: 'EPL' },
    { id: 'epl-2', name: 'Arsenal', short_code: 'ARS', league: 'EPL' },
    { id: 'epl-3', name: 'Aston Villa', short_code: 'AVL', league: 'EPL' },
    { id: 'epl-4', name: 'Brentford', short_code: 'BRE', league: 'EPL' },
    { id: 'epl-5', name: 'Brighton & Hove Albion', short_code: 'BHA', league: 'EPL' },
    { id: 'epl-6', name: 'Chelsea', short_code: 'CHE', league: 'EPL' },
    { id: 'epl-7', name: 'Coventry City', short_code: 'COV', league: 'EPL' },
    { id: 'epl-8', name: 'Crystal Palace', short_code: 'CRY', league: 'EPL' },
    { id: 'epl-9', name: 'Everton', short_code: 'EVE', league: 'EPL' },
    { id: 'epl-10', name: 'Fulham', short_code: 'FUL', league: 'EPL' },
    { id: 'epl-11', name: 'Hull City', short_code: 'HUL', league: 'EPL' },
    { id: 'epl-12', name: 'Ipswich Town', short_code: 'IPS', league: 'EPL' },
    { id: 'epl-13', name: 'Leeds United', short_code: 'LEE', league: 'EPL' },
    { id: 'epl-14', name: 'Liverpool', short_code: 'LIV', league: 'EPL' },
    { id: 'epl-15', name: 'Manchester City', short_code: 'MCI', league: 'EPL' },
    { id: 'epl-16', name: 'Manchester United', short_code: 'MUN', league: 'EPL' },
    { id: 'epl-17', name: 'Newcastle United', short_code: 'NEW', league: 'EPL' },
    { id: 'epl-18', name: 'Nottingham Forest', short_code: 'NFO', league: 'EPL' },
    { id: 'epl-19', name: 'Sunderland', short_code: 'SUN', league: 'EPL' },
    { id: 'epl-20', name: 'Tottenham Hotspur', short_code: 'TOT', league: 'EPL' }
  ]
};

const LAST_LEAGUE_STORAGE_KEY = 'lms_last_active_league_id';
const STARTED_ROUNDS_STORAGE_KEY = 'lms_started_rounds_by_league';

export default function App() {
  // User Authentication & Profile State
  const [session, setSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [profile, setProfile] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot' | 'reset'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Navigation & Sidebar State
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'join' | null
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [tipsDrawerOpen, setTipsDrawerOpen] = useState(true);

  // User's Joined Leagues
  const [myLeagues, setMyLeagues] = useState([]);

  // Active Tournament & Custom League Context
  const [activeEntry, setActiveEntry] = useState(null);
  const [setupStep, setSetupStep] = useState('league'); // 'league' | 'lives'
  const [selectedLeague, setSelectedLeague] = useState(null);

  // Form Inputs for Custom League
  const [formCompName, setFormCompName] = useState('');
  const [formInviteCode, setFormInviteCode] = useState('');
  const [formSport, setFormSport] = useState('NRL');
  const [formLives, setFormLives] = useState(3);
  const [formError, setFormError] = useState('');

  // Game & Leaderboard State
  const [teams, setTeams] = useState([]);
  const [picks, setPicks] = useState([]);
  const [leagueMembers, setLeagueMembers] = useState([]);
  const [allLeaguePicks, setAllLeaguePicks] = useState([]);
  const [startedRoundsMap, setStartedRoundsMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STARTED_ROUNDS_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const LEAGUE_CONFIG = {
    NRL: { name: 'National Rugby League', defaultRound: 1 },
    AFL: { name: 'Australian Football League', defaultRound: 1 },
    EPL: { name: 'English Premier League', defaultRound: 1 },
  };

  // Track which rounds have kicked off for the active league
  const activeLeagueKey = activeEntry?.compId || activeEntry?.league || 'solo';
  const startedRoundsForActive = new Set(startedRoundsMap[activeLeagueKey] || []);

  const toggleRoundStarted = (roundNum) => {
    setStartedRoundsMap((prev) => {
      const currentList = new Set(prev[activeLeagueKey] || []);
      if (currentList.has(roundNum)) {
        currentList.delete(roundNum);
      } else {
        currentList.add(roundNum);
      }
      const updated = { ...prev, [activeLeagueKey]: Array.from(currentList) };
      localStorage.setItem(STARTED_ROUNDS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const openSavedLeague = (membership, playerName) => {
    if (!membership?.leagues) return;
    localStorage.setItem(LAST_LEAGUE_STORAGE_KEY, membership.league_id);
    setStatusMessage('');
    setActiveEntry({
      league: membership.leagues.sport || 'NRL',
      totalLives: membership.leagues.starting_lives || 1,
      remainingLives: membership.lives,
      compName: membership.leagues.name,
      inviteCode: membership.leagues.invite_code,
      compId: membership.league_id,
      playerName: playerName || profile?.username || 'Player'
    });
  };

  // 1. Restore session on page load
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY') {
        setAuthMode('reset');
        setAuthError('');
        setAuthSuccess('');
      }
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setProfile(null);
        setMyLeagues([]);
        setActiveEntry(null);
        setPicks([]);
        setLeagueMembers([]);
        setAllLeaguePicks([]);
      } else {
        setSession(currentSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 2. Load profile & saved comps when session changes
  useEffect(() => {
    if (session?.user) {
      fetchUserProfileAndLeagues(session.user, true);
    }
  }, [session?.user?.id]);

  async function fetchUserProfileAndLeagues(user, autoRestoreLastLeague = false) {
    if (!user?.id) return;

    let { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!prof) {
      const fallbackName =
        user.user_metadata?.username ||
        (user.email ? user.email.split('@')[0] : 'Player');

      const { data: createdProf } = await supabase
        .from('profiles')
        .upsert({ id: user.id, username: fallbackName })
        .select()
        .maybeSingle();

      prof = createdProf || { id: user.id, username: fallbackName };
    }

    setProfile(prof);

    const { data: memberships } = await supabase
      .from('league_members')
      .select('*, leagues(*)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (memberships) {
      setMyLeagues(memberships);

      if (autoRestoreLastLeague && !activeEntry && memberships.length > 0) {
        const savedLeagueId = localStorage.getItem(LAST_LEAGUE_STORAGE_KEY);
        const targetMembership =
          memberships.find((m) => m.league_id === savedLeagueId) || memberships[0];

        if (targetMembership?.leagues) {
          openSavedLeague(targetMembership, prof.username);
        }
      }
    }
  }

  // Handle Login, Sign Up, Forgot Password, and Set New Password
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      if (authMode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim(), {
          redirectTo: window.location.origin,
        });
        if (error) {
          setAuthError(error.message);
        } else {
          setAuthSuccess('Password reset link sent! Check your email inbox (and spam folder).');
        }
        return;
      }

      if (authMode === 'reset') {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) {
          setAuthError(error.message);
        } else {
          setAuthSuccess('Password updated! Entering your dashboard...');
          setNewPassword('');
          setTimeout(() => {
            setAuthMode('login');
            setAuthSuccess('');
          }, 1200);
        }
        return;
      }

      if (authMode === 'signup') {
        if (!authUsername.trim()) {
          setAuthError('Please enter a display name.');
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
          options: { data: { username: authUsername.trim() } }
        });

        if (error) {
          setAuthError(error.message);
        } else if (data?.user && !data?.session) {
          setAuthSuccess(
            'Account created! Please check your email inbox and click the confirmation link to log in.'
          );
        } else if (data?.session) {
          setSession(data.session);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword
        });

        if (error) {
          setAuthError(error.message);
        } else if (data?.session) {
          setSession(data.session);
        }
      }
    } catch (err) {
      setAuthError(err?.message || 'Unexpected authentication error. Check your connection.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem(LAST_LEAGUE_STORAGE_KEY);
    await supabase.auth.signOut();
    setActiveEntry(null);
    setSession(null);
    setProfile(null);
    setMyLeagues([]);
    setPicks([]);
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
    setAuthSuccess('');
  };

  const getOpponentInfo = (teamIndex, totalTeams, round) => {
    if (totalTeams < 2) return { opponentIndex: null, isHome: true };
    const opponentIndex =
      (teamIndex + round) % totalTeams === teamIndex
        ? (teamIndex + 1) % totalTeams
        : (teamIndex + round) % totalTeams;
    const isHome = (teamIndex + round) % 2 === 0;
    return { opponentIndex, isHome };
  };

  // Load Teams + League Standings & Picks when entering a league
  useEffect(() => {
    if (!activeEntry) return;

    async function loadTournamentData() {
      setLoading(true);
      const sportCode = activeEntry.league || 'NRL';

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('league', sportCode)
        .order('name');

      if (!teamsError && teamsData && teamsData.length > 0) {
        setTeams(teamsData);
      } else {
        setTeams(FALLBACK_TEAMS[sportCode] || []);
      }

      const defaultRnd = LEAGUE_CONFIG[sportCode]?.defaultRound || 1;
      setCurrentRound(defaultRnd);

      if (activeEntry.compId) {
        await refreshLeagueBoard(activeEntry.compId);
      }

      setLoading(false);
    }

    loadTournamentData();
  }, [activeEntry?.compId, activeEntry?.league]);

  async function refreshLeagueBoard(leagueId) {
    const [membersRes, picksRes] = await Promise.all([
      supabase
        .from('league_members')
        .select('*, profiles(username)')
        .eq('league_id', leagueId)
        .order('lives', { ascending: false }),

      supabase
        .from('picks')
        .select('*, teams(name, short_code, logo_url)')
        .eq('league_id', leagueId)
    ]);

    if (membersRes.data) {
      setLeagueMembers(membersRes.data);
      const me = membersRes.data.find((m) => m.user_id === session?.user?.id);
      if (me) {
        setActiveEntry((prev) => (prev ? { ...prev, remainingLives: me.lives } : prev));
      }
    }

    if (picksRes.data) {
      setAllLeaguePicks(picksRes.data);
      const myPicks = picksRes.data
        .filter((p) => p.user_id === session?.user?.id)
        .map((p) => ({
          round: Number(p.round_number),
          team_id: String(p.team_id),
          team_name: p.teams?.name || 'Selected Team',
          fixture: `Round ${p.round_number}`
        }));
      setPicks(myPicks);
    }
  }

  // Map every picked team ID -> the round number it was used in (across all past & future rounds)
  const teamRoundMap = new Map(picks.map((p) => [String(p.team_id), Number(p.round)]));
  const activeRoundPick = picks.find((p) => Number(p.round) === Number(currentRound));
  const isCurrentRoundLocked = startedRoundsForActive.has(Number(currentRound));

  // Lock in a team pick for the currently selected round (past, current, or upcoming)
  const handleSelectTeam = async (team, fixtureText) => {
    const teamIdStr = String(team.id);

    if (activeEntry.remainingLives <= 0) {
      setStatusMessage('Eliminated: No remaining lives.');
      return;
    }

    if (isCurrentRoundLocked) {
      setStatusMessage(`Round ${currentRound} has already kicked off—picks are locked.`);
      return;
    }

    const usedInRound = teamRoundMap.get(teamIdStr);
    if (usedInRound !== undefined && usedInRound !== Number(currentRound)) {
      setStatusMessage(
        `Rule violation: You already selected ${team.name} for Round ${usedInRound}.`
      );
      return;
    }

    const updated = picks.filter((p) => Number(p.round) !== Number(currentRound));
    setPicks([
      ...updated,
      {
        round: Number(currentRound),
        team_id: teamIdStr,
        team_name: team.name,
        fixture: fixtureText
      }
    ]);

    if (activeEntry.compId && session?.user?.id) {
      const { error } = await supabase.from('picks').upsert(
        {
          league_id: activeEntry.compId,
          user_id: session.user.id,
          round_number: Number(currentRound),
          team_id: team.id,
          status: 'pending'
        },
        { onConflict: 'league_id,user_id,round_number' }
      );

      if (error) {
        setStatusMessage(`Error saving pick: ${error.message}`);
        return;
      }

      await refreshLeagueBoard(activeEntry.compId);
    }

    setStatusMessage(`Locked in ${team.name} (${fixtureText}) for Round ${currentRound}.`);
  };

  // Create League in 'leagues' table + auto-join creator in 'league_members'
  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formCompName.trim()) {
      setFormError('Please enter a league name.');
      return;
    }

    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data: comp, error: compErr } = await supabase
      .from('leagues')
      .insert([
        {
          name: formCompName.trim(),
          sport: formSport,
          invite_code: generatedCode,
          starting_lives: formLives,
          created_by: session.user.id
        }
      ])
      .select()
      .single();

    if (compErr) {
      setFormError(compErr.message);
      return;
    }

    const { error: memberErr } = await supabase.from('league_members').insert([
      {
        league_id: comp.id,
        user_id: session.user.id,
        lives: formLives,
        status: 'active'
      }
    ]);

    if (memberErr) {
      setFormError(memberErr.message);
      return;
    }

    localStorage.setItem(LAST_LEAGUE_STORAGE_KEY, comp.id);
    await fetchUserProfileAndLeagues(session.user, false);

    setActiveEntry({
      league: comp.sport || formSport,
      totalLives: comp.starting_lives,
      remainingLives: comp.starting_lives,
      compName: comp.name,
      inviteCode: comp.invite_code,
      compId: comp.id,
      playerName: profile?.username || 'Player'
    });

    setActiveModal(null);
    setFormCompName('');
  };

  // Join League via Invite Code
  const handleJoinCompetition = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formInviteCode.trim()) {
      setFormError('Please enter the 6-character invite code.');
      return;
    }

    const { data: comp, error: compErr } = await supabase
      .from('leagues')
      .select('*')
      .eq('invite_code', formInviteCode.trim().toUpperCase())
      .single();

    if (compErr || !comp) {
      setFormError('Invalid invite code. Check with your league admin.');
      return;
    }

    const { error: joinErr } = await supabase.from('league_members').insert([
      {
        league_id: comp.id,
        user_id: session.user.id,
        lives: comp.starting_lives,
        status: 'active'
      }
    ]);

    if (joinErr && joinErr.code !== '23505') {
      setFormError(joinErr.message);
      return;
    }

    localStorage.setItem(LAST_LEAGUE_STORAGE_KEY, comp.id);
    await fetchUserProfileAndLeagues(session.user, false);

    setActiveEntry({
      league: comp.sport || 'NRL',
      totalLives: comp.starting_lives,
      remainingLives: comp.starting_lives,
      compName: comp.name,
      inviteCode: comp.invite_code,
      compId: comp.id,
      playerName: profile?.username || 'Player'
    });

    setActiveModal(null);
    setFormInviteCode('');
  };

  // Image error handler that automatically tries .svg if .png is missing
  const handleLogoError = (e) => {
    if (e.currentTarget.src.endsWith('.png')) {
      e.currentTarget.src = e.currentTarget.src.replace('.png', '.svg');
    } else {
      e.currentTarget.style.display = 'none';
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400 animate-pulse" />
          <span className="text-sm font-bold tracking-wider uppercase">Loading your session...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 0: PLAYER LOGIN / SIGN UP / FORGOT & RESET PASSWORD GATE
  // =========================================================================
  if (!session || authMode === 'reset') {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide text-white">LAST MAN STANDING</h1>
              <p className="text-xs text-slate-400">
                {authMode === 'login' && 'Sign in to submit your tips'}
                {authMode === 'signup' && 'Create your player profile'}
                {authMode === 'forgot' && 'Enter your email to reset your password'}
                {authMode === 'reset' && 'Choose a new password for your account'}
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 mb-4 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 mb-4 bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Display Name (Shown on Leaderboard)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phil"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {authMode !== 'reset' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {(authMode === 'login' || authMode === 'signup') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot');
                        setAuthError('');
                        setAuthSuccess('');
                      }}
                      className="text-xs text-blue-400 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="Minimum 6 characters"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {authMode === 'reset' && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-lg"
            >
              {authLoading
                ? 'Please wait...'
                : authMode === 'login'
                ? 'Sign In'
                : authMode === 'signup'
                ? 'Create Profile & Enter'
                : authMode === 'forgot'
                ? 'Send Password Reset Email'
                : 'Save New Password'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 space-y-2">
            {authMode === 'forgot' ? (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="text-blue-400 font-bold hover:underline"
              >
                &larr; Back to Sign In
              </button>
            ) : authMode !== 'reset' ? (
              <div>
                {authMode === 'login' ? "Don't have a player profile yet?" : 'Already registered?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'signup' : 'login');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-blue-400 font-bold hover:underline"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const isSidebarOpen = sidebarHovered || sidebarPinned;
  const maxRoundDisplay = Math.max(currentRound + 3, 12);
  const horizontalRounds = Array.from({ length: maxRoundDisplay }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black text-slate-100 flex relative overflow-x-hidden font-sans">
      <div
        onMouseEnter={() => setSidebarHovered(true)}
        className="fixed top-0 left-0 w-4 h-full z-40 cursor-pointer"
      />

      {/* Slide-out Sidebar */}
      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-md border-r border-slate-800 z-50 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-2xl ${
          isSidebarOpen ? 'w-96 translate-x-0' : 'w-14 -translate-x-12 md:translate-x-0 md:w-14'
        }`}
      >
        <div className="p-3.5 flex flex-col h-full justify-between overflow-y-auto">
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                {isSidebarOpen && (
                  <div>
                    <h2 className="font-black text-xs text-white tracking-wide">LAST MAN STANDING</h2>
                    <p className="text-[10px] text-emerald-400 font-bold">
                      {profile?.username || session.user.email}
                    </p>
                  </div>
                )}
              </div>

              {isSidebarOpen && (
                <button
                  onClick={() => setSidebarPinned(!sidebarPinned)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    sidebarPinned
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={sidebarPinned ? 'Unpin menu' : 'Keep menu open'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Create / Join Actions */}
            <div className="mt-4 space-y-1.5">
              <div
                className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1.5 ${
                  !isSidebarOpen && 'hidden'
                }`}
              >
                Leagues
              </div>

              <button
                onClick={() => {
                  setFormError('');
                  setActiveModal('create');
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold transition text-left ${
                  activeModal === 'create'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title="Create Comp"
              >
                <PlusCircle className="w-4 h-4 text-blue-400 shrink-0" />
                {isSidebarOpen && <span>Create Competition</span>}
              </button>

              <button
                onClick={() => {
                  setFormError('');
                  setActiveModal('join');
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold transition text-left ${
                  activeModal === 'join'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title="Join Comp"
              >
                <LogIn className="w-4 h-4 text-emerald-400 shrink-0" />
                {isSidebarOpen && <span>Join via Invite Code</span>}
              </button>
            </div>

            {/* My Saved Comps */}
            {myLeagues.length > 0 && isSidebarOpen && (
              <div className="mt-4 space-y-1.5 border-t border-slate-800 pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1.5 mb-1.5">
                  My Saved Comps
                </div>
                {myLeagues.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => openSavedLeague(m)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold border transition ${
                      activeEntry?.compId === m.league_id
                        ? 'bg-blue-950/80 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="truncate text-left">
                      <div className="truncate">{m.leagues?.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {m.leagues?.sport || 'NRL'} • Code: {m.leagues?.invite_code}
                      </div>
                    </div>
                    <span className="text-rose-400 flex items-center gap-1 shrink-0">
                      {m.lives} <Heart className="w-3 h-3 fill-rose-500" />
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Collapsible Dropdown: Running Order & Everyone's Tips */}
            {activeEntry?.compId && isSidebarOpen && (
              <div className="mt-4 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setTipsDrawerOpen(!tipsDrawerOpen)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 text-xs font-bold text-white transition"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Running Order & Tips</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      tipsDrawerOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {tipsDrawerOpen && (
                  <div className="mt-2 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 space-y-2.5">
                    {/* Round Kickoff Toggle inside Dropdown */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Round {currentRound} Visibility
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleRoundStarted(Number(currentRound))}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border transition ${
                          isCurrentRoundLocked
                            ? 'bg-emerald-950/70 border-emerald-600/70 text-emerald-300'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {isCurrentRoundLocked ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>Started (Visible)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-slate-400" />
                            <span>Pre-Kickoff (Hidden)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Compact Horizontal Scrollable Leaderboard Table */}
                    <div className="overflow-x-auto max-h-72">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400">
                            <th className="py-2 px-2 sticky left-0 bg-slate-950 z-10 min-w-[110px]">
                              Player
                            </th>
                            <th className="py-2 px-1.5 text-center">Lives</th>
                            {horizontalRounds.map((rNum) => {
                              const roundStarted = startedRoundsForActive.has(rNum);
                              return (
                                <th
                                  key={rNum}
                                  onClick={() => {
                                    setCurrentRound(rNum);
                                    setStatusMessage('');
                                  }}
                                  title={`Jump to Round ${rNum}`}
                                  className={`py-2 px-2 text-center min-w-[68px] cursor-pointer hover:text-white ${
                                    rNum === Number(currentRound)
                                      ? 'text-blue-400 bg-blue-950/40'
                                      : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-center gap-1">
                                    <span>R{rNum}</span>
                                    {roundStarted && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    )}
                                  </div>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {leagueMembers.map((member, idx) => {
                            const isMe = member.user_id === session.user.id;
                            const isEliminated =
                              member.lives <= 0 || member.status === 'eliminated';
                            const displayName = member.profiles?.username || 'Player';

                            return (
                              <tr
                                key={member.id}
                                className={
                                  isEliminated
                                    ? 'opacity-45 bg-rose-950/10'
                                    : isMe
                                    ? 'bg-blue-950/20'
                                    : ''
                                }
                              >
                                <td className="py-2 px-2 sticky left-0 bg-slate-950 z-10 whitespace-nowrap font-bold">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-mono text-slate-500">
                                      {idx + 1}.
                                    </span>
                                    <span className="text-slate-100 truncate max-w-[75px]">
                                      {displayName}
                                    </span>
                                    {isMe && (
                                      <span className="text-[9px] px-1 rounded bg-blue-500/20 text-blue-300">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                </td>

                                <td className="py-2 px-1.5 text-center whitespace-nowrap">
                                  {isEliminated ? (
                                    <span className="text-[9px] font-black text-rose-400">OUT</span>
                                  ) : (
                                    <span className="inline-flex items-center gap-0.5 font-bold text-rose-400">
                                      {member.lives}
                                      <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                                    </span>
                                  )}
                                </td>

                                {horizontalRounds.map((rNum) => {
                                  const pick = allLeaguePicks.find(
                                    (p) =>
                                      p.user_id === member.user_id &&
                                      Number(p.round_number) === rNum
                                  );
                                  const canSeePick = isMe || startedRoundsForActive.has(rNum);

                                  return (
                                    <td
                                      key={rNum}
                                      className={`py-1.5 px-1.5 text-center whitespace-nowrap ${
                                        rNum === Number(currentRound) ? 'bg-blue-950/20' : ''
                                      }`}
                                    >
                                      {!pick ? (
                                        <span className="text-slate-600">—</span>
                                      ) : !canSeePick ? (
                                        <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                          <Lock className="w-2.5 h-2.5 text-amber-400" />
                                          Tipped
                                        </span>
                                      ) : (
                                        <span
                                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                                            pick.status === 'win'
                                              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                                              : pick.status === 'loss'
                                              ? 'bg-rose-950/70 border-rose-500/50 text-rose-300 line-through'
                                              : 'bg-slate-800 border-slate-700 text-white'
                                          }`}
                                        >
                                          {pick.teams?.logo_url && (
                                            <img
                                              src={pick.teams.logo_url}
                                              alt=""
                                              className="w-3 h-3 object-contain"
                                              onError={handleLogoError}
                                            />
                                          )}
                                          <span>
                                            {pick.teams?.short_code || pick.teams?.name || 'Team'}
                                          </span>
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Active Entry Summary */}
            {activeEntry && isSidebarOpen && (
              <div className="mt-4 space-y-2.5 border-t border-slate-800 pt-3">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Remaining Lives
                    </div>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: activeEntry.totalLives }).map((_, i) => (
                        <Heart
                          key={i}
                          className={`w-4 h-4 ${
                            i < activeEntry.remainingLives
                              ? 'fill-rose-500 text-rose-500'
                              : 'fill-slate-800 text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      R{currentRound} Pick
                    </div>
                    <div className="font-bold text-xs text-white truncate max-w-[120px] mt-0.5">
                      {activeRoundPick ? activeRoundPick.team_name : 'None'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isSidebarOpen && (
            <div className="space-y-1.5 pt-3 border-t border-slate-800 mt-4">
              {activeEntry && (
                <button
                  onClick={() => {
                    localStorage.removeItem(LAST_LEAGUE_STORAGE_KEY);
                    setActiveEntry(null);
                    setSetupStep('league');
                    setPicks([]);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>All Leagues / Lobby</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-xs font-bold text-rose-300 border border-rose-900/50 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarPinned ? 'md:ml-96' : 'md:ml-14'
        }`}
      >
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-5 py-2.5 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarPinned(!sidebarPinned)}
              className="md:hidden p-1.5 bg-slate-800 rounded-lg text-slate-300"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="font-black text-xs sm:text-sm tracking-wider text-slate-200">
              LAST MAN STANDING
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Player: <strong className="text-white">{profile?.username || session.user.email}</strong>
            </span>
            {activeEntry?.compId && (
              <button
                onClick={() => {
                  setSidebarPinned(true);
                  setTipsDrawerOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/70 text-xs font-bold text-blue-200 transition"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>League Tips</span>
              </button>
            )}
            {activeEntry && (
              <button
                onClick={() => {
                  localStorage.removeItem(LAST_LEAGUE_STORAGE_KEY);
                  setActiveEntry(null);
                  setSetupStep('league');
                  setPicks([]);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
              >
                My Leagues ({myLeagues.length})
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-bold text-rose-300 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* View 1: Entry / Lobby Screen */}
        {!activeEntry ? (
          <div className="flex-1 flex items-center justify-center p-5">
            <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black">Welcome, {profile?.username || 'Player'}</h1>
                  <p className="text-slate-400 text-xs">
                    Open a saved league, create a new comp, or join with an invite code
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  onClick={() => {
                    setFormError('');
                    setActiveModal('create');
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-950/60 border border-blue-800/80 hover:bg-blue-900/60 rounded-xl text-xs font-bold text-blue-200 transition"
                >
                  <PlusCircle className="w-4 h-4 text-blue-400" />
                  <span>Create Comp with Friends</span>
                </button>

                <button
                  onClick={() => {
                    setFormError('');
                    setActiveModal('join');
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 rounded-xl text-xs font-bold text-emerald-200 transition"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Join with Invite Code</span>
                </button>
              </div>

              {myLeagues.length > 0 && (
                <div className="mb-5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Your Saved Competitions ({myLeagues.length})
                  </div>
                  <div className="space-y-2">
                    {myLeagues.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => openSavedLeague(m)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 transition text-left"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{m.leagues?.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                              {m.leagues?.sport || 'NRL'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Invite Code: {m.leagues?.invite_code}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                            {m.lives} <Heart className="w-3.5 h-3.5 fill-rose-500" />
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative flex py-1.5 items-center mb-4">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Or Practice Solo
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {setupStep === 'league' ? (
                <div className="space-y-2">
                  {Object.entries(LEAGUE_CONFIG).map(([code, config]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setSelectedLeague(code);
                        setSetupStep('lives');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition group text-left"
                    >
                      <div>
                        <div className="font-bold text-base text-white group-hover:text-blue-400 transition">
                          {code}
                        </div>
                        <div className="text-xs text-slate-400">{config.name}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Choose Lives
                    </span>
                    <button
                      onClick={() => setSetupStep('league')}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Change Sport ({selectedLeague})
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() =>
                          setActiveEntry({
                            league: selectedLeague,
                            totalLives: count,
                            remainingLives: count
                          })
                        }
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 transition flex flex-col items-center gap-2"
                      >
                        <div className="flex gap-1">
                          {Array.from({ length: count }).map((_, i) => (
                            <Heart key={i} className="w-4 h-4 fill-rose-500 text-rose-500" />
                          ))}
                        </div>
                        <div className="text-center font-bold text-white text-xs">
                          {count} {count === 1 ? 'Life' : 'Lives'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* View 2: Compact Team Selection Dashboard */
          <main className="p-4 md:p-6 max-w-7xl w-full mx-auto space-y-4">
            {/* Compact Round Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {activeEntry.compName ? `${activeEntry.compName} • ` : ''}
                    {activeEntry.league} • Round {currentRound}
                  </span>
                  {activeEntry.inviteCode && (
                    <span className="font-mono text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      Code: {activeEntry.inviteCode}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5 mt-0.5">
                  <h3 className="text-lg font-black text-white">
                    Pick Your Club — Round {currentRound}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    ({picks.length}/{teams.length} assigned)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setCurrentRound((r) => Math.max(1, r - 1));
                    setStatusMessage('');
                  }}
                  disabled={currentRound === 1}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold rounded-lg transition"
                >
                  Prev
                </button>
                <span className="text-xs font-mono font-bold px-2.5 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-blue-400">
                  R{currentRound}
                </span>
                <button
                  onClick={() => {
                    setCurrentRound((r) => r + 1);
                    setStatusMessage('');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition"
                >
                  Next
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="px-3.5 py-2 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Compact 5-Column Team Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {teams.map((team, index) => {
                const usedInRound = teamRoundMap.get(String(team.id));
                const isSelectedThisRound = usedInRound === Number(currentRound);
                const isUsedInAnotherRound =
                  usedInRound !== undefined && usedInRound !== Number(currentRound);

                const { opponentIndex, isHome } = getOpponentInfo(index, teams.length, currentRound);
                const opponent = opponentIndex !== null ? teams[opponentIndex] : null;
                const fixtureText = opponent
                  ? `${isHome ? 'vs' : '@'} ${opponent.short_code || opponent.name}`
                  : 'Bye';

                return (
                  <button
                    key={team.id}
                    disabled={
                      isUsedInAnotherRound ||
                      isCurrentRoundLocked ||
                      activeEntry.remainingLives <= 0
                    }
                    onClick={() => handleSelectTeam(team, fixtureText)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between min-h-[96px] transition-all relative ${
                      isSelectedThisRound
                        ? 'bg-blue-950/90 border-blue-500 ring-1 ring-blue-500/60 shadow-md'
                        : isUsedInAnotherRound
                        ? 'bg-slate-900/30 border-slate-800/40 opacity-40 cursor-not-allowed'
                        : isCurrentRoundLocked
                        ? 'bg-slate-900/60 border-slate-800 opacity-60 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-md bg-slate-800/90 p-0.5 flex items-center justify-center overflow-hidden border border-slate-700/60 shrink-0">
                            {team.logo_url ? (
                              <img
                                src={team.logo_url}
                                alt={team.name}
                                className="w-full h-full object-contain"
                                onError={handleLogoError}
                              />
                            ) : (
                              <span className="font-mono text-[9px] font-bold text-slate-400">
                                {team.short_code}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-400">
                            {team.short_code}
                          </span>
                        </div>

                        <div
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                            isSelectedThisRound
                              ? 'bg-blue-900/80 text-blue-200 border border-blue-700'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          <Swords className="w-2.5 h-2.5 text-slate-400" />
                          <span>{fixtureText}</span>
                        </div>
                      </div>

                      <div className="font-bold text-xs text-white line-clamp-1">{team.name}</div>
                    </div>

                    <div className="text-[9px] font-bold uppercase tracking-wider mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
                      {isSelectedThisRound ? (
                        <>
                          <span className="text-blue-400 font-black">Locked (R{currentRound})</span>
                          <CheckCircle2 className="w-3 h-3 text-blue-400" />
                        </>
                      ) : isUsedInAnotherRound ? (
                        <span className="text-amber-500/80">Used in R{usedInRound}</span>
                      ) : isCurrentRoundLocked ? (
                        <span className="text-slate-500">Round Locked</span>
                      ) : (
                        <span className="text-slate-500">Select R{currentRound}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </main>
        )}
      </div>

      {/* Modal: Create Competition */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Create Custom League</h3>
                <p className="text-xs text-slate-400">
                  Generates a unique invite code to share with friends
                </p>
              </div>
            </div>

            {formError && (
              <div className="p-3 mb-4 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCompetition} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  League Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Work Mates LMS 2026"
                  value={formCompName}
                  onChange={(e) => setFormCompName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Sport / Competition
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['NRL', 'AFL', 'EPL'].map((sport) => (
                    <button
                      type="button"
                      key={sport}
                      onClick={() => setFormSport(sport)}
                      className={`p-2.5 rounded-xl font-bold text-xs border transition ${
                        formSport === sport
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Starting Lives
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setFormLives(num)}
                      className={`p-2.5 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 ${
                        formLives === num
                          ? 'bg-rose-600 border-rose-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {num} {num === 1 ? 'Life' : 'Lives'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow-lg mt-2"
              >
                Create & Join League
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Join Competition */}
      {activeModal === 'join' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">Join Friend's League</h3>
                <p className="text-xs text-slate-400">
                  Enter the 6-character invite code shared by your league creator
                </p>
              </div>
            </div>

            {formError && (
              <div className="p-3 mb-4 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleJoinCompetition} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Invite Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. A8F3K2"
                  value={formInviteCode}
                  onChange={(e) => setFormInviteCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono uppercase text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg mt-2"
              >
                Join League
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}