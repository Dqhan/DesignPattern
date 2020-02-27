/**
 * 单例模式
 */

function Instance(name) {
    this.name = name;
}

Instance.prototype.fire = function () {
    console.log(this.name);
}

var singleton = (function () {
    var instance = null;
    return function (name) {
        if (!instance)
            instance = new Instance(name);
        return instance;
    }
})();
singleton('dqhan').fire();
singleton('dqhan1').fire();

//如果针对同一对象进行修改改进方式，在构造函数添加设置函数即可

function Instance(name) {
    this.name = name;
}

Instance.prototype.fire = function () {
    console.log(this.name);
}

Instance.prototype.set = function (name) {
    this.name = name;
}

var singleton = (function () {
    var instance = null;
    return function (name) {
        if (!instance)
            instance = new Instance(name);
        else
            instance.set(name);
        return instance;
    }
})();
singleton('dqhan').fire();
singleton('dqhan1').fire();

//到目前为止还有个问题，就是如果我们对这个单例模式进行扩展，要改变内部函数，这样做不满足设计模式中的单一职责原则，那么如何改进呢，改进如下

function Instance(name) {
    this.name = name;
}

Instance.prototype.fire = function () {
    console.log(this.name);
}

Instance.prototype.set = function (name) {
    this.name = name;
}

var singleton = (function (fn) {
    var instance = null;
    return function () {
        if (!instance) instance = fn.apply(this, arguments)
        return instance;
    }
})();

singleton(function () {
    var instance = new Instance('dqhan');
    return instance;
}).fire();

singleton(function () {
    var instance = new Instance('dqhan1');
    return instance;
}).fire();

//这样通过改变构造函数来实现对具体实例进行修改，但是对外使用不太方便，我们要求对外只提供个单例模式，具体场景自己设置构造函数

var singleton = function (fn) {
    var instance = null;
    return function () {
        if (!instance) instance = fn.apply(this, arguments)
        return instance;
    }
}
//对外暴露部分

var setSingleton = singleton(function () {
    var instance = new Instance('dqhan');
    return instance;
})

function Instance(name) {
    this.name = name;
}

Instance.prototype.fire = function () {
    console.log(this.name);
}

Instance.prototype.set = function (name) {
    this.name = name;
}


setSingleton('dqhan').fire();
setSingleton('dqhan1').fire();

/**
 * 工厂模式
 */

//最简单得工厂模式
function Factory(name) {
    this.name = name;
}

Factory.prototype.changeName = function (name) {
    this.name = name;
}

var demo = new Factory('dqhan');
var demo1 = new Factory('dqhan1');
//看上去是不是就是个构造函数呀，没错，构造函数也是工厂模式

//没有扩展性，那么我们来扩展一下,调用一个方法，然后根据type判断具体使用哪个实例,即简单工厂模式
function Factory(type) {
    function Cat() {
        this.name = 'cat';
    }

    Cat.prototype.say = function () {
        console.log('miaomiao~');
    }

    function Dog() {
        this.name = 'dog';
    }

    Dog.prototype.say = function () {
        console.log('wangwang~');
    }

    var alr = {
        cat: function () {
            return new Cat();
        },
        dog: function () {
            return new Dog();
        }
    };

    this.__proto__ = alr[type]();
}

var cat = new Factory('cat');
cat.say();
var dog = new Factory('dog');
dog.say();

//工厂模式的本意是将实际创建对象的工作推给字类去做，这样核心类就变成了一个抽象类，js实现我们只看核心思想即可，我们把工厂方法看作一个实例化对象的一个类

function Factory(type) {
    return new this[type]();
}

Factory.prototype = {
    Cat: function () {
        this.name = 'cat';
        this.__proto__.say = function () {
            console.log('miaomiao~');
        }
    },
    Dog: function () {
        this.name = 'dog';
        this.__proto__.say = function () {
            console.log('wangwang~');
        }
    }
}

var cat = new Factory('Cat');
cat.say();
var dog = new Factory('Dog');
dog.say();

//到目前为止，一个工厂模式就展现给我们了，创建实例的方法都附加在Factory的原型上，对外使用方法，每次都需要new一个对象，这样做是不是很繁琐呢，那么直接调用Factory更好一点呢，改进如下
//采用安全模式创建工厂模式方法

function Factory(type) {
    if (this instanceof Factory)
        return new this[type]();
    else
        return new Factory(type);
}

