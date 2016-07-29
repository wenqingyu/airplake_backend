##注册流程

###说明  
请求正确返回格式:{"status":"OK",code: 200,"data":返回数据}  
请求错误返回格式:{"status": "Error","error_code": "错误代码","error_msg": "错误信息"}

* 注册  
接口地址: http://139.196.203.14:3010/api/v1/users/verification  
请求方式: POST    
demo:  
```javascript  
          $.ajax({
            type:"POST",
            url: "http://139.196.203.14:3010/api/v1/users/verification",
            data:{
                email:'119136016@qq.com',
                type: 2    // 1:服务商注册 2.用户注册
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```  
返回结果:  
    * 成功: {"status":"OK",code: 200}  
    * 失败:   
{"status":"Error","error_code":10002,"error_msg":"Email Is Exists"}  
{"status":"Error","error_code":500,"error_msg":"......"}

* 详细信息保存  
接口地址: http://139.196.203.14:3010/api/v1/users/token  (token为jwt加密数据,会带在跳转地址的参数上面)  
请求方式: PUT    
demo:  
```javascript  
          $.ajax({
            type:"PUT",
            url: "http://139.196.203.14:3010/api/v1/users/token",
            data:{
                vendor:{   //服务商详细信息
                    teamname:'测试团队1',
                    tel:13706207777,
                    wechat:'colin',
                    email:'xx@qq.com',
                    city:'广州',
                    servicetime:'全天',
                    equipment:[{type:'无人机',model:'大疆精灵3'},{type:'无人机',model:'大疆精灵3'}],
                    servicetype:'1,2',
                    des:'测试'
                },
                user:{    //用户详细信息
                    name:'xc',
                    password:'csdf',
                    birthday:'1988-09-23',
                    tel:'13806207777',
                    wechat:'csdf',
                    city:'苏州',
                    idCard:'身份证'
                }  
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```  
返回结果:  
    * 成功: {"status":"OK",code: 200}  
    * 失败:  
{"status":"Error","error_code":10005,"error_msg":"Verify invalid"}  
{"status":"Error","error_code":10004,"error_msg":"The User Has Been Verified"}  
{"status":"Error","error_code":10003,"error_msg":"Expire"}  
{"status":"Error","error_code":500,"error_msg":"......"}
