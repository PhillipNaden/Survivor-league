import { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabase';
import {
  Heart,
  Trophy,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Calendar,
  Lock,
  PlusCircle,
  LogIn,
  LogOut,
  X,
  Menu,
  Pin,
  AlertCircle,
  Users,
  Trash2,
  Clock,
  LayoutGrid,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  Send,
  ShieldCheck,
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

function getActiveSeasonInfo(sportCode) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;

  if (sportCode === 'EPL') {
    const startYear = month >= 7 ? year : year - 1;
    const endShort = String(startYear + 1).slice(-2);
    return {
      label: `${startYear}-${endShort}`,
      sportsDbSeason: `${startYear}-${startYear + 1}`,
      openFootballSlug: `${startYear}-${endShort}`,
    };
  }

  const targetYear = month >= 11 ? year + 1 : year;
  return {
    label: String(targetYear),
    sportsDbSeason: String(targetYear),
  };
}

function detectCurrentLeagueRound(sportCode, fixturesList) {
  const nowMs = Date.now();
  const sportFixtures = (fixturesList || []).filter((f) => f.sport === sportCode);

  if (sportFixtures.length > 0) {
    const roundEarliest = new Map();
    sportFixtures.forEach((f) => {
      const r = Number(f.round_number);
      const t = new Date(f.kickoff_utc).getTime();
      if (!isNaN(r) && !isNaN(t)) {
        if (!roundEarliest.has(r) || t < roundEarliest.get(r)) {
          roundEarliest.set(r, t);
        }
      }
    });

    const sortedRounds = Array.from(roundEarliest.entries()).sort((a, b) => a[0] - b[0]);
    const upcoming = sortedRounds.find(([, earliestKickoff]) => earliestKickoff > nowMs);
    if (upcoming) return upcoming[0];
    if (sortedRounds.length > 0) return sortedRounds[sortedRounds.length - 1][0];
  }

  return sportCode === 'EPL' ? 11 : 1;
}

const SPORTSDB_LEAGUE_IDS = {
  EPL: '4328',
  NRL: '4416',
  AFL: '4456',
};

const TEAM_NAME_ALIASES = {
  'brisbane broncos': 'BRI', 'broncos': 'BRI',
  'canberra raiders': 'CAN', 'raiders': 'CAN',
  'canterbury-bankstown bulldogs': 'CBY', 'canterbury bulldogs': 'CBY', 'bulldogs': 'CBY',
  'cronulla-sutherland sharks': 'CRO', 'cronulla sharks': 'CRO', 'sharks': 'CRO',
  'dolphins': 'DOL', 'redcliffe dolphins': 'DOL',
  'gold coast titans': 'GLD', 'titans': 'GLD',
  'manly warringah sea eagles': 'MAN', 'manly sea eagles': 'MAN', 'sea eagles': 'MAN',
  'melbourne storm': 'MST', 'storm': 'MST',
  'new zealand warriors': 'NZW', 'nz warriors': 'NZW', 'warriors': 'NZW',
  'newcastle knights': 'NCL', 'knights': 'NCL',
  'north queensland cowboys': 'NQL', 'cowboys': 'NQL',
  'parramatta eels': 'PAR', 'eels': 'PAR',
  'penrith panthers': 'PEN', 'panthers': 'PEN',
  'south sydney rabbitohs': 'SOU', 'rabbitohs': 'SOU',
  'st. george illawarra dragons': 'SGI', 'st george illawarra dragons': 'SGI', 'dragons': 'SGI',
  'sydney roosters': 'SYR', 'roosters': 'SYR',
  'wests tigers': 'WST', 'tigers': 'WST',

  'adelaide crows': 'ADE', 'adelaide': 'ADE',
  'brisbane lions': 'BRL', 'brisbane': 'BRL',
  'carlton blues': 'CAR', 'carlton': 'CAR',
  'collingwood magpies': 'COL', 'collingwood': 'COL',
  'essendon bombers': 'ESS', 'essendon': 'ESS',
  'fremantle dockers': 'FRE', 'fremantle': 'FRE',
  'geelong cats': 'GEE', 'geelong': 'GEE',
  'gold coast suns': 'GCS', 'gold coast': 'GCS',
  'gws giants': 'GWS', 'greater western sydney giants': 'GWS', 'gws': 'GWS',
  'hawthorn hawks': 'HAW', 'hawthorn': 'HAW',
  'melbourne demons': 'MEL', 'melbourne': 'MEL',
  'north melbourne kangaroos': 'NTH', 'north melbourne': 'NTH',
  'port adelaide power': 'PTA', 'port adelaide': 'PTA',
  'richmond tigers': 'RIC', 'richmond': 'RIC',
  'st kilda saints': 'STK', 'st kilda': 'STK', 'st. kilda': 'STK',
  'sydney swans': 'SYD', 'sydney': 'SYD',
  'west coast eagles': 'WCE', 'west coast': 'WCE',
  'western bulldogs': 'WBD', 'footscray': 'WBD',

  'afc bournemouth': 'BOU', 'bournemouth': 'BOU',
  'arsenal': 'ARS', 'arsenal fc': 'ARS',
  'aston villa': 'AVL', 'aston villa fc': 'AVL',
  'brentford': 'BRE', 'brentford fc': 'BRE',
  'brighton & hove albion': 'BHA', 'brighton and hove albion': 'BHA', 'brighton & hove albion fc': 'BHA', 'brighton': 'BHA',
  'chelsea': 'CHE', 'chelsea fc': 'CHE',
  'coventry city': 'COV', 'coventry city fc': 'COV', 'coventry': 'COV',
  'crystal palace': 'CRY', 'crystal palace fc': 'CRY',
  'everton': 'EVE', 'everton fc': 'EVE',
  'fulham': 'FUL', 'fulham fc': 'FUL',
  'hull city': 'HUL', 'hull city afc': 'HUL', 'hull': 'HUL',
  'ipswich town': 'IPS', 'ipswich town fc': 'IPS', 'ipswich': 'IPS',
  'leeds united': 'LEE', 'leeds united fc': 'LEE', 'leeds': 'LEE',
  'liverpool': 'LIV', 'liverpool fc': 'LIV',
  'manchester city': 'MCI', 'manchester city fc': 'MCI', 'man city': 'MCI',
  'manchester united': 'MUN', 'manchester united fc': 'MUN', 'man united': 'MUN', 'man utd': 'MUN',
  'newcastle united': 'NEW', 'newcastle united fc': 'NEW', 'newcastle': 'NEW',
  'nottingham forest': 'NFO', 'nottingham forest fc': 'NFO', "nott'm forest": 'NFO',
  'sunderland': 'SUN', 'sunderland afc': 'SUN',
  'tottenham hotspur': 'TOT', 'tottenham hotspur fc': 'TOT', 'tottenham': 'TOT', 'spurs': 'TOT',
};

function resolveTeamShortCode(rawName, teamsList) {
  if (!rawName) return null;
  const cleaned = rawName.trim().toLowerCase();
  if (TEAM_NAME_ALIASES[cleaned]) return TEAM_NAME_ALIASES[cleaned];

  const exactMatch = teamsList.find(
    (t) =>
      t.name.toLowerCase() === cleaned ||
      t.short_code.toLowerCase() === cleaned
  );
  if (exactMatch) return exactMatch.short_code;

  const partialMatch = teamsList.find(
    (t) =>
      cleaned.includes(t.name.toLowerCase()) ||
      t.name.toLowerCase().includes(cleaned)
  );
  return partialMatch ? partialMatch.short_code : null;
}

const LAST_LEAGUE_STORAGE_KEY = 'lms_last_active_league_id';

function formatLocalKickoff(dateObj) {
  if (!dateObj || isNaN(dateObj.getTime())) return 'TBD';
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(dateObj);
}

function formatMessageTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

function getDefaultRoundKickoffUTC(sport, compRoundNumber, actualLeagueRound, dbSchedules) {
  const override = dbSchedules?.[Number(actualLeagueRound)];
  if (override) {
    return new Date(override);
  }

  const now = new Date();
  const base = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 15, 0, 0));
  const dayOfWeek = base.getUTCDay();
  const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
  base.setUTCDate(base.getUTCDate() + daysUntilSat + (Number(compRoundNumber) - 1) * 7);

  if (sport === 'NRL' || sport === 'AFL') {
    base.setUTCHours(9, 0, 0, 0);
  }

  return base;
}

