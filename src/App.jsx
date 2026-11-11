import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { 
  Heart, 
  Trophy, 
  Shield, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw, 
  Radio, 
  Calendar, 
  Lock, 
  Swords,
  PlusCircle,
  LogIn,
  X,
  Menu,
  Pin,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Navigation & Sidebar State
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'join' | null
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);

  // Active Tournament & Custom League Context
  const [activeEntry, setActiveEntry] = useState(null); 
  const [setupStep, setSetupStep] = useState('league'); // 'league' | 'lives'
  const [selectedLeague, setSelectedLeague] = useState(null);

  // Form Inputs for Custom League
  const [formCompName, setFormCompName] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPlayerName, setFormPlayerName] = useState('');
  const [formSport, setFormSport] = useState('EPL');
  const [formLives, setFormLives] = useState(3);
  const [formError, setFormError] = useState('');

  // Game State
  const [teams, setTeams] = useState([]);
  const [picks, setPicks] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const LEAGUE_CONFIG = {
    EPL: { name: 'English Premier League', defaultRound: 12 },
    AFL: { name: 'Australian Football League', defaultRound: 1 },
    NRL: { name: 'National Rugby League', defaultRound: 1 },
  };

  const getOpponentInfo = (teamIndex, totalTeams, round) => {
    if (totalTeams < 2) return { opponentIndex: null, isHome: true };
    const opponentIndex = (teamIndex + round) % totalTeams === teamIndex 
      ? (teamIndex + 1) % totalTeams 
      : (teamIndex + round) % totalTeams;
    const isHome = (teamIndex + round) % 2 === 0;
    return { opponentIndex, isHome };
  };

  useEffect(() => {
    if (!activeEntry) return;

    async function loadTournamentData() {
      setLoading(true);
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('league', activeEntry.league)
        .order('name');

      if (!teamsError && teamsData) {
        setTeams(teamsData);
      }

      setCurrentRound(LEAGUE_CONFIG[activeEntry.league].defaultRound);
      setLoading(false);
    }

    loadTournamentData();
  }, [activeEntry]);

  const pickedTeamIds = new Set(picks.map((p) => p.team_id));
  const activeRoundPick = picks.find((p) => p.round === currentRound);

  const handleSelectTeam = (team, fixtureText) => {
    if (activeEntry.remainingLives <= 0) {
      setStatusMessage('Eliminated: No remaining lives.');
      return;
    }

    if (pickedTeamIds.has(team.id) && activeRoundPick?.team_id !== team.id) {
      setStatusMessage(`Rule violation: You have already used ${team.name}.`);
      return;
    }

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
    setStatusMessage(`Locked in ${team.name} (${fixtureText}) for Round ${currentRound}.`);
  };

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formCompName.trim() || !formPassword.trim() || !formPlayerName.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }

    const { data: comp, error: compErr } = await supabase
      .from('competitions')
      .insert([
        {
          name: formCompName.trim(),
          sport: formSport,
          lives: formLives,
          password: formPassword.trim()
        }
      ])
      .select()
      .single();

    if (compErr) {
      setFormError(compErr.message.includes('unique') ? 'League name is already taken.' : compErr.message);
      return;
    }

    await supabase.from('competition_members').insert([
      {
        competition_id: comp.id,
        player_name: formPlayerName.trim(),
        lives_left: formLives
      }
    ]);

    setActiveEntry({
      league: comp.sport,
      totalLives: comp.lives,
      remainingLives: comp.lives,
      compName: comp.name,
      compId: comp.id,
      playerName: formPlayerName.trim()
    });

    setActiveModal(null);
    setFormCompName('');
    setFormPassword('');
    setFormPlayerName('');
  };

  const handleJoinCompetition = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formCompName.trim() || !formPassword.trim() || !formPlayerName.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }

    const { data: comp, error: compErr } = await supabase
      .from('competitions')
      .select('*')
      .eq('name', formCompName.trim())
      .single();

    if (compErr || !comp) {
      setFormError('Competition not found. Check the name spelling.');
      return;
    }

    if (comp.password !== formPassword.trim()) {
      setFormError('Incorrect league password.');
      return;
    }

    await supabase.from('competition_members').insert([
      {
        competition_id: comp.id,
        player_name: formPlayerName.trim(),
        lives_left: comp.lives
      }
    ]);

    setActiveEntry({
      league: comp.sport,
      totalLives: comp.lives,
      remainingLives: comp.lives,
      compName: comp.name,
      compId: comp.id,
      playerName: formPlayerName.trim()
    });

    setActiveModal(null);
    setFormCompName('');
    setFormPassword('');
    setFormPlayerName('');
  };

  const isSidebarOpen = sidebarHovered || sidebarPinned;

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
        <div className="p-4 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                {isSidebarOpen && (
                  <div>
                    <h2 className="font-black text-sm text-white tracking-wide">LAST MAN STANDING</h2>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Tournament Hub</p>
                  </div>
                )}
              </div>

              {isSidebarOpen && (
                <button
                  onClick={() => setSidebarPinned(!sidebarPinned)}
                  className={`p-1.5 rounded-lg border text-xs transition ${
                    sidebarPinned ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={sidebarPinned ? 'Unpin menu' : 'Keep menu open'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <div className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 ${!isSidebarOpen && 'hidden'}`}>
                Custom Leagues
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
                {isSidebarOpen && <span>Join Competition</span>}
              </button>
            </div>

            {activeEntry && isSidebarOpen && (
              <div className="mt-8 space-y-4 border-t border-slate-800 pt-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    {activeEntry.compName ? 'Custom Private Comp' : 'Public Challenge'}
                  </span>
                  <h3 className="text-xl font-black text-white truncate">
                    {activeEntry.compName || activeEntry.league}
                  </h3>
                  {activeEntry.playerName && (
                    <span className="text-xs text-slate-400">Player: {activeEntry.playerName}</span>
                  )}
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Remaining Lives</div>
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
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {activeRoundPick?.fixture || 'Click a club on the grid'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {activeEntry && isSidebarOpen && (
            <button
              onClick={() => {
                setActiveEntry(null);
                setSetupStep('league');
                setPicks([]);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-white border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Leave / New Entry</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarPinned ? 'md:ml-80' : 'md:ml-16'}`}>
        
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

        {/* View 1: Entry / Nominate Screen */}
        {!activeEntry ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-black">Join a Competition</h1>
                  <p className="text-slate-400 text-sm">Choose a quick sport or create a private comp with friends</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => { setFormError(''); setActiveModal('create'); }}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-950/60 border border-blue-800/80 hover:bg-blue-900/60 rounded-xl text-xs font-bold text-blue-200 transition"
                >
                  <PlusCircle className="w-4 h-4 text-blue-400" />
                  <span>Create Comp with Friends</span>
                </button>

                <button
                  onClick={() => { setFormError(''); setActiveModal('join'); }}
                  className="flex items-center justify-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 rounded-xl text-xs font-bold text-emerald-200 transition"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Join Friend's Comp</span>
                </button>
              </div>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-widest text-slate-500">Or Play Solo Match</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {setupStep === 'league' && (
                <div className="space-y-3">
                  {Object.entries(LEAGUE_CONFIG).map(([code, config]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setSelectedLeague(code);
                        setSetupStep('lives');
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition group text-left"
                    >
                      <div>
                        <div className="font-bold text-lg text-white group-hover:text-blue-400 transition">{code}</div>
                        <div className="text-xs text-slate-400">{config.name}</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-white">
                        <span>Round {config.defaultRound} Active</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {setupStep === 'lives' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Choose Lives</span>
                    <button onClick={() => setSetupStep('league')} className="text-xs text-blue-400 hover:underline">
                      Change Sport ({selectedLeague})
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() => {
                          setActiveEntry({
                            league: selectedLeague,
                            totalLives: count,
                            remainingLives: count,
                          });
                        }}
                        className="p-5 rounded-xl bg-slate-850 border border-slate-800 hover:border-rose-500 transition flex flex-col items-center gap-3"
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
          /* View 2: Main Active Dashboard */
          <main className="p-6 md:p-10 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-slate-800 p-5 rounded-2xl gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>
                    {activeEntry.compName ? `${activeEntry.compName} • ` : ''}Round {currentRound}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mt-1">
                  Pick Your Club
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentRound((r) => Math.max(1, r - 1))}
                  disabled={currentRound === 1}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold rounded-lg transition"
                >
                  Previous Round
                </button>
                <span className="text-xs font-mono font-bold px-3 py-2 bg-slate-950 rounded-lg border border-slate-800">
                  R{currentRound}
                </span>
                <button
                  onClick={() => setCurrentRound((r) => r + 1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition"
                >
                  Next Round
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {teams.map((team, index) => {
                const isSelectedThisRound = activeRoundPick?.team_id === team.id;
                const isBurnedInPriorRound = pickedTeamIds.has(team.id) && !isSelectedThisRound;

                const { opponentIndex, isHome } = getOpponentInfo(index, teams.length, currentRound);
                const opponent = opponentIndex !== null ? teams[opponentIndex] : null;
                const fixtureText = opponent 
                  ? `${isHome ? 'vs' : '@'} ${opponent.short_code || opponent.name}`
                  : 'Bye';

                return (
                  <button
                    key={team.id}
                    disabled={isBurnedInPriorRound || activeEntry.remainingLives <= 0}
                    onClick={() => handleSelectTeam(team, fixtureText)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between min-h-[145px] transition-all relative ${
                      isSelectedThisRound
                        ? 'bg-blue-950/90 border-blue-500 ring-2 ring-blue-500/50 shadow-lg'
                        : isBurnedInPriorRound
                        ? 'bg-slate-900/30 border-slate-800/40 opacity-40 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-800/80 p-1 flex items-center justify-center overflow-hidden border border-slate-700/60 shrink-0">
                            {team.logo_url ? (
                              <img 
                                src={team.logo_url} 
                                alt={team.name} 
                                className="w-full h-full object-contain"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <span className="font-mono text-[10px] font-bold text-slate-400">
                                {team.short_code}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-400">
                            {team.short_code}
                          </span>
                        </div>

                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          isSelectedThisRound 
                            ? 'bg-blue-900/80 text-blue-200 border border-blue-700' 
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          <Swords className="w-3 h-3 text-slate-400" />
                          <span>{fixtureText}</span>
                        </div>
                      </div>

                      <div className="font-bold text-base text-white line-clamp-1">{team.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {isHome ? 'Home against' : 'Away at'} {opponent?.name || 'TBD'}
                      </div>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      {isSelectedThisRound ? (
                        <>
                          <span className="text-blue-400 font-black">Locked In</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        </>
                      ) : isBurnedInPriorRound ? (
                        <span className="text-slate-600">Already Burned</span>
                      ) : (
                        <span className="text-slate-500 hover:text-slate-300">Click to Select</span>
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
                <p className="text-xs text-slate-400">Set up a competition and invite your mates</p>
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
                  {['EPL', 'AFL', 'NRL'].map((sport) => (
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
                  Tournament Lives
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
                      <span>{num} {num === 1 ? 'Life' : 'Lives'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  League Password
                </label>
                <input
                  type="password"
                  placeholder="Set secret password for friends"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Your Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dave"
                  value={formPlayerName}
                  onChange={(e) => setFormPlayerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition shadow-lg mt-2"
              >
                Create and Enter Competition
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
                <h3 className="font-black text-lg text-white">Join Friend's Competition</h3>
                <p className="text-xs text-slate-400">Enter the name and password provided by your league admin</p>
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
                  Competition Name
                </label>
                <input
                  type="text"
                  placeholder="Enter exact league name"
                  value={formCompName}
                  onChange={(e) => setFormCompName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  League Password
                </label>
                <input
                  type="password"
                  placeholder="Enter league password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Your Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah"
                  value={formPlayerName}
                  onChange={(e) => setFormPlayerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg mt-2"
              >
                Join and Open Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}