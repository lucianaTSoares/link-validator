import chalk from "chalk";
import fs from "fs/promises";
import fetch from "node-fetch";

const getFileContent = async (path) => {
  try {
    const content = await fs.readFile(path, {
      encoding: "utf-8",
    });
    getLinks(content)
  } catch (err) {
    console.log(chalk.red(err));
  }
};

const getLinks = (content) => {
  const regex = /\[([^\]]*)\]\((https?:\/\/[^$#\s].[^\s]*)\)/gm;
  const array = [];
  let temp;

  while ((temp = regex.exec(content)) !== null) {
    array.push({ [temp[1]]: temp[2] });
  }

  console.log(array)

  return array;
};

const validateLinks = async () => {
  const array = getLinks().map((object) => Object.values(object).join());
  try {
    const promises = await Promise.all(
      array.map((link) => {
        const res = fetch(link);
        return `${res.status} - ${res.statusText}`;
      })
    );
    return promises;
  } catch (err) {
    console.log(chalk.red(err));
  }
};

const constructObject = async (path) => {
  const links = await getFileContent(path);
  const status = validateLinks();

  console.log(links)

  links.map((value, index) => {
    console.log({ ...value, status: status[index] });
  });
};

constructObject("../public/file/file.md");