function buildRoundMatchups(
  teamsList,
  sportCode,
  compRoundNumber,
  actualLeagueRound,
  dbFixtures,
  dbSchedules
) {
  if (!teamsList || teamsList.length < 2) {
    return { matches: [], byeTeam: null };
  }

  const byShortCode = new Map(teamsList.map((t) => [t.short_code, t]));
  const roundDbFixtures = (dbFixtures || []).filter(
    (f) => Number(f.round_number) === Number(actualLeagueRound)
  );

  if (roundDbFixtures.length > 0) {
    const usedIds = new Set();
    const matches = [];

    roundDbFixtures.forEach((f, idx) => {
      const home = byShortCode.get(f.home_short_code);
      const away = byShortCode.get(f.away_short_code);
      if (home && away) {
        usedIds.add(String(home.id));
        usedIds.add(String(away.id));
        matches.push({
          id: f.id || `db-match-${actualLeagueRound}-${idx}`,
          home,
          away,
          kickoffUTC: new Date(f.kickoff_utc),
        });
      }
    });

    const byeTeam = teamsList.find((t) => !usedIds.has(String(t.id))) || null;
    matches.sort((a, b) => a.kickoffUTC - b.kickoffUTC);
    return { matches, byeTeam };
  }

  const pool = [...teamsList];
  const hasBye = pool.length % 2 === 1;
  if (hasBye) {
    pool.push(null);
  }

  const n = pool.length;
  const r = (Number(actualLeagueRound) - 1) % (n - 1);

  const rotated = [pool[0]];
  for (let i = 1; i < n; i++) {
    const idx = 1 + ((i - 1 + r) % (n - 1));
    rotated.push(pool[idx]);
  }

  const roundStartUTC = getDefaultRoundKickoffUTC(
    sportCode,
    compRoundNumber,
    actualLeagueRound,
    dbSchedules
  );
  const matches = [];
  let byeTeam = null;

  for (let i = 0; i < n / 2; i++) {
    const teamA = rotated[i];
    const teamB = rotated[n - 1 - i];

    if (!teamA && teamB) {
      byeTeam = teamB;
      continue;
    }
    if (!teamB && teamA) {
      byeTeam = teamA;
      continue;
    }

    const flipHome = (Number(actualLeagueRound) + i) % 2 === 1;
    const home = flipHome ? teamB : teamA;
    const away = flipHome ? teamA : teamB;

    const kickoffUTC = new Date(roundStartUTC.getTime());
    if (sportCode === 'EPL') {
      const eplOffsets = [-2.5, 0, 0, 0, 0, 0, 2.5, 23, 23, 25.5];
      kickoffUTC.setTime(
        roundStartUTC.getTime() + eplOffsets[i % eplOffsets.length] * 3600 * 1000
      );
    } else if (sportCode === 'NRL') {
      const nrlOffsets = [-47, -26, -24, -4, -1.5, 0.5, 19, 21];
      kickoffUTC.setTime(
        roundStartUTC.getTime() + nrlOffsets[i % nrlOffsets.length] * 3600 * 1000
      );
    } else {
      const aflOffsets = [-47.5, -24.5, -5.5, -2.5, 0.5, 0.5, 18, 20.5, 22];
      kickoffUTC.setTime(
        roundStartUTC.getTime() + aflOffsets[i % aflOffsets.length] * 3600 * 1000
      );
    }

    matches.push({
      id: `rr-${sportCode}-r${actualLeagueRound}-${home.short_code}-${away.short_code}`,
      home,
      away,
      kickoffUTC,
    });
  }

  matches.sort((a, b) => a.kickoffUTC - b.kickoffUTC);
  return { matches, byeTeam };
}

