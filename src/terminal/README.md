## Terminal Program
To talk to db directly using Command Line Input.

## Methods
There are 4 commands:

- list
- add
- create
- delete


There are 2 models:

- user
- userinfo

Important functions:

```
1. getModel()

return [err, model, modelObj]


2. cmdList()

list all model

3. cmdAdd()
create a User

4. cmdDelete()
delete a model, 

5. cmdCreateUserinfo()

create a UserInfo



```


### list model

### add a model

### create a user
```
NODE_ENV='local' node src/terminal/index.js


```

### delete a user
```


```

## How to use

```
$ node src/terminal/index.js 

add user {"username":"admin", "email":"", "password":"@","role":0,"usertype":"internal","unused":0,"status":"valid"}

add user {"username":"john", "email":"john@hotmail.com", "password":"@","role":1,"usertype":"internal","unused":10,"status":"valid"}

add user {"username":"mary", "email":"mary@hotmail.com", "password":"4","role":1,"usertype":"external","unused":20,"status":"valid"}

create userinfo  {"username":"john","usertype":"internal","tag":"","undelivered":0,"delivered":0,"submitted":0}

create userinfo  {"username":"mary","usertype":"external","tag":"","undelivered":0,"delivered":0,"submitted":0}



```


