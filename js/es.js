$(document).ready(function() {

});

function setCookie(cname, cvalue, exdays) {
    // var d = new Date();
    // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    // var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


angular
    .module('es-app', [])
    .controller('esCalculatorCtrl', ['$scope', '$window', function($scope, $window) {


        $scope.isPrepare = function() {
            if ($scope.state == "prepare") return true;
            else return false;
        }
        $scope.isDetail = function() {
            if ($scope.state == "detail") return true;
            else return false;
        }
        $scope.isSimplify = function() {
            if ($scope.state == "simplify") return true;
            else return false;
        }

        $scope.prepare = function() {
            $scope.state = "prepare";
            $scope.update();
        }
        $scope.simplify = function() {
            $scope.state = "simplify";
            $scope.update();
        }
        $scope.detail = function() {
            $scope.state = "detail";
            $scope.update();
        }

        $scope.setRewardOfPoint = function() {
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

        $scope.insertReward = function(index) {
            $scope.rewards.splice(index + 1, 0, { "point": 0, "amount": 1, "type": '乳酸' });
        }
        $scope.removeReward = function(index) {
            $scope.rewards.splice(index, 1);
        }

        $scope.calcDeadlineTime = function() {
            // console.log("deadlineDate\n" + $scope.deadlineDate.toISOString() + "\n" + $scope.deadlineDate.getTime());
            $scope.deadlineTime = new Date($scope.deadlineDate.getTime() + 22 * 1000 * 60 * 60);
        }

        $scope.calcRemainTime = function() {
            var currentTime = new Date();
            // console.log("currentTime\n" + currentTime + "\n gettime: " + currentTime.getTime() + "\ntoISOString: " + currentTime.toISOString());

            if ($scope.isSimplify()) {
                $scope.calcDeadlineTime();
            }
            // console.log("deadlineTime\n" + $scope.deadlineTime.toISOString() + "\n" + $scope.deadlineTime.getTime());

            $scope.remainingTime = new Date($scope.deadlineTime.getTime() - currentTime.getTime());
        }

        $scope.isTargetFilled = function() {
            if (typeof $scope.targetPt == "undefined" || $scope.targetPt == "NAN") {
                return false;
            } else {
                return true;
            }
        }
        $scope.isConcertLPFilled = function() {
            if (typeof $scope.urgent_lp == "undefined" || typeof $scope.large_lp == "undefined" || typeof $scope.larger_lp == "undefined" || !angular.isNumber($scope.larger_lp) || !angular.isNumber($scope.large_lp) || !angular.isNumber($scope.urgent_lp)) {
                return false;
            } else {
                return true;
            }
        }

        $scope.update = function() {
            console.log("update");

            //修正簡化版設定
            if (!$scope.isDetail()) {
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


            if (typeof $scope.targetPt == "undefined" || $scope.targetPt == "NAN") {
                targetPt = 0;
            } else {
                targetPt = $scope.targetPt;
            }

            $scope.calcRemainTime();
            var remainingTime;
            if ($scope.isPrepare()) {
                remainingTime = $scope.days + $scope.hours / 24;
            } else {
                remainingTime = $scope.remainingTime.getTime() / (1000 * 60 * 60 * 24); //start from 1/1/1970=0
            }

            var multiple = 1 + $scope.multiple / 100;
            var crit_rate = $scope.crit_rate / 100;

            $scope.calcMaxNight();
            $scope.large_need = 0;
            $scope.urgent_need = 0;
            var needPt = (targetPt - $scope.currentPt) / (multiple * (1 + crit_rate * 0.2));


            if (!$scope.isDetail()) {
                $scope.night = $scope.max_night;
            }

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
            $scope.LP_consum = needPt / $scope.PtperLP;
            if (targetPt == 0 || $scope.LP_consum < 0) $scope.LP_consum = 0;
            console.log("LP_consum: " + $scope.LP_consum);
            if (!$scope.isFullLevel) $scope.LP_consum += $scope.upgrade_consum_lp;
            $scope.LP_prop = $scope.get_lactate + $scope.own_lactate + 5 * ($scope.get_drink + $scope.own_drink);
            if ($scope.notSleep) {
                $scope.LP_time = remainingTime * 24 * 2;
            } else {
                console.log(" parseInt(remainingTime): " + parseInt(remainingTime));
                $scope.LP_time = remainingTime * 24 * 2 - parseInt(remainingTime) * ($scope.sleepingHours - 5) * 2;
            }
            $scope.LP_need = $scope.LP_consum - $scope.LP_time - $scope.LP_prop;

            //乳酸
            if ($scope.isPrepare()) {
                remainingTime += 1; //未買第一天的乳酸
            }
            LP_need_rest = Math.ceil($scope.LP_need);
            if (LP_need_rest < 0) LP_need_rest = 0;
            $scope.tot_diamond_lactate = 0;
            $scope.buy_lactate_50 = 0;
            $scope.buy_lactate_80 = 0;
            //5折
            var buy_limit = 3;
            var buy_pack_price = buy_limit * lp_price * 0.5;
            if (LP_need_rest < parseInt(remainingTime) * buy_limit) {
                //不買全部5折乳酸
                $scope.buy_lactate_50 = parseInt(LP_need_rest / buy_limit) * buy_limit;
                LP_need_rest -= $scope.buy_lactate_50;
                $scope.tot_diamond_lactate += $scope.buy_lactate_50 / buy_limit * buy_pack_price;
                console.log("*****乳酸\n" + LP_need_rest + "\n" + LP_need_rest);
                if (LP_need_rest * lp_price > buy_pack_price) {
                    $scope.buy_lactate_50 += buy_limit;
                    LP_need_rest -= buy_limit;
                    $scope.tot_diamond_lactate += buy_pack_price;
                    console.log("*****乳酸\n" + buy_pack_price + "\n" + "\nremainingTime: ");
                }
            } else {
                //買全部5折乳酸
                $scope.buy_lactate_50 = parseInt(remainingTime) * buy_limit;
                console.log("*****乳酸\n" + buy_pack_price + "\n" + lp_price + "\nremainingTime: " + parseInt(remainingTime));
                LP_need_rest -= parseInt(remainingTime) * buy_limit;
                $scope.tot_diamond_lactate += parseInt(remainingTime) * buy_pack_price;
                console.log("*****乳酸\n" + $scope.tot_diamond_lactate + "\nremainingTime: " + parseInt(remainingTime));
                //8折
                buy_limit = 6;
                buy_pack_price = buy_limit * lp_price * 0.8;
                if (LP_need_rest <= parseInt(remainingTime) * buy_limit) {
                    $scope.buy_lactate_80 = parseInt(LP_need_rest / buy_limit) * buy_limit;
                    LP_need_rest -= $scope.buy_lactate_80;
                    $scope.tot_diamond_lactate += $scope.buy_lactate_80 / buy_limit * buy_pack_price;
                    if (LP_need_rest * lp_price > buy_pack_price) {
                        $scope.buy_lactate_80 += buy_limit;
                        LP_need_rest -= buy_limit;
                        $scope.tot_diamond_lactate += buy_pack_price;
                    }
                } else {
                    console.log("*****乳酸\n" + $scope.tot_diamond_lactate);
                    $scope.buy_lactate_80 = parseInt(remainingTime) * buy_limit;
                    LP_need_rest -= parseInt(remainingTime) * buy_limit;
                    $scope.tot_diamond_lactate += parseInt(remainingTime) * buy_pack_price;
                }
            }
            if ($scope.isPrepare()) {
                remainingTime -= 1; //未買第一天的乳酸
            }
            if (LP_need_rest < 0) LP_need_rest = 0;
            $scope.lp_buy_directly = LP_need_rest;
            $scope.tot_diamond_lp = LP_need_rest * lp_price;
            saveDataToCookie();
        }

        $scope.getRewards = function() {
            $scope.get_lactate = 0;
            $scope.get_drink = 0;
            $scope.get_bread = 0;
            var round = parseInt((targetPt - $scope.currentPt) / $scope.maxPt);
            angular.forEach($scope.rewards, function(reward) {
                if (reward.type == $scope.typeOfRewards[0]) {
                    $scope.get_lactate += reward.amount * round;
                    if (targetPt % $scope.maxPt > reward.point && $scope.currentPt % $scope.maxPt < reward.point) {
                        $scope.get_lactate += reward.amount;
                    }
                } else if (reward.type == $scope.typeOfRewards[1]) {
                    $scope.get_drink += reward.amount * round;
                    if (targetPt % $scope.maxPt > reward.point && $scope.currentPt % $scope.maxPt < reward.point) {
                        $scope.get_drink += reward.amount;
                    }
                } else if (reward.type == $scope.typeOfRewards[2]) {
                    $scope.get_bread += reward.amount * round;
                    if (targetPt % $scope.maxPt > reward.point && $scope.currentPt % $scope.maxPt < reward.point) {
                        $scope.get_bread += reward.amount;
                    }
                }
            })
        }

        $scope.isLargerBetter = function() {
            if ($scope.larger_Pt / $scope.larger_lp > $scope.large_Pt / $scope.large_lp) {
                return true;
            } else {
                return false;
            }
        }

        $scope.calcMaxNight = function() {
            // var remainingTime = ($scope.remainingTime.getTime() + $scope.remainingTime.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24);
            remainingTime = $scope.remainingTime.getTime() / (1000 * 60 * 60 * 24); //start from 1/1/1970=0
            $scope.max_night = (targetPt - $scope.currentPt) / remainingTime / (6000 * $scope.ratio_urgent + 15000 * 2);
            if ($scope.max_night > 6) $scope.max_night = 6;
        }

        $scope.defaultSetting = function() {
            $scope.multiple = 0;
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
            $scope.crit_rate = 15;
            $scope.days = 7;
            $scope.hours = 10;
            $scope.showRewards = false;
            $scope.breadAte = 0;
            $scope.sleepingHours = 8;
            $scope.notSleep = false;
            $scope.setRewardOfPoint();
        }

        $scope.setMine = function() {
            $scope.targetPt = 2100000;
            $scope.currentPt = 000;
            $scope.urgent_lp = 3;
            $scope.large_lp = 2;
            $scope.larger_lp = 3;
            $scope.night = 5;
            $scope.breadAte = 9;
            $scope.state = "detail";
        }

        stringToInt = function(input) {
            input = parseInt(input, 10);
        }

        saveDataToCookie = function() {
            console.log("saveDataToCookie");
            setCookie("state", $scope.state, 7);
            setCookie("targetPt", $scope.targetPt, 7);
            setCookie("currentPt", $scope.currentPt, 7);
            setCookie("get_lactate", $scope.get_lactate, 7);
            setCookie("get_drink", $scope.get_drink, 7);
            setCookie("get_bread", $scope.get_bread, 7);
            setCookie("currentPt", $scope.currentPt, 7);
            setCookie("urgent_lp", $scope.urgent_lp, 30);
            setCookie("large_lp", $scope.large_lp, 30);
            setCookie("larger_lp", $scope.larger_lp, 30);
            setCookie("night", $scope.night, 7);
            setCookie("breadAte", $scope.breadAte, 7);
            console.log("done");
        }

        getDataFromCookie = function() {
            console.log("getDataFromCookie\n" + document.cookie);
            $scope.state = getCookie("state");
            $scope.targetPt = parseInt(getCookie("targetPt"), 10);
            $scope.currentPt = parseInt(getCookie("currentPt"), 10);
            $scope.get_lactate = parseInt(getCookie("get_lactate"), 10);
            $scope.get_drink = parseInt(getCookie("get_drink"), 10);
            $scope.get_bread = parseInt(getCookie("get_bread"), 10);
            $scope.urgent_lp = parseInt(getCookie("urgent_lp"), 10);
            $scope.large_lp = parseInt(getCookie("large_lp"), 10);
            $scope.larger_lp = parseInt(getCookie("larger_lp"), 10);
            $scope.night = parseInt(getCookie("night"), 10);
            $scope.breadAte = parseInt(getCookie("breadAte"), 10);
        }

        //constant
        $scope.typeOfRewards = ['乳酸', '運動飲料', '面包'];
        $scope.remainingTime = 0;
        $scope.max_night = 6;
        $scope.urgent_Pt = 15000;
        $scope.large_Pt = 6000;
        $scope.larger_Pt = 9000;
        lp_price = 10;

        $scope.state = "simplify"; //simplify, detail, prepare
        $scope.currentPt = 0;
        $scope.get_lactate = 0;
        $scope.get_drink = 0;
        $scope.get_bread = 0;

        // getDataFromCookie();

        $scope.defaultSetting();
        // console.log("current\n" + new Date().toISOString() + "\n" + new Date().getTime() + "\nISOString: " + new Date().toISOString());
        $scope.deadlineDate = new Date(new Date().setDate(new Date().getDate() + 7));
        $scope.deadlineDate.setHours(0);
        $scope.deadlineDate.setMinutes(0);
        $scope.deadlineDate.setSeconds(0);
        // console.log("deadlineDate\n" + $scope.deadlineDate.toISOString() + "\n" + $scope.deadlineDate.getTime());
        $scope.deadlineTime = new Date($scope.deadlineDate.getTime() + 10 * 1000 * 60 * 60);

        // $scope.setMine(); //just for me testing
        $scope.update();


        $scope.scrollToTop = function() {
            $window.scrollTo(0, 0);
            console.log("scrollToTop");
        }
    }]);