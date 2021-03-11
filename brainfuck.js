"use strict";

const MEMORY_SIZE = 16;

const code = process.argv[2];

let memory = new ArrayBuffer(MEMORY_SIZE);
let memoryView = new Uint8Array(memory);

let ptrCode = 0;
let ptrMemory = 0;

let loopStack = [];

while (true) {
    let c = code[ptrCode];

    switch (c) {
        case "<":
            --ptrMemory;
            break;
        case ">":
            ++ptrMemory;
            break;
        case "+":
            ++memoryView[ptrMemory];
            break;
        case "-":
            --memoryView[ptrMemory];
            break;
        case ".":
            process.stdout.write(String.fromCharCode(memoryView[ptrMemory]));
            break;
        case "[":
            // Skip code between brakets
            if (memoryView[ptrMemory] === 0) {
                let openBrackets = 1;

                do {
                    ++ptrCode;

                    if (code[ptrCode] === "[") {
                        ++openBrackets;
                    }
                    else if (code[ptrCode] === "]") {
                        --openBrackets;
                    }
                } while (openBrackets > 0);
            }
            else {
                loopStack.push(ptrCode);
            }
            break;
        case "]":
            // Jump to beginning of loop
            if (memoryView[ptrMemory] !== 0) {
                ptrCode = loopStack[loopStack.length - 1];
            }
            // Loop end
            else {
                loopStack.pop();
            }
            break;
    }

    ++ptrCode;

    if (ptrCode >= code.length) {
        break;
    }
}
