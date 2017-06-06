const nav = {
    LISTSELECTOR: '#the-nav .api-ref-side-nav > li',
    SUBLISTSELECTOR: '#the-nav .api-ref-side-nav a[href^="#top"] + div li',
    check: function(verify, val) {
        return function(element) {
            verify.equal(element.value.length, val, `expect navbar to have ${val} links/sublinks`);
        };
    }
};

module.exports = {
    nav
};
