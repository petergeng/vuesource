casper.test.begin('Encapsulation & Inheritance', 8, function (test) {
    
    casper
    .start('./fixtures/extend.html', function () {

        test.assertSelectorHasText('.dir', 'directive works')
        test.assertSelectorHasText('.filter', 'filter works')
        test.assertSelectorHasText('.partial', 'partial works')
        test.assertSelectorHasText('.vm', 'component works')
        test.assertSelectorHasText('.vm-w-model', 'component with model works')

        test.assertSelectorHasText('#log', 'T created T ready T created C created T ready C ready', 'hook inheritance works')
        test.assertSelectorHasText('.cvm', 'component works', 'Child should have access to Parent options')

        this.evaluate(function () {
            test.vmData = {
                selfMsg: 'replacing $data ',
                msg: 'also works'
            }
        })

        test.assertSelectorHasText('.vm-w-model', 'replacing $data also works')
    })
    .run(function () {
        test.done()
    })

})