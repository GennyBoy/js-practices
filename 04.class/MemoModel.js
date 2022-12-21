import * as fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

export class Memo {
  constructor({ id = null, body }) {
    if (!body.trim()) {
      throw "Memo instance can not be initiated with empty body";
    }
    this.id = this.#getId(id);
    this.body = body;
  }

  static async of(id) {
    const file = await fs.readFile(`database/${id}.json`);
    const memo_json = await JSON.parse(file);
    const memo_class = await new Memo({ ...memo_json });
    return memo_class;
  }

  static async listFirstLines() {
    (await this.fetchAllMemos()).forEach((memo) => {
      console.log(memo.getFirstLine());
    });
  }

  static async fetchAllMemos() {
    const files = await fs.readdir("database/");

    const memos = Promise.all(
      files.map(async (file) => {
        const memo = await fs.readFile(`database/${file}`, {
          encoding: "utf-8",
        });
        const memo_json = JSON.parse(memo);
        return new Memo({ id: memo_json.id, body: memo_json.body });
      })
    );

    return memos;
  }

  #getId(id) {
    return id ?? uuidv4();
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
        console.log("Created a file");
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
