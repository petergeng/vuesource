/* global items */

casper.test.begin('Repeated Items', 44, function (test) {
    
    casper
    .start('./fixtures/repeated-items.html')
    .then(function () {

        // initial values
        test.assertSelectorHasText('.count', '3')
        test.assertSelectorHasText('.item:nth-child(1)', '0 A')
        test.assertSelectorHasText('.item:nth-child(2)', '1 B')
        test.assertSelectorHasText('.item:nth-child(3)', '2 C')

    })
    .thenClick('.push', function () {
        test.assertSelectorHasText('.count', '4')
        test.assertSelectorHasText('.item:nth-child(4)', '3 0')
    })
    .thenClick('.shift', function () {
        test.assertSelectorHasText('.count', '3')
        test.assertSelectorHasText('.item:nth-child(1)', '0 B')
        test.assertSelectorHasText('.item:nth-child(2)', '1 C')
        test.assertSelectorHasText('.item:nth-child(3)', '2 0')
    })
    .thenClick('.pop', function () {
        test.assertSelectorHasText('.count', '2')
        test.assertSelectorHasText('.item:nth-child(1)', '0 B')
        test.assertSelectorHasText('.item:nth-child(2)', '1 C')
    })
    .thenClick('.unshift', function () {
        test.assertSelectorHasText('.count', '3')
        test.assertSelectorHasText('.item:nth-child(1)', '0 1')
        test.assertSelectorHasText('.item:nth-child(2)', '1 B')
        test.assertSelectorHasText('.item:nth-child(3)', '2 C')
    })
    .thenClick('.splice', function () {
        test.assertSelectorHasText('.count', '4')
        test.assertSelectorHasText('.item:nth-child(1)', '0 1')
        test.assertSelectorHasText('.item:nth-child(2)', '1 2')
        test.assertSelectorHasText('.item:nth-child(3)', '2 3')
        test.assertSelectorHasText('.item:nth-child(4)', '3 C')
    })
    .thenClick('.remove', function () {
        test.assertSelectorHasText('.count', '3')
        test.assertSelectorHasText('.item:nth-child(1)', '0 1')
        test.assertSelectorHasText('.item:nth-child(2)', '1 2')
        test.assertSelectorHasText('.item:nth-child(3)', '2 3')
    })
    .thenClick('.replace', function () {
        test.assertSelectorHasText('.count', '3')
        test.assertSelectorHasText('.item:nth-child(1)', '0 1')
        test.assertSelectorHasText('.item:nth-child(2)', '1 2')
        test.assertSelectorHasText('.item:nth-child(3)', '2 4')
    })
    .thenClick('.reverse', function () {
        test.assertSelectorHasText('.count', '3')
        test.assertSelectorHasText('.item:nth-child(1)', '0 4')
        test.assertSelectorHasText('.item:nth-child(2)', '1 2')
        test.assertSelectorHasText('.item:nth-child(3)', '2 1')
    })
    .thenClick('.sort', function () {
        test.assertSelectorHasText('.count', '3')
        test.assertSelectorHasText('.item:nth-child(1)', '0 1')
        test.assertSelectorHasText('.item:nth-child(2)', '1 2')
        test.assertSelectorHasText('.item:nth-child(3)', '2 4')
    })
    .then(function () {
        // make sure things work on empty array
        this.click('.pop')
        this.click('.pop')
        this.click('.pop')
        this.click('.pop')
        this.click('.shift')
        this.click('.remove')
        this.click('.replace')
        this.click('.sort')
        this.click('.reverse')
        this.click('.splice')
    })
    .then(function () {
        test.assertSelectorHasText('.count', '2')
        test.assertSelectorHasText('.item:nth-child(1)', '0 6')
        test.assertSelectorHasText('.item:nth-child(2)', '1 7')
    })
    .thenClick('.item:nth-child(1)', function () {
        test.assertSelectorHasText('.count', '1')
        test.assertSelectorHasText('.item:nth-child(1)', '0 7')
        test.assertEval(function () {
            return items.length === 1 && items[0].title === '7'
        })
    })
    .run(function () {
        test.done()
    })

})