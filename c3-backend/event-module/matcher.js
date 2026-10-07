export function hungarian(matrix) {
    const n = matrix.length;
    if (n === 0) return [];
    const m = matrix[0].length;
    // Pad matrix to be square
    const size = Math.max(n, m);
    const cost = Array(size).fill(0).map((_, i) =>
        Array(size).fill(0).map((_, j) => (i < n && j < m) ? matrix[i][j] : 0)
    );

    const u = Array(size + 1).fill(0);
    const v = Array(size + 1).fill(0);
    const p = Array(size + 1).fill(0);
    const way = Array(size + 1).fill(0);

    for (let i = 1; i <= size; i++) {
        p[0] = i;
        let j0 = 0;
        const minv = Array(size + 1).fill(Infinity);
        const used = Array(size + 1).fill(false);

        do {
            used[j0] = true;
            const i0 = p[j0];
            let delta = Infinity;
            let j1 = 0;

            for (let j = 1; j <= size; j++) {
                if (!used[j]) {
                    const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
                    if (cur < minv[j]) {
                        minv[j] = cur;
                        way[j] = j0;
                    }
                    if (minv[j] < delta) {
                        delta = minv[j];
                        j1 = j;
                    }
                }
            }

            for (let j = 0; j <= size; j++) {
                if (used[j]) {
                    u[p[j]] += delta;
                    v[j] -= delta;
                } else {
                    minv[j] -= delta;
                }
            }
            j0 = j1;
        } while (p[j0] !== 0);

        do {
            const j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0 !== 0);
    }

    const result = [];
    for (let j = 1; j <= size; j++) {
        const i = p[j] - 1;
        if (i < n && j - 1 < m) {
            result.push([i, j - 1]); // Returns [row, col]
        }
    }
    return result.sort((a, b) => a[0] - b[0]);
}
