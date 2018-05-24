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

    // // 2.页面初始化的时候,根据关键字,查询第一页数据(一次只查询4条)(在配置了刷新功能后会首次起动的时候加载)
    // getSearchData({
    //     proName:urlParams.key,
    //     page:1,
    //     pageSize:4
    // },function (data) {
    //     // console.log(data)
    //     // 将获取到的数据渲染到页面
    //     $(".ct_product").html(template('list',data))
    // })

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

    // 5.用户下拉的时候根据当前排序刷新,上拉加载重置
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识
            // 下拉刷新
            down : {
                // 最近更新的功能
                // style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
                // color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
                // height:'50px',//可选,默认50px.下拉刷新控件的高度,
                // range:'100px', //可选 默认100px,控件可下拉拖拽的范围
                // offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback :function(){//必选，刷新函数，自己来编写，比如通过ajax从服务器获取新数据；
                    var that = this ;//组件对象
                    var key = $.trim($input.val())
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

                    /*排序功能也重置*/
                    $('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
                    getSearchData({
                        proName: key,
                        page: 1,
                        pageSize: 4
                    }, function (data) {
                        setTimeout(function () {
                            /*渲染数据*/
                            $('.ct_product').html(template('list', data));
                            /*注意：停止下拉刷新*/
                            that.endPulldownToRefresh();
                            /*上拉加载重置*/
                            that.refresh(true);
                        }, 300);
                    });
                }
            },
            // 6.当用户上拉的时候加载下一页(没有数据的情况下就不再进行加载,并告知用户)
            up : {
                height:50,//可选.默认50.触发上拉加载拖动距离
                auto:true,//可选,默认false.自动上拉加载一次
                contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback :function() {//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    // 获取下一页数据,所以page要加1
                    ++window.page ;
                    // 根据当前已有的参数不改变来加载更多
                    /*组件对象*/
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    /*获取当前点击的功能参数  price 1 2 num 1 2*/
                    var order = $('.ct_order a.now').attr('data-order');
                    var orderVal = $('.ct_order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2;
                    /*获取数据*/
                    var params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4
                        /*排序的方式*/
                    };
                    params[order] = orderVal;
                    getSearchData(params, function (data) {
                        setTimeout(function () {
                            /*渲染数据*/
                            $('.ct_product').append(template('list', data));
                            /*注意：根据数据的长度判断是否已经没有其他数据了,如果是则停止上拉加载*/
                            if(data.data.length){
                                that.endPullupToRefresh();
                            }else{
                                that.endPullupToRefresh(true);
                            }
                        }, 300);
                    });

                }
            }




        }
    });




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
























