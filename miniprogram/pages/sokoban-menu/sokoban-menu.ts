export { }

import { LEVELS } from '../sokoban/levels'

let lastTapTime = 0
let lastTapId = 0

Component({
  data: {
    levels: [] as Array<{ id: number; cleared: boolean; locked: boolean }>,
    clearedCount: 0,
    totalCount: LEVELS.length
  },

  lifetimes: {
    attached() {
      this.refreshLevels()
    }
  },

  pageLifetimes: {
    show() {
      this.refreshLevels()
    }
  },

  methods: {
    refreshLevels() {
      const progress: Record<string, boolean> = wx.getStorageSync('sokoban_progress') || {}
      const clearedCount = Object.keys(progress).filter(k => progress[k]).length

      const levels = LEVELS.map((_, i) => {
        const id = i + 1
        const cleared = !!progress[String(id)]
        // 第一关始终解锁，其他关需要前一关已通关
        const locked = id > 1 && !progress[String(id - 1)]
        return { id, cleared, locked }
      })

      this.setData({ levels, clearedCount })
    },

    onTapLevel(e: any) {
      const id = e.currentTarget.dataset.id as number
      const locked = e.currentTarget.dataset.locked as boolean
      const now = Date.now()

      // 双击检测 (300ms内连续点击同个关卡)
      if (lastTapTime && (now - lastTapTime < 300) && lastTapId === id) {
        // 双击强行解锁进入
        wx.navigateTo({
          url: `../sokoban/sokoban?level=${id}`
        })
        lastTapTime = 0
        return
      }

      lastTapTime = now
      lastTapId = id

      if (locked) {
        return
      }
      wx.navigateTo({
        url: `../sokoban/sokoban?level=${id}`
      })
    },

    onShareAppMessage() {
      return {
        title: '推箱子 - 经典益智闯关',
        path: '/pages/sokoban-menu/sokoban-menu'
      }
    },

    onShareTimeline() {
      return {
        title: '推箱子 - 经典益智闯关',
        query: ''
      }
    }
  }
})
