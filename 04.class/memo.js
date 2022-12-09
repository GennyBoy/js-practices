#! /usr/bin/env node

import * as fs from "node:fs/promises";
import pkg from "enquirer";
import minimist from "minimist";
import { Memo } from "./MemoModel.js";
const { Select } = pkg;
const argv = minimist(process.argv.slice(2));

async function listFirstLines() {
  (await fetchAllMemos()).forEach((memo) => {
    console.log(memo.getFirstLine());
  });
}

async function fetchAllMemos() {
  let memos = [];

  const files = await fs.readdir("database/");

  for (const file of files) {
    const memo = await fs.readFile(`database/${file}`, {
      encoding: "utf-8",
    });
    const memo_json = JSON.parse(memo);
    memos.push(new Memo({ id: memo_json.id, body: memo_json.body }));
  }
  return memos;
}

async function buildChoicesForPrompt() {
  let choices = [];
  (await fetchAllMemos()).forEach((memo) => {
    const choice = {
      name: memo.id,
      message: memo.getFirstLine(),
      value: memo.getFirstLine(),
    };
    choices.push(choice);
  });
  return choices;
}

const deletePrompt = new Select({
  name: "note",
  message: "Choose a note you want to delete:",
  choices: buildChoicesForPrompt(),
});

const readPrompt = new Select({
  name: "note",
  message: "Choose a note you want to see:",
  choices: buildChoicesForPrompt(),
});

if (argv.l) {
  listFirstLines();
} else if (argv.d) {
  deletePrompt
    .run()
    .then((answer) => {
      fs.rm(`database/${answer}.json`).then(() => {
        console.log("deleted the file");
      });
    })
    .catch((err) => {
      console.error(err);
    });
} else if (argv.r) {
  readPrompt
    .run()
    .then((answer) => {
      Memo.of(answer).then((memo) => {
        console.log(memo.body);
      });
    })
    .catch((err) => {
      console.error(err);
    });
} else {
  const input = await fs.readFile("/dev/stdin", "utf8");
  try {
    const memo = new Memo({ body: input });
    memo.createFile();
  } catch (e) {
    console.error(e);
    console.error("Failed to create a memo!");
  }
}
