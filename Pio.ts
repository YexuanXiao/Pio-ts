// Helper type
// SOSA: String or String Array
type SOSA = string | string[]
type bool = boolean

// Argument's type
type Custom = {
    selector: string
    text?: string
    type?: string
}
type Content = {
    welcome?: SOSA
    touch?: SOSA
    home?: SOSA
    close?: SOSA
    link?: string
    referer?: string
    skin?: [string, string]
    custom?: Custom[]
    alternate?: SOSA
}
const ButtonNames_implement_ = [
    'home',
    'skin',
    'info',
    'night',
    'close',
    'totop'
] as const
type Button = {
    [Property in typeof ButtonNames_implement_[number]]+?: bool
}
type ButtonElements = {
    [Property in typeof ButtonNames_implement_[number] | string]: HTMLElement
}
type Argument = {
    mode: string
    hidden?: bool
    content: Content
    night?: string | (() => void)
    model: SOSA
    tips?: bool
    button?: Button
}
type Current = {
    state: bool
    menu: HTMLElement
    canvas: HTMLCanvasElement
    body: HTMLElement
    root: string
}

// declare loadlive2d
declare function loadlive2d(str: string, str1: string): void

// Main Class
class Pio {
    private idol: number
    private current: Current
    private timer: number | undefined
    private readonly prop: Argument
    private readonly dialog: HTMLElement
    private readonly buttons: ButtonElements

    constructor(prop: Argument) {
        this.prop = prop

        // Get and set idol number
        const length = prop.model.length
        const num = parseInt(localStorage.getItem('pio-num') as string)
        if (Number.isFinite(num) && num < length) {
            this.idol = num
        } else {
            this.idol = 0
            localStorage.setItem('pio-num', '0')
        }

        // Create buttons
        this.buttons = {
            home: document.createElement('span'),
            skin: document.createElement('span'),
            info: document.createElement('span'),
            night: document.createElement('span'),
            close: document.createElement('span'),
            totop: document.createElement('span')
        }
        for (let items in this.buttons) {
            this.buttons[items].className = `pio-${items}`
        }

        // Get and set current
        const state = localStorage.getItem('pio-state') === 'false'
        const menu = document.querySelector('.pio-container .pio-action')
        if (!menu) throw new Error("Pio Elements don't exist!")
        const canvas = document.getElementById('pio')
        if (!canvas) throw new Error("Pio Elements don't exist!")
        const body = document.querySelector('.pio-container')
        if (!body) throw new Error("Pio Elements don't exist!")
        this.current = {
            state: state ? false : true,
            menu: menu as HTMLElement,
            canvas: canvas as HTMLCanvasElement,
            body: body as HTMLElement,
            root: document.location.origin
        }

        // Dialog
        this.dialog = document.createElement('div')
        this.dialog.className = 'pio-dialog'
        body.appendChild(this.dialog)

        // Before this, prepare all HTML elements and members
        // Then, do other stuff about initialization
        this.Init()
    }

    static CreateContainerToBody(width: number, height: number) {
        const container = document.createElement('div')
        container.className = 'pio-container'
        document.body.appendChild(container)
        const menu = document.createElement('div')
        menu.classList.add('pio-action')
        container.appendChild(menu)
        const canvas = document.createElement('canvas')
        canvas.id = 'pio'
        // Node must insert before get the actual width and height
        container.appendChild(canvas)
        // Make canvas adapt DPI scale
        const ratio = window.devicePixelRatio
        canvas.width = width * ratio
        canvas.height = height * ratio
        let style = canvas.style
        style.transform = `scale(${1 / ratio})`
        style.transformOrigin = 'right top'
        style.marginBottom = `-${canvas.offsetHeight * (1 - 1 / ratio)}px`
        style.marginLeft = `-${canvas.offsetWidth * (1 - 1 / ratio)}px`
    }

    private SetNextIdol() {
        const next = this.idol + 1
        if (next < this.prop.model.length) {
            this.idol = next
        } else {
            this.idol = 0
        }
        localStorage.setItem('pio-num', String(this.idol))
    }

    // 
    private static GetString(sosa: SOSA) {
        if (typeof sosa === 'string') {
            return sosa
        } else {
            const num = Math.floor(Math.random() * sosa.length)
            return sosa[num]
        }
    }

