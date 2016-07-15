#接口文档  
##说明  
请求正确返回格式:{"status":"OK","msgbody":返回数据}  
请求错误返回格式:{"status": "Error","error_code": "错误代码","error_msg": "错误信息"}
##服务商入口
* 获取列表  
接口地址: http://139.196.203.14:3010/api/v1/portals  
请求方式: GET  
demo:
```javascript
        $.ajax({
            type:"GET",
            url: "http://139.196.203.14:3010/api/v1/portals",
            data:{
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```

* 单个服务商详细信息  
接口地址: http://139.196.203.14:3010/api/v1/portals/id  (id为服务商id)  
请求方式: GET  
demo:
```javascript
        $.ajax({
            type:"GET",
            url: "http://139.196.203.14:3010/api/v1/portals/4",
            data:{
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```

* 新增  
接口地址: http://139.196.203.14:3010/api/v1/portals  
请求方式: POST  
demo:  
```javascript  
        $.ajax({
            type:"POST",
            url: "http://139.196.203.14:3010/api/v1/portals",
            data:{
                teamname:'测试团队1',
                tel:13706207777,
                wechat:'colin',
                email:'xx@qq.com',
                city:'广州',
                servicetime:'全天',
                equipment:[{type:'无人机',model:'大疆精灵3'},{type:'无人机',model:'大疆精灵3'}],
                content:['婚庆','工地'],
                des:'测试'
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```

* 修改  
接口地址: http://139.196.203.14:3010/api/v1/portals/id  (id为服务商id)  
请求方式: PUT  
demo:  
```javascript  
        $.ajax({
            type:"POST",
            url: "http://139.196.203.14:3010/api/v1/portals/4",
            data:{
                teamname:'测试团队1',
                tel:13706207777,
                wechat:'colin',
                email:'xx@qq.com',
                city:'广州',
                servicetime:'全天',
                equipment:[{type:'无人机',model:'大疆精灵3'},{type:'无人机',model:'大疆精灵3'}],
                content:['婚庆','工地'],
                des:'测试'
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```

* 删除  
接口地址: http://139.196.203.14:3010/api/v1/portals/id  (id为服务商id)  
请求方式: DELETE  
demo:  
```javascript  
          $.ajax({
            type:"DELETE",
            url: "http://139.196.203.14:3010/api/v1/portals/3",
            data:{
            },
            success:function(data){
                alert(JSON.stringify(data));
            }
        })
```