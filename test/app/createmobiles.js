// create 1000 different mobile number

for(let i=0;i<1000;i++){
  let str = i.toString();

  while(str.length < 8){
    str = '0' + str;
  }
  console.log('138' + str)
}