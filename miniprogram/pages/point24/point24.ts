// point24.ts
interface Card {
    id: number
    value: number
    display: string
    suit: string
    visible: boolean
}

interface GameState {
    cards: Card[]
    selectedCard: number | null  // 选中的卡牌ID
    selectedOp: string | null    // 选中的运算符
    timer: number
    isPlaying: boolean
    solved: number
    total: number
    showResult: boolean
    resultSuccess: boolean
    resultMessage: string
    solution: string
    showSolution: boolean
    bestTime: number
    countdownText: string  // Ready / Go! / ''
    history: { cards: Card[], selectedCard: number | null, selectedOp: string | null }[]
}

const SUITS = ['♠', '♥', '♦', '♣']

// 预定义一些有解的牌组合
const SOLVABLE_SETS = [
    [1, 2, 3, 4], [1, 3, 4, 6], [1, 4, 5, 6], [1, 5, 5, 5],
    [2, 3, 4, 6], [2, 4, 6, 8], [3, 3, 8, 8], [1, 1, 2, 6],
    [4, 4, 4, 4], [1, 2, 7, 7], [3, 4, 5, 6], [1, 1, 8, 8],
    [2, 2, 2, 3], [1, 1, 3, 5], [2, 2, 4, 6], [3, 3, 3, 3],
    [1, 1, 1, 8], [6, 6, 6, 6], [2, 3, 5, 7], [2, 2, 6, 6],
    [1, 3, 6, 8], [2, 4, 7, 8], [1, 2, 4, 8], [3, 4, 7, 10],
    [2, 5, 6, 9], [1, 6, 8, 9], [4, 5, 7, 8], [3, 5, 8, 10],
    [5, 5, 5, 1], [2, 8, 8, 9], [1, 4, 6, 7], [3, 6, 6, 9],
    [8, 3, 8, 1], [2, 7, 8, 9], [1, 2, 6, 9], [4, 4, 7, 9],
    [3, 7, 9, 9], [2, 5, 8, 8], [4, 6, 7, 7], [5, 6, 6, 8],
]

let nextCardId = 1

