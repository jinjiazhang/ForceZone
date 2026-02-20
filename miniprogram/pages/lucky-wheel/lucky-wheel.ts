// pages/lucky-wheel/lucky-wheel.ts
export { }


const COLORS = [
    '#FF9966', '#4facfe', '#66bb6a', '#f1c40f', '#a18cd1',
    '#FF6B6B', '#4cd9a4', '#fbc2eb', '#e74c3c', '#9b59b6'
];

Page({
    data: {
        title: '',
        gradientStyle: '',
        slices: [] as any[],
        rotateDeg: 0,
        isSpinning: false,
        showResult: false,
        resultText: ''
    },

    onLoad() {
        this.initWheel();
    },

    initWheel() {
        const preset = wx.getStorageSync('lucky_wheel_current_preset');
        if (!preset || !preset.options) {
            wx.showToast({ title: '没有找到配置', icon: 'none' });
            setTimeout(() => wx.navigateBack(), 1500);
            return;
        }

        const options = preset.options;
        this.setData({ title: preset.title });

        let totalWeight = 0;
        options.forEach((o: any) => totalWeight += o.weight);

        let currentDeg = 0;
        const slices = options.map((opt: any, i: number) => {
            const sweepDeg = (opt.weight / totalWeight) * 360;
            const startDeg = currentDeg;
            const endDeg = currentDeg + sweepDeg;
            const midDeg = currentDeg + sweepDeg / 2;
            currentDeg = endDeg;
            return {
                ...opt,
                startDeg,
                endDeg,
                midDeg,
                color: COLORS[i % COLORS.length]
            };
        });

        const gradientStr = slices.map((s: any) => `${s.color} ${s.startDeg}deg ${s.endDeg}deg`).join(', ');

        this.setData({
            slices,
            gradientStyle: `conic-gradient(${gradientStr})`,
            rotateDeg: 0,
            showResult: false
        });
    },

    onStartSpin() {
        if (this.data.isSpinning) return;

        const { slices } = this.data;
        if (slices.length === 0) return;

        // Pick winning slice
        let totalWeight = 0;
        slices.forEach((s: any) => totalWeight += s.weight);
        let rand = Math.random() * totalWeight;

        let winningSliceIndex = 0;
        for (let i = 0; i < slices.length; i++) {
            if (rand <= slices[i].weight) {
                winningSliceIndex = i;
                break;
            }
            rand -= slices[i].weight;
        }

        const winner = slices[winningSliceIndex];

        // Sub-angle within the slice (keep padding to avoid edge ambiguity)
        const padding = Math.min((winner.endDeg - winner.startDeg) * 0.1, 5); // 10% or 5deg padding
        const randDegInSlice = winner.startDeg + padding + Math.random() * (winner.endDeg - winner.startDeg - 2 * padding);

        // Calculate rotation
        const turns = 6; // 6 full rotations
        // The current rotateDeg might not be 0 if spun before.
        // Calculate new total rotation so it looks continuous.
        const currentRotations = Math.floor(this.data.rotateDeg / 360);
        const targetBase = (currentRotations + turns) * 360;

        // We want randDegInSlice to land on 0deg (the pointer).
        // So targetBase + 360 - randDegInSlice
        const finalRotateDeg = targetBase + 360 - randDegInSlice;

        this.setData({
            isSpinning: true,
            rotateDeg: finalRotateDeg,
            showResult: false
        });

        // Spin animation duration is set to 4s in CSS
        setTimeout(() => {
            // Show result
            this.setData({
                isSpinning: false,
                showResult: true,
                resultText: winner.name
            });
        }, 4000); // Wait for spin animation to finish
    },

    closeResultModal() {
        this.setData({ showResult: false });
    }
});
