import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import {
  Heart,
  Trophy,
  CheckCircle2,
  ChevronRight,
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

export default function App() {
  // User Authentication & Profile State
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Navigation & Sidebar State
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'join' | null
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);

  // User's Joined Leagues
  const [myLeagues, setMyLeagues] = useState([]);

  // Active Tournament & Custom League Context
  const [activeEntry, setActiveEntry] = useState(null);
  const [setupStep, setSetupStep] = useState('league'); // 'league' | 'lives'
  const [selectedLeague, setSelectedLeague] = useState(null);

  // Form Inputs for Custom League
  const [formCompName, setFormCompName] = useState('');
  const [formInviteCode, setFormInviteCode] = useState('');
  const [formSport, setFormSport] = useState('EPL');
  const [formLives, setFormLives] = useState(3);
  const [formError, setFormError] = useState('');

  // Game & Leaderboard State
  const [teams, setTeams] = useState([]);
  const [picks, setPicks] = useState([]); // Current user's picks
  const [leagueMembers, setLeagueMembers] = useState([]); // All members in active comp
  const [allLeaguePicks, setAllLeaguePicks] = useState([]); // All picks across league
  const [revealCurrentRound, setRevealCurrentRound] = useState(false); // Toggle round kick-off visibility
  const [currentRound, setCurrentRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const LEAGUE_CONFIG = {
    EPL: { name: 'English Premier League', defaultRound: 12 },
    AFL: { name: 'Australian Football League', defaultRound: 1 },
    NRL: { name: 'National Rugby League', defaultRound: 1 },
  };

  // 1. Check active login session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserProfileAndLeagues(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfileAndLeagues(session.user.id);
      } else {
        setProfile(null);
        setMyLeagues([]);
        setActiveEntry(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserProfileAndLeagues(userId) {
    // Load Profile
    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (prof) setProfile(prof);

    // Load all leagues this player belongs to
    const { data: memberships } = await supabase
      .from('league_members')
      .select('*, leagues(*)')
      .eq('user_id', userId);

    if (memberships) {
      setMyLeagues(memberships);
    }
  }

  // Handle Login / Sign Up
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (authMode === 'signup') {
      if (!authUsername.trim()) {
        setAuthError('Please enter a display name.');
        setAuthLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email: authEmail.trim(),
        password: authPassword,
        options: { data: { username: authUsername.trim() } }
      });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword
      });
      if (error) setAuthError(error.message);
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setActiveEntry(null);
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
      const sportCode = activeEntry.league || 'EPL';

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('league', sportCode)
        .order('name');

      if (!teamsError && teamsData) {
        setTeams(teamsData);
      }

      const defaultRnd = LEAGUE_CONFIG[sportCode]?.defaultRound || 1;
      setCurrentRound(defaultRnd);

      // If this is a database league, fetch members and picks
      if (activeEntry.compId) {
        await refreshLeagueBoard(activeEntry.compId);
      }

      setLoading(false);
    }

    loadTournamentData();
  }, [activeEntry]);

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
      // Keep current user's remaining lives synced
      const me = membersRes.data.find((m) => m.user_id === session?.user?.id);
      if (me) {
        setActiveEntry((prev) => (prev ? { ...prev, remainingLives: me.lives } : prev));
      }
    }

    if (picksRes.data) {
      setAllLeaguePicks(picksRes.data);
      // Filter current user's picks for burned-team tracking
      const myPicks = picksRes.data
        .filter((p) => p.user_id === session?.user?.id)
        .map((p) => ({
          round: p.round_number,
          team_id: p.team_id,
          team_name: p.teams?.name || 'Selected Team',
          fixture: `Round ${p.round_number}`
        }));
      setPicks(myPicks);
    }
  }

  const pickedTeamIds = new Set(picks.map((p) => p.team_id));
  const activeRoundPick = picks.find((p) => p.round === currentRound);

  // Lock in a team pick (saves to Supabase if inside a league)
  const handleSelectTeam = async (team, fixtureText) => {
    if (activeEntry.remainingLives <= 0) {
      setStatusMessage('Eliminated: No remaining lives.');
      return;
    }

    if (pickedTeamIds.has(team.id) && activeRoundPick?.team_id !== team.id) {
      setStatusMessage(`Rule violation: You have already used ${team.name}.`);
      return;
    }

    // Optimistic UI update
    const updated = picks.filter((p) => p.round !== currentRound);
    setPicks([
      ...updated,
      {
        round: currentRound,
        team_id: team.id,
        team_name: team.name,
        fixture: fixtureText
      }
    ]);

    // Save to Supabase if in a multiplayer league
    if (activeEntry.compId && session?.user?.id) {
      const { error } = await supabase.from('picks').upsert(
        {
          league_id: activeEntry.compId,
          user_id: session.user.id,
          round_number: currentRound,
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

    setStatusMessage(`Locked in ${team.name} (${fixtureText}) for Round${currentRound}.`);
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

    // Auto-join creator as player #1
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

    await fetchUserProfileAndLeagues(session.user.id);

    setActiveEntry({
      league: formSport,
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

    await fetchUserProfileAndLeagues(session.user.id);

    setActiveEntry({
      league: formSport,
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

  // =========================================================================
  // VIEW 0: PLAYER LOGIN / PROFILE CREATION GATE
  // =========================================================================
  if (!session) {
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
                {authMode === 'login' ? 'Sign in to submit your tips' : 'Create your player profile'}
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 mb-4 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
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

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-lg"
            >
              {authLoading
                ? 'Please wait...'
                : authMode === 'login'
                ? 'Sign In'
                : 'Create Profile & Enter'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            {authMode === 'login' ? "Don't have a player profile yet?" : 'Already registered?'}{' '}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setAuthError('');
              }}
              className="text-blue-400 font-bold hover:underline"
            >
              {authMode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSidebarOpen = sidebarHovered || sidebarPinned;

  // Build horizontal rounds list (e.g., R1 to R15 or up to currentRound + 2)
  const maxRoundDisplay = Math.max(currentRound + 2, 12);
  const horizontalRounds = Array.from({ length: maxRoundDisplay }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black text-slate-100 flex relative overflow-x-hidden font-sans">
      {/* Proximity trigger zone on left screen border */}
      <div
        onMouseEnter={() => setSidebarHovered(true)}
        className="fixed top-0 left-0 w-4 h-full z-40 cursor-pointer"
      />

      {/* Slide-out Sidebar */}
      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-md border-r border-slate-800 z-50 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-2xl ${
          isSidebarOpen ? 'w-80 translate-x-0' : 'w-16 -translate-x-12 md:translate-x-0 md:w-16'
        }`}
      >
        <div className="p-4 flex flex-col h-full justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                {isSidebarOpen && (
                  <div>
                    <h2 className="font-black text-sm text-white tracking-wide">LAST MAN STANDING</h2>
                    <p className="text-[10px] text-emerald-400 font-bold">
                      Logged in as {profile?.username || session.user.email}
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

            <div className="mt-6 space-y-2">
              <div
                className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 ${
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
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold transition text-left ${
                  activeModal === 'create'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title="Create Comp"
              >
                <PlusCircle className="w-5 h-5 text-blue-400 shrink-0" />
                {isSidebarOpen && <span>Create Competition</span>}
              </button>

              <button
                onClick={() => {
                  setFormError('');
                  setActiveModal('join');
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold transition text-left ${
                  activeModal === 'join'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title="Join Comp"
              >
                <LogIn className="w-5 h-5 text-emerald-400 shrink-0" />
                {isSidebarOpen && <span>Join via Invite Code</span>}
              </button>
            </div>

            {/* Saved Leagues List in Sidebar */}
            {myLeagues.length > 0 && isSidebarOpen && (
              <div className="mt-6 space-y-1.5 border-t border-slate-800 pt-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">
                  My Active Comps
                </div>
                {myLeagues.map((m) => (
                  <button
                    key={m.id}
                    onClick={() =>
                      setActiveEntry({
                        league: 'EPL',
                        totalLives: m.leagues?.starting_lives || 1,
                        remainingLives: m.lives,
                        compName: m.leagues?.name,
                        inviteCode: m.leagues?.invite_code,
                        compId: m.league_id,
                        playerName: profile?.username
                      })
                    }
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold border transition ${
                      activeEntry?.compId === m.league_id
                        ? 'bg-blue-950/80 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <span className="truncate">{m.leagues?.name}</span>
                    <span className="text-rose-400 flex items-center gap-1 shrink-0">
                      {m.lives} <Heart className="w-3 h-3 fill-rose-500" />
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeEntry && isSidebarOpen && (
              <div className="mt-6 space-y-4 border-t border-slate-800 pt-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    {activeEntry.compName ? 'Private League' : 'Solo Mode'}
                  </span>
                  <h3 className="text-lg font-black text-white truncate">
                    {activeEntry.compName || activeEntry.league}
                  </h3>
                  {activeEntry.inviteCode && (
                    <div className="mt-1 inline-block px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[11px] font-mono text-amber-400">
                      Invite Code: <strong>{activeEntry.inviteCode}</strong>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                    Remaining Lives
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: activeEntry.totalLives }).map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-5 h-5 ${
                          i < activeEntry.remainingLives
                            ? 'fill-rose-500 text-rose-500'
                            : 'fill-slate-800 text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
                    <span>Round {currentRound} Pick</span>
                    <Lock className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="font-bold text-sm text-white truncate">
                    {activeRoundPick ? activeRoundPick.team_name : 'No selection'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {isSidebarOpen && (
            <div className="space-y-2 pt-4 border-t border-slate-800">
              {activeEntry && (
                <button
                  onClick={() => {
                    setActiveEntry(null);
                    setSetupStep('league');
                    setPicks([]);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Switch League</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-xs font-bold text-rose-300 border border-rose-900/50 transition"
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
          sidebarPinned ? 'md:ml-80' : 'md:ml-16'
        }`}
      >
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setSidebarPinned(!sidebarPinned)}
            className="p-2 bg-slate-800 rounded-lg text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-black text-sm tracking-wider">LAST MAN STANDING</span>
          <div className="w-9" />
        </div>

        {/* View 1: Entry / Lobby Screen */}
        {!activeEntry ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black">Welcome, {profile?.username || 'Player'}</h1>
                    <p className="text-slate-400 text-sm">
                      Open a league, create a new comp, or join with an invite code
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Buttons: Create or Join */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => {
                    setFormError('');
                    setActiveModal('create');
                  }}
                  className="flex items-center justify-center gap-2 p-3.5 bg-blue-950/60 border border-blue-800/80 hover:bg-blue-900/60 rounded-xl text-xs font-bold text-blue-200 transition"
                >
                  <PlusCircle className="w-4 h-4 text-blue-400" />
                  <span>Create Comp with Friends</span>
                </button>

                <button
                  onClick={() => {
                    setFormError('');
                    setActiveModal('join');
                  }}
                  className="flex items-center justify-center gap-2 p-3.5 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 rounded-xl text-xs font-bold text-emerald-200 transition"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Join with Invite Code</span>
                </button>
              </div>

              {/* Saved Leagues Quick-Select */}
              {myLeagues.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Your Joined Competitions
                  </div>
                  <div className="space-y-2">
                    {myLeagues.map((m) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setActiveEntry({
                            league: 'EPL',
                            totalLives: m.leagues?.starting_lives || 1,
                            remainingLives: m.lives,
                            compName: m.leagues?.name,
                            inviteCode: m.leagues?.invite_code,
                            compId: m.league_id,
                            playerName: profile?.username
                          })
                        }
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 transition text-left"
                      >
                        <div>
                          <div className="font-bold text-white">{m.leagues?.name}</div>
                          <div className="text-xs text-slate-400 font-mono">
                            Invite Code: {m.leagues?.invite_code}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
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

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Or Practice Solo
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {setupStep === 'league' ? (
                <div className="space-y-3">
                  {Object.entries(LEAGUE_CONFIG).map(([code, config]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setSelectedLeague(code);
                        setSetupStep('lives');
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition group text-left"
                    >
                      <div>
                        <div className="font-bold text-lg text-white group-hover:text-blue-400 transition">
                          {code}
                        </div>
                        <div className="text-xs text-slate-400">{config.name}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
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
                  <div className="grid grid-cols-3 gap-3">
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
                        className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 transition flex flex-col items-center gap-3"
                      >
                        <div className="flex gap-1">
                          {Array.from({ length: count }).map((_, i) => (
                            <Heart key={i} className="w-5 h-5 fill-rose-500 text-rose-500" />
                          ))}
                        </div>
                        <div className="text-center font-bold text-white text-sm">
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
          /* View 2: Active League Standings + Team Selection Dashboard */
          <main className="p-6 md:p-10 space-y-8">
            {/* =============================================================
                RUNNING ORDER & HORIZONTAL ROUND PICKS BOARD
               ============================================================= */}
            {activeEntry.compId && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-black text-lg text-white">
                          {activeEntry.compName} — Running Order
                        </h2>
                        {activeEntry.inviteCode && (
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-400">
                            Code: {activeEntry.inviteCode}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        Ranked by remaining lives • Horizontal timeline of round selections
                      </p>
                    </div>
                  </div>

                  {/* Round Kick-Off Visibility Toggle */}
                  <button
                    onClick={() => setRevealCurrentRound(!revealCurrentRound)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                      revealCurrentRound
                        ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                        : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {revealCurrentRound ? (
                      <>
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span>Round {currentRound} Started (Picks Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-slate-400" />
                        <span>Round {currentRound} Open (Other Picks Hidden)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Horizontal Scrollable Standings Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-3.5 px-4 sticky left-0 bg-slate-950 z-10 min-w-[180px]">
                          Player
                        </th>
                        <th className="py-3.5 px-4 text-center min-w-[90px]">Lives</th>
                        {horizontalRounds.map((rNum) => (
                          <th
                            key={rNum}
                            className={`py-3.5 px-3 text-center min-w-[115px] ${
                              rNum === currentRound ? 'text-blue-400 bg-blue-950/20' : ''
                            }`}
                          >
                            R{rNum}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 text-sm">
                      {leagueMembers.map((member, idx) => {
                        const isMe = member.user_id === session.user.id;
                        const isEliminated = member.lives <= 0 || member.status === 'eliminated';
                        const displayName = member.profiles?.username || 'Player';

                        return (
                          <tr
                            key={member.id}
                            className={
                              isEliminated
                                ? 'opacity-45 bg-rose-950/10'
                                : isMe
                                ? 'bg-blue-950/15'
                                : 'hover:bg-slate-800/30'
                            }
                          >
                            {/* Running Order Rank + Player Name */}
                            <td className="py-3 px-4 sticky left-0 bg-slate-900 z-10 whitespace-nowrap font-bold">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-mono text-slate-500 w-4">
                                  {idx + 1}.
                                </span>
                                <span className="text-white">{displayName}</span>
                                {isMe && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-black">
                                    YOU
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Lives Remaining */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              {isEliminated ? (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                                  OUT
                                </span>
                              ) : (
                                <div className="inline-flex items-center gap-1">
                                  {Array.from({ length: member.lives }).map((_, i) => (
                                    <Heart
                                      key={i}
                                      className="w-3.5 h-3.5 fill-rose-500 text-rose-500"
                                    />
                                  ))}
                                </div>
                              )}
                            </td>

                            {/* Horizontal Line of Team Picks */}
                            {horizontalRounds.map((rNum) => {
                              const pick = allLeaguePicks.find(
                                (p) => p.user_id === member.user_id && p.round_number === rNum
                              );

                              // Show pick if: it's an earlier round, OR current round has started, OR it's your own pick
                              const canSeePick =
                                rNum < currentRound ||
                                (rNum === currentRound && revealCurrentRound) ||
                                isMe;

                              return (
                                <td
                                  key={rNum}
                                  className={`py-2.5 px-3 text-center whitespace-nowrap ${
                                    rNum === currentRound ? 'bg-blue-950/10' : ''
                                  }`}
                                >
                                  {!pick ? (
                                    <span className="text-slate-600 text-xs">—</span>
                                  ) : !canSeePick ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                                      <Lock className="w-3 h-3 text-amber-400" />
                                      Tipped
                                    </span>
                                  ) : (
                                    <div
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs