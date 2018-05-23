// 1.页面初始化的时候,关键字在输入框内显示
// 获取关键字
// 定义一个全局的方法,获取用户需要搜索的关键字对象
window.CT = {}
CT.getParams = function () {
    // 以对象的形式来存储地址栏信息
    var params = {};
    var search = location.search;
    if(search){
        var search = search.replace("?","");
        // 如果有多个数据
        var arr = search.split('&')
        arr.forEach(function (item,i) {
            var itemArr = item.split('=')
            // console.log(itemArr)
            // 键=值,只要键不重复就不会有问题
            params[itemArr[0]] = itemArr[1]
        })
    }
    // console.log(params)
    return params;
}