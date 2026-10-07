import { hungarian } from './matcher.js';

class LCG {
    constructor(seed) { this.seed = seed; }
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }
}

const DOMAINS = ['Frontend', 'Backend', 'UI/UX', 'AI/ML', 'Data Analytics'];
const COST_MAP = { 0: 1, 1: 4, 2: 9, 3: 16, 4: 25 }; // rank index to cost

export async function runAllocation(members, seed) {
    const lcg = new LCG(seed);

    const boys = members.filter(m => m.gender === 'boy');
    const girls = members.filter(m => m.gender === 'girl');

    await allocateGroupEvenly(boys, lcg);
    await allocateGroupEvenly(girls, lcg);
}

async function allocateGroupEvenly(groupMembers, lcg) {
    if (groupMembers.length === 0) return;
    const numDomains = DOMAINS.length;
    const count = groupMembers.length;

    // Distribute slots evenly
    const baseSlots = Math.floor(count / numDomains);
    let remainder = count % numDomains;

    // To keep tie-breaks deterministic, we shuffle domains slightly using LCG
    const domSlots = DOMAINS.map(() => baseSlots);
    const order = [0, 1, 2, 3, 4].map(v => ({ v, r: lcg.next() })).sort((a, b) => a.r - b.r).map(x => x.v);

    for (let i = 0; i < remainder; i++) {
        domSlots[order[i]]++;
    }

    const totalSlots = count;
    const matrix = [];

    // Flatten slot structure
    const slotToDomain = [];
    for (let d = 0; d < numDomains; d++) {
        for (let s = 0; s < domSlots[d]; s++) {
            slotToDomain.push(DOMAINS[d]);
        }
    }

    for (let i = 0; i < count; i++) {
        const member = groupMembers[i];
        const row = [];

        for (let c = 0; c < totalSlots; c++) {
            const domain = slotToDomain[c];
            let rank = member.ranking ? member.ranking.indexOf(domain) : -1;
            if (rank === -1) rank = 4; // default worst

            let baseCost = COST_MAP[rank];
            const noise = lcg.next() * 0.1;
            row.push(baseCost + noise);
        }
        matrix.push(row);
    }

    const assignments = hungarian(matrix);

    for (const [r, c] of assignments) {
        if (r < count && c < totalSlots) {
            groupMembers[r].allocatedDomain = slotToDomain[c];
            if (groupMembers[r].save) await groupMembers[r].save();
        }
    }
}
