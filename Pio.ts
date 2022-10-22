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
type ButtonNames = 'home' | 'skin' | 'info' | 'night' | 'close' | 'totop'
type Buttons = {
    [Type in ButtonNames]+?: bool
}
type Argument = {
    mode: string
    hidden?: bool
    content: Content
    night?: string | (() => void)
    model: SOSA
    tips?: bool
    button?: Buttons
}
type Current = {
    state: bool
    menu: HTMLElement
    canvas: HTMLCanvasElement
    body: HTMLElement
    root: string
}

// Declare loadlive2d
declare function loadlive2d(canvas_id: string, model_link: string): void

// Main Class
class Pio {
    private idol: number
    private current: Current
    private timer: number | undefined
    private readonly prop: Argument
    private readonly dialog: HTMLElement

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

        // Get and set current
        const body = document.querySelector('.pio-container')
        const menu = document.querySelector('.pio-container .pio-action')

        // id=pio for loadlive2d use
        const canvas = document.getElementById('pio')

        if (!menu || !canvas || !body)
            throw new Error("Pio Elements don't exist!")

        const state = localStorage.getItem('pio-state') === 'false'
        this.current = {
            state: state ? false : true,
            menu: menu as HTMLElement,
            canvas: canvas as HTMLCanvasElement,
            body: body as HTMLElement,
            root: document.location.hostname
        }

        // Let this.current.state and localStorage.pio-state exist
        localStorage.setItem('pio-state', String(this.current.state))

        // Dialog
        this.dialog = document.createElement('div')
        this.dialog.className = 'pio-dialog'
        body.appendChild(this.dialog)

