/**
 * Actual demo
 */
debugger;
var demo = new Vue({
  el: '#demo',
  data: {
    message : 'abc'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
