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
    const memo_class = await new Memo({
      id: memo_json.id,
      body: memo_json.body,
    });
    return memo_class;
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
