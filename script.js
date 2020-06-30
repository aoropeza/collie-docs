// node.js example
const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");

const repositories = [
  {
    repoUrl: "https://github.com/aoropeza/collie-api.git",
    projectName: "collie-api",
    branch: "develop",
  },
  {
    repoUrl: "https://github.com/aoropeza/collie-frontend.git",
    projectName: "collie-frontend",
    branch: "develop",
  },
  {
    repoUrl: "https://github.com/aoropeza/collie-uses-cases.git",
    projectName: "collie-uses-cases",
    branch: "develop",
  },
  {
    repoUrl: "https://github.com/aoropeza/collie-cli.git",
    projectName: "collie-cli",
    branch: "develop",
  },
  {
    repoUrl: "https://github.com/aoropeza/collie-dsl.git",
    projectName: "collie-dsl",
    branch: "master",
  },
];

const pushChangeToRepo = async ({ repoUrl, projectName, branch }) => {
  const dir = path.join(process.cwd(), `.tmp/${projectName}`);
  await git
    .clone({
      fs,
      http,
      dir,
      url: repoUrl,
      onAuth: () => ({ username: process.env.GITHUB_TOKEN }),
    })
    .catch(() => console.log(`Error cloning ${repoUrl}`));
  fs.copyFileSync("docs/collie-docs.md", `.tmp/${projectName}/README.md`);
  await git.add({ fs, dir: `.tmp/${projectName}`, filepath: "README.md" });
  await git.commit({
    fs,
    dir: `.tmp/${projectName}`,
    author: {
      name: "Alejandro Oropeza",
      email: "alexoropeza@gmail.com",
    },
    message: "Updated README file",
  });
  let pushResult = await git.push({
    fs,
    http,
    dir: `.tmp/${projectName}`,
    remote: "origin",
    ref: branch,
    onAuth: () => ({ username: process.env.GITHUB_TOKEN }),
  });
  console.log(pushResult);
};

const start = async () => {
  const promises = repositories.map((repo) => {
    return pushChangeToRepo(repo);
  });
  await Promise.all(promises);
};

start();
