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

/*需要登录的ajax请求*/
CT.loginUrl = '/m/user/login.html';
CT.cartUrl = '/m/user/cart.html';
CT.loginAjax = function (params) {
    $.ajax({
        type: params.type || 'get',
        url: params.url || '#',
        data: params.data || '',
        dataType: params.dataType || 'json',
        success:function (data) {
            /*未登录的处理 {error: 400, message: "未登录！"}
            所有的需要登录的接口 没有登录返回这个数据*/
            if(data.error == 400){
                /*跳到登录页  把当前地址传递给登录页面  当登录成功按照这个地址跳回来*/
                console.log(location/href);
                location.href = CT.loginUrl + '?returnUrl=' + location.href;
                return false;
            }else{
                params.success && params.success(data);
            }
        },
        error:function () {
            mui.toast('服务器繁忙');
        }
    })







}