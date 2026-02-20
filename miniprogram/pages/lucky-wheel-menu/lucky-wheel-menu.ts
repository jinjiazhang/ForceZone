// pages/lucky-wheel-menu/lucky-wheel-menu.ts
export { }


interface PresetOption {
    id: string;
    name: string;
    weight: number;
}

interface Preset {
    id: string;
    title: string;
    options: PresetOption[];
}

const defaultPresets: Preset[] = [
    {
        id: 'default-1', title: '去哪里',
        options: [
            { id: 'opt-1-1', name: '周边游', weight: 100 },
            { id: 'opt-1-2', name: '宅家里', weight: 100 },
            { id: 'opt-1-3', name: '逛商场', weight: 100 },
            { id: 'opt-1-4', name: '游乐园', weight: 100 }
        ]
    },
    {
        id: 'default-2', title: '玩什么',
        options: [
            { id: 'opt-2-1', name: '打游戏', weight: 100 },
            { id: 'opt-2-2', name: '看电影', weight: 120 },
            { id: 'opt-2-3', name: '去运动', weight: 80 },
            { id: 'opt-2-4', name: '逛公园', weight: 100 }
        ]
    },
    {
        id: 'default-3', title: '吃什么',
        options: [
            { id: 'opt-3-1', name: '火锅', weight: 150 },
            { id: 'opt-3-2', name: '烧烤', weight: 120 },
            { id: 'opt-3-3', name: '特色小吃', weight: 100 },
            { id: 'opt-3-4', name: '日料', weight: 80 },
            { id: 'opt-3-5', name: '随便', weight: 50 }
        ]
    }
];

Page({
    data: {
        presets: [] as Preset[],
        currentPresetIndex: 0,
        showAddPresetModal: false,
        newPresetName: ''
    },

    onLoad() {
        this.loadPresets();
    },

    onShow() {
        // Optionally reload here if returned from elsewhere, but memory is fine.
    },

    loadPresets() {
        const saved = wx.getStorageSync('lucky_wheel_presets');
        if (saved && saved.length > 0) {
            this.setData({ presets: saved });
        } else {
            this.setData({ presets: JSON.parse(JSON.stringify(defaultPresets)) });
        }
    },

    savePresets() {
        wx.setStorageSync('lucky_wheel_presets', this.data.presets);
    },

    onSelectPreset(e: WechatMiniprogram.TouchEvent) {
        const index = e.currentTarget.dataset.index;
        this.setData({ currentPresetIndex: index });
    },

    onDeletePreset(e: WechatMiniprogram.TouchEvent) {
        const index = e.currentTarget.dataset.index;
        wx.showModal({
            title: '确认删除',
            content: '确定要删除这个预设吗？',
            success: (res) => {
                if (res.confirm) {
                    const presets = this.data.presets;
                    presets.splice(index, 1);
                    let newIndex = this.data.currentPresetIndex;
                    if (newIndex >= presets.length) {
                        newIndex = Math.max(0, presets.length - 1);
                    } else if (index < newIndex) {
                        newIndex--;
                    }
                    this.setData({ presets, currentPresetIndex: newIndex }, () => {
                        this.savePresets();
                    });
                }
            }
        });
    },

    onAddPreset() {
        this.setData({ showAddPresetModal: true, newPresetName: '' });
    },

    onInputNewPresetName(e: any) {
        this.setData({ newPresetName: e.detail.value });
    },

    onCancelAddPreset() {
        this.setData({ showAddPresetModal: false });
    },

    onConfirmAddPreset() {
        const name = this.data.newPresetName.trim();
        if (!name) {
            wx.showToast({ title: '名称不能为空', icon: 'none' });
            return;
        }
        const presets = this.data.presets;
        const newPreset: Preset = {
            id: 'preset-' + Date.now(),
            title: name,
            options: [
                { id: 'opt-' + Date.now() + '-1', name: '选项1', weight: 100 },
                { id: 'opt-' + Date.now() + '-2', name: '选项2', weight: 100 }
            ]
        };
        presets.push(newPreset);
        this.setData({
            presets,
            currentPresetIndex: presets.length - 1,
            showAddPresetModal: false
        }, () => {
            this.savePresets();
        });
    },

    onInputPresetTitle(e: any) {
        const title = e.detail.value;
        const { presets, currentPresetIndex } = this.data;
        presets[currentPresetIndex].title = title;
        this.setData({ presets }, () => this.savePresets());
    },

    onInputOptionName(e: any) {
        const index = e.currentTarget.dataset.index;
        const name = e.detail.value;
        const { presets, currentPresetIndex } = this.data;
        presets[currentPresetIndex].options[index].name = name;
        this.setData({ presets }, () => this.savePresets());
    },

    onInputOptionWeight(e: any) {
        const index = e.currentTarget.dataset.index;
        let weight = parseInt(e.detail.value, 10);
        if (isNaN(weight) || weight < 1) {
            weight = 1; // minimum weight
        }
        const { presets, currentPresetIndex } = this.data;
        presets[currentPresetIndex].options[index].weight = weight;
        this.setData({ presets }, () => this.savePresets());
    },

    onBlurOptionWeight(e: any) {
        // When blur, if input was cleared to empty string, it might not be a valid number, although we try to handle it in input
        const index = e.currentTarget.dataset.index;
        let weight = parseInt(e.detail.value, 10);
        if (isNaN(weight) || weight < 1) {
            weight = 1;
            const { presets, currentPresetIndex } = this.data;
            presets[currentPresetIndex].options[index].weight = weight;
            this.setData({ presets }, () => this.savePresets());
        }
    },

    onDeleteOption(e: WechatMiniprogram.TouchEvent) {
        const index = e.currentTarget.dataset.index;
        const { presets, currentPresetIndex } = this.data;
        if (presets[currentPresetIndex].options.length <= 2) {
            wx.showToast({ title: '至少需要2个选项', icon: 'none' });
            return;
        }
        presets[currentPresetIndex].options.splice(index, 1);
        this.setData({ presets }, () => this.savePresets());
    },

    onAddOption() {
        const { presets, currentPresetIndex } = this.data;
        if (presets[currentPresetIndex].options.length >= 20) {
            wx.showToast({ title: '最多只能有20个选项', icon: 'none' });
            return;
        }
        presets[currentPresetIndex].options.push({
            id: 'opt-' + Date.now(),
            name: '新选项',
            weight: 100
        });
        this.setData({ presets }, () => this.savePresets());
    },

    onEnterWheel() {
        const { presets, currentPresetIndex } = this.data;
        if (!presets || presets.length === 0) return;

        const currentPreset = presets[currentPresetIndex];
        // Check if options are valid
        const validOptions = currentPreset.options.filter(o => o.name.trim() !== '');
        if (validOptions.length < 2) {
            wx.showToast({ title: '转盘至少需要2个有效的选项', icon: 'none' });
            return;
        }

        // Save current preset to storage for the wheel page to read
        wx.setStorageSync('lucky_wheel_current_preset', currentPreset);

        wx.navigateTo({
            url: '../lucky-wheel/lucky-wheel'
        });
    }
});
