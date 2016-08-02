#接口文档  
##说明  
请求正确返回格式:{"status":"OK",code: 200,"data":返回数据}  
请求错误返回格式:{"status": "Error","error_code": "错误代码","error_msg": "错误信息"}

##登录接口
接口地址: http://139.196.203.14:3010/api/v1/users/login  
请求方式: POST    
demo:  
```javascript  
          $.ajax({
            type:"POST",
            url: "http://139.196.203.14:3010/api/v1/users/login",
            data:{name:'xc',password: 'csdf'},
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```  
返回结果:  
    * 成功:  
    {"status":"OK","code":200,"data":{"type":2,"isverification":null}}   
    说明:type指的是用户还是服务商(1:服务商;2:用户); isverification只有是服务商才有用，指的是是否已经验证过(1:已验证)  
    另外token会存在header里面，节点就叫token。 请保证后续接口header里面都会传给我  
    * 失败:   
{"status":"Error","error_code":10007,"error_msg":"User Is Not Exists"}  
{"status":"Error","error_code":500,"error_msg":"......"}

##注册流程
* 注册  
接口地址: http://139.196.203.14:3010/api/v1/users/verification  
请求方式: POST    
demo:  
```javascript  
          $.ajax({
            type:"POST",
            url: "http://139.196.203.14:3010/api/v1/users/verification",
            data:{
                email:'119136016@qq.com'
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

##服务类型接口
* 获取列表  
接口地址: http://139.196.203.14:3010/api/v1/servicetypes  
请求方式: GET  
demo:
```javascript
        $.ajax({
            type:"GET",
            url: "http://139.196.203.14:3010/api/v1/servicetypes",
            data:{
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```  
返回结果:  
    * 成功: {"status":"OK","code":200,"data":[{"id":1,"title":"测试","img":"http://test.img","star":4,"des":"abcd"},{"id":2,"title":"测试","img":"http://test.img","star":4,"des":"abcd"}]}  
    * 失败:  
{"status":"Error","error_code":500,"error_msg":"......"}

* 新增  
接口地址: http://139.196.203.14:3010/api/v1/servicetypes  
请求方式: POST  
demo:  
```javascript  
        $.ajax({
            type:"POST",
            url: "http://127.0.0.1:3010/api/v1/servicetypes",
            data:{
                title:'测试',
                img: 'http://test.img',
                star: 4,
                des: 'abcd'
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```  
返回结果:  
    * 成功: {"status":"OK","code":200}  
    * 失败:  
{"status":"Error","error_code":500,"error_msg":"......"}

##任务接口
* 发布任务  
接口地址: http://139.196.203.14:3010/api/v1/jobs  
请求方式: POST  
demo:  
```javascript  
        $.ajax({
            type:"POST",
            url: "http://139.196.203.14:3010/api/v1/jobs",
            data:{
                title:'测试',
                des: '描述',
                city: '上海',
                servicetype: '1,2',
                starttime:'2016-02-03',
                endtime:'2016-02-04',
                min:'3.02',
                max:'234.32',
                location:'xcsfdsafsa'
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```
返回结果:  
    * 成功: {"status":"OK","code":200}  
    * 失败:  
{"status":"Error","error_code":500,"error_msg":"......"}  

* 获取任务列表  
接口地址: http://139.196.203.14:3010/api/v1/jobs 
请求方式: GET  
demo:
```javascript
        $.ajax({
            type:"GET",
            url: "http://139.196.203.14/api/v1/jobs",
            data:{
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```
返回结果:  
    * 成功: {"status":"OK","code":200,"data":[{"id":1,"title":"测试","des":"描述","city":"上海","servicetype":"1,2","starttime":"2016-02-03","endtime":"2016-02-04","max":234.32,"min":3.02,"location":"xcsfdsafsa"}]}    
    * 失败:  
{"status":"Error","error_code":500,"error_msg":"......"} 

* 获取任务明细  
接口地址: http://139.196.203.14:3010/api/v1/jobs/id  (id为任务id)  
请求方式: GET  
demo:
```javascript
        $.ajax({
            type:"GET",
            url: "http://139.196.203.14/api/v1/jobs/1",
            data:{
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```
返回结果:  
    * 成功: {"status":"OK","code":200,"data":[{"id":1,"title":"测试","des":"描述","city":"上海","servicetype":"1,2","starttime":"2016-02-03","endtime":"2016-02-04","max":234.32,"min":3.02,"location":"xcsfdsafsa"}]}  
    * 失败:  
{"status":"Error","error_code":500,"error_msg":"......"}  


##服务商入口
* 新增  
接口地址: http://139.196.203.14:3010/api/v1/vendors  
请求方式: POST  
demo:  
```javascript  
        $.ajax({
            type:"POST",
            url: "http://139.196.203.14:3010/api/v1/vendors",
            data:{
                vendor:{
                    teamname:'测试团队1',
                    tel:13706207777,
                    wechat:'colin',
                    email:'xx@qq.com',
                    city:'广州',
                    servicetime:'全天',
                    equipment:[{type:'无人机',model:'大疆精灵3'},{type:'无人机',model:'大疆精灵3'}],
                    servicetype:[1,2],
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
    * 成功:  
    {"status":"OK","code":200}   
    说明:oken会存在header里面，节点就叫token。 请保证后续接口header里面都会传给我  
    * 失败:   
{"status":"Error","error_code":10006,"error_msg":"Teamname Is Exists"}  
{"status":"Error","error_code":500,"error_msg":"......"}
