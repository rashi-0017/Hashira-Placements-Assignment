/**
 * DEFINITIVE SOLUTION for the polynomial interpolation problem.
 * This version uses the standard Gauss-Jordan elimination algorithm with a
 * robust Fraction class to find the exact rational coefficients.
 */

// The JSON data for the second test case
const testCase2 = {
    "keys": { "n": 10, "k": 7 },
    "1": { "base": "6", "value": "13444211440455345511" },
    "2": { "base": "15", "value": "aed7015a346d635" },
    "3": { "base": "15", "value": "6aeeb69631c227c" },
    "4": { "base": "16", "value": "e1b5e05623d881f" },
    "5": { "base": "8", "value": "316034514573652620673" },
    "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
    "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
    "8": { "base": "6", "value": "20220554335330240002224253" },
    "9": { "base": "12", "value": "45153788322a1255483" },
    "10": { "base": "7", "value": "1101613130313526312514143" }
};

// --- Helper Functions and Classes ---

function abs(n) { return n < 0n ? -n : n; }

function gcd(a, b) {
    a = abs(a);
    b = abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

class Fraction {
    constructor(num, den = 1n) {
        if (den === 0n) throw new Error("Denominator cannot be zero.");
        num = BigInt(num);
        den = BigInt(den);
        const commonDivisor = gcd(num, den);
        this.num = num / commonDivisor;
        this.den = den / commonDivisor;
        if (this.den < 0n) {
            this.num = -this.num;
            this.den = -this.den;
        }
    }
    add(other) { return new Fraction(this.num * other.den + other.num * this.den, this.den * other.den); }
    subtract(other) { return new Fraction(this.num * other.den - other.num * this.den, this.den * other.den); }
    multiply(other) { return new Fraction(this.num * other.num, this.den * other.den); }
    divide(other) {
        if (other.num === 0n) throw new Error("Cannot divide by zero fraction.");
        return new Fraction(this.num * other.den, this.den * other.num);
    }
}

function parseBigInt(str, base) {
    let result = 0n;
    const bigBase = BigInt(base);
    for (const char of str) {
        result = result * bigBase + BigInt(parseInt(char, base));
    }
    return result;
}

// --- Main Solver Function ---

function solvePolynomial(data) {
    const k = data.keys.k;
    
    const matrix = [];
    for (let i = 1; i <= k; i++) {
        const row = [];
        const x = BigInt(i);
        const y = parseBigInt(data[i.toString()].value, parseInt(data[i.toString()].base, 10));
        for (let j = 0; j < k; j++) {
            row.push(new Fraction(x ** BigInt(k - 1 - j)));
        }
        row.push(new Fraction(y));
        matrix.push(row);
    }

    // Perform Gauss-Jordan elimination
    for (let i = 0; i < k; i++) {
        let pivotRow = i;
        for (let j = i + 1; j < k; j++) {
            if (abs(matrix[j][i].num) > abs(matrix[pivotRow][i].num)) {
                pivotRow = j;
            }
        }
        [matrix[i], matrix[pivotRow]] = [matrix[pivotRow], matrix[i]];

        const pivot = matrix[i][i];
        for (let j = i; j <= k; j++) {
            matrix[i][j] = matrix[i][j].divide(pivot);
        }

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const factor = matrix[j][i];
                for (let p = i; p <= k; p++) {
                    matrix[j][p] = matrix[j][p].subtract(matrix[i][p].multiply(factor));
                }
            }
        }
    }

    const coefficients = matrix.map(row => row[k]);
    
    // Format output as fractions (e.g., "num/den" or "num")
    const resultStrings = coefficients.map(c => {
        return c.den === 1n ? c.num.toString() : `${c.num.toString()}/${c.den.toString()}`;
    });

    return resultStrings.join(', ');
}

// Run the definitive solver and print the output
const finalOutput = solvePolynomial(testCase2);
console.log(finalOutput);