Factory.prototype = {
    Cat: function () {
        this.name = 'cat';
        this.__proto__.say = function () {
            console.log('miaomiao~');
        }
    },
    Dog: function () {
        this.name = 'dog';
        this.__proto__.say = function () {
            console.log('wangwang~');
        }
    }
}

var cat = Factory('Cat');
cat.say();
var dog = new Factory('Dog');
dog.say();
//这样做我们可以做到兼容函数调用与new创建实例的方式进行创建对象，到这个时候我们会联想到什么呢，是不是大名鼎鼎的jQuery，jQuery就是一个典型的工厂模式啊，同时也兼容了上述我们实现的两种使用方式
//我们来看看通过jQuery的方式是怎么实现的吧，没看过源码的小伙伴还不抓紧去看看

function Factory(type) {
    return new Factory.fn.init(type);
}

var fn = {
    init: function (type) {
        //当前this指向fn对象
        var target = this[type]();
        return target;
    }
}

Factory.fn = fn;

Factory.prototype.init = function (type) {
    var target = this[type]();
    return target;
}
Factory.prototype = {
    Cat: function () {
        this.name = 'cat';
        this.__proto__.say = function () {
            console.log('miaomiao~');
        }
    },
    Dog: function () {
        this.name = 'dog';
        this.__proto__.say = function () {
            console.log('wangwang~');
        }
    }
}
/**
 *  改变上面init中this指向问题使this指向Factory
*/
Factory.fn.init.prototype = Factory.prototype;

var cat = Factory('Cat');
cat.say();
var dog = new Factory('Dog');
dog.say();

//简单工厂模式跟常规工厂模式都是直接创建实例，但是如果遇到复杂场景，这里就需要采用抽象工厂模式，抽象工厂模式不是创建一个实例，而是创建一个集合，这个集合包含很多情况，每个情况可以使用具体实例
//本质上抽象工厂就是子类继承父类的方法

function AbstractFactory(fType) {
    if (this instanceof AbstractFactory) {
        ChildrenFn.prototype = new this[fType]();
    } else
        return new AbstractFactory(fType, ChildrenFn);
}

AbstractFactory.prototype.Cat = function () {
    this.name = 'cat';
}

AbstractFactory.prototype.Cat.prototype = {
    say: function () {
        console.log('miaomiao~');
    }
}

AbstractFactory.prototype.Dog = function () {
    this.name = 'dog';
}

AbstractFactory.prototype.Dog.prototype = {
    say: function () {
        console.log('wangwang~')
    }
}
//抽象工厂方法提供得接口不允许调用，需要字类重写，所以我们要加个限制

function AbstractFactory(fType, ChildrenFn) {
    if (this instanceof AbstractFactory) {
        ChildrenFn.prototype = new this[fType]();
    } else
        return new AbstractFactory(fType, ChildrenFn);
}

AbstractFactory.prototype.Cat = function () {
    this.name = 'cat';
}

AbstractFactory.prototype.Cat.prototype = {
    say: function () {
        throw new Error('不允许效用，仅允许重写。')
        console.log('miaomiao~');
    }
}

AbstractFactory.prototype.Dog = function () {
    this.name = 'dog';
}

AbstractFactory.prototype.Dog.prototype = {
    say: function () {
        throw new Error('不允许效用，仅允许重写。')
        console.log('wangwang~')
    }
}

function 美短Cat(name) {
    this.type = '美短';
    this.name = name;
}

AbstractFactory('Cat', 美短Cat)

var CatA = new 美短Cat('A');

// CatA.say();

AbstractFactory('Cat', 暹罗Cat)

function 暹罗Cat(name) {
    this.type = '暹罗';
    this.name = name
    this.__proto__.say = function () {
        console.log('重写cat say');
    }
}

var CatB = new 暹罗Cat('B');

CatB.say();

/**
 * 策略模式
 */
//什么是策略模式？就是分类处理嘛，符合A得情况，调用处理A得函数，符合B得情况，调用处理B得函数
//平时我们写代总会写一些什么样得代码呢~if else，简单写个demo
function fn(type) {
    if (type === 1)
        (function () {
            console.log('1');
        })();
    if (type === 2)
        (function () {
            console.log('2');
        })()
    if (type === 3)
        (function () {
            console.log('3')
        })()
}

