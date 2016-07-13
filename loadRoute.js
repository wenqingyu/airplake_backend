/**
 * 加载路由
 */
var path = require('path');
var fs = require('fs');
var allRoutes = [];
var allRoutesInfo = [];
exports.allRoutes = allRoutes;
exports.allRoutesInfo = allRoutesInfo;

//加载
readdir(path.join(process.cwd(), 'route'));

function readdir(routesDir) {
    var files = fs.readdirSync(routesDir);
    files.forEach(function (path) {
        //routes目录下的文件路径
        var filePath = routesDir + "/" + path;
        var stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            //递归执行函数
            readdir(filePath);
        } else {
            var pathExtend = require('path');
            if (pathExtend.extname(filePath) == '.js') {
                //加载文件并解析
                loadFile(filePath);
            }
        }
    });
}

//各个模块自己传路由路径加载路由
function loadFile(filePath) {
    var routeObj = require(filePath);
    //如果包含autoroute属性，则进行解析
    if (routeObj.autoroute) {
        for (var method in routeObj.autoroute) {
            var routeList = routeObj.autoroute[method];
            if (!routeList) {
                break;
            }

            for (var routeRule in routeList) {
                //func获取得到的就是上面对应各项的处理函数
                var func = routeList[routeRule];
                if (func != undefined) {
                    allRoutes.push(routeRule);
                    if (!func.middleWare) {
                        allRoutesInfo.push({ method: method, routeRule: routeRule, func: func });
                    }
                    else {
                        allRoutesInfo.push({
                            method: method,
                            routeRule: routeRule,
                            middleWare: func.middleWare,
                            func: func.func
                        });
                    }
                }
            }
        }
    }
}