import CrownCard from './components/CrownCard';
import { getLeaderboardData, stageStart, stageEnd } from './lib/riot';

function formatStageRange(start, end) {
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Riyadh' });
  const year = end.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'Asia/Riyadh' });
  return `${fmt(start)} – ${fmt(end)}, ${year}`;
}

export const dynamic = 'force-dynamic';

function PageCrownIcon() {
  return (
    <svg width="36" height="26" viewBox="0 0 44 32" fill="none" aria-hidden="true">
      <polygon
        points="3,28 3,14 13,21 22,4 31,21 41,14 41,28"
        stroke="#c89b3c"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="rgba(200,155,60,0.1)"
      />
      <rect x="3" y="26" width="38" height="3" rx="0.5" fill="#c89b3c" opacity="0.45" />
    </svg>
  );
}

function SectionDivider({ label, ordinal, count }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#605848' }}
        className="text-[9px] tracking-widest select-none"
      >
        {ordinal}
      </span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #3d3520, #7a6840 40%, #3d3520)' }} />
      <h2
        style={{ fontFamily: 'var(--font-cinzel-var)', color: '#9a8450' }}
        className="text-[10px] tracking-[0.3em] uppercase"
      >
        {label}
      </h2>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #3d3520, #7a6840 40%, #3d3520)' }} />
      <span
        style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#605848' }}
        className="text-[9px] tabular-nums"
      >
        {count}
      </span>
    </div>
  );
}

export default async function Dashboard() {
  let data;
  try {
    data = await getLeaderboardData();
  } catch (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#010a13' }}
      >
        <p
          style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#c23b22' }}
          className="text-sm"
        >
          [!] SYSTEM_ERROR: {error.message}
        </p>
      </div>
    );
  }

  const performanceCrowns = [
    { title: "The Executioner",   desc: "Avg Damage Per Minute · Best of 5",           data: data.performance.dpm,       format: "number",  prize: "$5" },
    { title: "The Capitalist",    desc: "Avg Gold Per Minute · Best of 5",              data: data.performance.gpm,       format: "number",  prize: "$5" },
    { title: "The Warden",        desc: "Hard CC Immobilizations Per Min · Best of 5",  data: data.performance.cc,        format: "number",  prize: "$5" },
    { title: "The Oracle",        desc: "Vision Score Per Minute · Best of 5",          data: data.performance.vision,    format: "number",  prize: "$5" },
    { title: "The Demolitionist", desc: "Objective Damage Per Min · Best of 5",         data: data.performance.objDamage, format: "number",  prize: "$5" },
    { title: "The Meat Shield",   desc: "Damage Mitigated Per Min · Best of 5",         data: data.performance.mitigated, format: "number",  prize: "$5" },
    { title: "The Catalyst",      desc: "Kill Participation % · Best of 5",             data: data.performance.kp,        format: "percent", prize: "$5" },
    { title: "The Guardian",      desc: "Healing & Shielding Per Min · Best of 5",      data: data.performance.healing,   format: "number",  prize: "$5" },
  ];

  const regulatorCrowns = [
    { title: "The Untouchable", desc: "Overall KDA · Min 5 Games",          data: data.regulators.kda,      format: "number",  prize: "$8" },
    { title: "The Victor",      desc: "Win Rate % · Min 5 Games",           data: data.regulators.winRate,  format: "percent", prize: "$8" },
    { title: "Hall of Shame",   desc: "% of Game Spent Dead · Min 5 Games", data: data.regulators.timeDead, format: "percent", isShame: true },
  ];

  return (
    <main
      className="min-h-screen px-4 py-8 md:px-8 md:py-10 overflow-x-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 40% at 50% 0%, rgba(10,40,100,0.18) 0%, transparent 65%),
          radial-gradient(ellipse 40% 30% at 80% 100%, rgba(200,155,60,0.04) 0%, transparent 60%),
          #010a13
        `,
      }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <header className="text-center mb-8 card-in" style={{ animationDelay: '0s' }}>
          <div className="flex justify-center mb-3 opacity-80">
            <PageCrownIcon />
          </div>
          <h1
            style={{ fontFamily: 'var(--font-cinzel-var)', color: '#f0e6d3', letterSpacing: '-0.01em' }}
            className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-none"
          >
            Weekly{' '}
            <span className="crown-shimmer">Crowns</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, transparent, #7a6840)' }} />
            <p
              style={{ fontFamily: 'var(--font-jetbrains-var)', color: '#9a8450' }}
              className="text-[10px] tracking-[0.22em] uppercase"
            >
              {formatStageRange(stageStart, stageEnd)}
            </p>
            <div className="h-px w-12" style={{ background: 'linear-gradient(90deg, #7a6840, transparent)' }} />
          </div>
        </header>

        {/* The Majors */}
        <section className="mb-8">
          <SectionDivider label="The Majors" ordinal="I" count="03" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {regulatorCrowns.map((crown, i) => (
              <div key={i} className="card-in" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                <CrownCard {...crown} />
              </div>
            ))}
          </div>
        </section>

        {/* Performance Crowns */}
        <section className="mb-10">
          <SectionDivider label="Performance Crowns" ordinal="II" count="08" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {performanceCrowns.map((crown, i) => (
              <div key={i} className="card-in" style={{ animationDelay: `${0.35 + i * 0.045}s` }}>
                <CrownCard {...crown} />
              </div>
            ))}
          </div>
        </section>

        {/* Benchwarmers */}
        {data.benchwarmers && data.benchwarmers.length > 0 && (
          <footer className="mt-6 text-center card-in" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #7a6840)' }} />
              <span
                style={{ fontFamily: 'var(--font-cinzel-var)', color: '#a89060' }}
                className="text-[9px] tracking-[0.4em] uppercase"
              >
                AFK — Zero Games
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #7a6840, transparent)' }} />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {data.benchwarmers.map((player, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--font-manrope-var)',
                    color: '#a09070',
                    border: '1px solid #5a5040',
                    backgroundColor: '#0d1018',
                  }}
                  className="px-3 py-1 text-[11px] tracking-wide"
                >
                  {player.displayName}
                </span>
              ))}
            </div>
          </footer>
        )}

      </div>
    </main>
  );
}