fn(1);
fn(2);
fn(3);
//那么现在我们增加新得情况呢，是不是还要继续添加条件，这样子代码得可扩展性是不是很差，而且可读性也很差
//如果我们采用策略模式呢
var map = {
    1: fn1,
    2: fn2,
    3: fn3
}
function fn1() {
    console.log(1);
}
function fn2() {
    console.log(2);
}
function fn3() {
    console.log(3);
}
function fn(type) {
    map[type]();
}
//这样写是不是代码就很直观了，我们可以直观得看到映射关系跟具体使用得方法，如果我们要面对复杂得应用场景，需要可扩展性呢
//我们添加一个扩展方法暴露给外面
function extendCommend(type, fn) {
    map[type] = fn;
}
//这样一个简单得策略模式就完成了

/**
 * 代理模式
 */

//什么是代理模式，简单的讲就是对目标提供一个虚拟的壳子，这个壳子干什么用呢，来增加对目标使用的权限
//代理模式有三种，保护代理，虚拟代理，缓存代理 我们看看这三种代理具体是怎么回事儿

//保护代理
function targetAction(props) {
    console.dir(props);
}
//现在我们要求不是所有的情况都可以条用这个方法，添加保护代理

function proxyTargetAction(props) {
    if (typeof props === 'string') console.log('拒绝使用目标函数')
    targetAction(props);
}
proxyTargetAction({ name: 'dqhan' });
proxyTargetAction('str');

//虚拟代理
//其实虚拟代理我们平时是总会用到的，那就是函数节流与防抖了~下面我就就实现一个吧

function debounce(fn, delay) {
    var self = this,
        timer;
    return function () {
        clearInterval(timer);
        timer = setTimeout(function () {
            fn.apply(self, arguments);
        }, delay)
    }
}

//缓存代理

function add() {
    var arg = [].slice.call(arguments);

    return arg.reduce(function (a, b) {
        return a + b;
    });
}

// 代理
var proxyAdd = (function () {
    var cache = {};

    return function () {
        var arg = [].slice.call(arguments).join(',');
        // 如果有，则直接从缓存返回
        if (cache[arg]) {
            return cache[arg];
        } else {
            var result = add.apply(this, arguments);
            cache[arg] = result;
            return result;
        }
    };
})();
proxyAdd(1, 2, 3, 4, 5);
proxyAdd(1, 2, 3, 4, 5);//直接从缓存中输出

/**
 * 观察者模式
 */

//观察者模式又称发布订阅模式，这种设计模式最大的特点就是以事件驱动的方式来执行函数
//想象一下React两个子组件通信，我们平时是通过父组件传递信息的，那么如果两个模块的呢，没有父组件呢，是不是观察者模式就很能起到作用了呢~
//我们来实现一个观察者模式

var observer = (function () {
    var events = {};
    return function () {
        return {
            register: function (eventName, callback) {
                events[eventName] = callback;
            },
            fire: function (eventName) {
                if (toString.call(events[eventName]) !== '[object Function]')
                    throw new Error('error');
                else
                    return events[eventName]();
            },
            remove: function (eventName) {
                if (toString.call(events[eventName]) !== '[object Function]')
                    throw new Error('error');
                else
                    delete events[eventName];
            }
        }
    }
})();

var ob = observer();
ob.register('say', function () {
    console.log('demo');
});

ob.fire('say');

// ob.remove('say');

/**
 * 装饰者模式
 */

//以动态方式对某个对象添加一些额外得职责，但是不影响该对象以及该对象得衍生产物

function Demo() {

}
Demo.prototype.fire = function () {
    console.log('fire');
}

var demo = new Demo();

//装饰器
function Decorator(demo) {
    this.demo = demo;
}

Decorator.prototype.fire = function () {
    this.demo.fire();
}


var cat = new Decorator(demo);

cat.fire();

