#! /usr/bin/env node
const { v4: uuidv4 } = require("uuid");
const fs = require("node:fs/promises");
const argv = require("minimist")(process.argv.slice(2));

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

if (argv.l) {
  listFirstLines();
} else {
  readInput()
    .then((value) => {
      createMemo(value);
    })
    .catch((error) => {
      console.log(error);
    });
}
