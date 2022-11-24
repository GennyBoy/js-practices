#! /usr/bin/env node

const dayjs = require("dayjs");
const ja = require("dayjs/locale/ja");
const argv = require("minimist")(process.argv.slice(2));

const year = argv.y || dayjs().format("YYYY");
const month = argv.m || dayjs().format("MM");
const date = dayjs(`${year}-${month}`, "YYYY-MM");
const last_day_of_month = date.daysInMonth();
const day_of_week_for_first_day_of_month = date.startOf("month").day();

// 月と年を表示する
console.log(`     ${date.locale(ja).format("MMM")} ${date.format("YYYY")}`);
console.log("日 月 火 水 木 金 土");

// 月初の曜日まで空白を入れる
for (let i = 0; i < day_of_week_for_first_day_of_month; i++) {
  process.stdout.write("   ");
}

let wday = day_of_week_for_first_day_of_month;
for (let i = 1; i <= last_day_of_month; i++) {
  // 1桁の日の時は空白で埋める
  process.stdout.write(`${i.toString().padStart(2, " ")} `);
  // 土曜日になったら改行を入れる
  if (wday == 6) {
    process.stdout.write("\n");
  }
  wday == 6 ? (wday = 0) : wday++;
}

// これをしないと出力結果の末尾に `%` が表示されてしまう
process.stdout.write("\n");