//其实我们很多时候也是利用了装饰者模式得思想得，比如架构层面得，当我们使用了第三方控件库得时候，
//但是这个控件库并不能完全得满足我们得使用，这时候我们会在第三方控件库上套一层壳子来满足我们要求得，这也算装饰者模式得思想
//再比如我们在封装一个控件得时候，如果我们想满足各种前端框架得迁移，我们最好得办法是什么呢，主体使用jquery，然后外面封装React、Vue等等这也算宏观上得装饰着模式
//我们来简单得写个利用装饰着模式封装控件得方法
//控件主体
(function (global,
    $,
    $$,
    factory,
    plugin) {
    if (typeof global[plugin] !== "object") global[plugin] = {};
    $.extend(true, global[plugin], factory.call(global, $, $$))
})(window, $, $$, function (
    $,
    $$
) {
    var uuid = -1;
    var _TabControl = function (ops) {
        this._ops = {
            items: ops.items || [],
            hashItems: {},
            selectedIndex: ops.selectedIndex || 0
        };
        this._element = $(ops.element);
        this._tabContainerId = "ui-tabcontrol-container-";
        this._oldValue = { selectedIndex: 0 };
        this._convertHashItems();
        this._init()
            ._initId()
            ._create()
            ._initMember()
            ._setTabContainer()
            ._setTabContent()
            ._bindEvent();
    };

    _TabControl.prototype = {
        _convertHashItems: function () {
            var i = 0;
            for (; i < this._ops.items.length; i++) {
                this._ops.hashItems[this._ops.items[i].title] = {
                    selectedIndex: i,
                    selectedItem: this._ops.items[i]
                };
            }
        },
        _init: function () {
            this._element.addClass("ui-tabcontrol");
            return this;
        },

        _initId: function () {
            this._tabContainerId += uuid;
            return this;
        },

        _create: function () {
            this._createTab();
            return this;
        },

        _createTab: function () {
            var fragement = [],
                h = -1;
            fragement[++h] =
                "<div id= " + this._tabContainerId + ' class="ui-tab-container">';
            fragement[++h] = "</div>";
            this._element.prepend(fragement.join(""));
        },

        _initMember: function () {
            this.$container = $("#" + this._tabContainerId);
            this.$contents = $(".ui-tabcontrol-content").children();
            return this;
        },

        _setTabContainer: function () {
            var i = 0,
                items = this._ops.items,
                len = items.length;
            for (; i < len; i++) {
                var el = document.createElement("div");
                el.textContent = items[i].title;
                $(el).addClass("ui-tabcontrol-container-item");
                if (this._ops.selectedIndex == i) $(el).addClass("active");
                el.onclick = this._tabClickHandler.bind(this);
                this.$container.append(el);
            }
            return this;
        },

        _resetTabContainer: function () {
            var $targets = this.$container.children();
            $targets.removeClass("active");
            $($targets[this._ops.selectedIndex]).addClass("active");
        },

        _bindEvent: function () {
            return this;
        },

        _tabClickHandler: function (e) {
            var self = this,
                newValue = this._ops.hashItems[e.target.textContent];
            $$.trigger(
                "tabHandleChanged",
                self._element,
                $$.Event({
                    element: self._element,
                    oldValue: this._oldValue,
                    newValue: newValue
                })
            );
            this._ops.selectedIndex = newValue.selectedIndex;
            this._oldValue = newValue;
            this._resetTabContainer();
            this._setTabContent();
        },

        _setTabContent: function () {
            this.$contents.addClass("ui-tabcontrol-content-item");
            var i = 0,
                items = this._ops.items,
                len = items.length;
            for (; i < len; i++) {
                if (i !== this._ops.selectedIndex)
                    $(this.$contents[i]).css("display", "none");
                else $(this.$contents[i]).css("display", "");
            }
            return this;
        },

        setOptions: function (ops) {
            this._ops.items = ops.items;
            this._ops.selectedIndex =
                ops.selectedIndex || this._oldValue.selectedIndex;
            this._convertHashItems();
            this._removeTabTabContainer()
                ._setTabContainer()
                ._setTabContent();
        },
        _removeTabTabContainer: function () {
            this.$container.empty();
            return this;
        }
    };
    return {
        TabControl: _TabControl
    }
}, "ui")
//React封装

import ReactWidget from './react-widget';

class TabControl extends ReactWidget {
    constructor(props) {
        super(props);
    }


    componentWillReceiveProps(newProps) {
        this.element.setOptions({
            items: newProps.items,
            selectedIndex: newProps.selectedIndex
        });
    }

    componentDidMount() {
        this.element = new ui.TabControl({
            element: ReactDOM.findDOMNode(this),
            items: this.props.items,
            selectedIndex: this.props.selectedIndex
        });
        $(ReactDOM.findDOMNode(this)).on('tabHandleChanged', this.props.selectChanged.bind(this));
    }

    render() {
        return <div>
            <div className='ui-tabcontrol-content'>
                {this.props.children}
            </div>
        </div>
    }
}

