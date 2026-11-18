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
  Bell,
  BellOff,
  Eye,
  EyeOff
} from 'lucide-react';

function safeGetStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage restrictions
  }
}

function safeRemoveStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

function getSafeTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
  } catch {
    return 'Local Time';
  }
}

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
      footballDataSeason: String(startYear),
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

  'afc bournemouth': 'BOU', 'bournemouth': 'BOU', 'bou': 'BOU',
  'arsenal': 'ARS', 'arsenal fc': 'ARS', 'ars': 'ARS',
  'aston villa': 'AVL', 'aston villa fc': 'AVL', 'avl': 'AVL',
  'brentford': 'BRE', 'brentford fc': 'BRE', 'bre': 'BRE',
  'brighton & hove albion': 'BHA', 'brighton and hove albion': 'BHA',
  'brighton & hove albion fc': 'BHA', 'brighton hove': 'BHA', 'brighton': 'BHA', 'bha': 'BHA',
  'burnley': 'BUR', 'burnley fc': 'BUR', 'bur': 'BUR',
  'chelsea': 'CHE', 'chelsea fc': 'CHE', 'che': 'CHE',
  'coventry city': 'COV', 'coventry city fc': 'COV', 'coventry': 'COV', 'cov': 'COV',
  'crystal palace': 'CRY', 'crystal palace fc': 'CRY', 'cry': 'CRY',
  'everton': 'EVE', 'everton fc': 'EVE', 'eve': 'EVE',
  'fulham': 'FUL', 'fulham fc': 'FUL', 'ful': 'FUL',
  'hull city': 'HUL', 'hull city afc': 'HUL', 'hull': 'HUL', 'hul': 'HUL',
  'ipswich town': 'IPS', 'ipswich town fc': 'IPS', 'ipswich': 'IPS', 'ips': 'IPS',
  'leeds united': 'LEE', 'leeds united fc': 'LEE', 'leeds': 'LEE', 'lee': 'LEE',
  'leicester city': 'LEI', 'leicester city fc': 'LEI', 'leicester': 'LEI', 'lei': 'LEI',
  'liverpool': 'LIV', 'liverpool fc': 'LIV', 'liv': 'LIV',
  'manchester city': 'MCI', 'manchester city fc': 'MCI', 'man city': 'MCI', 'mci': 'MCI',
  'manchester united': 'MUN', 'manchester united fc': 'MUN', 'man united': 'MUN', 'man utd': 'MUN', 'mun': 'MUN',
  'newcastle united': 'NEW', 'newcastle united fc': 'NEW', 'newcastle': 'NEW', 'new': 'NEW',
  'nottingham forest': 'NFO', 'nottingham forest fc': 'NFO', 'nottingham': 'NFO', "nott'm forest": 'NFO', 'nfo': 'NFO',
  'sheffield united': 'SHU', 'sheffield united fc': 'SHU', 'sheffield utd': 'SHU', 'shu': 'SHU',
  'southampton': 'SOU', 'southampton fc': 'SOU',
  'sunderland': 'SUN', 'sunderland afc': 'SUN', 'sun': 'SUN',
  'tottenham hotspur': 'TOT', 'tottenham hotspur fc': 'TOT', 'tottenham': 'TOT', 'spurs': 'TOT', 'tot': 'TOT',
  'west ham united': 'WHU', 'west ham united fc': 'WHU', 'west ham': 'WHU', 'whu': 'WHU',
  'wolverhampton wanderers': 'WOL', 'wolverhampton wanderers fc': 'WOL', 'wolverhampton': 'WOL', 'wolves': 'WOL', 'wol': 'WOL',
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
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    }).format(dateObj);
  } catch {
    return dateObj.toUTCString().slice(0, 22);
  }
}

function formatMessageTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
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
  dbFixtures
) {
  if (!teamsList || teamsList.length < 2) {
    return { matches: [], byeTeam: null, isReleased: false };
  }

  const byShortCode = new Map(teamsList.map((t) => [t.short_code, t]));
  const roundDbFixtures = (dbFixtures || []).filter(
    (f) => Number(f.round_number) === Number(actualLeagueRound)
  );

  if (roundDbFixtures.length === 0) {
    return { matches: [], byeTeam: null, isReleased: false };
  }

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

  const expectedMatchCount = Math.floor(teamsList.length / 2);
  const byeTeam =
    teamsList.length % 2 === 1 && matches.length >= expectedMatchCount
      ? teamsList.find((t) => !usedIds.has(String(t.id))) || null
      : null;

  matches.sort((a, b) => a.kickoffUTC - b.kickoffUTC);
  return { matches, byeTeam, isReleased: matches.length > 0 };
}

