//index.js

Page({
    data: {
        hasModal: false,
        isMoney: true,
        disableForm: true,
        sum: null,
        paidSum: null,
        title: null,
        money: null,
        deleteMoney: false,
        delete: null,
        totalMoney: 0,
        editObj: null,
        moneyArr: [],
        peopleArr: [],
        resultArr: []
    },

    checkInput() {
        this.setData({
            disableForm: this.data.title === null || this.data.money === null
        });
    },

    finishInput(e) {
        const type = parseInt(e.currentTarget.dataset.type); // 0是标题，1是金额
        if (type === 0) {
            this.setData({
                title: e.detail.value
            });
        } else {
            this.setData({
                money: e.detail.value
            });
        }
        this.checkInput();
    },

    showModal(e) {
        const type = parseInt(e.currentTarget.dataset.type); // 0是款项，1是分摊人
        const title = type === 0 ? `款项${this.data.moneyArr.length + 1}` : `分摊人${this.data.peopleArr.length + 1}`;
        this.setData({
            title,
            isMoney: type === 0,
            hasModal: true
        });
        this.checkInput();
    },

    hideModal() {
        this.setData({
            hasModal: false
        });
        this.clearEdit();
        this.clearForm();
    },

    submitForm() {
        const item = {
            title: this.data.title,
            money: Number(this.data.money)
        };

        // 编辑模式
        if (this.data.editObj) {
            const editObj = this.data.editObj;
            const arrName = editObj.isMoney ? 'moneyArr' : 'peopleArr';
            const newArr = this.data[arrName].concat();
            newArr[editObj.index] = item;
            this.setData({
                [arrName]: newArr
            });
            if (editObj.isMoney) {
                this.updateSum();
            }
            this.hideModal();
            return;
        }

        // 新增项目
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
            this.updateSum();
        }
        this.hideModal();
    },

    updateSum() {
        let sum = 0;
        const moneyArr = this.data.moneyArr;
        for (let i = 0; i < moneyArr.length; i++) {
            sum += moneyArr[i].money;
        }
        this.setData({
            sum: sum.toFixed(2)
        });
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
            paidSum,
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

    invokeEdit(e) {
        const arrName = e.currentTarget.dataset.money ? 'moneyArr' : 'peopleArr';
        const index = e.currentTarget.dataset.index;
        const target = this.data[arrName][index];
        const editObj = {
            index,
            isMoney: e.currentTarget.dataset.money,
            title: target.title,
            money: target.money
        };
        this.setData({
            editObj,
            title: target.title,
            money: target.money,
            hasModal: true
        })
    },

    clearEdit() {
        this.setData({
            editObj: null
        })
    },

    invokeDelete(e) {
        this.setData({
            delete: e.currentTarget.dataset.index,
            deleteMoney: e.currentTarget.dataset.money
        })
    },

    stopDelete(e) {
        const delIndex = e.target.dataset.delete;
        console.log(delIndex);
        if (delIndex !== undefined) {
            wx.showModal({
                title: '删除',
                content: '操作不可撤销，是否确定？',
                success: (res) => {
                    const arrName = this.data.deleteMoney ? 'moneyArr' : 'peopleArr';
                    const newArr = this.data[arrName].concat();
                    newArr.splice(delIndex, 1);
                    this.setData({
                        [arrName]: newArr,
                        delete: null
                    })
                }
            })
        } else {
            this.setData({
                delete: null
            })
        }
    },

    preventDefault() {},
});