window.$$.TabControl = TabControl;

//这时候我们想要扩展成vue得框架，只需要放弃react，改用vue就行，而且可以修改暴漏给外面的selectChanged方法

/**
 * 外观模式
 */

//所谓的外观模式，就是将核心的方法打包成一个方法暴漏给外围模块

function add() {
    console.log('add');
}

function delete1() {
    console.log('delete');
}

function multiplication() {
    console.log('multiplication');
}

function division() {
    console.log('division')
}

function execute() {
    add();
    delete1();
    multiplication();
    division();
}

execute();

/**
 * 适配器模式
 */
//适配器模式核心思想就是兼容不同情况

function add(props) {
    if (toString.call(props) === '[object Object]') {
        var arr = [];
        for (var i in props) {
            if (props.hasOwnProperty(i))
                arr.push(props[i]);
        }
        return arr.reduce(function (pre, next) {
            return pre + next;
        })
    }
    if (toString.call(props) === '[object Array]') {
        return props.reduce(function (pre, next) {
            return pre + next;
        })
    }

    throw new Error('paramster is error.')
}


add([1, 2, 3]);
add({ a: 1, d: 2, c: 3 })
//这么处理我们可以使函数add同时兼容两种参数类型

/**
 * 享元模式
 */
//享元模式是一种性能优化，核心思想是运用共享技术来实现大量细粒度对象的创建，我们来见识下吧

function Person(props) {
    this.name = props.name;
    this.sex = props.sex;
    this.height = props.height;
    this.weight = props.weight;
}

Person.prototype.info = function () {
    console.log(this.name + this.sex + this.height + this.weight);
}

var metadata = [
    { name: 'dqhan0', sex: 'male', height: '170cm', weight: '125kg' },
    { name: 'dqhan1', sex: 'female', height: '165cm', weight: '135kg' },
    { name: 'dqhan2', sex: 'male', height: '180cm', weight: '145kg' },
    { name: 'dqhan3', sex: 'male', height: '173cm', weight: '155kg' },
    { name: 'dqhan4', sex: 'female', height: '169cm', weight: '165kg' },
    { name: 'dqhan5', sex: 'male', height: '168cm', weight: '175kg' },
]

function execute() {
    metadata.forEach(m => {
        new Person(m).info();
    })
}

execute();

//上面例子我们可以看出创建了6个对象，创建对象是很浪费内存空间的，我们把不变得属性抽离出来，把可变得属性当作扩展呢
//这样就满足了享元模式得核心思想，改进如下

//抽离性别
function Person(sex) {
    this.sex = sex;
    this.name = '';
    this.height = '';
    this.weight = '';
}

Person.prototype.info = function () {
    console.log(this.name + this.sex + this.height + this.weight);
}

var male = new Person('male');
var female = new Person('female');

function execute() {
    metadata.forEach(m => {
        if (m.sex === 'male') {
            male.name = m.name;
            male.height = m.height;
            male.weight = m.weight;
            male.info();
        } else {
            female.name = m.name;
            female.height = m.height;
            female.weight = m.weight;
            female.info();
        }
    })
}
execute();

//这就是一个享元模式简单类型，我们只根据性别来区分人的类型，但是这种方式是不是有很大的缺陷，耦合性很高，而且不算真正意义上的享元模式，我们在改进一下

//批量创建对象我们想到了什么？没错就是工厂模式,如果某种类型已经被创建过了，我们就不在创建
function Person(sex) {
    this.sex = sex;
    console.log('create person');
}

Person.prototype.info = function (name) {
    ManagerPeson.setExternalState(name, this);
    console.log(this.name + this.sex + this.height + this.weight);
}

var PersonFactory = (function () {
    var pool = {};
    return function (sex) {
        if (pool[sex]) {

        }
        else {
            pool[sex] = new Person(sex);
        }
        return pool[sex];
    }
})();

var ManagerPeson = (function () {
    var pool = {};
    return function () {
        return {
            add: function (m) {
                if (pool[m.name]) {
                } else {
                    pool[m.name] = {
                        name: m.name,
                        height: m.height,
                        weight: m.weight
                    };
                }
                return PersonFactory(m.sex);
            },
            setExternalState(name, target) {
                var poolTarget = pool[name];
                for (var i in poolTarget) {
                    if (poolTarget.hasOwnProperty(i))
                        target[i] = poolTarget[i]
                }
            }
        }
    }
})()

