## Model definition

### User

```

User {
username: unique
password:  required
role: required  // 0-admin, 1-普通用户
usertype: required, // internal external; Not used yet
unused:  可以使用数量
status: valid, invalid, freezed, 可以冻结用户操作, 'string'
email:
createdate:
phone:
address:
extra:
}

// You can check user status by query this record once

```

### UserInfo

```
UserInfo{
username: 
usertype: internal, external // 在统计时使用
lastlogin
tag: string
undelivered: 未收到, 
delivered:  已收到
submited:  已提交给平台的
}

// 

```

### Msg

```
Msg{
username: String, index
msg_id: String
batch_id: String, required
x_id: String, required, 
type: single-1, multi-2
date: 提交的时间,  index
deliverdate: 收到的时间
submited: true/false, 发送到短信平台成功
delivered: true/false, 用户收到, 实际上我是无法知道是否全部递送成功的
mobiles: []
content: 发送的内容; // 原始的发送内容
}

// 这是用户提交给平台的消息，里面可能包含了1000个号码;
// 还是说使用worker来并行将短信发送出去呢？

```

### Msgton

```
Msgton{
  username: String
  mobile：号码
  msg_id: 
  batch_id: String
  x_id: String
  date:
  status: Number 
}

// 跟踪用户发送的每一条短信！

```

### Action

```
Action{
  action: Number, //1-create, 2-edit, 3-delete
  username: String
  date:
  content:
}
// 记录Admin的所有操作，因为包含了充值，所以需要进行记录

```



