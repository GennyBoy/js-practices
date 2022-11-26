#! /usr/bin/env node
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// const input = fs.readFileSync("/dev/stdin", "utf8");

class Memo {
  constructor(body, id = null) {
    this.id = id;
    this.body = body;
  }

  read(id) {
    const file = JSON.parse(fs.readFileSync(`database/${id}.json`));
    this.body = file.body;
    console.log(this.body);
  }

  save() {
    this.id = uuidv4();
    const file_name = `${this.id}.json`;
    fs.writeFile(`database/${file_name}`, JSON.stringify(this), (err) => {
      if (err) throw err;
      console.log("正常に書き込みが完了しました");
    });
  }
}

// const memo = new Memo(input);
// memo.save();
const memo = new Memo();
memo.read("b8f23274-e34d-45b0-8270-c6aed6d65497");
