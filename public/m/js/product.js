$(function () {
    var id = CT.getParams().productId;
    getProductData(id,function (data) {
        // 清除加载状态
        $('.loading').remove();
        /*渲染商品详情页*/
        $('.mui-scroll').html(template('detail', data));
        /*初始化轮播图*/
        mui('.mui-slider').slider({
            interval: 2000
        });
        /*区域滚动*/
        mui('.mui-scroll-wrapper').scroll({
            indicators: false
        });
        // 1.尺码的选择
        $('.btn_size').on('tap', function () {
            $(this).addClass('now').siblings().removeClass('now');
        });
        // 2.数量选择
        $('.p_number span').on('tap',function(){
            var $input = $(this).siblings('input');
            var currNum = $input.val();
            // 因为取出来的是字符串,需要转换为数字
            var maxNum=parseInt($input.attr('data-max'));
            if($(this).hasClass('jian')){
                if(currNum == 0){
                    return false
                }
                currNum--;
            }else {
                // 不能超库存
                if(currNum >= maxNum){
                    // 消息框点击的时候会消失,正好和加号重叠(移动端击穿)
                    // 可以通过设置延迟来解决
                    setTimeout(
                        function () {
                            mui.toast('库存不足');
                        },200);
                    return false;
                }
                console.log(maxNum);
                currNum++;
            }
            $input.val(currNum);
        })
        // 3.加入购物车
        $('.btn_addCart').on('tap',function () {
            // 数据校验
            var $change = $('.btn_size.now')
            if(!$change.length){
                mui.toast('请您选择尺码');
                return false;
            }
            var num = $('.p_number input').val();
            if(num<=0){
                mui.toast('请您选择数量')
                return false;
            }
            // 提交数据
            // 一般来说查询数据用get,提交数据用post
            CT.loginAjax({
                url:"/cart/addCart",
                type:'post',
                data:{
                    productId:id,
                    num:num,
                    size:$change.html(),
                },
                dataType:'json',
                success:function (data) {
                    /*弹出提示框*/
                    /*content*/
                    /*title*/
                    /*btn text []*/
                    /*click btn callback */
                    mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function(e) {
                        if (e.index == 0) {
                            location.href = CT.cartUrl;
                        } else {
                            //TODO
                        }
                    })
                }
            })
        })








    })




});

var getProductData = function (productId,callback) {
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data: {
            id: productId
        },
        dataType: 'json',
        success: function (data) {
            setTimeout(function () {
                callback && callback(data);
            }, 1000);
        }
    });
}