function pickDeterministicRandomTeam(availableTeams, seedStr) {
  let hash = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const index = Math.abs(hash) % availableTeams.length;
  return availableTeams[index];
}

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
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'join' | 'howto' | null
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [activeTab, setActiveTab] = useState('picks'); // 'picks' | 'standings' | 'chat'

  // Live Clock Tick
  const [nowTick, setNowTick] = useState(() => Date.now());

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

  // League Message Board State
  const [leagueMessages, setLeagueMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatBottomRef = useRef(null);

  // Game, Schedules & Leaderboard State
  const [teams, setTeams] = useState([]);
  const [dbFixtures, setDbFixtures] = useState([]);
  const [picks, setPicks] = useState([]);
  const [leagueMembers, setLeagueMembers] = useState([]);
  const [allLeaguePicks, setAllLeaguePicks] = useState([]);
  const [roundSchedules, setRoundSchedules] = useState({});
  const [currentRound, setCurrentRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [syncingFixtures, setSyncingFixtures] = useState(false);
  const [pickBusy, setPickBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const autoResolveRunningRef = useRef(false);

  const LEAGUE_CONFIG = {
    NRL: { name: 'National Rugby League', roundLabel: 'Round' },
    AFL: { name: 'Australian Football League', roundLabel: 'Round' },
    EPL: { name: 'English Premier League', roundLabel: 'Matchweek' },
  };

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  const startLeagueRound = Number(activeEntry?.startRound || 1);
  const getActualLeagueRound = (compRoundNum) =>
    startLeagueRound + (Number(compRoundNum) - 1);

  const getRoundBracketLabel = (compRoundNum) => {
    const sportCode = activeEntry?.league || 'NRL';
    const word = LEAGUE_CONFIG[sportCode]?.roundLabel || 'Round';
    const actual = getActualLeagueRound(compRoundNum);
    return `${word} ${actual}`;
  };

  const actualCurrentLeagueRound = getActualLeagueRound(currentRound);

  const { matches: roundMatches, byeTeam: roundByeTeam } = buildRoundMatchups(
    teams,
    activeEntry?.league || 'NRL',
    currentRound,
    actualCurrentLeagueRound,
    dbFixtures,
    roundSchedules
  );

  const getRoundFirstKickoff = (compRoundNum) => {
    const sportCode = activeEntry?.league || 'NRL';
    const actualRound = getActualLeagueRound(compRoundNum);
    const { matches } = buildRoundMatchups(
      teams,
      sportCode,
      compRoundNum,
      actualRound,
      dbFixtures,
      roundSchedules
    );
    if (matches.length > 0) {
      return matches[0].kickoffUTC;
    }
    return getDefaultRoundKickoffUTC(sportCode, compRoundNum, actualRound, roundSchedules);
  };

  const isRoundStarted = (compRoundNum) => {
    const firstKickoff = getRoundFirstKickoff(compRoundNum);
    return nowTick >= firstKickoff.getTime();
  };

  // =========================================================================
  // AUTOMATIC MISSED-PICK ENFORCEMENT
  // =========================================================================
  useEffect(() => {
    if (
      !activeEntry?.compId ||
      !teams.length ||
      !leagueMembers.length ||
      loading ||
      autoResolveRunningRef.current
    ) {
      return;
    }

    const maxCompRounds = teams.length;
    const startedCompRounds = [];
    for (let r = 1; r <= maxCompRounds; r++) {
      if (isRoundStarted(r)) {
        startedCompRounds.push(r);
      }
    }

    if (startedCompRounds.length === 0) return;

    async function enforceMissedPicksForStartedRounds() {
      autoResolveRunningRef.current = true;
      let anyChangeMade = false;
      let myAutoNotice = '';

      try {
        for (const member of leagueMembers) {
          if (member.lives <= 0 || member.status === 'eliminated') continue;

          const memberPicks = allLeaguePicks.filter((p) => p.user_id === member.user_id);
          const usedTeamIds = new Set(memberPicks.map((p) => String(p.team_id)));
          const pickedRounds = new Set(memberPicks.map((p) => Number(p.round_number)));

          for (const compRnd of startedCompRounds) {
            if (pickedRounds.has(compRnd)) continue;

            const actualRnd = getActualLeagueRound(compRnd);
            const { byeTeam } = buildRoundMatchups(
              teams,
              activeEntry.league || 'NRL',
              compRnd,
              actualRnd,
              dbFixtures,
              roundSchedules
            );

            const availableTeams = teams.filter(
              (t) =>
                !usedTeamIds.has(String(t.id)) &&
                (!byeTeam || String(t.id) !== String(byeTeam.id))
            );

            if (availableTeams.length > 0) {
              const randomTeam = pickDeterministicRandomTeam(
                availableTeams,
                `${activeEntry.compId}:${member.user_id}:r${compRnd}`
              );

              const { error } = await supabase.from('picks').upsert(
                {
                  league_id: activeEntry.compId,
                  user_id: member.user_id,
                  round_number: compRnd,
                  team_id: randomTeam.id,
                  status: 'auto_pick'
                },
                { onConflict: 'league_id,user_id,round_number' }
              );

              if (!error) {
                usedTeamIds.add(String(randomTeam.id));
                pickedRounds.add(compRnd);
                anyChangeMade = true;
                if (member.user_id === session?.user?.id) {
                  myAutoNotice = `No tip entered before Round ${compRnd} (${getRoundBracketLabel(
                    compRnd
                  )}) kickoff — ${randomTeam.name} was automatically assigned.`;
                }
              }
            } else {
              const penaltyKey = `lms_no_team_penalty_${activeEntry.compId}_${member.user_id}_r${compRnd}`;
              if (!localStorage.getItem(penaltyKey)) {
                const newLives = Math.max(0, Number(member.lives) - 1);
                const newStatus = newLives <= 0 ? 'eliminated' : 'active';

                const { error } = await supabase
                  .from('league_members')
                  .update({ lives: newLives, status: newStatus })
                  .eq('id', member.id);

                if (!error) {
                  localStorage.setItem(penaltyKey, '1');
                  member.lives = newLives;
                  member.status = newStatus;
                  anyChangeMade = true;
                  if (member.user_id === session?.user?.id) {
                    myAutoNotice = `No tip entered and no unused teams left for Round ${compRnd} (${getRoundBracketLabel(
                      compRnd
                    )}) — 1 life automatically deducted.`;
                  }
                }
              }
            }
          }
        }

        if (anyChangeMade) {
          await refreshLeagueBoard(activeEntry.compId);
          if (myAutoNotice) {
            setStatusMessage(myAutoNotice);
          }
        }
      } finally {
        autoResolveRunningRef.current = false;
      }
    }

    enforceMissedPicksForStartedRounds();
  }, [
    nowTick,
    activeEntry?.compId,
    teams.length,
    leagueMembers.length,
    allLeaguePicks.length,
    loading
  ]);

  // =========================================================================
  // LEAGUE MESSAGE BOARD: LOAD & REALTIME SUBSCRIPTION
  // =========================================================================
  async function fetchLeagueMessages(leagueId) {
    if (!leagueId) return;
    const { data, error } = await supabase
      .from('league_messages')
      .select('*, profiles(username)')
      .eq('league_id', leagueId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (!error && data) {
      setLeagueMessages(data);
    }
  }

  useEffect(() => {
    const leagueId = activeEntry?.compId;
    if (!leagueId) {
      setLeagueMessages([]);
      return;
    }

    fetchLeagueMessages(leagueId);

    const channel = supabase
      .channel(`league-chat-${leagueId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'league_messages',
          filter: `league_id=eq.${leagueId}`,
        },
        () => {
          fetchLeagueMessages(leagueId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeEntry?.compId]);

  useEffect(() => {
    if (activeTab === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [leagueMessages.length, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = newMessageText.trim();
    if (!trimmed || !activeEntry?.compId || !session?.user?.id || sendingMessage) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase.from('league_messages').insert([
        {
          league_id: activeEntry.compId,
          user_id: session.user.id,
          message: trimmed,
        },
      ]);

      if (error) {
        setStatusMessage(`Could not post message: ${error.message}`);
        return;
      }

      setNewMessageText('');
      await fetchLeagueMessages(activeEntry.compId);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!activeEntry?.compId) return;
    await supabase.from('league_messages').delete().eq('id', messageId);
    setLeagueMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  // =========================================================================
  // AUTOMATIC LIVE FIXTURES SYNC
  // =========================================================================
  const syncLiveFixtures = async (sportOverride, teamsOverride, silent = false) => {
    const sportCode = sportOverride || activeEntry?.league || 'EPL';
    const activeTeamsList = teamsOverride || teams;
    const seasonInfo = getActiveSeasonInfo(sportCode);

    if (syncingFixtures) return;

    setSyncingFixtures(true);
    if (!silent) {
      setStatusMessage(
        `Syncing ${sportCode} ${seasonInfo.label} fixtures from live feed...`
      );
    }

    try {
      const rowsMap = new Map();

      if (sportCode === 'EPL' && seasonInfo.openFootballSlug) {
        try {
          const ofUrl = `https://raw.githubusercontent.com/openfootball/football.json/master/${seasonInfo.openFootballSlug}/en.1.json`;
          const ofRes = await fetch(ofUrl);
          if (ofRes.ok) {
            const ofJson = await ofRes.json();
            const matchesList = ofJson?.matches || [];
            matchesList.forEach((m) => {
              const roundMatch = String(m.round || '').match(/(\d+)/);
              const roundNum = roundMatch ? Number(roundMatch[1]) : null;
              if (!roundNum) return;

              const homeCode = resolveTeamShortCode(m.team1, activeTeamsList);
              const awayCode = resolveTeamShortCode(m.team2, activeTeamsList);
              if (!homeCode || !awayCode || homeCode === awayCode) return;

              const timeStr = (m.time || '15:00').slice(0, 5);
              const parsed = new Date(`${m.date}T${timeStr}:00Z`);
              if (isNaN(parsed.getTime())) return;

              rowsMap.set(`${sportCode}-${roundNum}-${homeCode}`, {
                sport: sportCode,
                round_number: roundNum,
                home_short_code: homeCode,
                away_short_code: awayCode,
                kickoff_utc: parsed.toISOString(),
              });
            });
          }
        } catch {
          // Continue to TheSportsDB
        }
      }

      const leagueId = SPORTSDB_LEAGUE_IDS[sportCode];
      if (leagueId) {
        const tsdbUrl = `https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=${leagueId}&s=${seasonInfo.sportsDbSeason}`;
        const res = await fetch(tsdbUrl);
        if (res.ok) {
          const json = await res.json();
          const events = json?.events || [];

          events.forEach((ev) => {
            const roundNum = Number(ev.intRound);
            if (!roundNum || isNaN(roundNum)) return;

            const homeCode = resolveTeamShortCode(ev.strHomeTeam, activeTeamsList);
            const awayCode = resolveTeamShortCode(ev.strAwayTeam, activeTeamsList);
            if (!homeCode || !awayCode || homeCode === awayCode) return;

            let kickoffISO = null;
            if (ev.strTimestamp) {
              const parsed = new Date(
                ev.strTimestamp.endsWith('Z') ? ev.strTimestamp : `${ev.strTimestamp}Z`
              );
              if (!isNaN(parsed.getTime())) kickoffISO = parsed.toISOString();
            } else if (ev.dateEvent) {
              const timePart = (ev.strTime || '15:00:00').slice(0, 8);
              const parsed = new Date(`${ev.dateEvent}T${timePart}Z`);
              if (!isNaN(parsed.getTime())) kickoffISO = parsed.toISOString();
            }

            if (!kickoffISO) return;

            rowsMap.set(`${sportCode}-${roundNum}-${homeCode}`, {
              sport: sportCode,
              round_number: roundNum,
              home_short_code: homeCode,
              away_short_code: awayCode,
              kickoff_utc: kickoffISO,
            });
          });
        }
      }

      const upsertRows = Array.from(rowsMap.values());

      if (upsertRows.length === 0) {
        if (!silent) {
          setStatusMessage(
            `No official ${sportCode} ${seasonInfo.label} draw published yet—using symmetrical round-robin schedule until draw release.`
          );
        }
        return;
      }

      const { error } = await supabase
        .from('fixtures')
        .upsert(upsertRows, { onConflict: 'sport,round_number,home_short_code' });

      if (error) {
        if (!silent) {
          setStatusMessage(`Error saving synced fixtures: ${error.message}`);
        }
        return;
      }

      const { data: freshFixtures } = await supabase
        .from('fixtures')
        .select('*')
        .eq('sport', sportCode);

      if (freshFixtures) {
        setDbFixtures(freshFixtures);
      }

      if (!silent) {
        setStatusMessage(
          `Synced ${upsertRows.length} live ${sportCode} (${seasonInfo.label}) fixtures!`
        );
      }
    } catch (err) {
      if (!silent) {
        setStatusMessage(`Fixture sync failed: ${err?.message || 'Network error'}`);
      }
    } finally {
      setSyncingFixtures(false);
    }
  };

  const openSavedLeague = (membership, playerName) => {
    if (!membership?.leagues) return;
    const sportCode = membership.leagues.sport || 'NRL';
    localStorage.setItem(LAST_LEAGUE_STORAGE_KEY, membership.league_id);
    setStatusMessage('');
    setActiveTab('picks');
    setActiveEntry({
      league: sportCode,
      season: membership.leagues.season || getActiveSeasonInfo(sportCode).label,
      startRound: Number(membership.leagues.start_round || (sportCode === 'EPL' ? 11 : 1)),
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
        setLeagueMessages([]);
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
    setLeagueMessages([]);
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
    setAuthSuccess('');
  };

  // Load Teams, Fixtures, Round Schedules, Standings & Picks when entering a league
  useEffect(() => {
    if (!activeEntry) return;

    async function loadTournamentData() {
      setLoading(true);
      const sportCode = activeEntry.league || 'NRL';

      const [teamsRes, schedRes, fixRes] = await Promise.all([
        supabase.from('teams').select('*').eq('league', sportCode).order('name'),
        supabase.from('round_schedules').select('*').eq('sport', sportCode),
        supabase.from('fixtures').select('*').eq('sport', sportCode)
      ]);

      const resolvedTeams =
        !teamsRes.error && teamsRes.data && teamsRes.data.length > 0
          ? teamsRes.data
          : FALLBACK_TEAMS[sportCode] || [];

      setTeams(resolvedTeams);

      if (!schedRes.error && schedRes.data) {
        const map = {};
        schedRes.data.forEach((row) => {
          map[Number(row.round_number)] = row.first_kickoff_utc;
        });
        setRoundSchedules(map);
      } else {
        setRoundSchedules({});
      }

      if (!fixRes.error && fixRes.data) {
        setDbFixtures(fixRes.data);
      } else {
        setDbFixtures([]);
      }

      setCurrentRound(1);

      if (activeEntry.compId) {
        await refreshLeagueBoard(activeEntry.compId);
      }

      syncLiveFixtures(sportCode, resolvedTeams, true);

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
          status: p.status,
          fixture: `Round ${p.round_number}`
        }));
      setPicks(myPicks);
    }
  }

  const teamRoundMap = new Map(picks.map((p) => [String(p.team_id), Number(p.round)]));
  const activeRoundPick = picks.find((p) => Number(p.round) === Number(currentRound));
  const isCurrentRoundLocked = isRoundStarted(Number(currentRound));

  // Clear pick permanently in Supabase + local state
  const handleClearPick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!activeRoundPick || pickBusy) return;

    if (isCurrentRoundLocked) {
      setStatusMessage(
        `Round ${currentRound} (${getRoundBracketLabel(
          currentRound
        )}) has already kicked off—picks can no longer be cleared.`
      );
      return;
    }

    setPickBusy(true);
    const clearedTeamName = activeRoundPick.team_name;
    const roundToClear = Number(currentRound);

    try {
      if (activeEntry.compId && session?.user?.id) {
        const { data: deletedRows, error } = await supabase
          .from('picks')
          .delete()
          .eq('league_id', activeEntry.compId)
          .eq('user_id', session.user.id)
          .eq('round_number', roundToClear)
          .select();

        if (error) {
          setStatusMessage(`Error clearing pick: ${error.message}`);
          return;
        }

        if (!deletedRows || deletedRows.length === 0) {
          setStatusMessage(
            'Database blocked delete: Run the DELETE policy SQL in Supabase so picks can be cleared.'
          );
          await refreshLeagueBoard(activeEntry.compId);
          return;
        }

        setPicks((prev) => prev.filter((p) => Number(p.round) !== roundToClear));
        setAllLeaguePicks((prev) =>
          prev.filter(
            (p) =>
              !(
                p.user_id === session.user.id &&
                Number(p.round_number) === roundToClear
              )
          )
        );
      } else {
        setPicks((prev) => prev.filter((p) => Number(p.round) !== roundToClear));
      }

      setStatusMessage(
        `Cleared ${clearedTeamName} from Round ${roundToClear} (${getRoundBracketLabel(
          roundToClear
        )}).`
      );
    } finally {
      setPickBusy(false);
    }
  };

  // Lock in (or toggle off if clicked again before kickoff) a team pick
  const handleSelectTeam = async (team, fixtureText) => {
    if (pickBusy) return;
    const teamIdStr = String(team.id);

    if (activeEntry.remainingLives <= 0) {
      setStatusMessage('Eliminated: No remaining lives.');
      return;
    }

    if (isCurrentRoundLocked) {
      setStatusMessage(
        `Round ${currentRound} (${getRoundBracketLabel(
          currentRound
        )}) has already kicked off—picks are locked.`
      );
      return;
    }

    if (activeRoundPick && String(activeRoundPick.team_id) === teamIdStr) {
      await handleClearPick();
      return;
    }

    const usedInRound = teamRoundMap.get(teamIdStr);
    if (usedInRound !== undefined && usedInRound !== Number(currentRound)) {
      setStatusMessage(
        `Rule violation: You already selected ${team.name} for Round ${usedInRound} (${getRoundBracketLabel(
          usedInRound
        )}).`
      );
      return;
    }

    setPickBusy(true);
    try {
      const updated = picks.filter((p) => Number(p.round) !== Number(currentRound));
      setPicks([
        ...updated,
        {
          round: Number(currentRound),
          team_id: teamIdStr,
          team_name: team.name,
          status: 'pending',
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

      setStatusMessage(
        `Locked in ${team.name} (${fixtureText}) for Round ${currentRound} (${getRoundBracketLabel(
          currentRound
        )}).`
      );
    } finally {
      setPickBusy(false);
    }
  };

  // Create League tagged with current season AND current upcoming league round/matchweek
  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formCompName.trim()) {
      setFormError('Please enter a league name.');
      return;
    }

    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const activeSeasonLabel = getActiveSeasonInfo(formSport).label;

    const { data: existingFixtures } = await supabase
      .from('fixtures')
      .select('sport, round_number, kickoff_utc')
      .eq('sport', formSport);

    const detectedStartRound = detectCurrentLeagueRound(formSport, existingFixtures || []);

    const { data: comp, error: compErr } = await supabase
      .from('leagues')
      .insert([
        {
          name: formCompName.trim(),
          sport: formSport,
          season: activeSeasonLabel,
          start_round: detectedStartRound,
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

    setActiveTab('picks');
    setActiveEntry({
      league: comp.sport || formSport,
      season: comp.season || activeSeasonLabel,
      startRound: Number(comp.start_round || detectedStartRound),
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

    const sportCode = comp.sport || 'NRL';
    setActiveTab('picks');
    setActiveEntry({
      league: sportCode,
      season: comp.season || getActiveSeasonInfo(sportCode).label,
      startRound: Number(comp.start_round || (sportCode === 'EPL' ? 11 : 1)),
      totalLives: comp.starting_lives,
      remainingLives: comp.lives,
      compName: comp.name,
      inviteCode: comp.invite_code,
      compId: comp.id,
      playerName: profile?.username || 'Player'
    });

    setActiveModal(null);
    setFormInviteCode('');
  };

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
  const maxSelectableCompRounds = Math.max(teams.length || 20, 20);
  const dropdownRounds = Array.from({ length: maxSelectableCompRounds }, (_, i) => i + 1);
  const maxRoundDisplay = Math.max(currentRound + 3, 12);
  const horizontalRounds = Array.from({ length: maxRoundDisplay }, (_, i) => i + 1);
  const currentRoundKickoff = activeEntry ? getRoundFirstKickoff(currentRound) : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black text-slate-100 flex relative overflow-x-hidden font-sans">
      <div
        onMouseEnter={() => setSidebarHovered(true)}
        className="fixed top-0 left-0 w-4 h-full z-40 cursor-pointer"
      />

      {/* Clean Slide-out Sidebar */}
      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-md border-r border-slate-800 z-50 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-2xl ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-14 -translate-x-12 md:translate-x-0 md:w-14'
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

            {/* Create / Join / How To Play Actions */}
            <div className="mt-4 space-y-1.5">
              <div
                className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1.5 ${
                  !isSidebarOpen && 'hidden'
                }`}
              >
                Leagues & Rules
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

              <button
                onClick={() => setActiveModal('howto')}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold transition text-left ${
                  activeModal === 'howto'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title="How to Play"
              >
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                {isSidebarOpen && <span>How to Play & Rules</span>}
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
                        {m.leagues?.sport || 'NRL'} {m.leagues?.season || ''} • {m.leagues?.invite_code}
                      </div>
                    </div>
                    <span className="text-rose-400 flex items-center gap-1 shrink-0">
                      {m.lives} <Heart className="w-3 h-3 fill-rose-500" />
                    </span>
                  </button>
                ))}
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
                      R{currentRound} ({getRoundBracketLabel(currentRound)})
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
          sidebarPinned ? 'md:ml-72' : 'md:ml-14'
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

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden lg:inline">
              Timezone: <strong className="text-slate-200">{userTimeZone}</strong>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Player: <strong className="text-white">{profile?.username || session.user.email}</strong>
            </span>

            <button
              type="button"
              onClick={() => setActiveModal('howto')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How to Play</span>
            </button>

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
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black">Welcome, {profile?.username || 'Player'}</h1>
                    <p className="text-slate-400 text-xs">
                      Open a saved league, create a new season comp, or join with an invite code
                    </p>
                  </div>
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
                              {m.leagues?.sport || 'NRL'} {m.leagues?.season || ''}
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
                  {Object.entries(LEAGUE_CONFIG).map(([code, config]) => {
                    const seasonLabel = getActiveSeasonInfo(code).label;
                    return (
                      <button
                        key={code}
                        onClick={() => {
                          setSelectedLeague(code);
                          setSetupStep('lives');
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition group text-left"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white group-hover:text-blue-400 transition">
                              {code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {seasonLabel}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">{config.name}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </button>
                    );
                  })}
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
                            season: getActiveSeasonInfo(selectedLeague).label,
                            startRound: selectedLeague === 'EPL' ? 11 : 1,
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
          /* View 2: Tabbed League Workspace ("Pick Teams" | "Standings" | "Message Board") */
          <main className="p-4 md:p-6 max-w-6xl w-full mx-auto space-y-4">
            {/* League Header + 3-Tab Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {activeEntry.compName || `${activeEntry.league} Solo`} • {activeEntry.league}{' '}
                    {activeEntry.season}
                  </span>
                  {activeEntry.inviteCode && (
                    <span className="font-mono text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      Code: {activeEntry.inviteCode}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    Round {currentRound} ({getRoundBracketLabel(currentRound)}) Kickoff ({userTimeZone}):{' '}
                    <strong className="text-slate-200">
                      {formatLocalKickoff(currentRoundKickoff)}
                    </strong>
                  </span>
                  {isCurrentRoundLocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/70 border border-rose-700/60 text-rose-300 text-[10px] font-bold">
                      <Lock className="w-2.5 h-2.5" /> Locked (Started)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-[10px] font-bold">
                      Open for Tips
                    </span>
                  )}
                </div>
              </div>

              {/* Tab Switcher: Pick Teams | Standings | Message Board */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('picks')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'picks'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Pick Teams</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('standings')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'standings'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    Standings{activeEntry.compId ? ` (${leagueMembers.length})` : ''}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'chat'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    Message Board{leagueMessages.length > 0 ? ` (${leagueMessages.length})` : ''}
                  </span>
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="px-3.5 py-2 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-300 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* ===============================================================
                TAB 1: HEAD-TO-HEAD MATCHUPS (HOME vs AWAY)
            =============================================================== */}
            {activeTab === 'picks' && (
              <>
                <div className="flex flex-wrap items-center justify-between bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl gap-3">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="font-black text-sm text-white">
                      Round {currentRound} ({getRoundBracketLabel(currentRound)}) —{' '}
                      {roundMatches.length} Games
                    </span>
                    <span className="text-xs text-slate-400">
                      • {picks.length}/{teams.length} clubs used
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={syncingFixtures}
                      onClick={() => syncLiveFixtures(activeEntry.league, teams, false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-xs font-bold text-slate-200 transition"
                      title="Refresh official fixture dates and kickoff times"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-blue-400 ${
                          syncingFixtures ? 'animate-spin' : ''
                        }`}
                      />
                      <span>{syncingFixtures ? 'Syncing...' : 'Sync Fixtures'}</span>
                    </button>

                    {activeRoundPick && !isCurrentRoundLocked && (
                      <button
                        type="button"
                        disabled={pickBusy}
                        onClick={handleClearPick}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/70 disabled:opacity-50 border border-rose-700/70 text-xs font-bold text-rose-200 transition"
                        title={`Remove ${activeRoundPick.team_name} from Round ${currentRound}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>
                          {pickBusy ? 'Clearing...' : `Clear Pick (${activeRoundPick.team_name})`}
                        </span>
                      </button>
                    )}

                    {/* Prev + Direct Round Dropdown + Next */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentRound((r) => Math.max(1, r - 1));
                          setStatusMessage('');
                        }}
                        disabled={currentRound === 1}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold rounded-lg transition"
                      >
                        Prev
                      </button>

                      <select
                        value={currentRound}
                        onChange={(e) => {
                          setCurrentRound(Number(e.target.value));
                          setStatusMessage('');
                        }}
                        aria-label="Jump to Round"
                        className="bg-slate-950 border border-slate-700 hover:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs font-bold text-blue-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {dropdownRounds.map((rNum) => {
                          const roundPick = picks.find((p) => Number(p.round) === rNum);
                          return (
                            <option key={rNum} value={rNum} className="bg-slate-900 text-white">
                              Round {rNum} ({getRoundBracketLabel(rNum)})
                              {roundPick ? ` • ${roundPick.team_name}` : ''}
                            </option>
                          );
                        })}
                      </select>

                      <button
                        type="button"
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
                </div>

                {/* Head-to-Head Matchup Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roundMatches.map((match) => {
                    const { home, away, kickoffUTC } = match;
                    const localGameTime = formatLocalKickoff(kickoffUTC);

                    const homeUsedRound = teamRoundMap.get(String(home.id));
                    const homeSelectedHere = homeUsedRound === Number(currentRound);
                    const homeUsedElsewhere =
                      homeUsedRound !== undefined && !homeSelectedHere;

                    const awayUsedRound = teamRoundMap.get(String(away.id));
                    const awaySelectedHere = awayUsedRound === Number(currentRound);
                    const awayUsedElsewhere =
                      awayUsedRound !== undefined && !awaySelectedHere;

                    const gameStarted = nowTick >= kickoffUTC.getTime();
                    const roundLocked = isCurrentRoundLocked || gameStarted;

                    return (
                      <div
                        key={match.id}
                        className={`bg-slate-900 border rounded-xl overflow-hidden transition ${
                          homeSelectedHere || awaySelectedHere
                            ? 'border-blue-500/80 ring-1 ring-blue-500/40 shadow-lg'
                            : 'border-slate-800'
                        }`}
                      >
                        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
                          {/* HOME TEAM BUTTON (LEFT) */}
                          <button
                            type="button"
                            disabled={
                              pickBusy ||
                              homeUsedElsewhere ||
                              roundLocked ||
                              activeEntry.remainingLives <= 0
                            }
                            onClick={() =>
                              handleSelectTeam(home, `vs ${away.short_code} (Home)`)
                            }
                            className={`p-3 flex items-center gap-2.5 text-left transition ${
                              homeSelectedHere
                                ? 'bg-blue-950/90 text-white'
                                : homeUsedElsewhere
                                ? 'bg-slate-950/40 opacity-40 cursor-not-allowed'
                                : roundLocked
                                ? 'opacity-65 cursor-not-allowed'
                                : 'hover:bg-slate-800/80'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-800/90 p-1 flex items-center justify-center overflow-hidden border border-slate-700/60 shrink-0">
                              {home.logo_url ? (
                                <img
                                  src={home.logo_url}
                                  alt={home.name}
                                  className="w-full h-full object-contain"
                                  onError={handleLogoError}
                                />
                              ) : (
                                <span className="font-mono text-[10px] font-bold text-slate-400">
                                  {home.short_code}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                  Home
                                </span>
                                {homeSelectedHere && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                )}
                              </div>
                              <div className="font-bold text-xs sm:text-sm text-white truncate">
                                {home.name}
                              </div>
                              <div className="text-[10px] font-semibold mt-0.5">
                                {homeSelectedHere ? (
                                  <span className="text-blue-400">
                                    {roundLocked ? 'Locked In' : 'Selected (Click to Clear)'}
                                  </span>
                                ) : homeUsedElsewhere ? (
                                  <span className="text-amber-500/80">
                                    Used in R{homeUsedRound} ({getRoundBracketLabel(homeUsedRound)})
                                  </span>
                                ) : (
                                  <span className="text-slate-500">{home.short_code}</span>
                                )}
                              </div>
                            </div>
                          </button>

                          {/* CENTER "V" DIVIDER */}
                          <div className="flex items-center justify-center px-2 bg-slate-950/50 border-x border-slate-800/70">
                            <span className="text-[11px] font-black uppercase text-slate-500">
                              v
                            </span>
                          </div>

                          {/* AWAY TEAM BUTTON (RIGHT) */}
                          <button
                            type="button"
                            disabled={
                              pickBusy ||
                              awayUsedElsewhere ||
                              roundLocked ||
                              activeEntry.remainingLives <= 0
                            }
                            onClick={() =>
                              handleSelectTeam(away, `@ ${home.short_code} (Away)`)
                            }
                            className={`p-3 flex items-center justify-end gap-2.5 text-right transition ${
                              awaySelectedHere
                                ? 'bg-blue-950/90 text-white'
                                : awayUsedElsewhere
                                ? 'bg-slate-950/40 opacity-40 cursor-not-allowed'
                                : roundLocked
                                ? 'opacity-65 cursor-not-allowed'
                                : 'hover:bg-slate-800/80'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-end gap-1.5">
                                {awaySelectedHere && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                )}
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                  Away
                                </span>
                              </div>
                              <div className="font-bold text-xs sm:text-sm text-white truncate">
                                {away.name}
                              </div>
                              <div className="text-[10px] font-semibold mt-0.5">
                                {awaySelectedHere ? (
                                  <span className="text-blue-400">
                                    {roundLocked ? 'Locked In' : 'Selected (Click to Clear)'}
                                  </span>
                                ) : awayUsedElsewhere ? (
                                  <span className="text-amber-500/80">
                                    Used in R{awayUsedRound} ({getRoundBracketLabel(awayUsedRound)})
                                  </span>
                                ) : (
                                  <span className="text-slate-500">{away.short_code}</span>
                                )}
                              </div>
                            </div>

                            <div className="w-8 h-8 rounded-lg bg-slate-800/90 p-1 flex items-center justify-center overflow-hidden border border-slate-700/60 shrink-0">
                              {away.logo_url ? (
                                <img
                                  src={away.logo_url}
                                  alt={away.name}
                                  className="w-full h-full object-contain"
                                  onError={handleLogoError}
                                />
                              ) : (
                                <span className="font-mono text-[10px] font-bold text-slate-400">
                                  {away.short_code}
                                </span>
                              )}
                            </div>
                          </button>
                        </div>

                        {/* Bottom Footer Bar: Local Date & Time of Play */}
                        <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{localGameTime}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bye Club Notice */}
                {roundByeTeam && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2.5">
                      {roundByeTeam.logo_url && (
                        <img
                          src={roundByeTeam.logo_url}
                          alt={roundByeTeam.name}
                          className="w-5 h-5 object-contain opacity-60"
                          onError={handleLogoError}
                        />
                      )}
                      <span>
                        <strong className="text-slate-300">{roundByeTeam.name}</strong> has a{' '}
                        <span className="font-bold uppercase text-amber-400/90">Bye</span> in Round{' '}
                        {currentRound} ({getRoundBracketLabel(currentRound)})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">Not available to pick</span>
                  </div>
                )}
              </>
            )}

            {/* ===============================================================
                TAB 2: STANDINGS & LEAGUE TIPS
            =============================================================== */}
            {activeTab === 'standings' && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-black text-base text-white">
                        {activeEntry.compName || `${activeEntry.league} Solo`} — Standings
                      </h2>
                      <p className="text-xs text-slate-400">
                        Ranked by remaining lives • Missed tips receive a random available club at kickoff (or deduct 1 life if none remain)
                      </p>
                    </div>
                  </div>
                </div>

                {!activeEntry.compId ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    You are in Solo Practice mode. Create or join a competition with an invite code to compare standings with friends.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-4 sticky left-0 bg-slate-950 z-10 min-w-[170px]">
                            Player
                          </th>
                          <th className="py-3 px-3 text-center min-w-[85px]">Lives</th>
                          {horizontalRounds.map((rNum) => {
                            const started = isRoundStarted(rNum);
                            const actual = getActualLeagueRound(rNum);
                            return (
                              <th
                                key={rNum}
                                onClick={() => {
                                  setCurrentRound(rNum);
                                  setActiveTab('picks');
                                  setStatusMessage('');
                                }}
                                title={`Jump to Round ${rNum} (${getRoundBracketLabel(rNum)})`}
                                className={`py-3 px-3 text-center min-w-[115px] cursor-pointer transition hover:text-white ${
                                  rNum === Number(currentRound)
                                    ? 'text-blue-400 bg-blue-950/30 border-b-2 border-blue-500'
                                    : ''
                                }`}
                              >
                                <div className="flex flex-col items-center justify-center">
                                  <div className="flex items-center gap-1">
                                    <span>R{rNum}</span>
                                    {started ? (
                                      <span
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                        title="Round Started — Tips Revealed"
                                      />
                                    ) : (
                                      <Lock
                                        className="w-2.5 h-2.5 text-slate-500"
                                        title="Hidden until kickoff"
                                      />
                                    )}
                                  </div>
                                  <span className="text-[9px] font-normal text-slate-500">
                                    ({activeEntry.league === 'EPL' ? `MW ${actual}` : `Rd ${actual}`})
                                  </span>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 text-sm">
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
                                  ? 'bg-blue-950/15'
                                  : 'hover:bg-slate-800/30'
                              }
                            >
                              <td className="py-2.5 px-4 sticky left-0 bg-slate-900 z-10 whitespace-nowrap font-bold">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-slate-500 w-4">
                                    {idx + 1}.
                                  </span>
                                  <span className="text-white text-xs sm:text-sm">{displayName}</span>
                                  {isMe && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-black">
                                      YOU
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-3 text-center whitespace-nowrap">
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

                              {horizontalRounds.map((rNum) => {
                                const pick = allLeaguePicks.find(
                                  (p) =>
                                    p.user_id === member.user_id &&
                                    Number(p.round_number) === rNum
                                );

                                const canSeePick = isMe || isRoundStarted(rNum);

                                return (
                                  <td
                                    key={rNum}
                                    className={`py-2 px-3 text-center whitespace-nowrap ${
                                      rNum === Number(currentRound) ? 'bg-blue-950/10' : ''
                                    }`}
                                  >
                                    {!pick ? (
                                      <span className="text-slate-600 text-xs">—</span>
                                    ) : !canSeePick ? (
                                      <span
                                        title={`Hidden until Round ${rNum} (${getRoundBracketLabel(
                                          rNum
                                        )}) kickoff (${formatLocalKickoff(
                                          getRoundFirstKickoff(rNum)
                                        )})`}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60"
                                      >
                                        <Lock className="w-3 h-3 text-amber-400" />
                                        Tipped
                                      </span>
                                    ) : (
                                      <div
                                        title={
                                          pick.status === 'auto_pick'
                                            ? 'Auto-assigned random available club at kickoff'
                                            : undefined
                                        }
                                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-bold ${
                                          pick.status === 'win'
                                            ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                                            : pick.status === 'loss'
                                            ? 'bg-rose-950/70 border-rose-500/50 text-rose-300 line-through'
                                            : pick.status === 'auto_pick'
                                            ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                                            : 'bg-slate-800 border-slate-700 text-white'
                                        }`}
                                      >
                                        {pick.teams?.logo_url && (
                                          <img
                                            src={pick.teams.logo_url}
                                            alt=""
                                            className="w-3.5 h-3.5 object-contain"
                                            onError={handleLogoError}
                                          />
                                        )}
                                        <span>
                                          {pick.teams?.short_code || pick.teams?.name || 'Team'}
                                        </span>
                                        {pick.status === 'auto_pick' && (
                                          <span className="text-[9px] uppercase text-amber-400">
                                            Auto