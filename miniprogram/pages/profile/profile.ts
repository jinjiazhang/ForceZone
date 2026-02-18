// profile.ts
export { }

Component({
  data: {
  },

  lifetimes: {
    attached() {
      // this.loadGameStats()
    }
  },

  pageLifetimes: {
    show() {
      // this.loadGameStats()
    }
  },

  methods: {
    // 触发彩蛋，解锁所有隐藏游戏
    unlockHiddenGames() {
      wx.vibrateShort({ type: 'medium' })
      wx.setStorageSync('unlock_hidden_games', true)
    },

    // 重新锁定（用于测试）
    lockHiddenGames() {
      wx.vibrateShort({ type: 'medium' })
      wx.removeStorageSync('unlock_hidden_games')
      wx.showToast({ title: '已重新锁定', icon: 'none' })
    }
  }
})