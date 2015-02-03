simple-select
=============

一个基于 [Simple Module](https://github.com/mycolorway/simple-module) 的快速选择组件。

![Demo Gif](https://raw.githubusercontent.com/mycolorway/simple-select/master/demo.gif)

### 如何使用

#### 下载并引用

通过 `bower install` 下载依赖的第三方库，然后在页面中引入这些文件：

```html
<link rel="stylesheet" type="text/css" href="[style path]/font-awesome.css" />
<link rel="stylesheet" type="text/css" href="[style path]/select.css" />

<script type="text/javascript" src="[script path]/jquery.min.js"></script>
<script type="text/javascript" src="[script path]/jquery.mousewheel.min.js"></script>
<script type="text/javascript" src="[script path]/module.js"></script>
<!-- simple-util https://github.com/mycolorway/simple-util -->
<script type="text/javascript" src="[script path]/util.js"></script>
<script type="text/javascript" src="[script path]/select.js"></script>
```

#### 初始化配置

在使用 simple-select 的 HTML 页面里应该有一个对应的 select 元素，例如：

```html
<select></select>
```

我们需要在这个页面的脚本里初始化 simple-select：

```javascript
simple.select({
    el: $('select'),           // * 必须
    cls: "",                   // 额外的 class
    onItemRender: $.noop,      // 渲染列表每个元素后调用的函数
    placeholder: ""            // input 元素的 placeholder 属性
});
```

组件会通过 `<select>` 元素生成列表元素，如：

```html
<select>
    <option data-key="George Washington">George Washington</option>
    <option data-key="John Adams">John Adams</option>
    <option data-key="Thomas Jefferson">Thomas Jefferson</option>
</select>
<script type="text/javascript">
    $(function() {
        simple.select({
            el: $('select')
        });
    });
</script>
```

### 方法和事件

simple-select 初始化之后，select 实例会暴露一些公共方法供调用：

```javascript
// 初始化 simple-select
var select = simple.select({
  el: $('select')
});

// 调用 selectItem 方法选择第三个元素
select.selectItem(2);
```

#### 公共方法

**setItems(items)**

设置 simple-select 列表元素，`label` `key` 为必须属性，所有属性都保存在对应 item 的 data 属性里：

```javascript
select.setItems([{
  label: "张三",
  key: "zhangsan zs 张三",
  id: "1"
},{
  label: "李四",
  key: "lisi ls 李四",
  id: "2"
},{
  label: "王麻子",
  key: "wangmazi wmz 王麻子",
  id: "3"
}]);
```

**selectItem(index)**

选择对应的列表元素，返回该元素的属性：

```javascript
select.selectItem(2);
// 返回
// {
//   label: "王麻子",
//   key: "wangmazi wmz 王麻子",
//   id: "3"
// }
```

**clearSelection()**

清除输入内容和选择的元素。

**destroy()**

恢复到初始化之前的状态。


#### 事件

**select**

触发条件：选择某个列表元素。返回该元素的属性。

**clear**

触发条件：清除输入内容和选择的元素。

