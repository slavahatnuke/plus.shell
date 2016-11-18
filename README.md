# Plus Shell
Fast remote terminal for developers goals / socket io remote terminal.
 - Secure JWT (jsonwebtoken) based (used HTTP + JWT + socket.io + socket.io streams) 
 - We used this for docker container access for developers needs.
 - Streams views
 - It kills process on exit

```
  Usage: plus.shell [options] [command]


  Commands:

    start           
    run [command...]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -p, --port [port]  Port       : 10022 is default
    -h, --host [host]  Host       : localhost or maydomain.com.dev or IP
    -k, --key [key]    Key        : this is text password, must be same  for client and server  
    -d, --dir [dir]    Work dir   : path to the work dir > $ plus.shell -d /project start 
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
  command: concurrently "plus.shell --dir /project start" "echo start-your-app"
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

Be happy!
 
your [+1G Team](http://plus1generation.com/)