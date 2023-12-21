'use strict';
process.env.DEBUG = 'splendor';
const d = require('debug')('splendor');

const YAML = require('yaml');
const fs = require('fs');
const _ = require('lodash');

const p = require('./lib/pr').p(d);
const e = require('./lib/pr').e(d);
const p4 = require('./lib/pr').p4(d);
const table = require('./lib/table').table;


splendor(process.argv);

async function splendor(args) {
    while (true) {
        let cards = YAML.parse(fs.readFileSync('./splendor.yaml', 'utf8'), { prettyErrors: true });
        let summary = YAML.parse(fs.readFileSync('./summary.yaml', 'utf8'), { prettyErrors: true });

        for (let card of cards) {

            summary.discounts[card.discount].value += 1;
            summary.points[card.discount].value += card.points;

            for (let gem of _.keys(card.cost)) {
                summary.cost[gem].value += card.cost[gem];
            }
        }

        p4(summary);

        console.log('Cost');
        console.log(print(Object.values(summary.cost)));

        console.log('Discounts');
        console.log(print(Object.values(summary.discounts)));

        console.log('Points');
        console.log(print(Object.values(summary.points)));

        getChar();
    }
}


function print(items) {
    items = _.sortBy(items, [ 'value' ]).reverse();
    return table(items, [
        {
            name: 'name',
            width: -17,
        },
        {
            name: 'value',
            width: 10,
        },
    ]);
}



function getChar() {
    let buffer = Buffer.alloc(1)
    fs.readSync(0, buffer, 0, 1)
    return buffer.toString('utf8')
}
