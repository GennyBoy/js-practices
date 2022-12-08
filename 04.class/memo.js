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

  static async of(id) {
    const file = await fs.readFile(`database/${id}.json`);
    const memo_json = await JSON.parse(file);
    const memo_class = await new Memo({
      id: memo_json.id,
      body: memo_json.body,
    });
    return memo_class;
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
  fs.readFile("/dev/stdin", "utf8")
    .then((value) => {
      return new Memo({ body: value });
    })
    .then((memo) => {
      memo.createFile();
    })
    .catch((err) => {
      console.error(err);
    });
}
