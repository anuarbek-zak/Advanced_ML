angular.module('myApp').controller('mainCtrl',function ($http,Upload) {
	var vm = this;
	vm.img_name = ''
	vm.send = function(){
		var data = {file: vm.file};
		console.log("sending",data);
		vm.sending = true;
		vm.img_name = ''
		Upload.upload({
			data: data,
			url: '/doIt'
		}).then(function (resp) {
			console.log(resp.data);
			vm.img_name = resp.data
			vm.sending = false
		}, function (resp) {
			console.log('Error status: ' + resp.status);
		}, function (evt) {

		});
	}
});

