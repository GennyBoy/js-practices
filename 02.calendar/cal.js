#! /usr/bin/env node

let dayjs = require("dayjs");
let ja = require("dayjs/locale/ja");

let argv = require("minimist")(process.argv.slice(2));
let year = argv.y || dayjs().format("YYYY");
let month = argv.m || dayjs().format("MM");
let date = dayjs(`${year}-${month}`, "YYYY-MM");
let last_day_of_month = date.endOf("month").format("DD");
let day_of_week_for_first_day_of_month = date.startOf("month").day();

// 月と年を表示する
console.log(`    ${date.locale(ja).format("MMM")} ${date.format("YYYY")}`);
console.log("日 月 火 水 木 金 土");

// 最後に縦の表示を揃えたい…
// ruby の rjust(2)みたいなのないか調べる
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
