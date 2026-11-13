import React from 'react';

export default function LeagueBoard({
  members = [],
  picks = [],
  totalRounds = 10,
  lockedRounds = [], // Array of round numbers that have already kicked off, e.g. [1, 2]
  currentUserId,
}) {
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <th className="py-3.5 px-4 sticky left-0 bg-slate-950 z-10">Player</th>
            <th className="py-3.5 px-4 text-center">Lives</th>
            {rounds.map((roundNum) => (
              <th key={roundNum} className="py-3.5 px-4 text-center min-w-[100px]">
                R{roundNum}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70 text-sm">
          {members.map((member, index) => {
            const username = member.profiles?.username || 'Player';
            const isEliminated = member.lives <= 0 || member.status === 'eliminated';

            return (
              <tr
                key={member.id}
                className={
                  isEliminated
                    ? 'opacity-45 bg-red-950/10'
                    : 'hover:bg-slate-800/40 transition-colors'
                }
              >
                {/* Running Order Position & Name */}
                <td className="py-3 px-4 font-medium sticky left-0 bg-slate-900 z-10 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-slate-500 w-4">
                      {index + 1}.
                    </span>
                    <span className="text-slate-100 font-semibold">{username}</span>
                    {member.user_id === currentUserId && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                </td>

                {/* Lives Remaining */}
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  {isEliminated ? (
                    <span className="text-xs font-bold text-red-400 uppercase">Out</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                      {member.lives} ❤️
                    </span>
                  )}
                </td>

                {/* Horizontal Line of Round Picks */}
                {rounds.map((roundNum) => {
                  const pick = picks.find(
                    (p) => p.user_id === member.user_id && p.round_number === roundNum
                  );
                  const isVisible =
                    lockedRounds.includes(roundNum) || member.user_id === currentUserId;

                  if (!pick) {
                    return (
                      <td key={roundNum} className="py-3 px-4 text-center text-slate-600">
                        —
                      </td>
                    );
                  }

                  if (!isVisible) {
                    return (
                      <td key={roundNum} className="py-3 px-4 text-center">
                        <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-1 rounded">
                          Locked
                        </span>
                      </td>
                    );
                  }

                  // Status color styling (win / loss / pending)
                  let badgeStyle = 'bg-slate-800 border-slate-700 text-slate-200';
                  if (pick.status === 'win') {
                    badgeStyle = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
                  } else if (pick.status === 'loss') {
                    badgeStyle = 'bg-red-950/60 border-red-500/40 text-red-300 line-through';
                  }

                  return (
                    <td key={roundNum} className="py-3 px-4 text-center whitespace-nowrap">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${badgeStyle}`}
                      >
                        {pick.teams?.logo_url && (
                          <img
                            src={pick.teams.logo_url}
                            alt=""
                            className="w-4 h-4 object-contain"
                          />
                        )}
                        <span>{pick.teams?.short_name || pick.teams?.name}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}