function findActiveCompRound(
  teamsList,
  sportCode,
  startLeagueRound,
  fixturesList,
  schedulesMap
) {
  const nowMs = Date.now();
  const maxRounds = Math.max(teamsList?.length || 20, 20);
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  for (let compRnd = 1; compRnd <= maxRounds; compRnd++) {
    const actualRnd = Number(startLeagueRound || 1) + (compRnd - 1);
    const { matches } = buildRoundMatchups(
      teamsList,
      sportCode,
      compRnd,
      actualRnd,
      fixturesList
    );

    if (matches.length > 0) {
      const firstKickoffMs = matches[0].kickoffUTC.getTime();
      const lastKickoffMs = matches[matches.length - 1].kickoffUTC.getTime();
      if (nowMs <= lastKickoffMs + 3 * 3600 * 1000 || nowMs < firstKickoffMs) {
        return compRnd;
      }
    } else {
      const fallbackStart = getDefaultRoundKickoffUTC(
        sportCode,
        compRnd,
        actualRnd,
        schedulesMap
      ).getTime();
      if (nowMs <= fallbackStart + THREE_DAYS_MS) {
        return compRnd;
      }
    }
  }

  return 1;
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
  const [formSport, setFormSport] = useState('EPL');
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
    NRL: { name: 'National Rugby League', roundLabel: 'Round', shortRound: 'Rd' },
    AFL: { name: 'Australian Football League', roundLabel: 'Round', shortRound: 'Rd' },
    EPL: { name: 'English Premier League', roundLabel: 'Matchweek', shortRound: 'MW' },
  };

  const userTimeZone = getSafeTimeZone();

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  const startLeagueRound = Number(activeEntry?.startRound || 1);
  const getActualLeagueRound = (compRoundNum) =>
    startLeagueRound + (Number(compRoundNum) - 1);

  const getRoundBracketLabel = (compRoundNum, compact = false) => {
    const sportCode = activeEntry?.league || 'NRL';
    const word = compact
      ? LEAGUE_CONFIG[sportCode]?.shortRound || 'Rd'
      : LEAGUE_CONFIG[sportCode]?.roundLabel || 'Round';
    const actual = getActualLeagueRound(compRoundNum);
    return `${word} ${actual}`;
  };

  const actualCurrentLeagueRound = getActualLeagueRound(currentRound);

  const {
    matches: roundMatches,
    byeTeam: roundByeTeam,
    isReleased: areRoundFixturesReleased
  } = buildRoundMatchups(
    teams,
    activeEntry?.league || 'NRL',
    currentRound,
    actualCurrentLeagueRound,
    dbFixtures
  );

  const getRoundFirstKickoff = (compRoundNum) => {
    const sportCode = activeEntry?.league || 'NRL';
    const actualRound = getActualLeagueRound(compRoundNum);
    const { matches } = buildRoundMatchups(
      teams,
      sportCode,
      compRoundNum,
      actualRound,
      dbFixtures
    );
    if (matches.length > 0) {
      return matches[0].kickoffUTC;
    }
    return getDefaultRoundKickoffUTC(sportCode, compRoundNum, actualRound, roundSchedules);
  };

  const isRoundStarted = (compRoundNum) => {
    const sportCode = activeEntry?.league || 'NRL';
    const actualRound = getActualLeagueRound(compRoundNum);
    const { matches } = buildRoundMatchups(
      teams,
      sportCode,
      compRoundNum,
      actualRound,
      dbFixtures
    );
    if (matches.length === 0) return false;
    return nowTick >= matches[0].kickoffUTC.getTime();
  };

  const handleToggleEmailReminders = async () => {
    if (!profile?.id) return;
    const nextValue = profile.email_reminders === false ? true : false;
    setProfile((prev) => (prev ? { ...prev, email_reminders: nextValue } : prev));
    await supabase
      .from('profiles')
      .update({ email_reminders: nextValue })
      .eq('id', profile.id);
    setStatusMessage(
      nextValue
        ? '24-hour round closing email reminders enabled.'
        : '24-hour round closing email reminders paused.'
    );
  };

  // =========================================================================
  // AUTOMATIC MISSED-PICK ENFORCEMENT (Only runs on rounds with real fixtures)
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
            const { matches, byeTeam } = buildRoundMatchups(
              teams,
              activeEntry.league || 'NRL',
              compRnd,
              actualRnd,
              dbFixtures
            );

            const playingTeamIds = new Set();
            matches.forEach((m) => {
              playingTeamIds.add(String(m.home.id));
              playingTeamIds.add(String(m.away.id));
            });

            const availableTeams = teams.filter(
              (t) =>
                playingTeamIds.has(String(t.id)) &&
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
              if (!safeGetStorage(penaltyKey)) {
                const newLives = Math.max(0, Number(member.lives) - 1);
                const newStatus = newLives <= 0 ? 'eliminated' : 'active';

                const { error } = await supabase
                  .from('league_members')
                  .update({ lives: newLives, status: newStatus })
                  .eq('id', member.id);

                if (!error) {
                  safeSetStorage(penaltyKey, '1');
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
    dbFixtures.length,
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
  // OFFICIAL FIXTURES SYNC (/api/epl-fixtures for EPL + TheSportsDB for NRL/AFL)
  // =========================================================================
  const syncLiveFixtures = async (sportOverride, teamsOverride, silent = false) => {
    const sportCode = sportOverride || activeEntry?.league || 'EPL';
    const activeTeamsList = teamsOverride || teams;
    const seasonInfo = getActiveSeasonInfo(sportCode);

    if (syncingFixtures) return null;

    setSyncingFixtures(true);
    if (!silent) {
      setStatusMessage(`Syncing official ${sportCode} ${seasonInfo.label} fixtures...`);
    }

    try {
      const rowsMap = new Map();

      if (sportCode === 'EPL') {
        const proxyRes = await fetch('/api/epl-fixtures');
        const proxyJson = await proxyRes.json();

        if (!proxyRes.ok || proxyJson?.ok === false) {
          if (!silent) {
            setStatusMessage(
              `EPL Sync Error: ${proxyJson?.error || `HTTP ${proxyRes.status}`}`
            );
          }
          return null;
        }

        (proxyJson.fixtures || []).forEach((m) => {
          const roundNum = Number(m.round_number);
          if (!roundNum || !m.kickoff_utc) return;

          const homeCode =
            resolveTeamShortCode(m.home_name, activeTeamsList) ||
            resolveTeamShortCode(m.home_short, activeTeamsList) ||
            resolveTeamShortCode(m.home_tla, activeTeamsList);
          const awayCode =
            resolveTeamShortCode(m.away_name, activeTeamsList) ||
            resolveTeamShortCode(m.away_short, activeTeamsList) ||
            resolveTeamShortCode(m.away_tla, activeTeamsList);

          if (!homeCode || !awayCode || homeCode === awayCode) return;

          const parsed = new Date(m.kickoff_utc);
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

      const leagueId = SPORTSDB_LEAGUE_IDS[sportCode];
      if (leagueId && rowsMap.size === 0 && sportCode !== 'EPL') {
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
            `No ${sportCode} ${seasonInfo.label} fixtures returned yet.`
          );
        }
        return null;
      }

      const { error } = await supabase
        .from('fixtures')
        .upsert(upsertRows, { onConflict: 'sport,round_number,home_short_code' });

      if (error) {
        if (!silent) {
          setStatusMessage(`Supabase Fixtures Save Error: ${error.message}`);
        }
        return null;
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
          `Synced ${upsertRows.length} official ${sportCode} fixtures across all matchweeks!`
        );
      }

      return freshFixtures || null;
    } catch (err) {
      if (!silent) {
        setStatusMessage(`Fixture sync failed: ${err?.message || 'Network error'}`);
      }
      return null;
    } finally {
      setSyncingFixtures(false);
    }
  };

  const openSavedLeague = (membership, playerName) => {
    if (!membership?.leagues) return;
    const sportCode = membership.leagues.sport || 'NRL';
    safeSetStorage(LAST_LEAGUE_STORAGE_KEY, membership.league_id);
    setStatusMessage('');
    setActiveTab('picks');
    setSidebarPinned(false);
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

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
        setAuthChecking(false);
      })
      .catch(() => {
        if (!mounted) return;
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
        .upsert({ id: user.id, username: fallbackName, email_reminders: true })
        .select()
        .maybeSingle();

      prof = createdProf || { id: user.id, username: fallbackName, email_reminders: true };
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
        const savedLeagueId = safeGetStorage(LAST_LEAGUE_STORAGE_KEY);
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
    safeRemoveStorage(LAST_LEAGUE_STORAGE_KEY);
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

  // Load Teams, Fixtures, Standings & Picks immediately (non-blocking background sync)
  useEffect(() => {
    if (!activeEntry) return;
    let cancelled = false;

    async function loadTournamentData() {
      setLoading(true);
      const sportCode = activeEntry.league || 'NRL';
      const compStartRound = Number(activeEntry.startRound || (sportCode === 'EPL' ? 11 : 1));

      try {
        const [teamsRes, schedRes, fixRes] = await Promise.all([
          supabase.from('teams').select('*').eq('league', sportCode).order('name'),
          supabase.from('round_schedules').select('*').eq('sport', sportCode),
          supabase.from('fixtures').select('*').eq('sport', sportCode)
        ]);

        if (cancelled) return;

        const resolvedTeams =
          !teamsRes.error && teamsRes.data && teamsRes.data.length > 0
            ? teamsRes.data
            : FALLBACK_TEAMS[sportCode] || [];

        setTeams(resolvedTeams);

        const resolvedSchedules = {};
        if (!schedRes.error && schedRes.data) {
          schedRes.data.forEach((row) => {
            resolvedSchedules[Number(row.round_number)] = row.first_kickoff_utc;
          });
        }
        setRoundSchedules(resolvedSchedules);

        const resolvedFixtures = !fixRes.error && fixRes.data ? fixRes.data : [];
        setDbFixtures(resolvedFixtures);

        const activeCompRnd = findActiveCompRound(
          resolvedTeams,
          sportCode,
          compStartRound,
          resolvedFixtures,
          resolvedSchedules
        );
        setCurrentRound(activeCompRnd);

        if (activeEntry.compId) {
          await refreshLeagueBoard(activeEntry.compId);
        }

        // Unblock mobile & desktop UI right away before running background API sync
        if (!cancelled) {
          setLoading(false);
        }

        // Run background sync silently so slow mobile connections never stall rendering
        const syncedFixtures = await syncLiveFixtures(sportCode, resolvedTeams, true);
        if (!cancelled && syncedFixtures && syncedFixtures.length > 0 && resolvedFixtures.length === 0) {
          const refinedCompRnd = findActiveCompRound(
            resolvedTeams,
            sportCode,
            compStartRound,
            syncedFixtures,
            resolvedSchedules
          );
          setCurrentRound(refinedCompRnd);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTournamentData();
    return () => {
      cancelled = true;
    };
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

    safeSetStorage(LAST_LEAGUE_STORAGE_KEY, comp.id);
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

    safeSetStorage(LAST_LEAGUE_STORAGE_KEY, comp.id);
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
      <div className="min-h-dvh w-full bg-slate-950 text-slate-300 flex items-center justify-center p-4 font-sans">
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
      <div className="min-h-dvh w-full max-w-full overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black tracking-wide text-white">
                LAST MAN STANDING
              </h1>
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-base sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-base sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-base sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-10 text-base sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
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
  const maxSelectableCompRounds = Math.max(teams.length || 20, 28);
  const dropdownRounds = Array.from({ length: maxSelectableCompRounds }, (_, i) => i + 1);
  const maxRoundDisplay = Math.max(currentRound + 3, 12);
  const horizontalRounds = Array.from({ length: maxRoundDisplay }, (_, i) => i + 1);
  const currentRoundKickoff = activeEntry ? getRoundFirstKickoff(currentRound) : null;

  const msUntilCurrentKickoff =
    areRoundFixturesReleased && currentRoundKickoff
      ? currentRoundKickoff.getTime() - nowTick
      : null;
  const isClosingWithin24Hours =
    msUntilCurrentKickoff !== null &&
    msUntilCurrentKickoff > 0 &&
    msUntilCurrentKickoff <= 24 * 3600 * 1000;
  const hoursRemaining = isClosingWithin24Hours
    ? Math.max(1, Math.ceil(msUntilCurrentKickoff / (3600 * 1000)))
    : null;

  return (
    <div className="min-h-dvh w-full max-w-full overflow-x-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-black text-slate-100 flex relative font-sans">
      <div
        onMouseEnter={() => setSidebarHovered(true)}
        className="hidden md:block fixed top-0 left-0 w-4 h-full z-40 cursor-pointer"
      />

      {/* Tap-outside Backdrop on Mobile */}
      {sidebarPinned && (
        <div
          onClick={() => setSidebarPinned(false)}
          className="md:hidden fixed inset-0 bg-black/75 backdrop-blur-xs z-40"
        />
      )}

      {/* LEFT-HAND NAVIGATION SIDEBAR */}
      <aside
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className={`fixed top-0 left-0 h-dvh bg-slate-900/95 backdrop-blur-md border-r border-slate-800 z-50 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-2xl ${
          isSidebarOpen
            ? 'w-[82vw] max-w-72 translate-x-0'
            : 'w-[82vw] max-w-72 -translate-x-full md:translate-x-0 md:w-14'
        }`}
      >
        <div className="p-3.5 flex flex-col h-full justify-between overflow-y-auto">
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                {isSidebarOpen && (
                  <div className="min-w-0">
                    <h2 className="font-black text-xs text-white tracking-wide truncate">
                      LAST MAN STANDING
                    </h2>
                    <p className="text-[10px] text-emerald-400 font-bold truncate">
                      {profile?.username || session.user.email}
                    </p>
                  </div>
                )}
              </div>

              {isSidebarOpen && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setSidebarPinned(!sidebarPinned)}
                    className={`hidden md:block p-1.5 rounded-lg border text-xs transition ${
                      sidebarPinned
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'border-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title={sidebarPinned ? 'Unpin menu' : 'Keep menu open'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSidebarPinned(false)}
                    className="md:hidden p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
                    aria-label="Close Menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Menu Section */}
            <div className="mt-4 space-y-1.5">
              <div
                className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1.5 ${
                  !isSidebarOpen && 'md:hidden'
                }`}
              >
                Menu
              </div>

              <button
                onClick={() => {
                  setSidebarPinned(false);
                  setActiveModal('howto');
                }}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-bold transition text-left ${
                  activeModal === 'howto'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20'
                }`}
                title="How to Play"
              >
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                {isSidebarOpen && <span>How to Play</span>}
              </button>

              <button
                onClick={() => {
                  setFormError('');
                  setSidebarPinned(false);
                  setActiveModal('create');
                }}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-bold transition text-left ${
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
                  setSidebarPinned(false);
                  setActiveModal('join');
                }}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-bold transition text-left ${
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
                onClick={handleToggleEmailReminders}
                className="w-full flex items-center justify-between gap-2 p-2.5 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
                title="Toggle 24-hour round closing email reminders"
              >
                <div className="flex items-center gap-2.5">
                  {profile?.email_reminders === false ? (
                    <BellOff className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <Bell className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                  {isSidebarOpen && <span>24h Email Reminders</span>}
                </div>
                {isSidebarOpen && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                      profile?.email_reminders === false
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {profile?.email_reminders === false ? 'OFF' : 'ON'}
                  </span>
                )}
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
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold border transition ${
                      activeEntry?.compId === m.league_id
                        ? 'bg-blue-950/80 border-blue-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="truncate text-left min-w-0 pr-2">
                      <div className="truncate">{m.leagues?.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">
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
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
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
                  <div className="text-right min-w-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      R{currentRound} ({getRoundBracketLabel(currentRound, true)})
                    </div>
                    <div className="font-bold text-xs text-white truncate max-w-[115px] mt-0.5">
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
                    safeRemoveStorage(LAST_LEAGUE_STORAGE_KEY);
                    setActiveEntry(null);
                    setSetupStep('league');
                    setPicks([]);
                    setSidebarPinned(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>All Leagues / Lobby</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-xs font-bold text-rose-300 border border-rose-900/50 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container (strictly bounded to viewport width on mobile) */}
      <div
        className={`flex-1 min-w-0 w-full flex flex-col min-h-dvh transition-all duration-300 ${
          sidebarPinned ? 'md:ml-72' : 'md:ml-14'
        }`}
      >
        {/* Top Header Bar */}
        <header className="w-full flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setSidebarPinned(!sidebarPinned)}
              className="md:hidden p-2 bg-slate-800 active:bg-slate-700 rounded-lg text-slate-200 shrink-0"
              aria-label="Open Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="font-black text-xs sm:text-sm tracking-wider text-slate-200 truncate">
              LAST MAN STANDING
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-[11px] text-slate-400 hidden lg:inline">
              Timezone: <strong className="text-slate-200">{userTimeZone}</strong>
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Player: <strong className="text-white">{profile?.username || session.user.email}</strong>
            </span>

            <button
              type="button"
              onClick={() => setActiveModal('howto')}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] sm:text-xs font-bold text-amber-300 transition"
              title="How to Play"
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">How to Play</span>
            </button>

            {activeEntry && (
              <button
                onClick={() => {
                  safeRemoveStorage(LAST_LEAGUE_STORAGE_KEY);
                  setActiveEntry(null);
                  setSetupStep('league');
                  setPicks([]);
                }}
                className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] sm:text-xs font-bold text-slate-200 transition"
              >
                Leagues ({myLeagues.length})
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-[11px] sm:text-xs font-bold text-rose-300 transition"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* View 1: Entry / Lobby Screen */}
        {!activeEntry ? (
          <div className="flex-1 w-full flex items-center justify-center p-3.5 sm:p-5">
            <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-xl font-black truncate">
                    Welcome, {profile?.username || 'Player'}
                  </h1>
                  <p className="text-slate-400 text-xs">
                    Open a saved league, create a new comp, or join with an invite code
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                <button
                  onClick={() => {
                    setFormError('');
                    setActiveModal('create');
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-950/60 border border-blue-800/80 hover:bg-blue-900/60 rounded-xl text-xs font-bold text-blue-200 transition"
                >
                  <PlusCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Create Comp with Friends</span>
                </button>

                <button
                  onClick={() => {
                    setFormError('');
                    setActiveModal('join');
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 rounded-xl text-xs font-bold text-emerald-200 transition"
                >
                  <LogIn className="w-4 h-4 text-emerald-400 shrink-0" />
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
                        className="w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 transition text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-sm text-white truncate">
                              {m.leagues?.name}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300 shrink-0">
                              {m.leagues?.sport || 'NRL'} {m.leagues?.season || ''}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Code: {m.leagues?.invite_code}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
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
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-white group-hover:text-blue-400 transition">
                              {code}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {seasonLabel}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 truncate">{config.name}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
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
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((count) => (
                      <button
                        key={count}
                        onClick={() =>
                          setActiveEntry({
                            league: selectedLeague,
                            season: getActiveSeasonInfo(selectedLeague).label,
                            startRound: detectCurrentLeagueRound(selectedLeague, dbFixtures),
                            totalLives: count,
                            remainingLives: count
                          })
                        }
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 transition flex flex-col items-center gap-2"
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
          <main className="p-3 sm:p-4 md:p-6 max-w-6xl w-full min-w-0 mx-auto space-y-3.5 sm:space-y-4">
            {/* 24-Hour Round Closing Reminder Banner */}
            {isClosingWithin24Hours && !isCurrentRoundLocked && (
              <div
                className={`px-3.5 py-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs ${
                  activeRoundPick
                    ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-600/70 text-amber-200'
                }`}
              >
                <div className="flex items-start sm:items-center gap-2">
                  <Bell className="w-4 h-4 shrink-0 text-amber-400 mt-0.5 sm:mt-0" />
                  <span>
                    <strong>
                      Round {currentRound} ({getRoundBracketLabel(currentRound)}) closes in ~{hoursRemaining}h:
                    </strong>{' '}
                    {activeRoundPick ? (
                      <>
                        Your tip is locked in as{' '}
                        <strong className="underline">{activeRoundPick.team_name}</strong>.
                      </>
                    ) : (
                      <>
                        You haven&apos;t entered a tip yet! A random available club will be assigned at kickoff if left blank.
                      </>
                    )}
                  </span>
                </div>
                <span className="text-[11px] opacity-80 shrink-0">
                  Email reminders: {profile?.email_reminders === false ? 'Off' : 'On'}
                </span>
              </div>
            )}

            {/* League Header + Responsive 3-Tab Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900 border border-slate-800 p-3 sm:px-4 sm:py-3 rounded-xl gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {activeEntry.compName || `${activeEntry.league} Solo`}
                  </span>
                  <span>
                    • {activeEntry.league} {activeEntry.season}
                  </span>
                  {activeEntry.inviteCode && (
                    <span className="font-mono text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      Code: {activeEntry.inviteCode}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-400 mt-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>
                    Kickoff:{' '}
                    <strong className="text-slate-200">
                      {areRoundFixturesReleased
                        ? formatLocalKickoff(currentRoundKickoff)
                        : 'Not released yet'}
                    </strong>
                  </span>
                  {!areRoundFixturesReleased ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold">
                      Awaiting Draw
                    </span>
                  ) : isCurrentRoundLocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/70 border border-rose-700/60 text-rose-300 text-[10px] font-bold">
                      <Lock className="w-2.5 h-2.5" /> Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-[10px] font-bold">
                      Open
                    </span>
                  )}
                  <span className="inline-flex md:hidden items-center gap-1 px-2 py-0.5 rounded bg-rose-950/50 border border-rose-800/50 text-rose-300 text-[10px] font-bold">
                    {activeEntry.remainingLives} <Heart className="w-2.5 h-2.5 fill-rose-500" />
                  </span>
                </div>
              </div>

              {/* Full-Width 3-Button Grid on Mobile, Inline Pill Bar on Desktop */}
              <div className="grid grid-cols-3 md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('picks')}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 md:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                    activeTab === 'picks'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Pick Teams</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('standings')}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 md:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                    activeTab === 'standings'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Standings{activeEntry.compId ? ` (${leagueMembers.length})` : ''}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 md:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition ${
                    activeTab === 'chat'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Board{leagueMessages.length > 0 ? ` (${leagueMessages.length})` : ''}
                  </span>
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="px-3.5 py-2 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs text-blue-300 flex items-start sm:items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
                <span className="break-words">{statusMessage}</span>
              </div>
            )}

            {/* ===============================================================
                TAB 1: HEAD-TO-HEAD MATCHUPS (HOME vs AWAY)
            =============================================================== */}
            {activeTab === 'picks' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/80 border border-slate-800 p-3 sm:px-4 sm:py-2.5 rounded-xl gap-2.5">
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="font-black text-xs sm:text-sm text-white truncate">
                        Round {currentRound} ({getRoundBracketLabel(currentRound)})
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-slate-400 shrink-0">
                      {picks.length}/{teams.length} used
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={syncingFixtures}
                        onClick={() => syncLiveFixtures(activeEntry.league, teams, false)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-xs font-bold text-slate-200 transition"
                        title="Refresh official fixture dates and kickoff times"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 text-blue-400 ${
                            syncingFixtures ? 'animate-spin' : ''
                          }`}
                        />
                        <span>{syncingFixtures ? 'Syncing...' : 'Sync'}</span>
                      </button>

                      {activeRoundPick && !isCurrentRoundLocked && (
                        <button
                          type="button"
                          disabled={pickBusy}
                          onClick={handleClearPick}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/70 disabled:opacity-50 border border-rose-700/70 text-xs font-bold text-rose-200 transition"
                          title={`Remove ${activeRoundPick.team_name} from Round ${currentRound}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate max-w-[110px] sm:max-w-none">
                            {pickBusy ? 'Clearing...' : `Clear (${activeRoundPick.team_name})`}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Prev + Direct Round Dropdown + Next (Full-width row on mobile) */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentRound((r) => Math.max(1, r - 1));
                          setStatusMessage('');
                        }}
                        disabled={currentRound === 1}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold rounded-lg transition shrink-0"
                      >
                        Prev
                      </button>

                      <select
                        value={currentRound}
                        onChange={(e) => {
                          setCurrentRound(Number(e.target.value));
                          setStatusMessage('');
                        }}
                        aria-label="Select Round from Dropdown"
                        className="flex-1 sm:flex-initial min-w-0 bg-slate-950 border border-slate-700 hover:border-blue-500 rounded-lg px-2 py-1.5 text-base sm:text-xs font-bold text-blue-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {dropdownRounds.map((rNum) => {
                          const roundPick = picks.find((p) => Number(p.round) === rNum);
                          return (
                            <option key={rNum} value={rNum} className="bg-slate-900 text-white">
                              R{rNum} ({getRoundBracketLabel(rNum, true)})
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
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition shrink-0"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* Loading Skeleton vs. Matchup Cards vs. Not Released Notice */}
                {loading && roundMatches.length === 0 ? (
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 text-center">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-300">Loading matchups...</p>
                  </div>
                ) : !areRoundFixturesReleased ? (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-sm sm:text-base text-white">
                      Fixtures Not Released Yet for Round {currentRound} (
                      {getRoundBracketLabel(currentRound)})
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      Official matchups and broadcast kickoff times for{' '}
                      <strong className="text-slate-200">
                        {getRoundBracketLabel(currentRound)}
                      </strong>{' '}
                      haven&apos;t been published yet. Click{' '}
                      <strong className="text-blue-300">Sync</strong> to pull the latest schedule.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
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
                          className={`bg-slate-900 border rounded-xl overflow-hidden transition w-full min-w-0 ${
                            homeSelectedHere || awaySelectedHere
                              ? 'border-blue-500/80 ring-1 ring-blue-500/40 shadow-lg'
                              : 'border-slate-800'
                          }`}
                        >
                          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch">
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
                              className={`p-2.5 sm:p-3 flex items-center gap-2 text-left transition min-w-0 ${
                                homeSelectedHere
                                  ? 'bg-blue-950/90 text-white'
                                  : homeUsedElsewhere
                                  ? 'bg-slate-950/40 opacity-40 cursor-not-allowed'
                                  : roundLocked
                                  ? 'opacity-65 cursor-not-allowed'
                                  : 'hover:bg-slate-800/80 active:bg-slate-800'
                              }`}
                            >
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800/90 p-1 flex items-center justify-center overflow-hidden border border-slate-700/60 shrink-0">
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
                                <div className="flex items-center gap-1">
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
                                <div className="text-[10px] font-semibold mt-0.5 truncate">
                                  {homeSelectedHere ? (
                                    <span className="text-blue-400">
                                      {roundLocked ? 'Locked In' : 'Selected'}
                                    </span>
                                  ) : homeUsedElsewhere ? (
                                    <span className="text-amber-500/80">
                                      Used R{homeUsedRound}
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">{home.short_code}</span>
                                  )}
                                </div>
                              </div>
                            </button>

                            {/* CENTER "V" DIVIDER */}
                            <div className="flex items-center justify-center px-1.5 sm:px-2 bg-slate-950/50 border-x border-slate-800/70">
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
                              className={`p-2.5 sm:p-3 flex items-center justify-end gap-2 text-right transition min-w-0 ${
                                awaySelectedHere
                                  ? 'bg-blue-950/90 text-white'
                                  : awayUsedElsewhere
                                  ? 'bg-slate-950/40 opacity-40 cursor-not-allowed'
                                  : roundLocked
                                  ? 'opacity-65 cursor-not-allowed'
                                  : 'hover:bg-slate-800/80 active:bg-slate-800'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-end gap-1">
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
                                <div className="text-[10px] font-semibold mt-0.5 truncate">
                                  {awaySelectedHere ? (
                                    <span className="text-blue-400">
                                      {roundLocked ? 'Locked In' : 'Selected'}
                                    </span>
                                  ) : awayUsedElsewhere ? (
                                    <span className="text-amber-500/80">
                                      Used R{awayUsedRound}
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">{away.short_code}</span>
                                  )}
                                </div>
                              </div>

                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800/90 p-1 flex items-center justify-center overflow-hidden border border-slate-700/60 shrink-0">
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
                )}

                {/* Bye Club Notice */}
                {roundByeTeam && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      {roundByeTeam.logo_url && (
                        <img
                          src={roundByeTeam.logo_url}
                          alt={roundByeTeam.name}
                          className="w-5 h-5 object-contain opacity-60 shrink-0"
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
                TAB 2: STANDINGS & LEAGUE TIPS (Contained Horizontal Scroll)
            =============================================================== */}
            {activeTab === 'standings' && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full min-w-0">
                <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-black text-sm sm:text-base text-white truncate">
                        {activeEntry.compName || `${activeEntry.league} Solo`} — Standings
                      </h2>
                      <p className="text-xs text-slate-400">
                        Swipe table sideways to view all rounds
                      </p>
                    </div>
                  </div>
                </div>

                {!activeEntry.compId ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    You are in Solo Practice mode. Create or join a competition with an invite code to compare standings with friends.
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto overscroll-x-contain">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <th className="py-2.5 px-3 sm:px-4 sticky left-0 bg-slate-950 z-10 min-w-[115px] sm:min-w-[165px]">
                            Player
                          </th>
                          <th className="py-2.5 px-2.5 text-center min-w-[65px] sm:min-w-[80px]">
                            Lives
                          </th>
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
                                className={`py-2.5 px-2.5 text-center min-w-[92px] sm:min-w-[105px] cursor-pointer transition hover:text-white ${
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
                              <td className="py-2.5 px-3 sm:px-4 sticky left-0 bg-slate-900 z-10 whitespace-nowrap font-bold max-w-[130px] sm:max-w-[180px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-mono text-slate-500">
                                    {idx + 1}.
                                  </span>
                                  <span className="text-white text-xs sm:text-sm truncate">
                                    {displayName}
                                  </span>
                                  {isMe && (
                                    <span className="text-[9px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-300 font-black shrink-0">
                                      YOU
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                                {isEliminated ? (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                                    OUT
                                  </span>
                                ) : (
                                  <div className="inline-flex items-center gap-0.5 sm:gap-1">
                                    {Array.from({ length: member.lives }).map((_, i) => (
                                      <Heart
                                        key={i}
                                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500"
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
                                    className={`py-2 px-2.5 text-center whitespace-nowrap ${
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
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-bold ${
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
                                          </span>
                                        )}
                                      </div>
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
                )}
              </section>
            )}

            {/* ===============================================================
                TAB 3: LEAGUE MESSAGE BOARD
            =============================================================== */}
            {activeTab === 'chat' && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col w-full min-w-0">
                <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shrink-0">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-black text-sm sm:text-base text-white truncate">
                        {activeEntry.compName || `${activeEntry.league} Solo`} — Message Board
                      </h2>
                      <p className="text-xs text-slate-400 truncate">
                        Open chat for everyone in this competition
                      </p>
                    </div>
                  </div>
                </div>

                {!activeEntry.compId ? (
                  <div className="p-8 text-center text-sm text-slate-400">
                    You are in Solo Practice mode. Create or join a competition with an invite code to chat with your league mates.
                  </div>
                ) : (
                  <>
                    <div className="p-3.5 sm:p-4 space-y-3 max-h-[360px] min-h-[220px] overflow-y-auto bg-slate-950/60">
                      {leagueMessages.length === 0 ? (
                        <div className="h-44 flex flex-col items-center justify-center text-center text-slate-500 text-xs px-4">
                          <MessageSquare className="w-7 h-7 mb-2 opacity-40" />
                          <p className="font-bold text-slate-400">No messages posted yet</p>
                          <p className="mt-0.5">
                            Kick off the banter below—everyone in {activeEntry.compName} can see and reply here.
                          </p>
                        </div>
                      ) : (
                        leagueMessages.map((msg) => {
                          const isMine = msg.user_id === session.user.id;
                          const senderName = msg.profiles?.username || 'Player';
                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${
                                isMine ? 'items-end' : 'items-start'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1 px-1">
                                <span className="text-[11px] font-bold text-slate-300">
                                  {isMine ? 'You' : senderName}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {formatMessageTime(msg.created_at)}
                                </span>
                                {isMine && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    title="Delete your message"
                                    className="text-slate-600 hover:text-rose-400 transition"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <div
                                className={`max-w-[85%] sm:max-w-[70%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed break-words ${
                                  isMine
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-bl-sm'
                                }`}
                              >
                                {msg.message}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    <form
                      onSubmit={handleSendMessage}
                      className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        maxLength={500}
                        placeholder="Write a message..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        className="flex-1 min-w-0 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={sendingMessage || !newMessageText.trim()}
                        className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white transition shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{sendingMessage ? '...' : 'Post'}</span>
                      </button>
                    </form>
                  </>
                )}
              </section>
            )}
          </main>
        )}
      </div>

      {/* MODAL: HOW TO PLAY & MAKING PICKS GUIDE */}
      {activeModal === 'howto' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[88dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-white">
                  How to Play — Last Man Standing
                </h3>
                <p className="text-xs text-slate-400">
                  Survive round by round without repeating a club until only one tipper remains
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>1. Core Game Rules</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc pl-4">
                  <li>
                    <strong className="text-white">Pick One Winner Per Round:</strong> Each round of your competition, pick one club to win their match.
                  </li>
                  <li>
                    <strong className="text-white">Never Repeat a Team:</strong> Once you use a club in any round, that club is burned for the rest of the season—you cannot pick them again.
                  </li>
                  <li>
                    <strong className="text-white">Lives & Elimination:</strong> Everyone starts with the number of lives chosen when the league was created (1, 2, or 3 hearts). If your tipped team loses or draws, you lose 1 life. Lose all your lives and you are eliminated (<span className="text-rose-400 font-bold">OUT</span>).
                  </li>
                  <li>
                    <strong className="text-white">Last Tipper Standing Wins:</strong> The competition runs until only one player still has lives remaining.
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-blue-400">
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span>2. How to Make & Change Your Picks</span>
                </div>
                <ol className="space-y-2 text-xs text-slate-300 leading-relaxed list-decimal pl-4">
                  <li>
                    <strong className="text-white">Select a Matchup Side:</strong> On the <strong className="text-blue-300">Pick Teams</strong> tab, every game shows <strong className="text-white">Home</strong> on the left vs <strong className="text-white">Away</strong> on the right, with the kickoff time converted to your device&apos;s local timezone underneath. Tap the club you want to back.
                  </li>
                  <li>
                    <strong className="text-white">Plan Ahead Across Future Rounds:</strong> Use <strong className="text-white">Prev</strong>, <strong className="text-white">Next</strong>, or the <strong className="text-blue-300">Round Dropdown</strong> between them to jump into upcoming rounds and map out your picks in advance. Clubs already assigned to another round show <span className="text-amber-400 font-semibold">Used R#</span> so you can&apos;t double-pick.
                  </li>
                  <li>
                    <strong className="text-white">Change or Clear Anytime Before Kickoff:</strong> As long as the round&apos;s first game hasn&apos;t kicked off yet, tap another team to switch your tip, or tap your selected team (or <span className="text-rose-300 font-semibold">Clear</span>) to remove it.
                  </li>
                </ol>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>3. Kickoff Locks, Reminders & Missed Tips</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc pl-4">
                  <li>
                    <strong className="text-white">Tips Stay Secret Until Kickoff:</strong> Before a round starts, the <strong className="text-blue-300">Standings</strong> tab shows <span className="text-amber-300 font-semibold">Tipped</span> with a padlock for other players so nobody can copy your pick. The instant the first game of that round kicks off, all picks unlock and become visible.
                  </li>
                  <li>
                    <strong className="text-white">24-Hour Reminder Emails:</strong> 24 hours before a round closes, you&apos;ll receive an email confirming your locked-in tip (or reminding you to pick if you haven&apos;t submitted one yet). Toggle this anytime from the left menu.
                  </li>
                  <li>
                    <strong className="text-white">Missed Tip Protection:</strong> If you forget to enter a tip before the first game kicks off, the system automatically assigns you a random available club you haven&apos;t used yet (<span className="text-amber-300 font-semibold">AUTO</span>). If you have no unused clubs left, you automatically lose 1 life.
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition"
            >
              Got It — Back to Comp
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COMPETITION */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20 shrink-0">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-white">Create Custom League</h3>
                <p className="text-xs text-slate-400">
                  Starts at Round 1 from this upcoming {getActiveSeasonInfo(formSport).label} round
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
                  placeholder={`e.g. Work Mates LMS ${getActiveSeasonInfo(formSport).label}`}
                  value={formCompName}
                  onChange={(e) => setFormCompName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-base sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
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
                      className={`p-2.5 rounded-xl font-bold text-[11px] sm:text-xs border transition ${
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
                Create & Join {getActiveSeasonInfo(formSport).label} League
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: JOIN COMPETITION */}
      {activeModal === 'join' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pr-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shrink-0">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-white">Join Friend's League</h3>
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-base sm:text-sm font-mono uppercase text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
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