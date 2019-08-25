# Debugging

## Option 1: Debugging with VSCode

If you're using VSCode and you have cloned the Git repository or downloaded the
repo archive, then you already have VSCode launch configurations for
debugging.

## Option 2: Remote Debugging

```
npm run debug
```

...starts "remote" debugging on `127.0.0.1:9229`. You can now connect with any
debugger which supports the remote debugging protocol, e.g.

- e.g. *Chrome Browser* -> URL-Bar: `chrome://inspect`
- e.g. *Firefox Browser* -> ☰ Menu -> Web Developer Tools -> Connect...
- e.g. *VSCode* with a remote debug configuration


