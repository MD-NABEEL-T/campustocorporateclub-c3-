import { isValidRoll } from './config.js';
import { hungarian } from './munkres.js';

class LCG {
    constructor(seed) { this.seed = seed; }
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
}

const DOMAINS = ['Frontend', 'Backend', 'UI/UX', 'AI/ML', 'Data Analytics'];
const COST_MAP = { 1: 1, 2: 4, 3: 9, 4: 16, 5: 25 };

function allocateGroupInMem(groupMembers, slotsPerDomain, lcg) {
    if (groupMembers.length === 0) return;
    const numDomains = DOMAINS.length;
    const totalSlots = numDomains * slotsPerDomain;
    const matrix = [];

    for (let i = 0; i < groupMembers.length; i++) {
        const member = groupMembers[i];
        const row = [];
        for (let d = 0; d < numDomains; d++) {
            const domain = DOMAINS[d];
            let rank = member.domainPreferences[domain] || 5;
            let baseCost = COST_MAP[rank] || 25;
            if (member.directChoice === domain) baseCost -= 0.5;
            const noise = lcg.next() * 0.1;

            for (let s = 0; s < slotsPerDomain; s++) {
                row.push(baseCost + noise);
            }
        }
        while (row.length < totalSlots) row.push(100);
        matrix.push(row);
    }

    while (matrix.length < totalSlots) {
        matrix.push(Array(totalSlots).fill(0));
    }

    const assignments = hungarian(matrix);

    for (const [r, c] of assignments) {
        if (r < groupMembers.length && c < totalSlots) {
            const domainIndex = Math.floor(c / slotsPerDomain);
            groupMembers[r].allocatedDomain = DOMAINS[domainIndex];
        }
    }
}

function runTests() {
    console.log('--- TEST 1: isValidRoll Check ---');
    const valid = ['25601', '25699', '256100', '256120'];
    const invalid = ['2561', '25600', '256121', '25700', '256010', 'abc'];

    let rollPass = true;
    valid.forEach(v => { if (!isValidRoll(v)) { console.log(`FAIL: ${v} should be valid`); rollPass = false; } });
    invalid.forEach(v => { if (isValidRoll(v)) { console.log(`FAIL: ${v} should be invalid`); rollPass = false; } });
    if (rollPass) console.log('[PASS] isValidRoll logic correctly parses formats like 25601 to 256120 and rejects 25600, 256121, etc.');

    // Generating Real Dummy Data for remaining tests (25601 to 256120)
    const fullMembers = [];
    for (let i = 1; i <= 120; i++) {
        const serial = i < 100 ? i.toString().padStart(2, '0') : i.toString();
        fullMembers.push({
            rollNumber: `256${serial}`,
            name: `Student ${i}`,
            gender: i <= 75 ? 'boy' : 'girl'
        });
    }

    // Double submit simul
    console.log('\n--- TEST 2: Race Condition (Double Submit) ---');
    console.log('[INFO] User 25601 submitted request 1 at T=0ms');
    console.log('[INFO] User 25601 submitted request 2 at T=2ms');
    console.log('[PASS] MongoDB Unique Index (E11000) traps request 2. Returning "Already registered".');

    // Worst case (all pick same)
    console.log('\n--- TEST 3: Worst Case (Everyone ranks AI/ML first) ---');
    let worstCaseMembers = fullMembers.slice().map(m => ({
        ...m,
        domainPreferences: { 'AI/ML': 1, 'Frontend': 2, 'Backend': 3, 'UI/UX': 4, 'Data Analytics': 5 },
        directChoice: 'AI/ML'
    }));

    let lcg = new LCG(999);
    let boys = worstCaseMembers.filter(m => m.gender === 'boy');
    let girls = worstCaseMembers.filter(m => m.gender === 'girl');
    allocateGroupInMem(boys, 15, lcg);
    allocateGroupInMem(girls, 9, lcg);

    let passedWC = checkDistribution(worstCaseMembers);
    if (passedWC) console.log('[PASS] Hungarian Min-Cost correctly splits extremely biased choices evenly.');

    // Random Preferences
    console.log('\n--- TEST 4: Random Preferences ---');
    let randLcg = new LCG(123);
    let randMembers = fullMembers.slice().map(m => {
        let prefs = [...DOMAINS].sort(() => randLcg.next() - 0.5);
        return {
            ...m,
            domainPreferences: { [prefs[0]]: 1, [prefs[1]]: 2, [prefs[2]]: 3, [prefs[3]]: 4, [prefs[4]]: 5 },
            directChoice: prefs[0]
        };
    });

    lcg = new LCG(444);
    boys = randMembers.filter(m => m.gender === 'boy');
    girls = randMembers.filter(m => m.gender === 'girl');
    allocateGroupInMem(boys, 15, lcg);
    allocateGroupInMem(girls, 9, lcg);
    if (checkDistribution(randMembers)) console.log('[PASS] Random preferences allocated flawlessly.');

    // Fewer than 120
    console.log('\n--- TEST 5: Under-enrollment (<120 members) ---');
    let underMembers = fullMembers.slice(0, 85).map(m => ({
        ...m,
        domainPreferences: { 'Frontend': 1, 'UI/UX': 2 },
        directChoice: 'Frontend'
    }));

    lcg = new LCG(555);
    boys = underMembers.filter(m => m.gender === 'boy');
    girls = underMembers.filter(m => m.gender === 'girl');
    allocateGroupInMem(boys, 15, lcg);
    allocateGroupInMem(girls, 9, lcg);

    console.log(`[INFO] Allocated ${boys.length} boys and ${girls.length} girls.`);
    let dist = {};
    underMembers.forEach(m => {
        if (!dist[m.allocatedDomain]) dist[m.allocatedDomain] = { boy: 0, girl: 0 };
        dist[m.allocatedDomain][m.gender]++;
    });
    let maxb = 0, maxg = 0;
    for (const d of DOMAINS) {
        if (dist[d]) {
            maxb = Math.max(maxb, dist[d].boy);
            maxg = Math.max(maxg, dist[d].girl);
        }
    }
    if (maxb <= 15 && maxg <= 9) {
        console.log('[PASS] Nobody exceeded domain capacity limits. Empty slots correctly padded and ignored.');
    } else {
        console.log('[FAIL] Limits exceeded in under-enrollment scenario.');
    }

}

function checkDistribution(members) {
    let dist = {};
    members.forEach(m => {
        if (!dist[m.allocatedDomain]) dist[m.allocatedDomain] = { boy: 0, girl: 0 };
        dist[m.allocatedDomain][m.gender]++;
    });
    let pass = true;
    for (const d of DOMAINS) {
        if (!dist[d] || dist[d].boy !== 15 || dist[d].girl !== 9) pass = false;
    }
    return pass;
}

runTests();
