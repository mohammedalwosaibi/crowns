function MiniCrownIcon() {
  return (
    <svg width="11" height="8" viewBox="0 0 22 16" fill="currentColor" aria-hidden="true">
      <polygon points="1,14 1,7 7,11 11,2 15,11 21,7 21,14" />
      <rect x="1" y="13" width="20" height="2.5" />
    </svg>
  );
}

export default function CrownCard({ title, desc, data, format, isShame = false, prize = null }) {
  // Leader: full solid bg with contrasting text; shame gets solid red, gold gets solid gold
  const iconColor    = isShame ? '#fff0ee' : '#1a1000';
  const accentBright = isShame ? '#fff0ee' : '#1a1000';
  const accentScore  = isShame ? '#fff0ee' : '#1a1000';
  const accentBg     = isShame
    ? 'linear-gradient(180deg, #c23b22 0%, #9e2f1a 100%)'
    : 'linear-gradient(180deg, #c8963a 0%, #b07828 100%)';
  const pillBg       = 'rgba(0,0,0,0.72)';
  const pillBorder   = 'rgba(0,0,0,0.8)';
  const pillText     = isShame ? '#ff9080' : '#f0d060';
  const pillShadow   = isShame ? '0 0 6px rgba(255,100,80,0.6)' : '0 0 6px rgba(240,200,60,0.7)';

  return (
    <div
      className="flex flex-col h-full border border-[#463714] hover:border-[#785a28] transition-colors duration-200"
      style={{ background: 'linear-gradient(180deg, #1e2328 0%, #16191e 100%)' }}
    >
      {/* Card Header */}
      <div className="px-3 pt-3 pb-2 flex items-start justify-between gap-2" style={{ borderBottom: '1px solid #1a1e24' }}>
        <div className="min-w-0">
          <h3
            style={{ fontFamily: 'var(--font-cinzel-var)', color: '#c8aa6e' }}
            className="text-[11.5px] font-bold uppercase tracking-wide leading-tight"
          >
            {title}
          </h3>
          <p
            style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#7a6d50' }}
            className="text-[8px] mt-1 tracking-[0.1em] uppercase leading-none"
          >
            {desc}
          </p>
        </div>
        {prize && (
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-var)',
              color: '#c89b3c',
              backgroundColor: 'rgba(200,155,60,0.1)',
              border: '1px solid rgba(200,155,60,0.22)',
            }}
            className="text-[10px] font-bold tabular-nums flex-shrink-0 px-1.5 py-0.5 leading-none"
          >
            {prize}
          </span>
        )}
      </div>

      {/* Player Rows */}
      <ul className="flex-grow flex flex-col px-1.5 py-1.5 gap-px">
        {data.map((player, index) => {
          const isLeader = index === 0;

          let displayScore = player.score.toFixed(2);
          if (format === 'percent') displayScore += '%';

          const formatGameScore = (val) => {
            if (format === 'percent') return (val * 100).toFixed(2) + '%';
            return val.toFixed(2);
          };

          const subStats = player.kills !== undefined
            ? [['K', player.kills], ['D', player.deaths], ['A', player.assists]]
            : player.wins !== undefined
            ? [['G', player.gamesPlayed], ['W', player.wins], ['L', player.losses]]
            : null;

          // ── Leader ──────────────────────────────────────────────────
          if (isLeader) {
            return (
              <li key={player.displayName} className="relative flex flex-col -mx-1.5 -mt-1.5">
                <div
                  className="flex flex-col pl-[10px] pr-[10px] py-1.5"
                  style={{ background: accentBg }}
                >
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span style={{ color: iconColor }} className="w-3.5 flex-shrink-0 flex items-center justify-center">
                        <MiniCrownIcon />
                      </span>
                      <span
                        style={{ fontFamily: 'var(--font-manrope-var)', color: accentBright }}
                        className="font-bold text-[11px] truncate"
                      >
                        {player.displayName}
                      </span>
                      {subStats && (
                        <div className="flex gap-1 flex-shrink-0">
                          {subStats.map(([label, val]) => (
                            <span
                              key={label}
                              style={{
                                fontFamily: 'var(--font-jetbrains-var)',
                                backgroundColor: pillBg,
                                color: pillText,
                                border: `1px solid ${pillBorder}`,
                                textShadow: pillShadow,
                              }}
                              className="text-[7.5px] px-1 py-0.5 tabular-nums leading-none"
                            >
                              <span style={{ opacity: 0.65 }}>{label} </span>{val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span
                      style={{ fontFamily: 'var(--font-jetbrains-var)', color: accentScore }}
                      className="text-[10.5px] font-bold tabular-nums flex-shrink-0 ml-2"
                    >
                      {displayScore}
                    </span>
                  </div>
                  {player.top5Games && player.top5Games.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 ml-6">
                      {player.top5Games.map((val, i) => (
                        <span
                          key={i}
                          style={{
                            fontFamily: 'var(--font-jetbrains-var)',
                            backgroundColor: pillBg,
                            color: pillText,
                            border: `1px solid ${pillBorder}`,
                            textShadow: pillShadow,
                          }}
                          className="text-[7.5px] px-1 py-0.5 tabular-nums leading-none"
                        >
                          {formatGameScore(val)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          }

          // ── Provisional ─────────────────────────────────────────────
          if (!player.isQualified) {
            return (
              <li key={player.displayName} className="flex flex-col px-1 py-1">
                <div className="flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#6a6858' }}
                      className="text-[9px] w-3.5 flex-shrink-0 tabular-nums text-center"
                    >
                      {index + 1}
                    </span>
                    <span
                      style={{ fontFamily: 'var(--font-manrope-var)', color: '#908878' }}
                      className="text-[10.5px] font-medium truncate"
                    >
                      {player.displayName}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains-var)',
                        color: '#807868',
                        backgroundColor: '#12141a',
                        border: '1px solid #484640',
                      }}
                      className="text-[7px] px-1 py-px tracking-widest uppercase flex-shrink-0"
                    >
                      prov
                    </span>
                    {subStats && (
                      <div className="flex gap-1 flex-shrink-0">
                        {subStats.map(([label, val]) => (
                          <span
                            key={label}
                            style={{
                              fontFamily: 'var(--font-jetbrains-var)',
                              backgroundColor: 'rgba(40,36,28,0.8)',
                              color: '#807868',
                              border: '1px solid #484640',
                            }}
                            className="text-[7.5px] px-1 py-0.5 tabular-nums leading-none"
                          >
                            <span style={{ opacity: 0.65 }}>{label} </span>{val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span
                    style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#807868' }}
                    className="text-[10px] tabular-nums ml-2 flex-shrink-0"
                  >
                    {displayScore}
                  </span>
                </div>
                {player.top5Games && player.top5Games.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 ml-6">
                    {player.top5Games.map((val, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: 'var(--font-jetbrains-var)',
                          backgroundColor: 'rgba(40,36,28,0.8)',
                          color: '#807868',
                          border: '1px solid #484640',
                        }}
                        className="text-[7.5px] px-1 py-0.5 tabular-nums leading-none"
                      >
                        {formatGameScore(val)}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          }

          // ── Qualified (non-leader) ───────────────────────────────────
          return (
            <li key={player.displayName} className="flex flex-col px-1 py-1">
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#7a6840' }}
                    className="text-[9px] w-3.5 flex-shrink-0 tabular-nums text-center"
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{ fontFamily: 'var(--font-manrope-var)', color: '#c8c0a8' }}
                    className="text-[10.5px] font-medium truncate"
                  >
                    {player.displayName}
                  </span>
                  {subStats && (
                    <div className="flex gap-1 flex-shrink-0">
                      {subStats.map(([label, val]) => (
                        <span
                          key={label}
                          style={{
                            fontFamily: 'var(--font-jetbrains-var)',
                            backgroundColor: 'rgba(100,80,30,0.25)',
                            color: '#9a9070',
                            border: '1px solid rgba(100,80,30,0.4)',
                          }}
                          className="text-[7.5px] px-1 py-0.5 tabular-nums leading-none"
                        >
                          <span style={{ opacity: 0.65 }}>{label} </span>{val}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span
                  style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#a09880' }}
                  className="text-[10px] tabular-nums ml-2 flex-shrink-0"
                >
                  {displayScore}
                </span>
              </div>
              {player.top5Games && player.top5Games.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 ml-6">
                  {player.top5Games.map((val, i) => (
                    <span
                      key={i}
                      style={{
                        fontFamily: 'var(--font-jetbrains-var)',
                        backgroundColor: 'rgba(100,80,30,0.25)',
                        color: '#9a9070',
                        border: '1px solid rgba(100,80,30,0.4)',
                      }}
                      className="text-[7.5px] px-1 py-0.5 tabular-nums leading-none"
                    >
                      {formatGameScore(val)}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
