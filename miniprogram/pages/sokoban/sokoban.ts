export { }

/**
 * 推箱子游戏
 * 地图元素:
 *   0 = 空(墙外)
 *   1 = 墙
 *   2 = 地板
 *   3 = 目标点
 *   4 = 箱子(在地板上)
 *   5 = 箱子在目标点上
 *   6 = 玩家(在地板上)
 *   7 = 玩家在目标点上
 */

// 30个经典推箱子关卡
const LEVELS: number[][][] = [
  // 第1关
  [
    [1,1,1,1],
    [1,2,3,1],
    [1,2,2,1,1,1],
    [1,5,6,2,2,1],
    [1,2,2,4,2,1],
    [1,2,2,1,1,1],
    [1,1,1,1],
  ],
  // 第2关
  [
    [1,1,1,1,1,1],
    [1,2,2,2,2,1],
    [1,2,1,6,2,1],
    [1,2,4,5,2,1],
    [1,2,3,5,2,1],
    [1,2,2,2,2,1],
    [1,1,1,1,1,1],
  ],
  // 第3关
  [
    [0,0,1,1,1,1],
    [1,1,1,2,2,1,1,1,1],
    [1,2,2,2,2,2,4,2,1],
    [1,2,1,2,2,1,4,2,1],
    [1,2,3,2,3,1,6,2,1],
    [1,1,1,1,1,1,1,1,1],
  ],
  // 第4关
  [
    [1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,1],
    [1,2,3,5,5,4,6,1],
    [1,2,2,2,2,2,2,1],
    [1,1,1,1,1,2,2,1],
    [0,0,0,0,1,1,1,1],
  ],
  // 第5关
  [
    [0,1,1,1,1,1,1,1],
    [0,1,2,2,2,2,2,1],
    [0,1,2,3,4,3,2,1],
    [1,1,2,4,6,4,2,1],
    [1,2,2,3,4,3,2,1],
    [1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1],
  ],
  // 第6关
  [
    [1,1,1,1,1,1,0,1,1,1,1,1],
    [1,2,2,2,2,1,1,1,2,2,2,1],
    [1,2,4,4,2,2,2,2,2,1,6,1],
    [1,2,4,2,1,3,3,3,2,2,2,1],
    [1,2,2,2,1,1,1,1,1,1,1,1],
    [1,1,1,1,1],
  ],
  // 第7关
  [
    [1,1,1,1,1,1,1],
    [1,2,2,2,2,2,1],
    [1,2,3,4,3,2,1],
    [1,2,4,3,4,2,1],
    [1,2,3,4,3,2,1],
    [1,2,4,3,4,2,1],
    [1,2,2,6,2,2,1],
    [1,1,1,1,1,1,1],
  ],
  // 第8关
  [
    [0,0,1,1,1,1,1,1],
    [0,0,1,2,3,3,6,1],
    [0,0,1,2,4,4,2,1],
    [0,0,1,1,2,1,1,1],
    [0,0,0,1,2,1],
    [0,0,0,1,2,1],
    [1,1,1,1,2,1],
    [1,2,2,2,2,1,1],
    [1,2,1,2,2,2,1],
    [1,2,2,2,1,2,1],
    [1,1,1,2,2,2,1],
    [0,0,1,1,1,1,1],
  ],
  // 第9关
  [
    [1,1,1,1,1],
    [1,3,2,2,1,1],
    [1,6,4,4,2,1],
    [1,1,2,2,2,1],
    [0,1,1,2,2,1],
    [0,0,1,1,3,1],
    [0,0,0,1,1,1],
  ],
  // 第10关
  [
    [0,0,0,0,0,0,1,1,1,1,1],
    [0,0,0,0,0,0,1,3,2,2,1],
    [0,0,0,0,0,0,1,3,1,2,1],
    [1,1,1,1,1,1,1,3,1,2,1],
    [1,2,6,2,4,2,4,2,4,2,1],
    [1,2,1,2,1,2,1,2,1,1,1],
    [1,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1],
  ],
  // 第11关
  [
    [0,0,1,1,1,1,1,1],
    [0,0,1,2,2,2,2,1],
    [0,0,1,2,1,1,6,1,1],
    [1,1,1,2,1,2,4,2,1],
    [1,2,3,3,1,2,4,2,1],
    [1,2,2,2,2,2,2,2,1],
    [1,2,2,1,1,1,1,1,1],
    [1,1,1,1],
  ],
  // 第12关
  [
    [1,1,1,1,1],
    [1,2,2,2,1,1],
    [1,2,4,2,2,1],
    [1,1,2,4,2,1,1,1,1],
    [0,1,1,1,6,3,2,2,1],
    [0,0,1,2,2,3,1,2,1],
    [0,0,1,2,2,2,2,2,1],
    [0,0,1,1,1,1,1,1,1],
  ],
  // 第13关
  [
    [1,1,1,1],
    [1,3,2,1,1],
    [1,3,6,2,1],
    [1,3,2,4,1],
    [1,1,4,2,1,1,1],
    [0,1,2,4,2,2,1],
    [0,1,2,2,2,2,1],
    [0,1,2,2,1,1,1],
    [0,1,1,1,1],
  ],
  // 第14关
  [
    [1,1,1,1,1,1,1],
    [1,2,2,2,2,2,1],
    [1,2,1,2,1,2,1],
    [1,3,2,4,5,6,1],
    [1,2,2,2,1,1,1],
    [1,1,1,1,1],
  ],
  // 第15关
  [
    [0,0,0,0,0,1,1,1],
    [1,1,1,1,1,1,6,1,1],
    [1,2,2,2,2,3,5,2,1],
    [1,2,2,2,1,2,2,2,1],
    [1,1,1,1,1,4,1,2,1],
    [0,0,0,0,1,2,2,2,1],
    [0,0,0,0,1,1,1,1,1],
  ],
  // 第16关
  [
    [0,1,1,1,1],
    [0,1,2,2,1,1,1,1],
    [0,1,2,2,2,2,2,1,1],
    [1,1,2,1,1,2,2,2,1],
    [1,3,2,3,1,2,6,4,1,1],
    [1,2,2,2,1,2,4,4,2,1],
    [1,2,2,3,1,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1],
  ],
  // 第17关
  [
    [1,1,1,1,1],
    [1,2,6,2,1],
    [1,3,3,3,1],
    [1,4,4,4,1,1],
    [1,2,2,2,2,1],
    [1,2,2,2,2,1],
    [1,1,1,1,1,1],
  ],
  // 第18关
  [
    [1,1,1,1,1,1,1],
    [1,2,2,2,2,2,1],
    [1,3,2,3,2,2,1],
    [1,2,1,1,2,1,1],
    [1,2,2,4,2,1],
    [1,1,1,4,2,1],
    [0,0,1,6,2,1],
    [0,0,1,2,2,1],
    [0,0,1,1,1,1],
  ],
  // 第19关
  [
    [1,1,1,1,1,1,1,1],
    [1,2,2,2,3,3,2,1],
    [1,2,2,6,4,4,2,1],
    [1,1,1,1,1,2,1,1],
    [0,0,0,1,2,2,1],
    [0,0,0,1,2,2,1],
    [0,0,0,1,2,2,1],
    [0,0,0,1,1,1,1],
  ],
  // 第20关
  [
    [1,1,1,1,1,1,1],
    [1,2,2,2,2,2,1,1,1],
    [1,2,2,6,4,4,3,3,1],
    [1,1,1,1,2,1,1,2,1],
    [0,0,1,2,2,2,2,2,1],
    [0,0,1,2,2,1,1,1,1],
    [0,0,1,2,2,1],
    [0,0,1,1,1,1],
  ],
  // 第21关
  [
    [1,1,1,1],
    [1,2,2,1,1,1,1],
    [1,2,3,2,3,2,1],
    [1,2,4,4,1,6,1],
    [1,1,2,2,2,2,1],
    [0,1,1,1,1,1,1],
  ],
  // 第22关
  [
    [1,1,1,1,1],
    [1,2,2,2,1,1,1],
    [1,3,2,3,2,2,1],
    [1,2,2,2,1,2,1],
    [1,1,2,1,2,2,1],
    [0,1,6,4,4,2,1],
    [0,1,2,2,2,2,1],
    [0,1,2,2,1,1,1],
    [0,1,1,1,1],
  ],
  // 第23关
  [
    [1,1,1,1,1,1,1],
    [1,2,2,5,2,2,1],
    [1,2,2,2,2,2,1],
    [1,1,2,1,2,1,1],
    [0,1,4,6,3,1],
    [0,1,2,2,2,1],
    [0,1,1,1,1,1],
  ],
  // 第24关
  [
    [1,0,1,1,1,1,1],
    [0,0,1,2,2,2,1],
    [1,1,1,4,4,6,1],
    [1,2,2,2,1,1,1],
    [1,2,2,2,2,2,1],
    [1,2,3,2,3,2,1],
    [1,1,1,1,1,1,1],
  ],
  // 第25关
  [
    [0,1,1,1,1],
    [0,1,2,2,1,1,1],
    [0,1,2,4,4,2,1],
    [1,1,3,3,3,2,1],
    [1,2,2,6,4,2,1],
    [1,2,2,2,1,1,1],
    [1,1,1,1,1],
  ],
  // 第26关
  [
    [0,1,1,1,1,1],
    [0,1,2,6,2,1],
    [0,1,2,2,2,1],
    [1,1,1,4,2,1],
    [1,2,3,3,3,1],
    [1,2,4,4,2,1],
    [1,1,1,2,2,1],
    [0,0,1,1,1,1],
  ],
  // 第27关
  [
    [1,1,1,1,1,1],
    [1,2,2,2,3,1],
    [1,2,1,1,2,1,1],
    [1,2,2,4,4,6,1],
    [1,2,1,2,2,2,1],
    [1,3,2,2,1,1,1],
    [1,1,1,1,1],
  ],
  // 第28关
  [
    [1,1,1,1,1],
    [1,2,2,2,1],
    [1,2,6,2,1],
    [1,2,4,4,1,1,1],
    [1,1,3,2,3,2,1],
    [0,1,2,2,2,2,1],
    [0,1,1,1,1,1,1],
  ],
  // 第29关
  [
    [0,0,0,0,0,1,1,1,1,1],
    [0,0,0,0,0,1,2,2,2,1,1],
    [0,0,0,0,0,1,2,2,2,2,1],
    [0,1,1,1,1,1,1,2,2,2,1],
    [1,1,2,2,2,2,2,1,3,2,1],
    [1,2,4,2,4,2,6,2,2,1,1],
    [1,2,1,1,1,1,1,1,3,1],
    [1,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1],
  ],
  // 第30关
  [
    [1,1,1,1],
    [1,2,2,1,1,1],
    [1,2,4,4,2,1],
    [1,3,3,3,2,1],
    [1,2,6,4,2,1],
    [1,2,2,2,1,1],
    [1,1,1,1,1],
  ],
]