    // Send Message, default times: [15, 25]s
    public RenderMessage(sosa: SOSA, time: number = (Math.floor(15 + Math.random() * (25 - 15 + 1)) * 1000)) {
        this.dialog.textContent = Pio.GetString(sosa)
        this.dialog.classList.add('active')
        if (this.timer !== undefined) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.dialog.classList.remove('active')
            this.timer = undefined
        }, time)
    }

    public Show() {
        this.current.body.classList.remove('hidden')
        this.current.state = true
        localStorage.setItem('pio-state', 'true')
        loadlive2d('pio', this.prop.model[this.idol])
    }

    public Hide() {
        let current = this.current

        // Anti-this.Show
        current.body.classList.add('hidden')
        current.state = false
        localStorage.setItem('pio-state', 'false')

        // Add the Show button
        let show = document.createElement('div')
        show.className = 'pio-show'
        current.body.appendChild(show)
        show.addEventListener('click', () => {
            this.Show()
            show.parentElement!.removeChild(show)
        })

        // Clean the position of Pio
        if (this.prop.mode === 'draggable') {
            current.body.style.top = ''
            current.body.style.left = ''
            current.body.style.bottom = ''
        }
    }

    static IsMobile() {
        return window.matchMedia('(max-width: 768px').matches
    }

    private Welcome() {
        // Referer
        if (document.referrer !== '' && document.referrer.split('/')[2] === this.current.root) {
            let referrer = document.createElement('a')
            referrer.href = document.referrer
            this.RenderMessage(this.prop.content.referer ? (this.prop.content.referer.replace(/%t/, `“${referrer.hostname}”`)) : (`欢迎来自 “${referrer.hostname}” 的朋友！`))
        } else {
            this.RenderMessage(this.prop.content.welcome || `欢迎来到${document.location.hostname}!`)
        }

        // Randomly display time tips within 10 seconds after Referer
        if (this.prop.tips) {
            const time = Math.floor(Math.random() * 10 + 25) * 1000
            setTimeout(() => {
                let date = new Date()
                const range = Math.floor(date.getHours() / 3)
                let text: string
                switch (range) {
                    case 0:
                        text = '已经这么晚了呀，早点休息吧，晚安~'
                        break
                    case 1:
                        text = '你是夜猫子吗？这么晚还不睡觉，明天起的来嘛'
                        break
                    case 2:
                        text = '早上好！现在是否元气满满呢？'
                        break
                    case 3:
                        text = '上午好！不要久坐，多起来走动走动哦！'
                        break
                    case 4:
                        text = '中午了，该休息了，现在是午餐时间！'
                        break
                    case 5:
                        text = '午后很容易犯困呢，今天的目标完成了吗？'
                        break
                    case 6:
                        text = '傍晚了！窗外夕阳的景色很美丽呢，今天是否是个好天气呢'
                        break
                    case 7:
                        text = '晚上好，今天过得怎么样？'
                        break
                    default:
                        text = '发生了不可能发生的事呢！'
                }
                this.RenderMessage(text)
            }, time)
        }
    }

    private Touch() {
        this.current.canvas.addEventListener('click', () => {
            this.RenderMessage(this.prop.content.touch || ['你在干什么？', '再摸我就报警了！', 'HENTAI!', '不可以这样欺负我啦！'])
        })
    }

    private Alternate() {
        if (this.prop.tips === undefined) return

        // Initially 2 minutes, increasing 1.5 times each time
        const period = 1.5
        let time = 2 * 60 * 1000
        // Previous end time
        let previous = new Date()
        setInterval(() => {
            let now = new Date()
            if (now > previous) {
                previous = new Date(now.getTime() + time)
                setTimeout(() => {
                    this.RenderMessage(this.prop.content.alternate || ['打起精神来！', '要不要坐下来喝杯咖啡？', '无聊的时候试试读一本书？'])
                }, time)
                time *= period
            }
        }, time)
    }

    private Menu() {
        let x = this.prop.button
        if (x === undefined) return
        if (x.close !== false) {
            this.current.menu.appendChild(this.buttons.close)
            this.buttons.close.addEventListener('click', () => {
                this.Hide()
            })
            this.buttons.close.addEventListener('mouseover', () => {
                this.RenderMessage(this.prop.content.close || 'QWQ 下次再见吧~')
            })
        }
        if (x.home !== false) {
            this.current.menu.appendChild(this.buttons.home)
            this.buttons.home.addEventListener('click', () => {
                location.href = this.current.root
            })
            this.buttons.home.addEventListener('mouseover', () => {
                this.RenderMessage(this.prop.content.home || '点击这里回到首页！')
            })
        }
        if (x.totop !== false) {
            this.current.menu.appendChild(this.buttons.totop)
            this.buttons.totop.addEventListener('click', () => {
                const element = document.querySelector('html') as HTMLElement
                let a = element.style.scrollBehavior
                let b = document.body.style.scrollBehavior
                element.style.scrollBehavior = 'smooth'
                b = ''
                document.documentElement.scrollTop = document.body.scrollTop = 0
                element.style.scrollBehavior = a
                document.body.style.scrollBehavior = b
            })
            this.buttons.totop.addEventListener('mouseover', () => {
                this.RenderMessage('点击这里滚动到顶部！')
            })
        }
        if (x.info !== false) {
            this.current.menu.appendChild(this.buttons.info)
            this.buttons.info.addEventListener('click', () => {
                window.open(this.prop.content.link || 'https://github.com/YexuanXiao/Pio-ts')
            })
            this.buttons.info.addEventListener('mouseover', () => {
                this.RenderMessage('想了解更多关于我的信息吗？')
            })
        }
        if (x.night !== null) {
            this.current.menu.appendChild(this.buttons.night)
            this.buttons.night.addEventListener('click', () => {
                if (typeof this.prop.night === 'function') {
                    this.prop.night()
                } else {
                    new Function('return ' + this.prop.night)()
                }
            })
            this.buttons.skin.addEventListener('mouseover', () => {
                this.RenderMessage('夜间点击这里可以保护眼睛呢')
            })
        }
        if (this.prop.model.length > 1) {
            this.current.menu.appendChild(this.buttons.skin)
            this.buttons.skin.addEventListener('click', () => {
                this.SetNextIdol()
                loadlive2d('pio', this.prop.model[this.idol])
                this.RenderMessage(this.prop.content.skin ? this.prop.content.skin[1] : '新衣服真漂亮~')
            })
            this.buttons.skin.addEventListener('mouseover', () => {
                this.RenderMessage(this.prop.content.skin ? this.prop.content.skin[0] : '想看看我的新衣服吗？')
            })
        }
    }

    private Custom() {
        this.prop.content.custom?.forEach(t => {
            let e = document.querySelectorAll(t.selector) as NodeListOf<HTMLElement>
            if (e.length) {
                for (let j = 0; j < e.length; j++) {
                    let text: string
                    if (t.type === 'read') {
                        text = `想阅读 “${e[j].innerText.substring(0, 50)}” 吗？`
                    }
                    else if (t.type === 'link') {
                        text = `想了解一下 “${(e[j].title ? e[j].title : e[j].innerText).substring(0, 50)}” 吗？`
                    }
                    else if (t.text !== undefined) {
                        text = t.text?.substring(0, 50)
                    }
                    e[j].addEventListener('mouseover', () => {
                        this.RenderMessage(text)
                    })
                }
            }
        })
    }

    private SetMode() {
        if (this.prop.mode === 'fixed') {
            this.Alternate()
            this.Menu()
            this.Touch()
        } else if (this.prop.mode === 'draggable') {
            this.Alternate()
            this.Menu()
            this.Touch()
            let body = this.current.body
            body.addEventListener('mousedown', (event) => {
                let location = {
                    x: event.clientX - body.offsetLeft,
                    y: event.clientY - body.offsetTop
                }
                let move = (event: any) => {
                    body.classList.add('active')
                    body.classList.remove('right')
                    body.style.left = `${(event.clientX - location.x)}px`
                    body.style.top = `${(event.clientY - location.x)}px`
                    body.style.bottom = 'auto'
                }
                document.addEventListener('mousemove', move)
                document.addEventListener('mouseup', () => {
                    body.classList.remove('active')
                    document.removeEventListener('mousemove', move)
                })
            })
        } else {
            this.current.body.classList.add('static')
        }
    }

    private Init() {
        this.SetMode()
        if (this.prop.content.custom) {
            this.Custom()
        }
        if (this.current.state) {
            if (this.prop.hidden === false && Pio.IsMobile()) {
                this.Welcome()
                loadlive2d('pio', this.prop.model[this.idol])
            } else if (!Pio.IsMobile()) {
                this.Welcome()
                loadlive2d('pio', this.prop.model[this.idol])
            }
        }
        else {
            this.Hide()
        }
    }

    // Compatible Paul_Pio
    public readonly init = this.Init
}

// Compatible Paul_Pio
const Paul_Pio = Pio