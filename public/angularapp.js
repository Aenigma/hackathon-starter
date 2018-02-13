(function () {
    class SmsController {
        constructor(smsService) {
            this.smsService = smsService

            this.data = []

            this.From = ''
            this.Body = ''

            this.load()
        }

        load() {
            this.smsService.getDbContent(res => {
                this.data = res.data
            })
        }

        submit() {
            console.log('submitted!');
            const { From, Body } = this

            this.smsService.addToDb({ From, Body }, () => {
                this.data = [...this.data, { From, Body }]
                this.From = this.Body = ''
            })
        }
    }

    class SmsService {
        constructor($http) {
            this.http = $http
        }

        addToDb({ From, Body }, successCallback) {
            return this.http({
                method: 'POST',
                url: '/sms',
                data: { From, Body },
            }).then(successCallback, err => console.error(err))
        }

        getDbContent(successCallback) {
            this.http({
                method: 'GET',
                url: '/db',
            }).then(successCallback, err => console.error(err))
        }
    }

    angular.module('smsApp', [])
        .service('SmsService', ['$http', SmsService])
        .controller('SmsController', ['SmsService', SmsController])
})();
