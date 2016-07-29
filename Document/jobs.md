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
