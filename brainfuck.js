"use strict";

const MEMORY_SIZE = 16;

const code = process.argv[2];

let buffer = new ArrayBuffer(MEMORY_SIZE);
let memory = new Uint8Array(buffer);

let ptrCode = 0;
let ptrMemory = 0;

let loopMap = {};
let loopMapRev = {};

// Pre-calculate bracket pairings in o(n)
let loopStack = [];
for (let i = 0; i < code.length; ++i) {
    if (code[i] === "[") {
        loopStack.push(i);
    }
    else if (code[i] === "]") {
        let startPos = loopStack.pop();

        loopMap[startPos] = i;
        loopMapRev[i] = startPos;
    }
}

while (true) {
    let c = code[ptrCode];

    switch (c) {
        case "<": --ptrMemory; break;
        case ">": ++ptrMemory; break;
        case "+": ++memory[ptrMemory]; break;
        case "-": --memory[ptrMemory]; break;
        case ".": process.stdout.write(String.fromCharCode(memory[ptrMemory])); break;
        case "[": ! memory[ptrMemory] ? ptrCode = loopMap[ptrCode] : 0; break;
        case "]": memory[ptrMemory] ? ptrCode = loopMapRev[ptrCode] : 0; break;
        default: break;
    }

    if (++ptrCode >= code.length) {
        break;
    }
}
