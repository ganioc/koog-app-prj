## koog app and worker

## JS project
Shall I use TypeScript to do this project?
- No!

## tests
Use test for lower layer functions.

### All http API testing

### All xxxx testing



### generate docker container
Shall I use one project to generate 2 Docker images?

#### generate app

```
docker build -t boxshell/koog-app:1.0.0 -f ./app.Docker .
docker push boxshell/koog-app:1.0.0
```

#### generate worker
```
docker build -t boxshell/koog-worker:1.0.0 -f ./worker.Docker .
docker push boxshell/koog-worker:1.0.0
```