function execute() {
    metadata.forEach(m => {
        ManagerPeson.add(m).info(m.name);
    })
}

/**
 * 命令模式
 */

//一种松耦合的设计思想，使发送者与接收者消除彼此之前得耦合关系
//  <button id="refresh">refresh</button>
//  <button id="add">add</button>
//  <button id="del">delete</button>

//传统方式
refreshBtn.addEventListener('click', function () {
    console.log('refresh');
})

addBtn.addEventListener('click', function () {
    console.log('add');
})

delBtn.addEventListener('click', function () {
    console.log('delete')
})

//命令模式

var Refresh = function () {

}

Refresh.prototype.action = function () {
    console.log('refresh')
}


var Add = function () {

}

Add.prototype.action = function () {
    console.log('add')
}


var Del = function () {

}

Del.prototype.action = function () {
    console.log('delete')
}

var RefreshCommand = function (receiver) {
    return {
        excute() {
            receiver.action();
        }
    }
}

var AddCommand = function (receiver) {
    return {
        excute() {
            receiver.action();
        }
    }
}

var DeleteCommand = function (receiver) {
    return {
        name: 'delete command',
        excute() {
            receiver.action();
        }
    }
}

var setCommand = function (btn, command) {
    console.dir(command);
    btn.addEventListener('click', function () {
        command.excute();
    })
}

var refreshCommand = RefreshCommand(new Refresh());
var addCommand = AddCommand(new Add());
var delCommand = DeleteCommand(new Del());
setCommand(refreshBtn, refreshCommand)
setCommand(addBtn, addCommand)
setCommand(delBtn, delCommand)
//命令模式规定一个命令要有执行函数excute，场景复杂可添加undo，unexcute等方法
//命令需要有接收者，具体行为由接收者提供，调用者仅需要知道这个命令即可
//宏命令
//宏命令是一组命令的集合，通过执行宏命令的方式，执行一批命令，核心思想跟消息队列是一样的，也可以是观察者模式中注册了针对一个事件注册多个个函数一样

//现在我们将refresh、delete、add方法一次性全部执行一次
var macioCommand = (function () {
    var commandPool = [];
    return {
        add(command) {
            if (commandPool.includes(command)) throw new error('已存在');
            else commandPool.push(command);
        },
        excute() {
            for (var command of commandPool) {
                command.excute();
            }
        }
    }
})();
macioCommand.add(refreshCommand);
macioCommand.add(addCommand);
macioCommand.add(delCommand);
macioCommand.excute();

/**
 * 中介者模式
 */
//如果一个场景有好多对象，每个对象之前彼此有联系，我们将采用中介者模式
//假设现在有三种动物，我们看谁吃的多

//传统方式
var Cat = function () {
    this.eatNumber = 0
}
Cat.prototype.eat = function (num, dog, pig) {
    this.eatNumber = num;
    var arr = [this.eatNumber, dog.eatNumber, pig.eatNumber];
    arr.sort(function (pre, next) {
        return next - pre;
    })
    console.log('cat当前排名:' + arr.indexOf(this.eatNumber) + 1);
}

var Dog = function (cat, pig) {
    this.eatNumber = 0
}
Dog.prototype.eat = function (num, cat, pig) {
    this.eatNumber = num;
    var arr = [this.eatNumber, cat.eatNumber, pig.eatNumber];
    arr.sort(function (pre, next) {
        return next - pre;
    })
    console.log('dog当前排名:' + arr.indexOf(this.eatNumber) + 1);
}
var Pig = function () {
    this.eatNumber = 0
}
Pig.prototype.eat = function (num, dog, cat) {
    this.eatNumber = num;
    var arr = [this.eatNumber, dog.eatNumber, cat.eatNumber];
    arr.sort(function (pre, next) {
        return next - pre;
    })
    console.log('pig当前排名:' + arr.indexOf(this.eatNumber) + 1);
}

var cat = new Cat();
var dog = new Dog();
var pig = new Pig();
cat.eat(20, dog, pig);
dog.eat(50, cat, pig);
pig.eat(100, cat, dog);
//传统模式的实现方式，在执行eat的时候我们需要将另外两种动物传进去做比较，那么如果我们将比较的方式抽出来实现呢
//中介者模式

var Cat = function () {
    this.eatNumber = 0
}
Cat.prototype.eat = function (num) {
    this.eatNumber = num;
    middle(this);
}

