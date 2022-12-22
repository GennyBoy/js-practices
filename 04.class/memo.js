#! /usr/bin/env node

import * as fs from "node:fs/promises";
import pkg from "enquirer";
import minimist from "minimist";
import { Memo } from "./MemoModel.js";
const { Select } = pkg;
const argv = minimist(process.argv.slice(2));

async function buildChoicesForPrompt() {
  const choices = (await Memo.fetchAll()).map((memo) => {
    const choice = {
      name: memo.id,
      message: memo.getFirstLine(),
      value: memo.getFirstLine(),
    };
    return choice;
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
  Memo.listFirstLines();
} else if (argv.d) {
  deletePrompt
    .run()
    .then((answer) => {
      fs.rm(`database/${answer}.json`).then(() => {
        console.log("Deleted the file");
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
