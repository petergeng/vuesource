var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el

    // check params
    // - lazy: update model on "change" instead of "input"
    var lazy = this._checkParam('lazy') != null
    // - number: cast value into number when updating model.
    var number = this._checkParam('number') != null
    // - debounce: debounce the input listener
    var debounce = parseInt(this._checkParam('debounce'), 10)

    // handle composition events.
    //   http://blog.evanyou.me/2014/01/03/composition-event/
    // skip this for Android because it handles composition
    // events quite differently. Android doesn't trigger
    // composition events for language input methods e.g.
    // Chinese, but instead triggers them for spelling
    // suggestions... (see Discussion/#162)
    var composing = false
    if (!_.isAndroid) {
      this.onComposeStart = function () {
        composing = true
      }
      this.onComposeEnd = function () {
        composing = false
        // in IE11 the "compositionend" event fires AFTER
        // the "input" event, so the input handler is blocked
        // at the end... have to call it here.
        self.listener()
      }
      _.on(el, 'compositionstart', this.onComposeStart)
      _.on(el, 'compositionend', this.onComposeEnd)
    }

    function syncToModel () {
      var val = number
        ? _.toNumber(el.value)
        : el.value
      self.set(val)
    }

    // if the directive has filters, we need to
    // record cursor position and restore it after updating
    // the input with the filtered value.
    // also force update for type="range" inputs to enable
    // "lock in range" (see #506)
    if (this.hasRead || el.type === 'range') {
      this.listener = function () {
        if (composing) return
        var charsOffset
        // some HTML5 input types throw error here
        try {
          // record how many chars from the end of input
          // the cursor was at
          charsOffset = el.value.length - el.selectionStart
        } catch (e) {}
        // Fix IE10/11 infinite update cycle
        // https://github.com/yyx990803/vue/issues/592
        /* istanbul ignore if */
        if (charsOffset < 0) {
          return
        }
        syncToModel()
        _.nextTick(function () {
          // force a value update, because in
          // certain cases the write filters output the
          // same result for different input values, and
          // the Observer set events won't be triggered.
          var newVal = self._watcher.value
          self.update(newVal)
          if (charsOffset != null) {
            var cursorPos =
              _.toString(newVal).length - charsOffset
            el.setSelectionRange(cursorPos, cursorPos)
          }
        })
      }
    } else {
      this.listener = function () {
        if (composing) return
        syncToModel()
      }
    }

    if (debounce) {
      this.listener = _.debounce(this.listener, debounce)
    }

    // Now attach the main listener

    this.event = lazy ? 'change' : 'input'
    // Support jQuery events, since jQuery.trigger() doesn't
    // trigger native events in some cases and some plugins
    // rely on $.trigger()
    //
    // We want to make sure if a listener is attached using
    // jQuery, it is also removed with jQuery, that's why
    // we do the check for each directive instance and
    // store that check result on itself. This also allows
    // easier test coverage control by unsetting the global
    // jQuery variable in tests.
    this.hasjQuery = typeof jQuery === 'function'
    if (this.hasjQuery) {
      jQuery(el).on(this.event, this.listener)
    } else {
      _.on(el, this.event, this.listener)
    }

    // IE9 doesn't fire input event on backspace/del/cut
    if (!lazy && _.isIE9) {
      this.onCut = function () {
        _.nextTick(self.listener)
      }
      this.onDel = function (e) {
        if (e.keyCode === 46 || e.keyCode === 8) {
          self.listener()
        }
      }
      _.on(el, 'cut', this.onCut)
      _.on(el, 'keyup', this.onDel)
    }

    // set initial value if present
    if (
      el.hasAttribute('value') ||
      (el.tagName === 'TEXTAREA' && el.value.trim())
    ) {
      this._initValue = number
        ? _.toNumber(el.value)
        : el.value
    }
  },

  update: function (value) {
    this.el.value = _.toString(value)
  },

  unbind: function () {
    var el = this.el
    if (this.hasjQuery) {
      jQuery(el).off(this.event, this.listener)
    } else {
      _.off(el, this.event, this.listener)
    }
    if (this.onComposeStart) {
      _.off(el, 'compositionstart', this.onComposeStart)
      _.off(el, 'compositionend', this.onComposeEnd)
    }
    if (this.onCut) {
      _.off(el, 'cut', this.onCut)
      _.off(el, 'keyup', this.onDel)
    }
  }
}
