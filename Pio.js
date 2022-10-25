"use strict";
class Pio {
    idol;
    current;
    timer;
    prop;
    dialog;
    constructor(prop) {
        this.prop = prop;
        const length = prop.model.length;
        const num = parseInt(localStorage.getItem('pio-num'));
        if (Number.isFinite(num) && num < length) {
            this.idol = num;
        }
        else {
            this.idol = 0;
            localStorage.setItem('pio-num', '0');
        }
        const body = document.querySelector('.pio-container');
        const menu = document.querySelector('.pio-container .pio-action');
        const canvas = document.getElementById('pio');
        if (!menu || !canvas || !body)
            throw new Error("Pio Elements don't exist!");
        const state = localStorage.getItem('pio-state') === 'false';
        this.current = {
            state: state ? false : true,
            menu: menu,
            canvas: canvas,
            body: body,
            root: document.location.hostname
        };
        localStorage.setItem('pio-state', String(this.current.state));
        this.dialog = document.createElement('div');
        this.dialog.className = 'pio-dialog';
        body.appendChild(this.dialog);
        this.Init();
    }
    static CreateContainerToBody(width, height) {
        const container = document.createElement('div');
        container.className = 'pio-container left';
        document.body.appendChild(container);
        const menu = document.createElement('div');
        menu.classList.add('pio-action');
        container.appendChild(menu);
        const canvas = document.createElement('canvas');
        canvas.id = 'pio';
        container.appendChild(canvas);
        const ratio = devicePixelRatio;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        const style = canvas.style;
        style.width = `${width}px`;
        style.height = `${height}px`;
    }
    SetNextIdol() {
        const next = ++this.idol;
        if (next < this.prop.model.length) {
            this.idol = next;
        }
        else {
            this.idol = 0;
        }
        localStorage.setItem('pio-num', String(this.idol));
        this.Show();
    }
    static GetString(message) {
        let text;
        if (typeof message === 'string') {
            text = message.trimStart();
        }
        else {
            const num = Math.floor(Math.random() * message.length);
            text = message[num].trimStart();
        }
        if (text.length === 0) {
            console.info('Pio.Message 获得了一个空字符串，请检查配置。');
            return '悄悄的告诉你，我有一个秘密。';
        }
        else {
            return text;
        }
    }
    Message(message, time = (Math.floor(10 + Math.random() * (20 - 10 + 1)) * 1000)) {
        this.dialog.textContent = Pio.GetString(message);
        this.dialog.classList.add('active');
        if (this.timer !== undefined)
            clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.dialog.classList.remove('active');
            this.timer = undefined;
        }, time);
    }
    Show() {
        this.current.body.classList.remove('hidden');
        this.current.state = true;
        localStorage.setItem('pio-state', 'true');
        loadlive2d('pio', this.prop.model[this.idol]);
    }
    Hide() {
        const current = this.current;
        current.body.classList.add('hidden');
        current.state = false;
        localStorage.setItem('pio-state', 'false');
        const show = document.createElement('div');
        show.className = 'pio-show';
        current.body.appendChild(show);
        show.addEventListener('click', () => {
            this.Show();
            show.parentElement.removeChild(show);
        });
        if (this.prop.mode === 'draggable') {
            current.body.style.top = '';
            current.body.style.left = '';
            current.body.style.bottom = '';
        }
    }
    static IsMobile() {
        return matchMedia('(max-width: 768px').matches;
    }
    Welcome() {
        const referrer = document.referrer.split('/')[2];
        const head1 = document.querySelector('h1');
        if (referrer !== undefined && referrer !== this.current.root) {
            this.Message(this.prop.content.referer ? (this.prop.content.referer.replace(/%t/, referrer)) : (`欢迎来自 ${referrer} 的朋友！`));
        }
        else if (referrer === undefined) {
            this.Message(this.prop.content.welcome || `欢迎来到 ${this.current.root}!`);
        }
        else if (head1 !== null) {
            this.Message(`欢迎阅读 “${head1.textContent.trim()}”！`);
        }
        if (this.prop.tips) {
            const time = Math.floor(Math.random() * 10 + 25) * 1000;
            setTimeout(() => {
                const date = new Date();
                const range = Math.floor(date.getHours() / 3);
                let text;
                switch (range) {
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
                        text = '发生了不可能发生的事呢！你生活在火星吗？';
                }
                this.Message(text);
            }, time);
        }
    }
    Touch() {
        this.current.canvas.addEventListener('click', () => {
            this.Message(this.prop.content.touch || ['你在干什么？', '再摸我就报警了！', 'HENTAI!', '不可以这样欺负我啦！']);
        });
    }
    Alternate() {
        if (this.prop.tips === undefined)
            return;
        const period = 1.5;
        let time = 2 * 60 * 1000;
        let previous = new Date();
        setInterval(() => {
            const now = new Date();
            if (now > previous) {
                previous = new Date(now.getTime() + time);
                setTimeout(() => {
                    this.Message(this.prop.content.alternate || ['打起精神来！', '要不要坐下来喝杯咖啡？', '无聊的时候试试读一本书？']);
                }, time);
                time *= period;
            }
        }, time);
    }
    Menu() {
        const prop = this.prop;
        const menu = this.current.menu;
        if (prop.button === undefined)
            prop.button = {};
        if (this.prop.model.length > 1 && prop.button.skin !== false) {
            const skin = document.createElement('span');
            skin.className = 'pio-skin';
            menu.appendChild(skin);
            const [changed, want] = prop.content.skin || ['新衣服真漂亮~', '想看看我的新衣服吗？'];
            skin.addEventListener('click', () => {
                this.SetNextIdol();
                this.Message(changed);
            });
            skin.addEventListener('mouseover', () => {
                this.Message(want);
            });
        }
        if (prop.button.home !== false) {
            const home = document.createElement('span');
            home.className = 'pio-home';
            menu.appendChild(home);
            home.addEventListener('click', () => {
                location.href = this.current.root;
            });
            home.addEventListener('mouseover', () => {
                this.Message(prop.content.home || '点击这里回到首页！');
            });
        }
        if (prop.button.totop !== false) {
            const totop = document.createElement('span');
            totop.className = 'pio-totop';
            menu.appendChild(totop);
            totop.addEventListener('click', () => {
                const element = document.querySelector('html');
                const pre_behave = element.style.scrollBehavior;
                let current = document.body.style.scrollBehavior;
                element.style.scrollBehavior = 'smooth';
                current = '';
                document.documentElement.scrollTop = document.body.scrollTop = 0;
                element.style.scrollBehavior = pre_behave;
                document.body.style.scrollBehavior = current;
            });
            totop.addEventListener('mouseover', () => {
                this.Message('点击这里滚动到顶部！');
            });
        }
        if (prop.button.night !== false && prop.night) {
            const night = document.createElement('span');
            night.className = 'pio-night';
            menu.appendChild(night);
            night.addEventListener('click', () => {
                if (typeof prop.night === 'function') {
                    prop.night();
                }
                else {
                    new Function('return ' + prop.night)();
                }
            });
            night.addEventListener('mouseover', () => {
                this.Message('夜间点击这里可以保护眼睛呢~');
            });
        }
        if (prop.button.close !== false) {
            const close = document.createElement('span');
            close.className = 'pio-close';
            menu.appendChild(close);
            close.addEventListener('click', () => {
                this.Hide();
            });
            close.addEventListener('mouseover', () => {
                this.Message(prop.content.close || 'QWQ 下次再见吧~');
            });
        }
        if (prop.button.info !== false) {
            const info = document.createElement('span');
            info.className = 'pio-info';
            menu.appendChild(info);
            info.addEventListener('click', () => {
                open(prop.content.link || 'https://github.com/YexuanXiao/Pio-ts');
            });
            info.addEventListener('mouseover', () => {
                this.Message('想了解更多关于我的信息吗？');
            });
        }
    }
    Custom() {
        if (this.prop.content.custom === undefined)
            return;
        for (const items of this.prop.content.custom) {
            const nodes = document.querySelectorAll(items.selector);
            for (const node of nodes) {
                let text = '';
                if (items.type === 'read') {
                    text = node.textContent.trim();
                    text = text.length !== 0 ? `想阅读 “${text}” 吗？` : text;
                }
                else if (items.type === 'link') {
                    text = node.title.trim() || node.textContent.trim();
                    text = text.length !== 0 ? `想了解一下 “${text}” 吗？` : text;
                }
                else if (items.text !== undefined) {
                    text = items.text;
                }
                node.addEventListener('mouseover', () => {
                    this.Message(text);
                });
            }
        }
    }
    SetMode() {
        if (this.prop.mode === 'fixed') {
            this.Alternate();
            this.Menu();
            this.Touch();
        }
        else if (this.prop.mode === 'draggable' && !Pio.IsMobile()) {
            this.Alternate();
            this.Menu();
            this.Touch();
            const body = this.current.body;
            body.addEventListener('mousedown', (event) => {
                const location = {
                    x: event.clientX - body.offsetLeft,
                    y: event.clientY - body.offsetTop
                };
                const move = (event) => {
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
    Listen() {
        let auto = true;
        let observer = new ResizeObserver(() => {
            if (this.current.state === true && Pio.IsMobile() && auto === true) {
                this.Hide();
                auto = false;
            }
            else if (!Pio.IsMobile() && auto === false) {
                this.Show();
                auto = true;
            }
        });
        const footer = document.body.querySelector('footer');
        const article = document.body.querySelector('article');
        observer.observe(footer || article || document.body);
    }
    Init() {
        this.SetMode();
        this.Custom();
        this.Listen();
        if (this.current.state === false) {
            this.Hide();
            return;
        }
        const mobile = Pio.IsMobile();
        if (!mobile) {
            this.Welcome();
            loadlive2d('pio', this.prop.model[this.idol]);
            return;
        }
        else if (this.prop.hidden === false && mobile) {
            this.Welcome();
            loadlive2d('pio', this.prop.model[this.idol]);
            return;
        }
        this.Hide();
    }
    init = this.Init;
    message = this.Message;
}
const Paul_Pio = Pio;
console.log("%c Pio %c https://paugram.com ", "color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;", "margin: 1em 0; padding: 5px 0; background: #efefef;");
console.log("%c Pio-ts %c https://github.com/YexuanXiao/Pio-ts ", "color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;", "margin: 1em 0; padding: 5px 0; background: #efefef;");