Page({
    data: {
        cards: [] as Card[],
        selectedCard: null as number | null,
        selectedOp: null as string | null,
        timer: 0,
        isPlaying: false,
        solved: 0,
        total: 0,
        showResult: false,
        resultSuccess: false,
        resultMessage: '',
        solution: '',
        showSolution: false,
        bestTime: 0,
        countdownText: '',
        history: [] as any[]
    } as GameState,

    timerInterval: null as any,

    onLoad() {
        const bestTime = wx.getStorageSync('point24_best_time') || 0
        this.setData({ bestTime })
    },

    onUnload() {
        this.stopTimer()
    },

    onShareAppMessage() {
        return {
            title: `我在24点游戏中解决了${this.data.solved}题，来挑战我吧！`,
            path: '/pages/point24/point24'
        }
    },

    // 开始新游戏
    startGame() {
        this.stopTimer()
        nextCardId = 1

        // 先显示Ready
        this.setData({
            selectedCard: null,
            selectedOp: null,
            timer: 0,
            isPlaying: true,
            showResult: false,
            showSolution: false,
            solution: '',
            history: [],
            countdownText: 'Ready',
            cards: []
        })

        // 800ms后显示Go!
        setTimeout(() => {
            this.setData({ countdownText: 'Go!' })

            // 再500ms后开始游戏
            setTimeout(() => {
                this.generateCards()
                this.setData({ countdownText: '' })
                this.startTimer()
            }, 500)
        }, 800)
    },

    // 生成4张牌
    generateCards() {
        let values: number[] = []
        // 随机生成1-9的数字，直到找到有解的组合
        while (true) {
            values = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1)
            // 简单验证是否有解（这里调用findSolutions会稍微耗时，但在1-9范围内通常很快）
            if (this.findSolutions(values).length > 0) {
                break
            }
        }

        const cards: Card[] = values.map(value => ({
            id: nextCardId++,
            value,
            display: this.formatValue(value),
            suit: SUITS[Math.floor(Math.random() * 4)],
            visible: true
        }))

        this.setData({ cards, total: this.data.total + 1 })
    },

    // 格式化卡牌显示值
    formatValue(value: number): string {
        // 1-9 直接显示数字，不显示 A, J, Q, K
        if (Number.isInteger(value)) {
            return String(value)
        }
        // 小数显示
        return value % 1 === 0 ? String(value) : value.toFixed(2)
    },

    // 计时器
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.setData({ timer: this.data.timer + 1 })
        }, 1000)
    },

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval)
            this.timerInterval = null
        }
    },

    // 保存历史记录
    saveHistory() {
        const history = [...this.data.history]
        history.push({
            cards: JSON.parse(JSON.stringify(this.data.cards)),
            selectedCard: this.data.selectedCard,
            selectedOp: this.data.selectedOp
        })
        // 最多保存10步
        if (history.length > 10) history.shift()
        this.setData({ history })
    },

    // 点击卡牌
    onCardTap(e: any) {
        if (!this.data.isPlaying) return

        const cardId = e.currentTarget.dataset.id
        const card = this.data.cards.find(c => c.id === cardId && c.visible)
        if (!card) return

        const { selectedCard, selectedOp, cards } = this.data

        if (selectedCard === null) {
            // 第一次选择卡牌
            this.setData({ selectedCard: cardId })
        } else if (selectedOp === null) {
            // 已选中一张卡牌但未选运算符，点击另一张卡牌切换选择
            if (cardId !== selectedCard) {
                this.setData({ selectedCard: cardId })
            } else {
                // 取消选择
                this.setData({ selectedCard: null })
            }
        } else {
            // 已选中卡牌和运算符，现在选择第二张卡牌进行计算
            if (cardId === selectedCard) {
                // 点击同一张卡牌，取消
                this.setData({ selectedCard: null, selectedOp: null })
                return
            }

            // 保存历史
            this.saveHistory()

            const card1 = cards.find(c => c.id === selectedCard)
            const card2 = card
            if (!card1 || !card2) return

            // 计算结果
            let result: number
            switch (selectedOp) {
                case '+': result = card1.value + card2.value; break
                case '-': result = card1.value - card2.value; break
                case '*': result = card1.value * card2.value; break
                case '/': result = card1.value / card2.value; break
                default: return
            }

            // 隐藏两张原卡牌，创建一张新卡牌
            const newCards = cards.map(c => {
                if (c.id === card1.id || c.id === card2.id) {
                    return { ...c, visible: false }
                }
                return c
            })

            // 添加结果卡牌
            const newCard: Card = {
                id: nextCardId++,
                value: result,
                display: this.formatValue(result),
                suit: '★',  // 计算结果用星号
                visible: true
            }
            newCards.push(newCard)

            this.setData({
                cards: newCards,
                selectedCard: null,
                selectedOp: null
            })

            // 检查游戏状态
            this.checkGameStatus(newCards)
        }
    },

    // 点击运算符
    onOperatorTap(e: any) {
        if (!this.data.isPlaying) return
        if (this.data.selectedCard === null) {
            wx.showToast({ title: '请先选择一张牌', icon: 'none' })
            return
        }

        const op = e.currentTarget.dataset.op
        this.setData({ selectedOp: op })
    },

    // 检查游戏状态
    checkGameStatus(cards: Card[]) {
        const visibleCards = cards.filter(c => c.visible)

        if (visibleCards.length === 1) {
            const finalValue = visibleCards[0].value
            this.stopTimer()

            if (Math.abs(finalValue - 24) < 0.0001) {
                // 成功！
                const time = this.data.timer
                let bestTime = this.data.bestTime

                if (bestTime === 0 || time < bestTime) {
                    bestTime = time
                    wx.setStorageSync('point24_best_time', bestTime)
                }

                this.setData({
                    showResult: true,
                    resultSuccess: true,
                    resultMessage: `太棒了！用时 ${time} 秒`,
                    solved: this.data.solved + 1,
                    isPlaying: false,
                    bestTime
                })
            } else {
                // 失败
                this.setData({
                    showResult: true,
                    resultSuccess: false,
                    resultMessage: `结果是 ${this.formatValue(finalValue)}，不是24`,
                    isPlaying: false
                })
            }
        }
    },

    // 撤销上一步
    onUndo() {
        if (!this.data.isPlaying) return
        const history = [...this.data.history]
        if (history.length === 0) {
            wx.showToast({ title: '没有可撤销的操作', icon: 'none' })
            return
        }

        const lastState = history.pop()
        if (!lastState) return

        this.setData({
            cards: lastState.cards,
            selectedCard: lastState.selectedCard,
            selectedOp: lastState.selectedOp,
            history
        })
    },

    // 重置当前题目
    onReset() {
        if (!this.data.isPlaying) return
        const history = this.data.history
        if (history.length === 0) return

        // 恢复到第一步
        const firstState = history[0]
        this.setData({
            cards: firstState.cards,
            selectedCard: null,
            selectedOp: null,
            history: []
        })
    },

    // 显示提示
    onShowHint() {
        if (!this.data.isPlaying) return

        // 获取当前可见的卡牌值
        const visibleCards = this.data.cards.filter(c => c.visible)
        const values = visibleCards.map(c => c.value)

        const solutions = this.findSolutions(values)
        if (solutions.length > 0) {
            this.setData({
                showSolution: true,
                solution: solutions[0]
            })
        } else {
            wx.showToast({ title: '当前状态无解', icon: 'none' })
        }
    },

    // 隐藏提示
    onHideHint() {
        this.setData({ showSolution: false })
    },

    // 24点求解算法
    findSolutions(nums: number[]): string[] {
        if (nums.length === 1) {
            return Math.abs(nums[0] - 24) < 0.0001 ? [String(nums[0])] : []
        }

        const solutions: string[] = []
        const ops = ['+', '-', '*', '/']

        // 生成所有数字排列
        const permute = (arr: number[]): number[][] => {
            if (arr.length <= 1) return [arr]
            const result: number[][] = []
            for (let i = 0; i < arr.length; i++) {
                const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
                for (const p of permute(rest)) {
                    result.push([arr[i], ...p])
                }
            }
            return result
        }

        if (nums.length === 4) {
            const permutations = permute(nums)

            for (const perm of permutations) {
                const [a, b, c, d] = perm

                for (const op1 of ops) {
                    for (const op2 of ops) {
                        for (const op3 of ops) {
                            const expressions = [
                                `((${a}${op1}${b})${op2}${c})${op3}${d}`,
                                `(${a}${op1}(${b}${op2}${c}))${op3}${d}`,
                                `(${a}${op1}${b})${op2}(${c}${op3}${d})`,
                                `${a}${op1}((${b}${op2}${c})${op3}${d})`,
                                `${a}${op1}(${b}${op2}(${c}${op3}${d}))`
                            ]

                            for (const expr of expressions) {
                                try {
                                    const result = this.parseAndEval(expr)
                                    if (Math.abs(result - 24) < 0.0001) {
                                        if (!solutions.includes(expr)) {
                                            solutions.push(expr)
                                            if (solutions.length >= 3) return solutions
                                        }
                                    }
                                } catch {
                                    // 忽略
                                }
                            }
                        }
                    }
                }
            }
        }

        return solutions
    },

    // 安全的表达式解析和计算
    parseAndEval(expr: string): number {
        let pos = 0

        const parseNumber = (): number => {
            let numStr = ''
            // 处理负号
            if (expr[pos] === '-') {
                numStr += '-'
                pos++
            }
            while (pos < expr.length && /[\d.]/.test(expr[pos])) {
                numStr += expr[pos]
                pos++
            }
            return parseFloat(numStr)
        }

        const parseFactor = (): number => {
            if (expr[pos] === '(') {
                pos++
                const result = parseExpr()
                pos++
                return result
            }
            return parseNumber()
        }

        const parseTerm = (): number => {
            let result = parseFactor()
            while (pos < expr.length && (expr[pos] === '*' || expr[pos] === '/')) {
                const op = expr[pos]
                pos++
                const next = parseFactor()
                if (op === '*') {
                    result *= next
                } else {
                    result /= next
                }
            }
            return result
        }

        const parseExpr = (): number => {
            let result = parseTerm()
            while (pos < expr.length && (expr[pos] === '+' || expr[pos] === '-')) {
                const op = expr[pos]
                pos++
                const next = parseTerm()
                if (op === '+') {
                    result += next
                } else {
                    result -= next
                }
            }
            return result
        }

        return parseExpr()
    },

    // 关闭结果弹窗
    onCloseResult() {
        this.setData({ showResult: false })
    },

    // 返回
    goBack() {
        wx.navigateBack()
    }
})
