const ButtonName = [
    'home',
    'skin',
    'info',
    'night',
    'close',
    'totop'
];
// Main Class
class Pio {
    idol;
    current;
    timer;
    prop;
    dialog;
    buttons;
    constructor(prop) {
        this.prop = prop;
        // get and set idol number
        const max = prop.model.length;
        const num = parseInt(localStorage.getItem('pio-num'));
        if (Number.isFinite(num) && num < max) {
            this.idol = num;
        }
        else {
            this.idol = 0;
            localStorage.setItem('pio-num', '0');
        }
        // create buttons
        this.buttons = {
            home: document.createElement('span'),
            skin: document.createElement('span'),
            info: document.createElement('span'),
            night: document.createElement('span'),
            close: document.createElement('span'),
            totop: document.createElement('span')
        };
        for (let items in this.buttons) {
            this.buttons[items].className = `pio-${items}`;
        }
        // get and set current
        let state = localStorage.getItem('pio-state') === 'false';
        let menu = document.querySelector('.pio-container .pio-action');
        if (!menu)
            throw new Error("Pio Elements don't exist!");
        let canvas = document.getElementById('pio');
        if (!canvas)
            throw new Error("Pio Elements don't exist!");
        let body = document.querySelector('.pio-container');
        if (!body)
            throw new Error("Pio Elements don't exist!");
        this.current = {
            state: state ? false : true,
            menu: menu,
            canvas: canvas,
            body: body,
            root: document.location.origin
        };
        // dialog
        this.dialog = document.createElement('div');
        this.dialog.className = 'pio-dialog';
        body.appendChild(this.dialog);
        this.InitIdol();
    }
    static CreateContainerToBody(width, height) {
        const container = document.createElement('div');
        container.className = 'pio-container ml-2';
        document.body.appendChild(container);
        const talk = document.createElement('div');
        talk.classList.add('pio-action');
        container.appendChild(talk);
        const canvas = document.createElement('canvas');
        canvas.id = 'pio';
        // make canvas distinct
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
        canvas.style.transformOrigin = 'right top';
        container.appendChild(canvas);
        canvas.style.marginBottom = `-${canvas.offsetHeight * (1 - 1 / window.devicePixelRatio)}px`;
        canvas.style.marginLeft = `-${canvas.offsetWidth * (1 - 1 / window.devicePixelRatio)}px`;
    }
    SetNextIdol() {
        const next = this.idol + 1;
        if (next < this.prop.model.length) {
            this.idol = next;
        }
        else {
            this.idol = 0;
        }
        localStorage.setItem('pio-num', String(this.idol));
    }
    static GetString(sosa) {
        if (Array.isArray(sosa)) {
            const num = Math.floor(Math.random() * sosa.length);
            return sosa[num];
        }
        else {
            return sosa;
        }
    }
    RenderMessage(str) {
        if ((typeof str === 'string') || (Array.isArray(str) && typeof str[0] === 'string')) {
            this.dialog.textContent = Pio.GetString(str);
            this.dialog.classList.add('active');
            if (this.timer !== undefined)
                clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.dialog.classList.remove('active');
                this.timer = undefined;
            }, Math.round(Math.random() * 10 + 15) * 1000);
        }
        else {
            throw new Error(`Argument of ${arguments.callee.toString()} was wrong!`);
        }
    }
    Hide() {
        this.dialog.classList.remove('active');
        this.current.body.classList.add('hidden');
        this.current.state = false;
        let show = document.createElement('div');
        show.className = 'pio-show';
        this.current.body.appendChild(show);
        show.addEventListener('click', () => {
            this.Show();
            show.parentElement.removeChild(show);
        });
        localStorage.setItem('pio-state', 'false');
        // ! 清除预设好的间距
        if (this.prop.mode === 'draggable') {
            this.current.body.style.top = '';
            this.current.body.style.left = '';
            this.current.body.style.bottom = '';
        }
    }
    Show() {
        this.current.body.classList.remove('hidden');
        this.current.state = true;
        localStorage.setItem('pio-state', 'true');
        loadlive2d('pio', this.prop.model[this.idol]);
    }
    static IsMobile() {
        return window.matchMedia('(max-width: 768px').matches;
    }
    Welcome() {
        if (document.referrer !== '' && document.referrer.split('/')[2] == this.current.root) {
            let referrer = document.createElement('a');
            referrer.href = document.referrer;
            this.RenderMessage(this.prop.content.referer ? (this.prop.content.referer.replace(/%t/, `“${referrer.hostname}”`)) : (`欢迎来自 “${referrer.hostname}” 的朋友！`));
        }
        else {
            this.RenderMessage(this.prop.content.welcome || `欢迎来到${document.location.hostname}!`);
        }
        if (this.prop.tips) {
            if (this.timer !== undefined)
                clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                let text, date = new Date();
                date.setHours(date.getHours() + 1);
                const range = date.getHours() / 3;
                switch (Math.floor(range)) {
                    case 0:
                        text = '已经这么晚了呀，早点休息吧，晚安~';
                        break;
                    case 1:
                        text = '你是夜猫子吗？这么晚还不睡觉，明天起的来嘛';
                        break;
                    case 2:
                        text = '早上好！现在是否元气满满呢？';
                        break;
                    case 3:
                        text = '上午好！不要久坐，多起来走动走动哦！';
                        break;
                    case 4:
                        text = '中午了，该休息了，现在是午餐时间！';
                        break;
                    case 5:
                        text = '午后很容易犯困呢，今天的目标完成了吗？';
                        break;
                    case 6:
                        text = '傍晚了！窗外夕阳的景色很美丽呢，今天是否是个好天气呢';
                        break;
                    case 7:
                        text = '晚上好，今天过得怎么样？';
                        break;
                    default:
                        text = '发生了不可能发生的事呢！';
                }
                this.RenderMessage(text);
                this.timer = undefined;
            }, Math.round(Math.random() * 25 + 10) * 1000);
        }
    }
    Touch() {
        this.current.canvas.addEventListener('click', () => {
            this.RenderMessage(this.prop.content.touch || ['你在干什么？', '再摸我就报警了！', 'HENTAI!', '不可以这样欺负我啦！']);
        });
    }
    Alternate() {
        if (this.prop.tips === undefined)
            return;
        setInterval(() => {
            this.RenderMessage(this.prop.content.alternate || ['打起精神来！', '要不要坐下来喝杯咖啡？', '无聊的时候试试读一本书？']);
        }, 25 * 1000 * 20);
    }
    ShowButton() {
        let x = this.prop.button;
        if (x === undefined)
            return;
        if (x.close !== false) {
            this.current.menu.appendChild(this.buttons.close);
            this.buttons.close.addEventListener('click', () => {
                this.Hide();
            });
            this.buttons.close.addEventListener('mouseover', () => {
                this.RenderMessage(this.prop.content.close || 'QWQ 下次再见吧~');
            });
        }
        if (x.home !== false) {
            this.current.menu.appendChild(this.buttons.home);
            this.buttons.home.addEventListener('click', () => {
                location.href = this.current.root;
            });
            this.buttons.home.addEventListener('mouseover', () => {
                this.RenderMessage(this.prop.content.home || '点击这里回到首页！');
            });
        }
        if (x.totop !== false) {
            this.current.menu.appendChild(this.buttons.totop);
            this.buttons.totop.addEventListener('click', () => {
                const element = document.querySelector('html');
                let a = element.style.scrollBehavior;
                let b = document.body.style.scrollBehavior;
                element.style.scrollBehavior = 'smooth';
                b = '';
                document.documentElement.scrollTop = document.body.scrollTop = 0;
                element.style.scrollBehavior = a;
                document.body.style.scrollBehavior = b;
            });
            this.buttons.totop.addEventListener('mouseover', () => {
                this.RenderMessage('点击这里滚动到顶部！');
            });
        }
        if (x.info !== false) {
            this.current.menu.appendChild(this.buttons.info);
            this.buttons.info.addEventListener('click', () => {
                window.open(this.prop.content.link || 'https://github.com/YexuanXiao/Pio-ts');
            });
            this.buttons.info.addEventListener('mouseover', () => {
                this.RenderMessage('想了解更多关于我的信息吗？');
            });
        }
        if (x.night !== null) {
            this.current.menu.appendChild(this.buttons.night);
            this.buttons.night.addEventListener('click', () => {
                if (typeof this.prop.night === 'function') {
                    this.prop.night();
                }
                else {
                    new Function('return ' + this.prop.night)();
                }
            });
            this.buttons.skin.addEventListener('mouseover', () => {
                this.RenderMessage('夜间点击这里可以保护眼睛呢');
            });
        }
        if (this.prop.model.length > 1) {
            this.current.menu.appendChild(this.buttons.skin);
            this.buttons.skin.addEventListener('click', () => {
                this.SetNextIdol();
                loadlive2d('pio', this.prop.model[this.idol]);
                this.RenderMessage(this.prop.content.skin ? this.prop.content.skin[1] : '新衣服真漂亮~');
            });
            this.buttons.skin.addEventListener('mouseover', () => {
                this.RenderMessage(this.prop.content.skin ? this.prop.content.skin[0] : '想看看我的新衣服吗？');
            });
        }
    }
    ShowCustom() {
        this.prop.content.custom?.forEach(t => {
            let e = document.querySelectorAll(t.selector);
            if (e.length) {
                for (let j = 0; j < e.length; j++) {
                    let text;
                    if (t.type === 'read') {
                        text = `想阅读 “${e[j].innerText.substring(0, 50)}” 吗？`;
                    }
                    else if (t.type === 'link') {
                        text = `想了解一下 “${(e[j].title ? e[j].title : e[j].innerText).substring(0, 50)}” 吗？`;
                    }
                    else if (t.text !== undefined) {
                        text = t.text?.substring(0, 50);
                    }
                    e[j].addEventListener('mouseover', () => {
                        this.RenderMessage(text);
                    });
                }
            }
        });
    }
    SetMode() {
        if (this.prop.mode === 'fixed') {
            this.Alternate();
            this.ShowButton();
            this.Touch();
        }
        else if (this.prop.mode === 'dragable') {
            this.Alternate();
            this.ShowButton();
            this.Touch();
            let body = this.current.body;
            body.addEventListener('mousedown', (event) => {
                let location = {
                    x: event.clientX - body.offsetLeft,
                    y: event.clientY - body.offsetTop
                };
                let move = (event) => {
                    body.classList.add('active');
                    body.classList.remove('right');
                    body.style.left = `${(event.clientX - location.x)}px`;
                    body.style.top = `${(event.clientY - location.x)}px`;
                    body.style.bottom = 'auto';
                };
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', () => {
                    body.classList.remove('active');
                    document.removeEventListener('mousemove', move);
                });
            });
        }
        else {
            this.current.body.classList.add('static');
        }
    }
    InitIdol() {
        this.SetMode();
        if (this.prop.content.custom) {
            this.ShowCustom();
        }
        if (this.current.state) {
            if (this.prop.hidden === false && Pio.IsMobile()) {
                this.Welcome();
                loadlive2d('pio', this.prop.model[this.idol]);
            }
            else if (!Pio.IsMobile()) {
                this.Welcome();
                loadlive2d('pio', this.prop.model[this.idol]);
            }
        }
        else {
            this.Hide();
        }
    }
}
let Paul_Pio = Pio;
