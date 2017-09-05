# cube.js
cube.js是一个动态模板引擎————或者说是轻量级的mvvm框架，视图会随着数据的变化来自动刷新

##一分钟上手cube.js

#### 你需要引入cube.js

```
<script src='../dist/bundle.js'></script>
```

#### 首先，你可能有如下格式的数据
 
```
{
    d : 1,
    abc : [
        {
            ccc : 1,
        },
        {
            ccc : 2
        }
    ]
}
```

#### 使用c-tpl指定对应的数据
```
<div c-tpl='test'>

</div>
```

#### 使用Cube.set将数据设为监听数据，事实上你仍然可以直接使用var，这种情况下，当触发变更时，数据仍然会自动刷新，只是不那么频繁
```
<script>
    var data = {
        d : 1,
        abc : [
            {
                ccc : 1,
            },
            {
                ccc : 2
            }
        ]
    };
    //当不执行下面这句的时候，仍然可以进行渲染
    Cube.set("test",data);
</script>
```

#### 书写对应的模板，你可以使用for/each 和 if/else if/else 这种指令，:value表示你需要双向绑定的数据（暂时不建议使用，还在开发中）
```
<div c-tpl='test'>
    <input type='text' :value='d'> 
    <ul>
     ~ each i,v in abc ~
            ~ each item in v ~
                ~ if Math.random() > 0.5
                    <li>~ item ~ 0.5+</li>
                ~ else if Math.random() > 0.5 ~
                    <li>else if item</LI>
                ~ else ~
                     <li>0.5-</li>
                ~ end ~
            ~ end ~
        ~ end ~
    </ul>
    ~ d ~
</div>
```

#### 更改这些数据，查看变化吧！
```
<script>
    data.abc[0].ccc = 2;
    setTimeout(function(){
        data.d = 'oh yes'
    },3000);
</script>
```


