#! /usr/bin/env node

let dayjs = require("dayjs");
let ja = require("dayjs/locale/ja");
dayjs.locale(ja);

let today = dayjs();
let year = today.format("YYYY");
let month = today.format("MMM");
let last_day_of_month = today.endOf("month").format("DD");
let day_of_week_for_first_day_of_month = dayjs().startOf("month").day();

// 月と年を表示する
console.log(`    ${month} ${year}`);
console.log("日 月 火 水 木 金 土");

// 月初の曜日まで空白を入れる
for (let i = 0; i <= day_of_week_for_first_day_of_month; i++) {
  process.stdout.write("  ");
}

let wday = day_of_week_for_first_day_of_month;
for (let i = 1; i <= last_day_of_month; i++) {
  process.stdout.write(`${i} `);
  if (wday == 6) {
    process.stdout.write("\n");
  }
  wday == 6 ? (wday = 0) : wday++;
}
