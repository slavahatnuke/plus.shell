# Plus Shell
Fast remote terminal for developers goals. 
 - Now is not secure (used HTTP + socket.io) 
 - Used just for docker container access for developers needs.
 - Streams views
 - Kills process on exit

```
  Usage: plus.shell [options] [command]


  Commands:

    start           
    run [command...]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -p, --port [port]  Port
    -h, --host [host]  Host
    -k, --key [key]    Key
    -d, --dir [dir]    Work dir
```

## Examples

#### Start server
```
$ plus.shell start
plus.shell -> 0.0.0.0:10022
```

#### Run remote commands
```
$ plus.shell run -- echo hello
hello
```