interface MoveRecord {
  playerRow: number
  playerCol: number
  movedBox: boolean
  boxFromRow: number
  boxFromCol: number
  boxToRow: number
  boxToCol: number
  prevMap: number[][]
}

Page({
  data: {
    level: 1,
    map: [] as number[][],
    steps: 0,
    showWin: false,
    isLastLevel: false,
    cellSize: 0,
    gridWidth: 0,
    gridHeight: 0,
  },

  // 非响应式内部状态
  history: [] as MoveRecord[],
  playerRow: 0,
  playerCol: 0,
  touchStartX: 0,
  touchStartY: 0,
  isMoving: false,
  lastTapTime: 0,
  lastTapRow: -1,
  lastTapCol: -1,
  stopAutoMove: false,

  onLoad(options: any) {
    const level = parseInt(options.level) || 1
    this.setData({ level, isLastLevel: level >= LEVELS.length })
    this.initLevel(level)
  },

  initLevel(level: number) {
    const levelData = LEVELS[level - 1]
    if (!levelData) return

    // 深拷贝地图
    const map = levelData.map(row => [...row])

    // 找到玩家位置
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        if (map[r][c] === 6 || map[r][c] === 7) {
          this.playerRow = r
          this.playerCol = c
        }
      }
    }

    this.history = []

    // 计算格子大小 - 适应屏幕
    const sysInfo = wx.getSystemInfoSync()
    const maxGridAreaWidth = sysInfo.windowWidth * 0.92
    const maxGridAreaHeight = sysInfo.windowHeight * 0.78
    const cols = Math.max(...map.map(r => r.length))
    const rows = map.length
    const cellSize = Math.floor(Math.min(maxGridAreaWidth / cols, maxGridAreaHeight / rows))

    this.setData({
      map,
      steps: 0,
      showWin: false,
      cellSize,
      gridWidth: cellSize * cols,
      gridHeight: cellSize * rows,
    })
  },

  // 获取格子类型名
  getCellClass(type: number): string {
    switch (type) {
      case 0: return 'empty'
      case 1: return 'wall'
      case 2: return 'floor'
      case 3: return 'target'
      case 4: return 'box'
      case 5: return 'box-on-target'
      case 6: return 'player'
      case 7: return 'player-on-target'
      default: return 'empty'
    }
  },

  movePlayer(dr: number, dc: number) {
    if (this.isMoving || this.data.showWin) return
    this.isMoving = true

    const map = this.data.map.map(row => [...row])
    const pr = this.playerRow
    const pc = this.playerCol
    const nr = pr + dr
    const nc = pc + dc

    // 边界检查
    if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[nr].length) {
      this.isMoving = false
      return
    }

    const target = map[nr][nc]

    // 目标是墙或空
    if (target === 0 || target === 1) {
      this.isMoving = false
      return
    }

    let movedBox = false
    let boxFromRow = 0, boxFromCol = 0, boxToRow = 0, boxToCol = 0

    // 目标是箱子
    if (target === 4 || target === 5) {
      const bnr = nr + dr
      const bnc = nc + dc
      // 箱子后面必须可通行
      if (bnr < 0 || bnr >= map.length || bnc < 0 || bnc >= map[bnr].length) {
        this.isMoving = false
        return
      }
      const behind = map[bnr][bnc]
      if (behind !== 2 && behind !== 3) {
        this.isMoving = false
        return
      }
      // 移动箱子
      movedBox = true
      boxFromRow = nr; boxFromCol = nc
      boxToRow = bnr; boxToCol = bnc
      map[bnr][bnc] = behind === 3 ? 5 : 4
      map[nr][nc] = target === 5 ? 3 : 2
    }

    // 保存历史
    const prevMap = this.data.map.map(row => [...row])
    this.history.push({
      playerRow: pr, playerCol: pc,
      movedBox, boxFromRow, boxFromCol, boxToRow, boxToCol,
      prevMap,
    })

    // 移动玩家
    const currentCell = map[pr][pc]
    map[pr][pc] = (currentCell === 7) ? 3 : 2
    const destCell = map[nr][nc]
    map[nr][nc] = (destCell === 3) ? 7 : 6

    this.playerRow = nr
    this.playerCol = nc

    const steps = this.data.steps + 1
    this.setData({ map, steps })

    // 检查胜利
    if (this.checkWin(map)) {
      this.onWin()
    }

    setTimeout(() => { this.isMoving = false }, 50)
  },

  checkWin(map: number[][]): boolean {
    for (const row of map) {
      for (const cell of row) {
        if (cell === 3 || cell === 7) return false // 还有未覆盖的目标点
      }
    }
    return true
  },

  onWin() {
    // 保存进度
    const progress: Record<string, boolean> = wx.getStorageSync('sokoban_progress') || {}
    progress[String(this.data.level)] = true
    wx.setStorageSync('sokoban_progress', progress)

    setTimeout(() => {
      this.setData({ showWin: true })
      wx.vibrateShort({ type: 'heavy' })
    }, 300)
  },

  // 撤销
  onUndo() {
    if (this.history.length === 0) return
    const record = this.history.pop()!
    this.playerRow = record.playerRow
    this.playerCol = record.playerCol
    this.setData({
      map: record.prevMap,
      steps: this.data.steps - 1,
    })
  },

  // 重置
  onReset() {
    this.initLevel(this.data.level)
  },

  // 下一关
  onNextLevel() {
    const nextLevel = this.data.level + 1
    if (nextLevel > LEVELS.length) return
    this.setData({
      level: nextLevel,
      isLastLevel: nextLevel >= LEVELS.length,
    })
    this.initLevel(nextLevel)
  },

  // 返回关卡选择
  onBackToMenu() {
    wx.navigateBack()
  },

  onCellTap(e: any) {
    const row = e.currentTarget.dataset.row
    const col = e.currentTarget.dataset.col
    const now = Date.now()
    
    // 双击判定时间为 300ms 且同一点
    if (now - this.lastTapTime < 300 && this.lastTapRow === row && this.lastTapCol === col) {
      this.autoMoveTo(row, col)
      this.lastTapTime = 0
    } else {
      this.lastTapTime = now
      this.lastTapRow = row
      this.lastTapCol = col
    }
  },

  autoMoveTo(targetRow: number, targetCol: number) {
    const targetCell = this.data.map[targetRow]?.[targetCol]
    // 目标如果是墙或者箱外等不可直接走到之地
    // 可走到之地只能是地板(2), 目标点(3), 玩家当前点(6,7)
    if (targetCell !== 2 && targetCell !== 3 && targetCell !== 6 && targetCell !== 7) return
    
    // 寻路
    const path = this.findPath(this.playerRow, this.playerCol, targetRow, targetCol)
    if (!path || path.length === 0) return
    
    this.stopAutoMove = false
    this.executeAutoMove(path)
  },

  findPath(startRow: number, startCol: number, targetRow: number, targetCol: number): {dr: number, dc: number}[] | null {
    const map = this.data.map
    const rows = map.length
    if (rows === 0) return null
    const cols = Math.max(...map.map(r => r.length))
    
    const queue: {r: number, c: number, path: {dr: number, dc: number}[]}[] = []
    const visited: boolean[][] = Array.from({length: rows}, () => Array(cols).fill(false))
    
    queue.push({r: startRow, c: startCol, path: []})
    visited[startRow][startCol] = true
    
    const dirs = [
      {dr: -1, dc: 0},
      {dr: 1, dc: 0},
      {dr: 0, dc: -1},
      {dr: 0, dc: 1}
    ]
    
    while (queue.length > 0) {
      const {r, c, path} = queue.shift()!
      
      if (r === targetRow && c === targetCol) {
        return path
      }
      
      for (const dir of dirs) {
        const nr = r + dir.dr
        const nc = c + dir.dc
        
        if (nr >= 0 && nr < rows && nc >= 0 && nc < map[nr].length) {
          if (!visited[nr][nc]) {
            const cell = map[nr][nc]
            if (cell === 2 || cell === 3 || cell === 6 || cell === 7) {
              visited[nr][nc] = true
              queue.push({r: nr, c: nc, path: [...path, dir]})
            }
          }
        }
      }
    }
    return null
  },

  executeAutoMove(path: {dr: number, dc: number}[]) {
    if (path.length === 0 || this.data.showWin || this.stopAutoMove) return

    // 如果正好处于动画锁定状态，稍后重试
    if (this.isMoving) {
      setTimeout(() => {
        this.executeAutoMove(path)
      }, 20)
      return
    }
    
    const step = path.shift()!
    this.movePlayer(step.dr, step.dc)
    
    setTimeout(() => {
      this.executeAutoMove(path)
    }, 60)
  },

  // 手势操作
  onTouchStart(e: any) {
    this.stopAutoMove = true
    const touch = e.touches[0]
    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
  },

  onTouchEnd(e: any) {
    const touch = e.changedTouches[0]
    const dx = touch.clientX - this.touchStartX
    const dy = touch.clientY - this.touchStartY
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    // 最小滑动距离
    if (Math.max(absDx, absDy) < 20) return

    if (absDx > absDy) {
      // 水平滑动
      this.movePlayer(0, dx > 0 ? 1 : -1)
    } else {
      // 垂直滑动
      this.movePlayer(dy > 0 ? 1 : -1, 0)
    }
  },

  onShareAppMessage() {
    return {
      title: `推箱子 - 第${this.data.level}关`,
      path: '/pages/sokoban-menu/sokoban-menu'
    }
  },

  onShareTimeline() {
    return {
      title: `推箱子 - 第${this.data.level}关`,
      query: ''
    }
  },
})
