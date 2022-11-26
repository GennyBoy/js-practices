#! /usr/bin/env node
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const input = fs.readFileSync("/dev/stdinddd", "utf8");

class Memo {
  constructor(content) {
    this.content = content;
  }

  save() {
    const file_name = `${uuidv4()}.text`;
    fs.writeFile(`database/${file_name}`, JSON.stringify(this), (err) => {
      if (err) throw err;
      console.log("正常に書き込みが完了しました");
    });
  }
}

const memo = new Memo(input);
memo.save();
