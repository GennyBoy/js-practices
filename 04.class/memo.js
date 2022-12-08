#! /usr/bin/env node
const { v4: uuidv4 } = require("uuid");
const fs = require("node:fs/promises");
const argv = require("minimist")(process.argv.slice(2));
const { Select } = require("enquirer");

async function listFirstLines() {
  try {
    const files = await fs.readdir("database/");
    for (const file of files) {
      const memo_json = await fs.readFile(`database/${file}`, {
        encoding: "utf-8",
      });
      const memo_obj = JSON.parse(memo_json);
      console.log(memo_obj.first_line);
    }
  } catch (err) {
    console.error(err);
  }
}

async function readInput() {
  return fs.readFile("/dev/stdin", "utf8");
}

async function createMemo(body) {
  const id = uuidv4();
  const json_body = {
    id: id,
    first_line: body.split(/\n/)[0],
    body: body,
  };

  const file_name = `${id}.json`;
  fs.writeFile(`database/${file_name}`, JSON.stringify(json_body), (err) => {
    if (err) throw err;
    console.log("正常に書き込みが完了しました");
  });
}

async function fetchAllMemoObj() {
  let memo_objects = [];

  const files = await fs.readdir("database/");

  for (const file of files) {
    const memo_json = await fs.readFile(`database/${file}`, {
      encoding: "utf-8",
    });
    memo_objects.push(JSON.parse(memo_json));
  }
  return memo_objects;
}

async function buildChoicesForPrompt() {
  let choices = [];
  const memo_objects = await fetchAllMemoObj();
  memo_objects.forEach((memo_obj) => {
    const choice = {
      name: memo_obj.id,
      message: memo_obj.first_line,
      value: memo_obj.first_line,
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

async function body(id) {
  const file = await fs.readFile(`database/${id}.json`);
  const memo_obj = JSON.parse(file);
  console.log(memo_obj.body);
}

if (argv.l) {
  listFirstLines();
} else if (argv.d) {
  deletePrompt.run().then((answer) => {
    fs.rm(`database/${answer}.json`).then(() => {
      console.log("deleted the file");
    });
  });
} else if (argv.r) {
  readPrompt.run().then((answer) => {
    body(answer);
  });
} else {
  readInput()
    .then((value) => {
      createMemo(value);
    })
    .catch((error) => {
      console.log(error);
    });
}
