#! /usr/bin/env node

let dayjs = require("dayjs");
let ja = require("dayjs/locale/ja");
dayjs.locale(ja);

let today = dayjs();
let year = today.format("YYYY");
let month = today.format("MMM");
let last_day = today.endOf("month").format("DD");

// 月と年を表示する
// 1月 2022
console.log(`    ${month} ${year}`);

// 1日から月末までの日を出力する
for (let i = 1; i <= last_day; i++) {
  process.stdout.write(`${i} `);
}