        // Before this, prepare necessary HTML members and elements
        // Then, do other stuff about initialization
        this.Init()
    }

    // Helper function to create preconsition
    static CreateContainerToBody(width: number, height: number) {
        const container = document.createElement('div')
        container.className = 'pio-container left'
        document.body.appendChild(container)
        const menu = document.createElement('div')
        menu.classList.add('pio-action')
        container.appendChild(menu)
        const canvas = document.createElement('canvas')
        canvas.id = 'pio'

        // Node must insert before get the actual width and height
        container.appendChild(canvas)

        // Let canvas adapt DPI scale
        const ratio = window.devicePixelRatio
        canvas.width = width * ratio
        canvas.height = height * ratio
        const style = canvas.style
        style.transform = `scale(${1 / ratio})`
        style.transformOrigin = 'right top'
        style.marginBottom = `-${canvas.offsetHeight * (1 - 1 / ratio)}px`
        style.marginLeft = `-${canvas.offsetWidth * (1 - 1 / ratio)}px`
    }

    private SetNextIdol() {
        const next = ++this.idol
        if (next < this.prop.model.length) {
            this.idol = next
        } else {
            this.idol = 0
        }
        localStorage.setItem('pio-num', String(this.idol))
    }

    private static GetString(message: SOSA) {
        if (typeof message === 'string') {
            return message
        } else {
            const num = Math.floor(Math.random() * message.length)
            return message[num]
        }
    }

    // Send Message, default times: [10, 20]s
    public Message(message: SOSA, time: number = (Math.floor(10 + Math.random() * (20 - 10 + 1)) * 1000)) {
        this.dialog.textContent = Pio.GetString(message)
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
        const current = this.current

        // Anti-this.Show
        current.body.classList.add('hidden')
        current.state = false
        localStorage.setItem('pio-state', 'false')

        // Add the Show button
        const show = document.createElement('div')
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
        // Referrer, check referrer exist and not this site
        const referrer = document.referrer.split('/')[2] as string | undefined
        if (referrer !== undefined && referrer !== this.current.root) {
            this.Message(this.prop.content.referer ? (this.prop.content.referer.replace(/%t/, referrer)) : (`欢迎来自 ${referrer} 的朋友！`))
        } else if(referrer === undefined) {
            this.Message(this.prop.content.welcome || `欢迎来到 ${this.current.root}!`)
        }

        // Randomly display time tips within 10 seconds after Referer
        if (this.prop.tips) {
            const time = Math.floor(Math.random() * 10 + 25) * 1000
            setTimeout(() => {
                const date = new Date()
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
                        text = '发生了不可能发生的事呢！你生活在火星吗？'
                }
                this.Message(text)
            }, time)
        }
    }

    private Touch() {
        this.current.canvas.addEventListener('click', () => {
            this.Message(this.prop.content.touch || ['你在干什么？', '再摸我就报警了！', 'HENTAI!', '不可以这样欺负我啦！'])
        })
    }

    private Alternate() {
        if (this.prop.tips === undefined) return

        // Initially start after 2 minutes, increasing 1.5 times each time
        // Try add message every 2 minutes
        // Or if previous hasn't occurred, do nothing
        const period = 1.5
        // Delay time before display
        let time = 2 * 60 * 1000
        // Previous end time
        let previous = new Date()
        setInterval(() => {
            const now = new Date()
            if (now > previous) {
                // Show message after time 
                previous = new Date(now.getTime() + time)
                setTimeout(() => {
                    this.Message(this.prop.content.alternate || ['打起精神来！', '要不要坐下来喝杯咖啡？', '无聊的时候试试读一本书？'])
                }, time)
                time *= period
            }
        }, time)
    }

    private Menu() {
        const prop = this.prop
        const menu = this.current.menu

        // Skin button don't care prop.buttom switch
        if (this.prop.model.length > 1) {
            const skin = document.createElement('span')
            skin.className = 'pio-skin'
            menu.appendChild(skin)
            skin.addEventListener('click', () => {
                this.SetNextIdol()
                loadlive2d('pio', prop.model[this.idol])
                this.Message(prop.content.skin ? prop.content.skin[1] : '新衣服真漂亮~')
            })
            skin.addEventListener('mouseover', () => {
                this.Message(prop.content.skin ? prop.content.skin[0] : '想看看我的新衣服吗？')
            })
        }

        // Base on arguments control show of button
        if (prop.button === undefined) return
        if (prop.button.home !== false) {
            const home = document.createElement('span')
            home.className = 'pio-home'
            menu.appendChild(home)
            home.addEventListener('click', () => {
                location.href = this.current.root
            })
            home.addEventListener('mouseover', () => {
                this.Message(prop.content.home || '点击这里回到首页！')
            })
        }
        if (prop.button.totop !== false) {
            const totop = document.createElement('span')
            totop.className = 'pio-totop'
            menu.appendChild(totop)
            totop.addEventListener('click', () => {
                // Let scroll smooth
                const element = document.querySelector('html') as HTMLElement
                const pre_behave = element.style.scrollBehavior
                let current = document.body.style.scrollBehavior
                element.style.scrollBehavior = 'smooth'
                current = ''
                document.documentElement.scrollTop = document.body.scrollTop = 0
                element.style.scrollBehavior = pre_behave
                document.body.style.scrollBehavior = current
            })
            totop.addEventListener('mouseover', () => {
                this.Message('点击这里滚动到顶部！')
            })
        }
        if (prop.button.night !== null) {
            const night = document.createElement('span')
            night.className = 'pio-night'
            menu.appendChild(night)
            night.addEventListener('click', () => {
                if (typeof prop.night === 'function') {
                    prop.night()
                }
                else {
                    new Function('return ' + prop.night)();
                }
            })
            night.addEventListener('mouseover', () => {
                this.Message('夜间点击这里可以保护眼睛呢')
            })
        }
        if (prop.button.close !== false) {
            const close = document.createElement('span')
            close.className = 'pio-close'
            menu.appendChild(close!)
            close.addEventListener('click', () => {
                this.Hide()
            })
            close.addEventListener('mouseover', () => {
                this.Message(prop.content.close || 'QWQ 下次再见吧~')
            })
        }
        if (prop.button.info !== false) {
            const info = document.createElement('span')
            info.className = 'pio-info'
            menu.appendChild(info)
            info.addEventListener('click', () => {
                window.open(prop.content.link || 'https://github.com/YexuanXiao/Pio-ts')
            })
            info.addEventListener('mouseover', () => {
                this.Message('想了解更多关于我的信息吗？')
            })
        }
    }

    private Custom() {
        if (this.prop.content.custom === undefined) return
        for (const items of this.prop.content.custom) {
            const nodes = document.querySelectorAll(items.selector) as NodeListOf<HTMLElement>
            for (const node of nodes) {
                let text: string
                if (items.type === 'read') {
                    text = `想阅读 “${node.innerText.substring(0, 50)}” 吗？`
                }
                else if (items.type === 'link') {
                    text = `想了解一下 “${(node.title ? node.title : node.innerText).substring(0, 50)}” 吗？`
                }
                else if (items.text !== undefined) {
                    text = items.text.substring(0, 50)
                }
                node.addEventListener('mouseover', () => {
                    this.Message(text)
                })
            }
        }
    }

    private SetMode() {
        if (this.prop.mode === 'fixed') {
            this.Alternate()
            this.Menu()
            this.Touch()
        } else if (this.prop.mode === 'draggable' && Pio.IsMobile()) {
            this.Alternate()
            this.Menu()
            this.Touch()

            // Let Pio draggable
            const body = this.current.body
            body.addEventListener('mousedown', (event) => {
                const location = {
                    x: event.clientX - body.offsetLeft,
                    y: event.clientY - body.offsetTop
                }
                const move = (event: MouseEvent) => {
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

    // When resize window cause IsMobile == true, close Pio
    // Then, when cause IsMobile == false, reshow it 
    private Listen() {
        let auto = true
        window.addEventListener('resize', () => {
            if (this.current.state === true && Pio.IsMobile() && auto === true) {
                this.Hide()
                auto = false
            } else if (!Pio.IsMobile() && auto === false) {
                this.Show()
                auto = true
            }
        })
    }

    public Init() {
        this.SetMode()
        this.Custom()
        this.Listen()

        // Check state, constructor guarantees state exist
        // Branch for manually closed
        if (this.current.state === false) {
            this.Hide()
            return
        }

        // Branch for default state
        const mobile = Pio.IsMobile()
        if (!mobile) {
            // Branch for desktop and tablet
            this.Welcome()
            loadlive2d('pio', this.prop.model[this.idol])
            return
        } else if (this.prop.hidden === false && mobile) {
            // Branch for mobile and hidden: false
            this.Welcome()
            loadlive2d('pio', this.prop.model[this.idol])
            return
        }

        // Mobile default
        this.Hide()
    }

    // Compatible Paul_Pio
    public readonly init = this.Init
    public readonly message = this.Message
}

// Compatible Paul_Pio
const Paul_Pio = Pio