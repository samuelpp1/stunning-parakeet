
//等页面所有DOM元素加载完毕在执行js代码,这样js文件就可以想放在哪里就放在哪里了
window.addEventListener('load', function () {

    var up_page = document.querySelector('.up-page');
    var next_page = document.querySelector('.next-page');
    var focus = document.querySelector('.focus');

    var focusWidth = focus.offsetWidth;   //获取轮播图容器的宽度，方便后续做算法移动图片

    focus.addEventListener('mouseenter', function () {
        up_page.style.display = 'block';
        next_page.style.display = 'block';
        clearInterval(index_timer);
        index_timer = null;            //可写可不写，停止定时器后把变量删除，节省内存
    })

    focus.addEventListener('mouseleave', function () {
        up_page.style.display = 'none';
        next_page.style.display = 'none';
        // 开启定时器，自动播放,已经声明过index_timer变量，这里不需要加var了
        index_timer = setInterval(function () {
            //手动调用点击事件
            next_page.click();
        }, 2500);
    });

    var focus_ul = document.querySelector('.focus_ul');    //ul 所有轮播图播放的图片
    var focus_ol = document.querySelector('.circle');    //ol 底部的小圆点按钮

    // 动态创建小圆点,并添加点击事件
    for (var i = 0; i < focus_ul.children.length; i++) {   //有几个图片我就创建几个li
        //  循环创建节点（元素）li
        var li = document.createElement('li');
        // 依次添加到ol里
        focus_ol.appendChild(li);

        // 再利用循环给每一个轮播图的li加一个自定义属性，后续通过获取索引号来控制轮播图移动
        li.setAttribute('date_index', i);     //属性为date-index   属性值为0 1 2 3 4……

        // 再利用循环给每个li加入点击事件
        li.addEventListener('click', function () {
            // 排他思想，干掉其他人，留下我自己
            for (var i = 0; i < focus_ol.children.length; i++) {
                focus_ol.children[i].className = '';
            }
            this.className = 'current';

            // 点击小圆圈，移动图片 当然移动的是 ul,ul是一个长盒子，里面装着所有图片，控制ul的left值来播放轮播图
            // ul 的移动距离 小圆圈的索引号 乘以 图片的宽度 注意是负值
            // 当我们点击了某个小li 就拿到当前小li 的索引号
            var date_index = this.getAttribute('date_index');     //获取当前点击的li的索引号

            // 当我们点击了某个小li 就要把这个li 的索引号给 num  
            num = date_index;
            // 当我们点击了某个小li 就要把这个li 的索引号给 circle  
            circle = date_index;
            // num = circle = index;

            // 调用我们封装的动画函数,第一个参数为对象，谁移动就写谁，第二个参数是移动到目标值（数字），第三个参数是回调函数，可以写也可以不写
            // ul 的移动距离 小圆圈的索引号 乘以 图片的宽度 注意是负值
            animate(focus_ul, -date_index * focusWidth);
        });
    }

    // 给第一个小圆点默认为白色背景
    focus_ol.children[0].className = 'current';
    // 在最后一张图片后面再克隆第一张图片，制作无缝滚动效果
    var li = focus_ul.children[0].cloneNode(true);   //括号里为true，为深拷贝，复制标签以及里面的内容
    // 克隆完毕后，把它排到最后一张图片的后面(默认就是排到最后的)
    focus_ul.appendChild(li);


    // 定义一个全局变量num,相当于小圆圈的索引号,点击右侧按钮控制图片移动
    var num = 0;
    // 定义一个全局变量circle控制小圆点跟着图片移动
    var circle = 0;


    // 节流阀
    var flag = true;   //设置为全局变量供左右按钮点击函数使用，限制鼠标点击过快图片播放过快

    // 右侧按钮点击切换图片
    next_page.addEventListener('click', function () {

        if (flag) {

            flag = false;      //点击按钮后，就不让去继续点击了，等图片动画加载完之后利用回调函数再设置回true

            // 减去克隆的那一张，到最后一张的时候就切回第一张图片从新开始
            if (num == focus_ul.children.length - 1) {
                focus_ul.style.left = 0;
                num = 0;
            }

            num++;      //num相当与date_index

            animate(focus_ul, -num * focusWidth, function () {
                flag = true;       //回调函数：等图片动画加载完再回来执行这个函数
            });

            circle++;    //图片切到下一张了，底下的小圆点也要跟着到第二个

            // 如果到了第四张图片就让小圆点从头开始
            if (circle % 4 == 0) {
                circle = 0;
            }

            // 排他思想
            for (var i = 0; i < focus_ol.children.length; i++) {
                focus_ol.children[i].className = '';
            }
            focus_ol.children[circle].className = 'current';

        }

    });


    // 左侧按钮点击切换图片
    up_page.addEventListener('click', function () {

        if (flag) {

            flag = false;      //点击按钮后，就不让去继续点击了，等图片动画加载完之后利用回调函数再设置回true

            // 如果num等于第一张图片
            if (num == 0) {
                num = focus_ul.children.length - 1;          //切到第四张图片
                focus_ul.style.left = -num * focusWidth + 'px';    //最后一张图,因为是向左走，所以得是负值
                // 修改定位的top/left/right/bottom一定一定一定要加单位，js代码默认是没有单位的
            }

            // 上一张图片
            num--;

            // 上一个小圆点
            circle--;

            animate(focus_ul, -num * focusWidth, function () {
                flag = true;              //  //回调函数：等图片动画加载完再回来执行这个函数
            });

            // 如果circle<0就说明是在第一张图片显示时，点击了左侧按钮，这时就要让小圆点跳到第四个点上
            if (circle < 0) {
                circle = focus_ol.children.length - 1;
            }

            for (var i = 0; i < focus_ol.children.length; i++) {
                focus_ol.children[i].className = '';
            }
            focus_ol.children[circle].className = 'current';

        }

    });





    // 开启定时器，自动播放
    var index_timer = setInterval(function () {
        //手动调用点击事件
        next_page.click();
    }, 2500);


});
