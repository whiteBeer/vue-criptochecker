(function () {

    var MainPage = Vue.component('mainPage', {
        data: function () {
            return {}
        },
        mounted () {},
        template: '<div style="padding: 20px;">Welcome to CRIPTOCHECKER!</div>'
    });


    var Organizations = Vue.component('organizations', {
        data: function () {
            return {
                loading: true,
                interval: null,
                info: 'null'
            }
        },
        methods: {
            refresh() {
                self.loading = true;
                axios.get('https://api.coindesk.com/v1/bpi/currentprice.json').then(function (resp) {
                    self.info = resp.data;
                    self.info.time.updated = moment(self.info.time.updated).format();
                    self.loading = false;
                });
            }
        },
        mounted () {
            self = this;
            self.refresh();
            self.interval = setInterval(function () {
                self.refresh();
            }, 3000);
        },
        template: '' +
            '<div id="organizations"> ' +
                '<div v-if="!loading">' +
                    'BTC price ({{ info.time.updated }}):' +
                    '<div style="margin-top: 20px; font-weight: bold;">{{ info.bpi.USD.rate }}</div>' +
                '<div>' +
            '</div>',
        beforeDestroy() {
            clearInterval(self.interval);
        }
    });

    Vue.use(VueRouter);

    var adminApp = new Vue({
        el: '#admin-app',
        router: new VueRouter({
            routes: [
                { path: '/', component: MainPage },
                { path: '/criptochecker', component: Organizations }
            ]
        })
    });

})();