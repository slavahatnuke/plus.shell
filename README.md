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

### docker examples

**docker-compose.yml**
```
app:
  build: ./
  working_dir: /project
  volumes:
    - ./:/project
  command: plus.shell --dir /project start
  ports:
    - "10022:10022"
```

**Dockerfile**
```
FROM ubuntu:precise

RUN mkdir /project
WORKDIR /project

RUN apt-get update
RUN apt-get install -y build-essential git curl

# node.js
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs

# npm packages
RUN npm install -g concurrently plus.shell
```