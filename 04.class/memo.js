#! /usr/bin/env node
const { v4: uuidv4 } = require("uuid");
const fs = require("node:fs/promises");
const argv = require("minimist")(process.argv.slice(2));
const { Select } = require("enquirer");

class Memo {
  constructor({ id = null, body }) {
    this.id = this.#getId(id);
    this.body = body;
  }

  #getId(id) {
    if (id === null) {
      return uuidv4();
    } else {
      return id;
    }
  }

  getFirstLine() {
    return this.body.split(/\n/)[0];
  }

  getFileName() {
    return `${this.id}.json`;
  }

  createFile() {
    fs.writeFile(`database/${this.getFileName()}`, JSON.stringify(this))
      .then(() => {
        console.log("正常に書き込みが完了しました");
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

async function listFirstLines() {
  (await fetchAllMemoObj()).forEach((note_object) => {
    console.log(note_object.getFirstLine());
  });
}

async function fetchAllMemoObj() {
  let memo_objects = [];

  const files = await fs.readdir("database/");

  for (const file of files) {
    const memo = await fs.readFile(`database/${file}`, {
      encoding: "utf-8",
    });
    const memo_json = JSON.parse(memo);
    memo_objects.push(new Memo({ id: memo_json.id, body: memo_json.body }));
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
  fs.readFile("/dev/stdin", "utf8")
    .then((value) => {
      return new Memo({ body: value });
    })
    .then((memo_obj) => {
      memo_obj.createFile();
    })
    .catch((err) => {
      console.error(err);
    });
}
