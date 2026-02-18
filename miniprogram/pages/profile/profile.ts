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

    // 重新锁定
    lockHiddenGames() {
      wx.removeStorageSync('unlock_hidden_games')
    }
  }
})