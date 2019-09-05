# Debugging

## Option 1: Debugging with VSCode

If you're using VSCode then your VSCode launch configuration might look like
this:

*.vscode/launch.json*
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "VSCode Debugger",
            "program": "${workspaceFolder}/bin/index.js",
            "args": [
                "--config",
                "./test/input/glossarify-md.conf.json"
            ]
        },
        {
            "type": "node",
            "request": "attach",
            "name": "External debugger",
            "address": "127.0.0.1",
            "port": 9229,
            "localRoot": "${workspaceFolder}",
            "remoteRoot": "${workspaceFolder}/bin/index.js"
        }
    ]
}
```
Launching with option *External debugger* runs the program for remote debugging.
You can then connect via a browser as descripted for option 2.

## Option 2: Remote Debugging

```
npm run debug
```

...runs the program for "remote" debugging on `127.0.0.1:9229`. You can now
connect with any debugger which supports the remote debugging protocol, e.g.

- e.g. *Chrome Browser* -> URL-Bar: `chrome://inspect`
- e.g. *Firefox Browser* -> ☰ Menu -> Web Developer Tools -> Connect...
- e.g. *VSCode* with a remote debug configuration
