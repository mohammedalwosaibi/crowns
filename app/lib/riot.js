// app/lib/riot.js

const apiKey = process.env.RIOT_API_KEY;
export const stageStart = new Date('2026-05-13T00:00:00+03:00');
export const stageEnd   = new Date('2026-05-19T23:59:59+03:00');
const startTime = Math.floor(stageStart.getTime() / 1000);
const endTime   = Math.floor(stageEnd.getTime()   / 1000);

const users = [
    { "displayName": "mlafe", "riotId": "mlafe#wof", "puuid": "1z7tHhBXi7MRRK-nyYI5UOPP30-J80Ojcamc9sDnd22Dyuwyb4ndQ8VYxUf22Ce_1XXn4-9SJR02MQ" },
    { "displayName": "NoiR", "riotId": "NoiR#Ali", "puuid": "UVB3FrdcaI6EkPPmq1hfS_kzhr76ELI_ZCOaA3K0i99OKhF16_R8hpXHQevcRpT5TCSIyR_VTpXsYA" },
    { "displayName": "lil Darky", "riotId": "lil Darky#000", "puuid": "YTWQZZPLGOlQiVLNi_KPtvu3PENxO_7G3lUky9oYw_L2eJ4QZI_-pQYhF5weaoIIukYwnXn0f6odhQ" },
    { "displayName": "Fizzx0", "riotId": "Fizzx0#TKF", "puuid": "g32sxvFLeigpnDqATlBlSqS4QnC4yGqsS-t-FqAyETwdHAL5uDVsi8q3u7fe1T-X4Og9gUuqcHyCkg" },
    { "displayName": "PLaNeR", "riotId": "PLaNeR#11111", "puuid": "rNbxP9iv9bqk2ZZm2cJZFPQFzOnZi8v3yqO9GvgMUQg2iKco2HEWy3SgCAckIUCzN_DSZa9IjUaRhg" },
    { "displayName": "Infinity", "riotId": "Infinity#HIM", "puuid": "cg_5zLaqtbNFFT_1RrAzCRD-ETjQRDl4H3gRhaY75TtECHzl2RmoVRcbt7xm-3nWCOUqpwdxXKtZ2Q" },
    { "displayName": "lil Omeny", "riotId": "lil Omeny#000", "puuid": "ei862XM35VEIYGsJQyhxtSRpRFxO2eI6uGZ3W63bFerx4N49RGOneD6XYe0JjCeh0oYcl9JBRtoy5A" },
    { "displayName": "Thug", "riotId": "Thug#00001", "puuid": "0jgd9VptbS_sbgdH_LWDXnFxCYxhOjiZOhlRvIgfdu4nIRCLrIlgLcYAqiOhTjTmQ9aO0Yqu8526CQ" },
    { "displayName": "Beeruッ", "riotId": "Beeruッ#000", "puuid": "qVKcwjhn-bX9KIEoyAhaRfb5F705wJQwEBH6msgGPvmbFGmuv_EB5DBkuXMwRiwLS0oWAK2gvPrJFg" },
    { "displayName": "Madridi", "riotId": "Madridi#1993", "puuid": "xNIMUl7odqm_D5d9zJrABcswobvUHMPjk_l5S3yiyRCQjLZUqyoOSHX8w9N9wxGceDifEy12cbHqIA" },
    { "displayName": "lil M7xy", "riotId": "lil M7xy#000", "puuid": "voCCeQmkCiVTr2OQfnFWtvpqz7u4ufGO9EAH8hmKSuF763AaH5W5o5CocpFJagLv-kisDi5ip2x9VA" }
];

const puuidToDisplayName = {};
for (const user of users) {
    puuidToDisplayName[user.puuid] = user.displayName;
}

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

