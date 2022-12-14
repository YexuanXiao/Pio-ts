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
        const ratio = devicePixelRatio
        canvas.width = width * ratio
        canvas.height = height * ratio
        const style = canvas.style
        style.width = `${width}px`
        style.height = `${height}px`
    }

    public SetNextIdol() {
        const next = ++this.idol
        if (next < this.prop.model.length) {
            this.idol = next
        } else {
            this.idol = 0
        }
        localStorage.setItem('pio-num', String(this.idol))
        this.Show()
    }

    private static GetString(message: SOSA) {
        let text: string
        if (typeof message === 'string') {
            text = message.trimStart()
        } else {
            const num = Math.floor(Math.random() * message.length)
            text = message[num].trimStart()
        }
        if (text.length === 0) {
            console.info('Pio.Message ????????????????????????????????????????????????')
            return '??????????????????????????????????????????'
        } else {
            return text
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
        return matchMedia('(max-width: 768px').matches
    }

    private Welcome() {
        // Referrer, check referrer exist and not this site
        const referrer = document.referrer.split('/')[2] as string | undefined
        const head1 = document.querySelector('h1')
        if (referrer !== undefined && referrer !== this.current.root) {
            this.Message(this.prop.content.referer ? (this.prop.content.referer.replace(/%t/, referrer)) : (`???????????? ${referrer} ????????????`))
        } else if (referrer === undefined) {
            this.Message(this.prop.content.welcome || `???????????? ${this.current.root}!`)
        } else if (head1 !== null) {
            this.Message(`???????????? ???${head1.textContent!.trim()}??????`)
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
                        text = '????????????????????????????????????????????????~'
                        break
                    case 1:
                        text = '???????????????????????????????????????????????????????????????'
                        break
                    case 2:
                        text = '??????????????????????????????????????????'
                        break
                    case 3:
                        text = '??????????????????????????????????????????????????????'
                        break
                    case 4:
                        text = '???????????????????????????????????????????????????'
                        break
                    case 5:
                        text = '?????????????????????????????????????????????????????????'
                        break
                    case 6:
                        text = '??????????????????????????????????????????????????????????????????????????????'
                        break
                    case 7:
                        text = '????????????????????????????????????'
                        break
                    default:
                        text = '????????????????????????????????????????????????????????????'
                }
                this.Message(text)
            }, time)
        }
    }

    private Touch() {
        this.current.canvas.addEventListener('click', () => {
            this.Message(this.prop.content.touch || ['??????????????????', '????????????????????????', 'HENTAI!', '??????????????????????????????'])
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
                    this.Message(this.prop.content.alternate || ['??????????????????', '?????????????????????????????????', '????????????????????????????????????'])
                }, time)
                time *= period
            }
        }, time)
    }

    private Menu() {
        const prop = this.prop
        const menu = this.current.menu

        // Base on arguments control show of button
        if (prop.button === undefined) prop.button = {}

        if (this.prop.model.length > 1 && prop.button.skin !== false) {
            const skin = document.createElement('span')
            skin.className = 'pio-skin'
            menu.appendChild(skin)
            const [changed, want] = prop.content.skin || ['??????????????????~', '??????????????????????????????']
            skin.addEventListener('click', () => {
                this.SetNextIdol()
                this.Message(changed)
            })
            skin.addEventListener('mouseover', () => {
                this.Message(want)
            })
        }
        if (prop.button.home !== false) {
            const home = document.createElement('span')
            home.className = 'pio-home'
            menu.appendChild(home)
            home.addEventListener('click', () => {
                location.href = this.current.root
            })
            home.addEventListener('mouseover', () => {
                this.Message(prop.content.home || '???????????????????????????')
            })
        }
        if (prop.button.totop !== false) {
            const totop = document.createElement('span')
            totop.className = 'pio-totop'
            menu.appendChild(totop)

            // Let scroll smooth
            totop.addEventListener('click', () => {
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
                this.Message('??????????????????????????????')
            })
        }
        if (prop.button.night !== false && prop.night) {
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
                this.Message('???????????????????????????????????????~')
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
                this.Message(prop.content.close || 'QWQ ???????????????~')
            })
        }
        if (prop.button.info !== false) {
            const info = document.createElement('span')
            info.className = 'pio-info'
            menu.appendChild(info)
            info.addEventListener('click', () => {
                open(prop.content.link || 'https://github.com/YexuanXiao/Pio-ts')
            })
            info.addEventListener('mouseover', () => {
                this.Message('???????????????????????????????????????')
            })
        }
    }

    private Custom() {
        if (this.prop.content.custom === undefined) return
        for (const items of this.prop.content.custom) {
            const nodes = document.querySelectorAll(items.selector) as NodeListOf<HTMLElement>
            for (const node of nodes) {
                let text = ''
                if (items.type === 'read') {
                    text = node.textContent!.trim()
                    text = text.length !== 0 ? `????????? ???${text}??? ??????` : text
                }
                else if (items.type === 'link') {
                    text = node.title.trim() || node.textContent!.trim()
                    text = text.length !== 0 ? `??????????????? ???${text}??? ??????` : text
                }
                else if (items.text !== undefined) {
                    text = items.text
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
        } else if (this.prop.mode === 'draggable' && !Pio.IsMobile()) {
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
        // Don't use window.resize beacuse mobile platforms may triggger resize freq
        // Due to auto hiding broswer elements
        let observer = new ResizeObserver(() => {
            if (this.current.state === true && Pio.IsMobile() && auto === true) {
                this.Hide()
                auto = false
            } else if (!Pio.IsMobile() && auto === false) {
                this.Show()
                auto = true
            }
        })
        const footer = document.body.querySelector('footer')
        const article = document.body.querySelector('article')
        observer.observe(footer || article || document.body)
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

console.log("%c Pio %c https://paugram.com ","color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;","margin: 1em 0; padding: 5px 0; background: #efefef;");

console.log("%c Pio-ts %c https://github.com/YexuanXiao/Pio-ts ","color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;","margin: 1em 0; padding: 5px 0; background: #efefef;");
