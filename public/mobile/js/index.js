$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration:0.005,//减速系数,系数越大,滚动速度越慢,滚动值越小
        indicators:false
    })
    var gallery = mui('.mui-slider');
    gallery.slider(
        {
            interval:3000//自动轮播间隔
        }
    )
})