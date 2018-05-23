$(function () {
    // 一级分类的默认渲染 第一个一级分类对应的二级分类
    getCategory(function (data) {
        $('.cate_left ul').html(template("firstTemplate",data))
        // 绑定加载事件
        /*initSecondTapHandle();*/
        // 加载第一个一级分类对应的二级分类
        var categoryId = $('.cate_left ul li:first-child').find('a').attr('data-id');
        render(categoryId);

    })

    //点击一级分类加载对应的二级分类(事件委派,因为里面的li是动态生成的)
    $('.cate_left').on('tap','a',function (e) {
        // 判断是否当前项,当前选中的时候不去加载
        if($(this).parent().hasClass('now')) return false;
        // 样式选中功能
        $('.cate_left li').removeClass('now');
        $(this).parent().addClass('now');
        // 数据渲染:
        render($(this).attr('data-id'));
    })
})

// 获取一级分类的数据
var getCategory = function (callback) {
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:'',
        dataTpye:'json',
        success:function (data) {
            callback&&callback(data);
        }
    })
}
/*获取二级分类的数据*/
/*params = {id:1}*/
var getSecondCategoryData = function (params,callback) {
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        // 获取第一个二级分类
        data:params,
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
};
// 渲染二级分类:
var render = function (categoryId) {
    getSecondCategoryData({
        id:categoryId
    },function (data) {
        // 注意是渲染(二级)右边的数据
        $('.cate_right ul').html(template("secondTemplate",data))
    })
}