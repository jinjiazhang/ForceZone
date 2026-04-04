export { }

// 关卡元数据
const LEVEL_META: Array<{ stars: number; name: string }> = [
  // 入门（1-10）
  { stars: 1, name: '初识' },
  { stars: 1, name: '小试' },
  { stars: 1, name: '起步' },
  { stars: 1, name: '入门' },
  { stars: 1, name: '热身' },
  { stars: 1, name: '简单' },
  { stars: 2, name: '前进' },
  { stars: 2, name: '转角' },
  { stars: 2, name: '迂回' },
  { stars: 2, name: '小成' },
  // 进阶（11-20）
  { stars: 2, name: '渐难' },
  { stars: 2, name: '曲折' },
  { stars: 3, name: '迷局' },
  { stars: 3, name: '周旋' },
  { stars: 3, name: '纵横' },
  { stars: 3, name: '布局' },
  { stars: 3, name: '险境' },
  { stars: 3, name: '深入' },
  { stars: 4, name: '困境' },
  { stars: 4, name: '突围' },
  // 挑战（21-30）
  { stars: 4, name: '迷宫' },
  { stars: 4, name: '绝境' },
  { stars: 4, name: '巧思' },
  { stars: 4, name: '苦战' },
  { stars: 5, name: '极限' },
  { stars: 5, name: '天险' },
  { stars: 5, name: '高手' },
  { stars: 5, name: '宗师' },
  { stars: 5, name: '传奇' },
  { stars: 5, name: '登顶' }
]

Component({
  data: {
    levels: [] as Array<{ id: number; stars: number; name: string; cleared: boolean; locked: boolean }>,
    clearedCount: 0,
    totalCount: LEVEL_META.length
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

      const levels = LEVEL_META.map((meta, i) => {
        const id = i + 1
        const cleared = !!progress[String(id)]
        // 第一关始终解锁，其他关需要前一关已通关
        const locked = id > 1 && !progress[String(id - 1)]
        return { id, ...meta, cleared, locked }
      })

      this.setData({ levels, clearedCount })
    },

    onTapLevel(e: any) {
      const id = e.currentTarget.dataset.id as number
      const locked = e.currentTarget.dataset.locked as boolean
      if (locked) {
        wx.showToast({ title: '请先通关上一关', icon: 'none' })
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