const getMatchIds = async (puuid, count = 100) => {
    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&endTime=${endTime}&count=${count}&type=ranked&api_key=${apiKey}`;
    const result = await fetch(url, { next: { revalidate: 300 } });
    return await result.json();
}

const getMatchData = async (matchId) => {
    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`;
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Riot API Error: ${response.status} on match ${matchId}`);
    return await response.json();
}

const getUniqueMatchIds = async () => {
    const uniqueMatchIdsSet = new Set();
    for (const user of users) {
        const matchIds = await getMatchIds(user.puuid);
        if (Array.isArray(matchIds)) {
            for (const matchId of matchIds) uniqueMatchIdsSet.add(matchId);
        }
    }
    return [...uniqueMatchIdsSet];
}

const getAllMatchData = async (uniqueMatchIds) => {
    const allMatchData = [];
    for (const matchId of uniqueMatchIds) {
        try {
            const fetchStart = Date.now();
            const matchData = await getMatchData(matchId);
            allMatchData.push(matchData);
            
            // THE FIX: Only sleep if it took time (meaning it actually hit Riot, not the cache)
            if (Date.now() - fetchStart > 50) {
                await sleep(60); 
            }
        } catch (error) {
            console.error(error.message);
            break; 
        }
    }
    return allMatchData;
}

const processMatches = (allMatchData) => {
    const playerStats = {};
    for (const user of users) {
        playerStats[user.displayName] = {
            displayName: user.displayName,
            dpm: [], gpm: [], ccPerMin: [], visionScorePerMin: [],
            objectiveDamagePerMin: [], damageMitigatedPerMin: [],
            killParticipation: [], healAndShieldingPerMin: [],
            totals: { kills: 0, deaths: 0, assists: 0, gamesPlayed: 0, wins: 0, timePlayed: 0, timeDead: 0 }
        };
    }

    for (const match of allMatchData) {
        if (!match.info || match.info.gameDuration / 60 < 4.5) continue;
        for (const participant of match.info.participants) {
            const displayName = puuidToDisplayName[participant.puuid];
            if (displayName) {
                const stats = playerStats[displayName];
                const challenges = participant.challenges || {};
                const mins = match.info.gameDuration / 60;

                stats.dpm.push(challenges.damagePerMinute || 0);
                stats.gpm.push(challenges.goldPerMinute || 0);
                stats.visionScorePerMin.push(challenges.visionScorePerMinute || 0);
                stats.killParticipation.push(challenges.killParticipation || 0);
                stats.ccPerMin.push((challenges.enemyChampionImmobilizations || 0) / mins);
                stats.objectiveDamagePerMin.push((participant.damageDealtToObjectives || 0) / mins);
                stats.damageMitigatedPerMin.push((participant.damageSelfMitigated || 0) / mins);
                stats.healAndShieldingPerMin.push((challenges.effectiveHealAndShielding || 0) / mins);
                stats.totals.kills += participant.kills || 0;
                stats.totals.deaths += participant.deaths || 0;
                stats.totals.assists += participant.assists || 0;
                stats.totals.gamesPlayed += 1;
                if (participant.win) stats.totals.wins += 1;
                stats.totals.timePlayed += match.info.gameDuration;
                stats.totals.timeDead += participant.totalTimeSpentDead || 0;
            }
        }
    }
    return Object.values(playerStats);
}

const calculateCrowns = (playerStats) => {
    const activePlayers = playerStats.filter(p => p.totals.gamesPlayed > 0);
    const inactivePlayers = playerStats.filter(p => p.totals.gamesPlayed === 0).map(p => ({ displayName: p.displayName }));
    const MIN_GAMES = 5;

    const getBestOf5 = (statKey) => activePlayers.map(p => {
        const top5 = [...p[statKey]].sort((a, b) => b - a).slice(0, 5);
        return {
            displayName: p.displayName,
            score: top5.reduce((a, b) => a + b, 0) / 5,
            top5Games: top5, // <--- ADD THIS LINE BACK!
            isQualified: p.totals.gamesPlayed >= MIN_GAMES
        };
    }).sort((a, b) => b.score - a.score);

    const sortProv = (a, b) => (a.isQualified === b.isQualified) ? b.score - a.score : (a.isQualified ? -1 : 1);

    return {
        performance: {
            dpm: getBestOf5("dpm"), gpm: getBestOf5("gpm"), cc: getBestOf5("ccPerMin"),
            vision: getBestOf5("visionScorePerMin"), objDamage: getBestOf5("objectiveDamagePerMin"),
            mitigated: getBestOf5("damageMitigatedPerMin"), kp: getBestOf5("killParticipation").map(p => ({...p, score: p.score * 100})),
            healing: getBestOf5("healAndShieldingPerMin")
        },
        regulators: {
            kda: activePlayers.map(p => ({
                kills: p.totals.kills,
                deaths: p.totals.deaths,
                assists: p.totals.assists,
                displayName: p.displayName, score: (p.totals.kills + p.totals.assists) / (p.totals.deaths || 1), isQualified: p.totals.gamesPlayed >= MIN_GAMES })).sort(sortProv),
            winRate: activePlayers.map(p => ({
                wins: p.totals.wins,
                losses: p.totals.gamesPlayed - p.totals.wins,
                gamesPlayed: p.totals.gamesPlayed,
                displayName: p.displayName, score: (p.totals.wins / p.totals.gamesPlayed) * 100, isQualified: p.totals.gamesPlayed >= MIN_GAMES })).sort(sortProv),
            timeDead: activePlayers.map(p => ({ displayName: p.displayName, score: (p.totals.timeDead / p.totals.timePlayed) * 100, isQualified: p.totals.gamesPlayed >= MIN_GAMES })).sort((a, b) => (a.isQualified === b.isQualified) ? b.score - a.score : (a.isQualified ? -1 : 1))
        },
        benchwarmers: inactivePlayers
    };
};

// 🌟 THE EXPORTED ENGINE 🌟
export async function getLeaderboardData() {
    if (!apiKey) throw new Error("RIOT_API_KEY is missing from .env.local");
    const uniqueMatchIds = await getUniqueMatchIds();
    const allMatchData = await getAllMatchData(uniqueMatchIds);
    const playerStats = processMatches(allMatchData);
    return calculateCrowns(playerStats);
}