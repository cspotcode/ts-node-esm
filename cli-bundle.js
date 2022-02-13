#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/find-up/index.js
var import_node_path2 = __toESM(require("node:path"), 1);
var import_node_url2 = require("node:url");

// node_modules/locate-path/index.js
var import_node_process = __toESM(require("node:process"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var import_node_fs = __toESM(require("node:fs"), 1);
var import_node_url = require("node:url");

// node_modules/yocto-queue/index.js
var Node = class {
  value;
  next;
  constructor(value) {
    this.value = value;
  }
};
var Queue = class {
  #head;
  #tail;
  #size;
  constructor() {
    this.clear();
  }
  enqueue(value) {
    const node = new Node(value);
    if (this.#head) {
      this.#tail.next = node;
      this.#tail = node;
    } else {
      this.#head = node;
      this.#tail = node;
    }
    this.#size++;
  }
  dequeue() {
    const current = this.#head;
    if (!current) {
      return;
    }
    this.#head = this.#head.next;
    this.#size--;
    return current.value;
  }
  clear() {
    this.#head = void 0;
    this.#tail = void 0;
    this.#size = 0;
  }
  get size() {
    return this.#size;
  }
  *[Symbol.iterator]() {
    let current = this.#head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
};

// node_modules/locate-path/index.js
var typeMappings = {
  directory: "isDirectory",
  file: "isFile"
};
function checkType(type) {
  if (type in typeMappings) {
    return;
  }
  throw new Error(`Invalid type specified: ${type}`);
}
var matchType = (type, stat) => type === void 0 || stat[typeMappings[type]]();
var toPath = (urlOrPath) => urlOrPath instanceof URL ? (0, import_node_url.fileURLToPath)(urlOrPath) : urlOrPath;
function locatePathSync(paths, {
  cwd = import_node_process.default.cwd(),
  type = "file",
  allowSymlinks = true
} = {}) {
  checkType(type);
  cwd = toPath(cwd);
  const statFunction = allowSymlinks ? import_node_fs.default.statSync : import_node_fs.default.lstatSync;
  for (const path_ of paths) {
    try {
      const stat = statFunction(import_node_path.default.resolve(cwd, path_));
      if (matchType(type, stat)) {
        return path_;
      }
    } catch {
    }
  }
}

// node_modules/find-up/index.js
var toPath2 = (urlOrPath) => urlOrPath instanceof URL ? (0, import_node_url2.fileURLToPath)(urlOrPath) : urlOrPath;
var findUpStop = Symbol("findUpStop");
function findUpMultipleSync(name, options = {}) {
  let directory = import_node_path2.default.resolve(toPath2(options.cwd) || "");
  const { root } = import_node_path2.default.parse(directory);
  const stopAt = options.stopAt || root;
  const limit = options.limit || Number.POSITIVE_INFINITY;
  const paths = [name].flat();
  const runMatcher = (locateOptions) => {
    if (typeof name !== "function") {
      return locatePathSync(paths, locateOptions);
    }
    const foundPath = name(locateOptions.cwd);
    if (typeof foundPath === "string") {
      return locatePathSync([foundPath], locateOptions);
    }
    return foundPath;
  };
  const matches = [];
  while (true) {
    const foundPath = runMatcher({ ...options, cwd: directory });
    if (foundPath === findUpStop) {
      break;
    }
    if (foundPath) {
      matches.push(import_node_path2.default.resolve(directory, foundPath));
    }
    if (directory === stopAt || matches.length >= limit) {
      break;
    }
    directory = import_node_path2.default.dirname(directory);
  }
  return matches;
}
function findUpSync(name, options = {}) {
  const matches = findUpMultipleSync(name, { ...options, limit: 1 });
  return matches[0];
}

// cli.ts
var import_child_process = __toESM(require("child_process"));
var import_path = __toESM(require("path"));
var import_module = require("module");
var entrypoint = import_path.default.resolve(process.argv[2]);
if (!process.env.TS_NODE_PROJECT) {
  const found = findUpSync("tsconfig.json", {
    cwd: entrypoint
  });
  if (found) {
    process.env.TS_NODE_PROJECT = found;
  }
}
var loaderPath;
try {
  loaderPath = (0, import_module.createRequire)(entrypoint).resolve("ts-node/package.json");
} catch {
  loaderPath = require.resolve("ts-node/package.json");
}
loaderPath = import_path.default.resolve(loaderPath, "../esm.mjs");
var suppressWarningsPath = require.resolve("./suppress-warning.js");
var args = [
  ...process.execArgv,
  "--require",
  suppressWarningsPath,
  "--loader",
  loaderPath,
  ...process.argv.slice(2)
];
var result = import_child_process.default.spawnSync(process.argv0, args, {
  stdio: "inherit"
});
process.exitCode = result.status;
