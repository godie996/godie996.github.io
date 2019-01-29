{
  const view = {
    button: undefined,
    init() {
      this.button = document.querySelector('#upvote')
    }
  }
  const model = {
    _count: 1,
    get count() {return this._count},
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
      const query = new AV.Query('Upvote');
      query.limit(1000)
      query.find().then((upvotes) => {
        model.count = upvotes.length
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
          const Upvote = AV.Object.extend('Upvote');
          const upvote = new Upvote();
          upvote.save({
            target: window.location.href
          }).then(resolved, rejected)
        }
      }
    }
  }
  window.addEventListener('load', () => controller.init())
}