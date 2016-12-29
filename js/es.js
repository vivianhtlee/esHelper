$(document).ready(function () {

});

angular
	.module('es-app', [])
	.controller('esCalculatorCtrl', ['$scope', '$window', function ($scope, $window) {


		$scope.isPrepare = function () {
			if ($scope.state == "prepare") return true;
			else return false;
		}
		$scope.isDetail = function () {
			if ($scope.state == "detail") return true;
			else return false;
		}
		$scope.isSimplify = function () {
			if ($scope.state == "simplify") return true;
			else return false;
		}

		$scope.prepare = function () {
			$scope.state = "prepare";
			$scope.update();
		}
		$scope.simplify = function () {
			$scope.state = "simplify";
			$scope.update();
		}
		$scope.detail = function () {
			$scope.state = "detail";
			$scope.update();
		}

		$scope.setRewardOfPoint = function () {
			$scope.maxPt = 1450000;
			$scope.rewards = [];
			$scope.rewards = [
				{ "point": 300, "amount": 3, "type": $scope.typeOfRewards[0] },
				{ "point": 600, "amount": 1, "type": '面包' },
				{ "point": 900, "amount": 3, "type": '乳酸' },
				{ "point": 3500, "amount": 1, "type": '面包' },
				{ "point": 7000, "amount": 1, "type": '運動飲料' },
				{ "point": 30000, "amount": 1, "type": '面包' },
				{ "point": 35000, "amount": 1, "type": '運動飲料' },
				{ "point": 140000, "amount": 1, "type": '運動飲料' },
				{ "point": 360000, "amount": 1, "type": '運動飲料' },
				{ "point": 500000, "amount": 1, "type": '面包' },
				{ "point": 640000, "amount": 1, "type": '運動飲料' },
				{ "point": 1070000, "amount": 1, "type": '面包' },
				{ "point": 1370000, "amount": 3, "type": '運動飲料' }
			];
		};

		$scope.insertReward = function (index) {
			$scope.rewards.splice(index + 1, 0, { "point": 0, "amount": 1, "type": '乳酸' });
		}
		$scope.removeReward = function (index) {
			$scope.rewards.splice(index, 1);
		}

		$scope.calcDeadlineTime = function () {
			$scope.deadlineTime = new Date($scope.deadlineDate.getTime() + 22 * 1000 * 60 * 60);
		}

		$scope.calcRemainTime = function () {
			var currentTime = new Date();

			if ($scope.isSimplify()) {
				$scope.calcDeadlineTime();
			}
			console.log("calcRemainTime\n" + $scope.deadlineTime.toISOString() + "\n" + $scope.deadlineTime.getTime());

			if ($scope.isDetail()) {
				$scope.remainingTime = new Date($scope.deadlineTime.getTime() - currentTime.getTime());
			} else if ($scope.isSimplify()) {
				$scope.remainingTime = new Date($scope.deadlineTime.getTime() - currentTime.getTime());
			}
			console.log("$scope.remainingTime\n" + $scope.remainingTime.toISOString() + "\n" + $scope.remainingTime.getTime());
		}


		$scope.update = function () {
			//修正簡化版設定
			if (!$scope.isDetail) {
				$scope.multiple = 1;
				$scope.current_lp = 0;
				$scope.current_ap = 0;
				$scope.current_exp = 2000;
				$scope.ratio_urgent = 5;
				$scope.cleanAP = true;
				$scope.sleepingHours = 8;
				$scope.setRewardOfPoint();
				if ($scope.isPrepare()) {
					$scope.currentPt = 0;
					$scope.isFullLevel = false;
				}
			}

			$scope.calcRemainTime();
			var remainingTime;
			if ($scope.isPrepare()) {
				remainingTime = $scope.days + $scope.hours / 24;
			} else {
				remainingTime = $scope.remainingTime.getTime() / (1000 * 60 * 60 * 24);//start from 1/1/1970=0
			}

			console.log("update\nremainingTime:" + remainingTime + "\ntimezone: " + $scope.remainingTime.getTimezoneOffset());
			$scope.calcMaxNight();
			$scope.large_need = 0;
			$scope.urgent_need = 0;
			var needPt = ($scope.targetPt - $scope.currentPt) / $scope.multiple;

			//夜場
			$scope.urgent_need += remainingTime * $scope.night;
			$scope.large_need += remainingTime * $scope.night * $scope.ratio_urgent;
			var PfWithNight = remainingTime * $scope.night * (6000 * $scope.ratio_urgent + 15000 * 2);

			var needPt2 = needPt - PfWithNight;
			$scope.large_need += needPt2 / (6000 * $scope.ratio_urgent + 15000) * $scope.ratio_urgent;
			$scope.urgent_need += needPt2 / (6000 * $scope.ratio_urgent + 15000);

			$scope.PtperLP = needPt / ($scope.large_need * $scope.large_lp + ($scope.urgent_need + $scope.night * remainingTime) * $scope.urgent_lp);

			//積分獎勵
			$scope.getRewards();

			//AP&exp
			if ($scope.cleanAP) {
				$scope.AP_time = remainingTime * 24 * 60 / 3;
				if (!$scope.isDetail()) {
					$scope.breadAte = $scope.own_bread + $scope.get_bread;
				}
				$scope.AP_bread = $scope.breadAte * 200;
				var level = 0;
				if ($scope.current_exp + $scope.AP_time * 10 + $scope.AP_bread * 10 >= 5000) {
					level = 1;
					level += parseInt(($scope.current_exp + $scope.AP_time * 10 + $scope.AP_bread * 10 - 5000) / 3000);
				}
				$scope.levelUp = level;
			}

			//LP
			$scope.LP_consum = ($scope.targetPt - $scope.currentPt) / $scope.PtperLP;
			if (!$scope.isFullLevel) $scope.LP_consum += $scope.upgrade_consum_lp;
			$scope.LP_prop = $scope.get_lactate + $scope.own_lactate + 5 * ($scope.get_drink + $scope.own_drink);
			if (!$scope.sleep) {
				$scope.LP_time = remainingTime * 24 * 2;
			} else {
				console.log(" parseInt(remainingTime): " + parseInt(remainingTime));
				$scope.LP_time = remainingTime * 24 * 2 - parseInt(remainingTime) * ($scope.sleepingHours - 5) * 2;
			}
			$scope.LP_need = $scope.LP_consum - $scope.LP_time - $scope.LP_prop;
		}

		$scope.getRewards = function () {
			$scope.get_lactate = 0;
			$scope.get_drink = 0;
			$scope.get_bread = 0;
			var round = parseInt(($scope.targetPt - $scope.currentPt) / $scope.maxPt);
			angular.forEach($scope.rewards, function (reward) {
				if (reward.type == $scope.typeOfRewards[0]) {
					$scope.get_lactate += reward.amount * round;
					if ($scope.targetPt % $scope.maxPt > reward.point && $scope.currentPt % $scope.maxPt < reward.point) {
						$scope.get_lactate += reward.amount;
					}
				} else if (reward.type == $scope.typeOfRewards[1]) {
					$scope.get_drink += reward.amount * round;
					if ($scope.targetPt % $scope.maxPt > reward.point && $scope.currentPt % $scope.maxPt < reward.point) {
						$scope.get_drink += reward.amount;
					}
				} else if (reward.type == $scope.typeOfRewards[2]) {
					$scope.get_bread += reward.amount * round;
					if ($scope.targetPt % $scope.maxPt > reward.point && $scope.currentPt % $scope.maxPt < reward.point) {
						$scope.get_bread += reward.amount;
					}
				}
			})
		}

		$scope.calcMaxNight = function () {
			// var remainingTime = ($scope.remainingTime.getTime() + $scope.remainingTime.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24);
			remainingTime = $scope.remainingTime.getTime() / (1000 * 60 * 60 * 24);//start from 1/1/1970=0
			$scope.max_night = ($scope.targetPt - $scope.currentPt) / remainingTime / (6000 * $scope.ratio_urgent + 15000 * 2);
			if ($scope.max_night > 6) $scope.max_night = 6;
		}

		$scope.defaultSetting = function () {
			$scope.multiple = 1;
			$scope.current_lp = 0;
			$scope.current_ap = 0;
			$scope.current_exp = 2000;
			$scope.own_lactate = 0;
			$scope.own_drink = 0;
			$scope.own_bread = 0;
			$scope.ratio_urgent = 5;
			$scope.isFullLevel = true;
			$scope.upgrade_consum_lp = 20;
			$scope.cleanAP = true;
			$scope.crit_rate = 0.15;
			$scope.days = 7;
			$scope.hours = 10;
			$scope.showRewards = false;
			$scope.breadAte = 0;
			$scope.sleepingHours = 8;
			$scope.sleep = true;
			$scope.setRewardOfPoint();
		}

		$scope.setMine = function () {
			$scope.targetPt = 2100000;
			$scope.currentPt = 000;
			$scope.urgent_lp = 3;
			$scope.large_lp = 2;
			$scope.larger_lp = 3;
			$scope.night = 5;
			$scope.breadAte = 9;
			$scope.state = "detail";
		}

		$scope.state = "simplify";
		//simplify, detail, prepare

		$scope.typeOfRewards = ['乳酸', '運動飲料', '面包'];
		// $scope.typeOfRewards = [{id: '1', name:'乳酸'},{id:'2',name:'運動飲料'}, {id:'3',name:'面包'}];
		$scope.remainingTime = 0;
		$scope.get_lactate = 0;
		$scope.get_drink = 0;
		$scope.get_bread = 0;
		$scope.max_night = 6;
		$scope.defaultSetting();
		$scope.deadlineDate = new Date(new Date().setDate(new Date().getDate() + 7));
		$scope.deadlineTime = new Date($scope.deadlineDate.getTime() + 10 * 1000 * 60 * 60);

		$scope.setMine();//just for me testing
		$scope.update();


		$scope.scrollToTop = function () {
			$window.scrollTo(0, 0);
			console.log("scrollToTop");
		}
	}]);