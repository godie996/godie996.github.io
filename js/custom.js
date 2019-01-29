{
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
  const controller = () => {
    const button = document.querySelector('#upvote')
    const query = new AV.Query('Upvote');
    query.find().then((upvotes) => {
      model.count = upvotes.length
    }, (e) => {
      console.log(e)
    })
    if (button) {
      const done = () => button.disabled = false
      const resolved = () => {
        model.addCount(1)
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
  window.addEventListener('load', controller)
}