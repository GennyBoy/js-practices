#! /usr/bin/env node

const dayjs = require("dayjs");
const ja = require("dayjs/locale/ja");
const argv = require("minimist")(process.argv.slice(2));
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const year = argv.y || dayjs.utc().format("YYYY");
const month = argv.m || dayjs.utc().format("MM");
const date = dayjs.utc(`${year}-${month}`, "YYYY-MM");
const day_of_week_for_first_day_of_month = date.startOf("month").day();

// 月と年を表示する
console.log(`     ${date.locale(ja).format("MMM")} ${date.format("YYYY")}`);
console.log("日 月 火 水 木 金 土");

// 月初の曜日まで空白を入れる
for (let i = 0; i < day_of_week_for_first_day_of_month; i++) {
  process.stdout.write("   ");
}

let date_index = date.startOf("month");
while (date_index.isBefore(date.endOf("month"))) {
  // 1桁の日の時は空白で埋める
  process.stdout.write(`${date_index.date().toString().padStart(2, " ")} `);
  // 土曜日になったら改行を入れる
  if (date_index.day() == 6) {
    process.stdout.write("\n");
  }
  date_index = date_index.add(1, "day");
}

// これをしないと出力結果の末尾に `%` が表示されてしまう
process.stdout.write("\n");
