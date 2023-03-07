#!/usr/bin/env node

const fs = require('fs');

function addWord(word, list, dict, i) {
    list.push(word);
    if (!dict[word]) {
        dict[word] = [i];
    } else {
        dict[word].push(i);
    }
}

function compress(str) {
    const wordList = [];
    const dict = {};
    //const spi = [];
    let i = 0;
    let ni = 0;
    let a = 0;
    while (true) {
        ni = str.indexOf(" ", i);
        if (ni === -1) break;
        const word = str.substring(i, ni);
        addWord(word, wordList, dict, i);
        //spi.push(ni - a);
        i = ni + 1;
        a += 1;
    }
    const word = str.substring(i);
    addWord(word, wordList, dict, i);

    const table = [];
    const charList = wordList.join(" ").split("");

    Object.keys(dict).forEach(word => {
        const is = dict[word];
        if (word.length >= 1 && dict[word].length > 1) {
            table.push(word + "|" + is.join("§"));
            is.forEach(i => {
                for (let s = 0; s < word.length; s++) {
                    charList[i + s] = "";
                }
            });
        }
    });

    return table.join(",") + "µ" + charList.join("");
}

function decompress(data) {
    const parts = data.split("µ");
    const table = parts[0].split(",");
    const list = parts[1].split("");

    console.log(data, table, list);
    
    // todo: sort by idx, then go add in that order
    table.forEach(entry => {
        let o = 0;
        const [word, idxPart] = entry.split("|");
        const idx = idxPart.split("§");
        idx.forEach(i => {
            const j = parseInt(i, 10) - o;
            //list.splice(j, 0, word + list[j]);
            list[j] = word + list[j];
            console.log("added", word, "---", list)
            o += word.length;
        });
    });
    
    return list.join("");
}

try {
    const data = fs.readFileSync(process.argv[2], 'utf8');
    const compressed = compress(data);
    const decompressed = decompress(compressed);
    const beforeL = data.length;
    const afterL = compressed.length;
    console.log(decompressed);
    console.log("Before: " + beforeL + ", After: " + afterL);
    
    const change = (afterL - beforeL) / beforeL * 100;

    console.log("Improvement: " + change + "%");
} catch (err) {
    console.error(err);
}