var Dog = function (cat, pig) {
    this.eatNumber = 0
}
Dog.prototype.eat = function (num, cat, pig) {
    this.eatNumber = num;
    middle(this);
}
var Pig = function () {
    this.eatNumber = 0
}

Pig.prototype.eat = function (num, dog, cat) {
    this.eatNumber = num;
    middle(this);
}

var middle = (function () {
    var pool = [];
    return function (target) {
        pool.push(target.eatNumber);
        pool.sort(function (pre, next) {
            return next - pre;
        })
        console.log('当前排名:' + pool.indexOf(target.eatNumber) + 1);
    }
})()

var cat = new Cat();
var dog = new Dog();
var pig = new Pig();
cat.eat(20, dog, pig);
dog.eat(50, cat, pig);
pig.eat(100, cat, dog);

/**
 * 职责链模式
 */

//职责链模式在我们平时写业务逻辑是后比较常用，当一个函数处理很多东西的时候，我们通过职责链模式将其拆分
//常模模式
var order = function (orderType, pay, stack) {
    if (orderType === 1) {
        if (pay == true) {
            console.log('500元定金')
        } else {
            if (stack > 0)
                console.log('普通购买')
            else
                console.log('库存不足')
        }
    } else if (orderType === 2) {
        if (pay == true) {
            console.log('200元定金')
        } else {
            if (stack > 0)
                console.log('普通购买')
            else
                console.log('库存不足')
        }
    } else {
        if (stack > 0)
            console.log('普通购买')
        else
            console.log('库存不足')
    }
}
//看上去是不是狠繁琐，函数的复杂性太大了，我们采用职责链模式将其拆分
var order500 = function (orderType, pay, stack) {
    if (orderType === 1 && pay === true)
        console.log('500定金');
    else
        order200(orderType, pay, stack);
}

var order200 = function (orderType, pay, stack) {
    if (orderType === 2 && pay === true)
        console.log('200定金');
    else
        order(orderType, pay, stack);
}

var order = function (orderType, pay, stack) {
    if (stack > 0)
        console.log('普通购买')
    else
        console.log('没有库存')
}

/**
 * 方法模块模式
 */
//方法模板模式是一种只需要对只需要继承就可以实现的非常简单的设计模式
//方法模板模式有两部分组成，一部分是抽象父类，第二部分是具体实现子类
//抽象父类封装字类算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序，字类通过继承的方式继承这个抽象类，并可以重写父类方法

//咖啡与茶的例子来实现
//先泡一杯茶
function Coffee() {

}

Coffee.prototype.boilWater = function () {
    console.log('把水煮沸')
}

Coffee.prototype.brewCoffee = function () {
    console.log('冲咖啡')
}

Coffee.prototype.init = function () {
    this.boilWater();
    this.brewCoffee();
}

var coffee = new Coffee();
coffee.init();

//泡一杯茶
function Tea() {

}

Tea.prototype.boilWater = function () {
    console.log('把水煮沸')
}

Tea.prototype.steepTea = function () {
    console.log('冲茶水')
}

Tea.prototype.init = function () {
    this.boilWater();
    this.steepTea();
}

var tea = new Tea();
tea.init();

//这个过程大同小异，只是材料变了,部奏也变化了，我们如何改善
//方法与模板模式
var Beverage = function () {

}

//相同的方法
Beverage.prototype.boilWater = function () {
    console.log('烧水')
}


//冲茶或者冲咖啡     不同方法
Beverage.prototype.brew = function () {

}

Beverage.prototype.init = function () {
    this.boilWater();
    this.brew();
}

//创建Tea字类

function Tea() {

}
//继承模板类
Tea.prototype = new Beverage();
//重写brew满足茶的过程
Tea.prototype.brew = function () {
    console.log('冲茶水')
}

var tea = new Tea();
tea.init();

//创建Coffee

function Coffee(){

}

//继承模板类
Coffee.prototype = new Beverage();
//重写brew满足茶的过程
Coffee.prototype.brew = function () {
    console.log('冲咖啡')
}

var coffee = new Coffee();
coffee.init();
//那么什么是模板方法模式的核心是什么，就是这个init，这种设计模式我们在自己封装控件的时候会经常用到
//封装控件一定会有什么，initProps初始化属性，initEvent方法绑定，render渲染等等，我们是不是可以采用这种设计模式去做呢~





