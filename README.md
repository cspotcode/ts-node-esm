Quick hack until https://github.com/TypeStrong/ts-node/issues/1258 is implemented.

# What it does

1. Invokes `node --loader ts-node/esm`, passes additional flags and env vars to achieve benefits outlined below
2. Passes absolute path to `--loader` to ensure hook is loaded when running script from different cwd
3. Sets correct `TS_NODE_PROJECT` to get the behavior you'd expect from the ts-node CLI
4. Suppresses node's warning about how `--loader` is experimental

# Usage

```
npm i cspotcode/ts-node-esm ts-node
```

```
#!/usr/bin/env ts-node-esm
console.log('Hello world!');
```
