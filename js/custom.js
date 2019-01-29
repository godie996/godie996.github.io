{
  const view = {
    button: undefined,
    init() {
      this.button = document.querySelector('#upvote')
    }
  }
  const model = {
    _av: null,
    get av() {
      return this._av
    },
    set av(value) {
      this._av = value
      this.count = this._av.attributes.count
    },
    get id() {return this.av.id},
    _count: 1,
    get count() {return this.av.attributes.count},
    set count(value) {
      this._count = value
      window.upvoteCount.innerText = this._count
    },
    addCount(value = 1) {
      this.count += value
    }
  }

  const controller = {
    init() {
      view.init()
      this.hideButtonIfClicked()
      this.getCount()
      this.bindEvents()
    },
    hideButtonIfClicked() {
      if (localStorage.getItem('voted')) {
        view.button.remove()
      }
    },
    getCount() {
      const query = new AV.Query('UpvoteCount');
      query.limit(1)
      query.find().then((results) => {
        model.av = results[0]
      }, (e) => {
        console.log(e)
      })
    },
    bindEvents() {
      const button = view.button;
      if (button) {
        const done = () => button.disabled = false
        const resolved = () => {
          model.addCount(1)
          localStorage.setItem('voted', 'yes')
          button.remove()
          done()
        }
        const rejected = (e) => {
          console.log(e)
          done()
        }
        button.onclick = () => {
          button.disabled = true
          const av = AV.Object.createWithoutData('UpvoteCount', model.id);
          // 修改属性
          av.set('count', model.count + 1);
          // 保存到云端
          av.save().then(resolved, rejected)
        }
      }
    }
  }
  window.addEventListener('load', () => controller.init())
}