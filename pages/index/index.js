//index.js

Page({
    data: {
        hasModal: false,
        isMoney: true,
        disableForm: true,
        sum: null,
        title: null,
        money: null,
        totalMoney: 0,
        moneyArr: [],
        peopleArr: [],
        resultArr: []
    },

    finishInput(e) {
        const type = parseInt(e.currentTarget.dataset.type); // 0是标题，1是金额
        if (type === 0) {
            this.setData({
                title: e.detail.value
            });
        } else {
            this.setData({
                money: Number(e.detail.value)
            });
        }
        this.setData({
            disableForm: this.data.title === null || this.data.money === null
        });
    },

    showModal(e) {
        const type = parseInt(e.currentTarget.dataset.type); // 0是款项，1是分摊人
        this.setData({
            isMoney: type === 0,
            hasModal: true
        });
    },

    hideModal() {
        this.setData({
            hasModal: false
        });
        this.clearForm();
    },

    submitForm() {
        const item = {
            title: this.data.title,
            money: this.data.money
        };
        const arrName = this.data.isMoney ? 'moneyArr' : 'peopleArr';
        if (!this.data.isMoney) {
            const peopleArr = this.data.peopleArr;
            for (let i = 0; i < peopleArr.length; i++) {
                if (this.data.title === peopleArr[i].title) {
                    wx.showToast({
                        title: '该分摊人已存在',
                        icon: 'none'
                    });
                    return;
                }
            }
        }
        const newArr = this.data[arrName].concat();
        newArr.push(item);
        this.setData({
            [arrName]: newArr
        });
        if (this.data.isMoney) {
            let sum = 0;
            const moneyArr = this.data.moneyArr;
            for (let i = 0; i < moneyArr.length; i++) {
                sum += moneyArr[i].money;
            }
            this.setData({
                sum: sum.toFixed(2)
            });
        }
        this.hideModal();
    },

    clearForm() {
        this.setData({
            title: null,
            money: null
        })
    },

    compute() {
        const paidSum = this.data.sum;
        let orderSum = 0;
        const peopleArr = this.data.peopleArr;
        const resultArr = [];
        for (let i = 0; i < peopleArr.length; i++) {
            orderSum += peopleArr[i].money;
        }
        for (let i = 0; i < peopleArr.length; i++) {
            const ratio = peopleArr[i].money / orderSum;
            const item = {
                title: peopleArr[i].title,
                money: (paidSum * ratio).toFixed(2),
                percent: `${(ratio * 100).toFixed(2)}%`
            };
            resultArr.push(item);
        }
        this.setData({
            resultArr
        });
    },

    reset() {
        this.setData({
            moneyArr: [],
            peopleArr: [],
            resultArr: []
        })
    },

    preventDefault() {},
});
