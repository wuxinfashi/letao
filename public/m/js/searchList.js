// 需求:
    // 1.页面初始化的时候,关键字在输入框内显示
    // 2.页面初始化的时候,根据关键字,查询第一页数据(一次只查询4条)
    // 3.用户点击搜索的时候 根据新的关键字搜索商品 并重置排序
    // 4.用户点击排序的时候,根据排序的选项,去进行排序(默认的时候是降序,再次点击的时候按升序)
    // 5.用户下拉的时候根据当前排序刷新,上来加载重置
    // 6.当用户上拉的时候加载下一页(没有数据的情况下就不再进行加载,并告知用户)
$(function () {
    /*区域滚动*/
    mui('.mui-scroll-wrapper').scroll({
        indicators:false
    });

    // 1.页面初始化的时候,关键字在输入框内显示
    // 获取关键字
    var urlParams = CT.getParams()
    // 将用户输入的关键字初始化到searchlist的input中
    var $input = $('input').val(urlParams.key|| "")
    // console.log($input)

    // 2.页面初始化的时候,根据关键字,查询第一页数据(一次只查询4条)
    getSearchData({
        proName:urlParams.key,
        page:1,
        pageSize:4
    },function (data) {
        // console.log(data)
        // 将获取到的数据渲染到页面
        $(".ct_product").html(template('list',data))


    })

    // 3.用户点击搜索的时候 根据新的关键字搜索商品 并重置排序
    $('.ct_search a').on('tap',function () {
        var key = $.trim($input.val())
        //重新搜索就是再次调用getSearchData的方法,并按搜索的关键字查询
        if(key){
            getSearchData({
                proName:key,
                page:1,
                pageSize:4
            },function (data) {
                // console.log(data)
                // 将获取到的数据渲染到页面
                $(".ct_product").html(template('list',data))
            })
        }else {
            mui.toast('请输入关键字')
            return false
        }
    })

    // 4.用户点击排序的时候,根据排序的选项,去进行排序(默认的时候是降序,再次点击的时候按升序)
    $('.ct_order a').on('tap',function () {
        //如果已经被选择,则根据当前样式改变为相反的图标样式
        if($(this).hasClass('now')&&$(this).find('span').hasClass('fa fa-angle-down')){
            $(this).find('span').removeClass('fa fa-angle-down').addClass('fa fa-angle-up')
        }else if($(this).hasClass('now')&&$(this).find('span').hasClass('fa fa-angle-up')){
            $(this).find('span').removeClass('fa fa-angle-up').addClass('fa fa-angle-down')
        }
        // 改变当前样式
        $(this).addClass('now').siblings().removeClass('now').find('span').removeClass().addClass('fa fa-angle-down')

        //获取当前点击的功能参数 price 1升序 2降序 num 1升序 2降序
        // 通过data-type来判断需要按什么来进行排序,再判断里面的箭头,看需要获取升序还是降序
        var key = $.trim($input.val())
        if(!key){
            mui.toast('请输入关键字')
            return false;
        }
        var order = $(this).attr('data-type');
        // console.log(order)
        // 根据是升序还是降序取值为1或2
        var orderVal = $(this).find('span').hasClass('fa-angle-down')?1:2;
        var params = {
            proName:key,
            page:1,
            pageSize:4
            // 排序的方式在后面添加
        }
        params[order] = orderVal
        // 获取数据
        getSearchData(params,function (data) {
            $('.ct_product').html(template('list',data))
        })
    })





});




// 定义一个获取数据的方法,具体实现自己定义
// 两个形参,一个是传递过去获取后台的数据,一个是回调方法
var getSearchData = function (params,callback) {
    $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            /*存当前页码*/
            window.page = data.page;
            callback && callback(data);
        }
    });
}
























