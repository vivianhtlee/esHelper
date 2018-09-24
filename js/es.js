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
            $scope.night = parseInt($scope.night);
        }

        $scope.showNightWarning = function() {
            if (($scope.large_need + $scope.larger_need) / $scope.ratio_urgent / $scope.night_open < 2) {
                return true;
            } else {
                return false;
            }
        }

        $scope.setRewardOfPoint = function() {
            $scope.maxPt = 1600000;
            $scope.rewards = [];
            $scope.rewards = [
                { "point": 330, "amount": 3, "type": $scope.typeOfRewards[0] },
                { "point": 660, "amount": 1, "type": '面包' },
                { "point": 990, "amount": 3, "type": '乳酸' },
                { "point": 3900, "amount": 1, "type": '面包' },
                { "point": 7700, "amount": 1, "type": '運動飲料' },
                { "point": 15000, "amount": 1, "type": '面包' },
                { "point": 20000, "amount": 1, "type": '運動飲料' },
                { "point": 22000, "amount": 1, "type": '面包' },
                { "point": 180000, "amount": 1, "type": '運動飲料' },
                { "point": 440000, "amount": 1, "type": '運動飲料' },
                { "point": 560000, "amount": 1, "type": '面包' },
                { "point": 720000, "amount": 1, "type": '運動飲料' },
                { "point": 1170000, "amount": 1, "type": '面包' },
                { "point": 1520000, "amount": 3, "type": '運動飲料' }
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
            } else if ($scope.isDetail()) {
                console.log("deadlineTime: " + $scope.deadlineTime);
                console.log("deadlineDate: " + $scope.deadlineDate);
                $scope.deadlineDate.setHours(0);
                $scope.deadlineDate.setMinutes(0);
                $scope.deadlineDate.setSeconds(0);
                $scope.deadlineDate.setMilliseconds(0);
                $scope.deadlineTime.setYear(1970);
                $scope.deadlineTime.setMonth(0);
                $scope.deadlineTime.setDate(1);
                $scope.deadlineTime.setSeconds(0);
                $scope.deadlineTime.setMilliseconds(0);
                console.log("deadlineTime: " + $scope.deadlineTime + "\n" + $scope.deadlineTime.getTime());
                console.log("deadlineDate: " + $scope.deadlineDate + "\n" + $scope.deadlineDate.getTime());
                console.log("getTimezoneOffset: " + $scope.deadlineTime.getTimezoneOffset());
                // $scope.deadlineTime = new Date($scope.deadlineDate.getTime() + $scope.deadlineTime.getTime() + 8 * 60 * 60 * 1000);
                $scope.deadlineTime = new Date($scope.deadlineDate.getTime() + $scope.deadlineTime.getTime() - $scope.deadlineTime.getTimezoneOffset() * 60 * 1000);
                console.log("deadlineTime: " + $scope.deadlineTime + "\n" + $scope.deadlineTime.getTime());
            }
            // console.log("deadlineTime\n" + $scope.deadlineTime.toISOString() + "\n" + $scope.deadlineTime.getTime());

            $scope.remainingTime = new Date($scope.deadlineTime.getTime() - currentTime.getTime());
            console.log("remainingTime: " + $scope.remainingTime + "\nremainingTime.date: " + $scope.remainingTime.toISOString());
        }

        $scope.showDate = function() {
            if ($scope.remainingTime >= 1000 * 60 * 60 * 24) {
                return true;
            } else {
                return false;
            }
        }

        $scope.passdeadline = function() {
            if ($scope.remainingTime < 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.isTargetFilled = function() {
            if (!isNumber($scope.targetPt) || !isNumber($scope.currentPt)) {
                return false;
            } else {
                return true;
            }
        }
        $scope.isConcertLPFilled = function() {
            if (!isNumber($scope.urgent_lp) || !isNumber($scope.large_lp) || !isNumber($scope.larger_lp)) {
                return false;
            } else {
                return true;
            }
        }

        $scope.isLargerBetter = function() {
            if ($scope.larger_Pt / $scope.larger_lp > $scope.large_Pt / $scope.large_lp) {
                return true;
            } else {
                return false;
            }
        }

        $scope.Pt5TotargerPt = function() {
            $scope.targetPt = $scope.numberOfPt5 * 725000;
        }

        $scope.targetPtToPt5 = function() {
            $scope.numberOfPt5 = parseInt($scope.targetPt / 725000);
            console.log("targetPtToPt5");
        }

        $scope.isLargeNightBetter = function() {
            var PtpreLP_large_with_night = ($scope.ratio_urgent * $scope.large_Pt + $scope.urgent_Pt * 2) / ($scope.ratio_urgent * $scope.large_lp + $scope.urgent_lp * 2);
            var PtperLP_larger_without_night = ($scope.ratio_urgent * $scope.larger_Pt + $scope.urgent_Pt) / ($scope.ratio_urgent * $scope.larger_lp + $scope.urgent_lp);
            // var PtperLP_larger_with_night = ($scope.ratio_urgent * $scope.larger_Pt + $scope.urgent_Pt * 2) / ($scope.ratio_urgent * $scope.larger_lp + $scope.urgent_lp * 2);

            if (PtpreLP_large_with_night > PtperLP_larger_without_night) {
                return true;
            } else {
                return false;
            }
        }

        eventNotStart = function() {
            if (remainingTime >= $scope.days + $scope.hours / 24) {
                return true;
            } else {
                return false;
            }
        }

        $scope.update = function() {
            console.log("update\n" + $scope.showCards);

            //修正簡化版設定
            if (!$scope.isDetail()) {
                $scope.multiple = 0;
                $scope.current_lp = 0;
                $scope.current_ap = 0;
                $scope.current_exp = 2000;
                $scope.ratio_urgent = 5;
                $scope.cleanAP = true;
                $scope.sleepingHours = 8;
                $scope.breadAte = $scope.get_bread + $scope.own_bread;
                $scope.setRewardOfPoint();
                $scope.own_lactate = 0;
                $scope.own_drink = 0;
                $scope.own_bread = 0;
                if ($scope.isPrepare()) {
                    $scope.currentPt = 0;
                    $scope.isFullLevel = false;
                }
            }


            if (!isNumber($scope.targetPt)) {
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
                if (remainingTime > $scope.days + $scope.hours / 24) { //活動未開始
                    remainingTime = $scope.days + $scope.hours / 24;
                    $scope.remainingTime = new Date(remainingTime * (1000 * 60 * 60 * 24));
                }
            }

            var multiple = 1 + $scope.multiple / 100;
            var crit_rate = $scope.crit_rate / 100;

            $scope.calcMaxNight();
            $scope.large_need = 0;
            $scope.urgent_need = 0;
            $scope.larger_need = 0;
            $scope.night_open = 0;
            var needPt = (targetPt - $scope.currentPt) / (multiple * (1 + crit_rate * 0.2));


            if (!$scope.isDetail()) {
                $scope.night = $scope.max_night;
                if ($scope.night > 5) $scope.night = 5;
            }

            //夜場
            var needPt2 = needPt; //needPt保留不變
            if (!$scope.isLargerBetter()) { //前特大收益>=後特大
                var PtWithNight = remainingTime * $scope.night * (6000 * $scope.ratio_urgent + 15000 * 2);
                if (needPt2 > PtWithNight) {
                    $scope.urgent_need += remainingTime * $scope.night;
                    $scope.large_need += remainingTime * $scope.night * $scope.ratio_urgent;
                    needPt2 -= PtWithNight;
                } else {
                    $scope.urgent_need += needPt2 / ($scope.large_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2);
                    $scope.large_need += needPt2 / ($scope.large_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2) * $scope.ratio_urgent;
                    needPt2 = 0;
                }
                $scope.night_open = $scope.urgent_need;
                console.log("刷前特大夜場後需要" + needPt2 + "pt\n緊急場數: " + $scope.urgent_need);

                $scope.large_need += needPt2 / (6000 * $scope.ratio_urgent + 15000) * $scope.ratio_urgent;
                $scope.urgent_need += needPt2 / (6000 * $scope.ratio_urgent + 15000);
                //全場/前期收益
                $scope.PtperLP = needPt / ($scope.large_need * $scope.large_lp + ($scope.urgent_need + $scope.night * remainingTime) * $scope.urgent_lp);
            } else { //前特大收益<後特大
                if (remainingTime > 4) {
                    remainingTime_later = 4;
                    remainingTime_early = remainingTime - 4;
                } else {
                    remainingTime_later = remainingTime;
                    remainingTime_early = 0;
                }
                $scope.PtperLP = ($scope.ratio_urgent * $scope.large_Pt + $scope.urgent_Pt * 2) / ($scope.ratio_urgent * $scope.large_lp + $scope.urgent_lp * 2);

                var PtperLP_larger_without_night = ($scope.ratio_urgent * $scope.larger_Pt + $scope.urgent_Pt) / ($scope.ratio_urgent * $scope.larger_lp + $scope.urgent_lp);
                var PtperLP_larger_with_night = ($scope.ratio_urgent * $scope.larger_Pt + $scope.urgent_Pt * 2) / ($scope.ratio_urgent * $scope.larger_lp + $scope.urgent_lp * 2);

                console.log("合共需要PT:" + needPt2);
                console.log("後特大無夜場: " + PtperLP_larger_without_night + "\n後特大有夜場: " + PtperLP_larger_with_night);

                //扣去前半場的前特大
                if ($scope.isLargeNightBetter()) { //前特大+夜場>後特大無夜場
                    var PtWithNight = remainingTime_early * $scope.night * ($scope.large_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2);
                    if (needPt2 > PtWithNight) {
                        $scope.urgent_need += remainingTime_early * $scope.night;
                        $scope.large_need += remainingTime_early * $scope.night * $scope.ratio_urgent;
                        needPt2 -= PtWithNight;
                        $scope.night_open += remainingTime_early * $scope.night;
                    } else {
                        $scope.urgent_need = needPt2 / ($scope.large_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2);
                        $scope.large_need = needPt2 / ($scope.large_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2) * $scope.ratio_urgent;
                        $scope.night_open = $scope.urgent_need;
                        needPt2 = 0;
                    }
                } else { //前特大平刷
                    var night_early = 24 * 2 / ($scope.large_lp * $scope.ratio_urgent + $scope.urgent_lp * 2);
                    var PtWithNight = remainingTime_early * night_early * ($scope.large_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2);
                    if (needPt2 > PtWithNight) {
                        $scope.urgent_need += remainingTime_early * night_early;
                        $scope.large_need += remainingTime_early * night_early * $scope.ratio_urgent;
                        needPt2 -= PtWithNight;
                        $scope.night_open += remainingTime_early * night_early;
                    } else { //不需把所有前特大刷全
                        $scope.urgent_need = needPt2 / ($scope.large_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2);
                        $scope.large_need = needPt2 / ($scope.large_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2) * $scope.ratio_urgent;
                        $scope.night_open = $scope.urgent_need;
                        needPt2 = 0;
                    }
                }

                console.log("刷前特大後所需的pt: " + needPt2 + "\n緊急場數: " + $scope.urgent_need);

                //後特大夜場
                var PtWithNight = remainingTime_later * $scope.night * (9000 * $scope.ratio_urgent + 15000 * 2);
                if (needPt2 > PtWithNight) {
                    $scope.urgent_need += remainingTime_later * $scope.night;
                    $scope.larger_need += remainingTime_later * $scope.night * $scope.ratio_urgent;
                    needPt2 -= PtWithNight;
                    $scope.night_open += remainingTime_later * $scope.night;
                } else {
                    $scope.urgent_need += needPt2 / ($scope.larger_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2);
                    $scope.larger_need = needPt2 / ($scope.larger_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2) * $scope.ratio_urgent;
                    $scope.night_open += needPt2 / ($scope.larger_Pt * $scope.ratio_urgent + $scope.urgent_Pt * 2);
                    needPt2 = 0;
                }

                console.log("緊急場數: " + $scope.urgent_need + "\n刷了" + PtWithNight + "pt");
                console.log("刷完後特大緊急夜場仍需要:", needPt2);

                $scope.larger_need += needPt2 / ($scope.larger_Pt * $scope.ratio_urgent + $scope.urgent_Pt) * $scope.ratio_urgent;
                $scope.urgent_need += needPt2 / ($scope.larger_Pt * $scope.ratio_urgent + $scope.urgent_Pt);

                console.log("緊急場數: ", $scope.urgent_need);

                //計算後特大的Pt per LP
                if (needPt2 > 0) { //後特大會刷出超過夜場
                    //後半場的pt/(後特大LP+(緊急次數+夜場次數)*每場緊急LP)
                    $scope.PtperLP_larger = (needPt2 + PtWithNight) / ($scope.larger_need * $scope.larger_lp + ($scope.larger_need / $scope.ratio_urgent + $scope.night * remainingTime_later) * $scope.urgent_lp);
                    // console.log((needPt2 + PtWithNight), ($scope.larger_need * $scope.larger_lp + ($scope.larger_need / $scope.ratio_urgent + $scope.night * remainingTime_later) * $scope.urgent_lp));
                    console.log("後特大刷出" + (needPt2 + PtWithNight) + "pt\n後特大場數:" + $scope.larger_need);
                    console.log("後半場緊急場數: " + $scope.larger_need / $scope.ratio_urgent);
                } else { //後特大只開夜場
                    $scope.PtperLP_larger = PtperLP_larger_with_night;
                }
            }

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
            $scope.LP_consum = $scope.large_need * $scope.large_lp + $scope.larger_need * $scope.larger_lp + ($scope.urgent_need + $scope.night_open) * $scope.urgent_lp;
            if (targetPt == 0 || $scope.LP_consum < 0) $scope.LP_consum = 0;
            console.log("LP_consum: " + $scope.LP_consum);
            if (!$scope.isFullLevel) $scope.LP_consum += $scope.upgrade_consum_lp;
            $scope.LP_prop = $scope.get_lactate + $scope.own_lactate + 5 * ($scope.get_drink + $scope.own_drink);
            //時間回覆LP
            if ($scope.notSleep) {
                $scope.LP_time = remainingTime * 24 * 2;
            } else {
                console.log(" parseInt(remainingTime): " + parseInt(remainingTime));
                $scope.LP_time = remainingTime * 24 * 2 - parseInt(remainingTime) * ($scope.sleepingHours - 5) * 2;
            }
            $scope.LP_need = $scope.LP_consum - $scope.LP_time - $scope.LP_prop - level * 10;

            //乳酸
            if ($scope.isPrepare() || eventNotStart()) {
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
                    // console.log("*****乳酸\n" + buy_pack_price + "\n" + "\nremainingTime: ");
                }
            } else {
                //買全部5折乳酸
                $scope.buy_lactate_50 = parseInt(remainingTime) * buy_limit;
                // console.log("*****乳酸\n" + buy_pack_price + "\n" + lp_price + "\nremainingTime: " + parseInt(remainingTime));
                LP_need_rest -= parseInt(remainingTime) * buy_limit;
                $scope.tot_diamond_lactate += parseInt(remainingTime) * buy_pack_price;
                // console.log("*****乳酸\n" + $scope.tot_diamond_lactate + "\nremainingTime: " + parseInt(remainingTime));
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
                    // console.log("*****乳酸\n" + $scope.tot_diamond_lactate);
                    $scope.buy_lactate_80 = parseInt(remainingTime) * buy_limit;
                    LP_need_rest -= parseInt(remainingTime) * buy_limit;
                    $scope.tot_diamond_lactate += parseInt(remainingTime) * buy_pack_price;
                }
            }
            if ($scope.isPrepare() || eventNotStart()) {
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
                var targetPt2 = targetPt % $scope.maxPt;
                var currrentPt2 = $scope.currentPt % $scope.maxPt;

                if (reward.type == $scope.typeOfRewards[0]) {
                    $scope.get_lactate += reward.amount * round;
                    if ((targetPt2 > reward.point && currrentPt2 < reward.point) ||
                        (targetPt2 < currrentPt2) && (currrentPt2 < reward.point || targetPt2 > reward.point)) {
                        $scope.get_lactate += reward.amount;
                    }
                } else if (reward.type == $scope.typeOfRewards[1]) {
                    $scope.get_drink += reward.amount * round;
                    if ((targetPt2 > reward.point && currrentPt2 < reward.point) ||
                        (targetPt2 < currrentPt2) && (currrentPt2 < reward.point || targetPt2 > reward.point)) {
                        $scope.get_drink += reward.amount;
                    }
                } else if (reward.type == $scope.typeOfRewards[2]) {
                    $scope.get_bread += reward.amount * round;
                    if ((targetPt2 > reward.point && currrentPt2 < reward.point) ||
                        (targetPt2 < currrentPt2) && (currrentPt2 < reward.point || targetPt2 > reward.point)) {
                        $scope.get_bread += reward.amount;
                    }
                }
            })
        }

        $scope.showCardsCalculator = function() {
            console.log("test jump tp cards");
            $scope.showCards = true;
            window.location.href = "#cards";
            
        }
        $scope.hideCardsCalculator = function() {
            $scope.showCards = false;
        }

        $scope.calcMaxNight = function() {
            // var remainingTime = ($scope.remainingTime.getTime() + $scope.remainingTime.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24);
            remainingTime = $scope.remainingTime.getTime() / (1000 * 60 * 60 * 24); //start from 1/1/1970=0
            $scope.max_night = (targetPt - $scope.currentPt) / remainingTime / (6000 * $scope.ratio_urgent + 15000 * 2);
            if ($scope.max_night > 7) $scope.max_night = 7;
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
            $scope.upgrade_consum_lp = 35;
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

        $scope.test = function() {
            $scope.targetPt = 2100000;
            $scope.currentPt = 0;
            $scope.urgent_lp = 3;
            $scope.large_lp = 2.5;
            $scope.larger_lp = 3;
            $scope.night = 5;
            $scope.breadAte = 9;
            $scope.state = "detail";
        }
        $scope.test2 = function() {
            $scope.targetPt = 150000;
            $scope.currentPt = 0;
            $scope.urgent_lp = 3;
            $scope.large_lp = 2;
            $scope.larger_lp = 2;
            $scope.breadAte = 9;
            $scope.state = "simplify";
        }
        $scope.test3 = function() {
            $scope.targetPt = 60000000;
            $scope.currentPt = 0;
            $scope.urgent_lp = 3;
            $scope.large_lp = 1.75;
            $scope.larger_lp = 2;
            $scope.night = 7;
            $scope.breadAte = 120;
            $scope.state = "detail";
            $scope.multiple = 30;
            $scope.notSleep = true;
            $scope.isFullLevel = false;
            $scope.upgrade_consum_lp = 60;
        }

        stringToInt = function(input) {
            input = parseInt(input, 10);
        }

        saveDataToCookie = function() {
            console.log("saveDataToCookie");
            setCookie("state", $scope.state, 7);
            setCookie("targetPt", $scope.targetPt, 7);
            setCookie("currentPt", $scope.currentPt, 7);
            setCookie("deadlineDate", $scope.deadlineDate, 7);
            setCookie("deadlineTime", $scope.deadlineTime, 7);
            setCookie("own_lactate", $scope.own_lactate, 7);
            setCookie("own_drink", $scope.own_drink, 7);
            setCookie("own_bread", $scope.own_bread, 7);
            setCookie("currentPt", $scope.currentPt, 7);
            setCookie("urgent_lp", $scope.urgent_lp, 30);
            setCookie("large_lp", $scope.large_lp, 30);
            setCookie("larger_lp", $scope.larger_lp, 30);
            setCookie("night", $scope.night, 7);
            setCookie("breadAte", $scope.breadAte, 7);
            console.log("done");
        }

        isNumber = function(input) {
            if (angular.isNumber(input) && !isNaN(input)) {
                return true;
            } else {
                return false;
            }
        }

        $scope.countLP = function(input) {
            console.log("countLP" + input);
            if (input == 'Da') {
                $scope.Da_lp_50W = countLP_W($scope.Da_team1, $scope.Da_team2, $scope.Da_team3, 500000);
                $scope.Da_lp_75W = countLP_W($scope.Da_team1, $scope.Da_team2, $scope.Da_team3, 750000);
                $scope.Da_lp_100W = countLP_W($scope.Da_team1, $scope.Da_team2, $scope.Da_team3, 1000000);
            } else if (input == 'Vo') {
                $scope.Vo_lp_50W = countLP_W($scope.Vo_team1, $scope.Vo_team2, $scope.Vo_team3, 500000);
                $scope.Vo_lp_75W = countLP_W($scope.Vo_team1, $scope.Vo_team2, $scope.Vo_team3, 750000);
                $scope.Vo_lp_100W = countLP_W($scope.Vo_team1, $scope.Vo_team2, $scope.Vo_team3, 1000000);
            } else if (input == 'Pf') {
                $scope.Pf_lp_50W = countLP_W($scope.Pf_team1, $scope.Pf_team2, $scope.Pf_team3, 500000);
                $scope.Pf_lp_75W = countLP_W($scope.Pf_team1, $scope.Pf_team2, $scope.Pf_team3, 750000);
                $scope.Pf_lp_100W = countLP_W($scope.Pf_team1, $scope.Pf_team2, $scope.Pf_team3, 1000000);
            }
            console.log($scope.currentUrgentColor);

            if ($scope.currentUrgentColor == 'Da') {
                $scope.lp_50W = Math.min($scope.Vo_lp_50W, $scope.Pf_lp_50W);
                $scope.lp_75W = $scope.Da_lp_75W;
                $scope.lp_100W = $scope.Da_lp_100W;
            } else if ($scope.currentUrgentColor == 'Vo') {
                $scope.lp_50W = Math.min($scope.Da_lp_50W, $scope.Pf_lp_50W);
                $scope.lp_75W = $scope.Vo_lp_75W;
                $scope.lp_100W = $scope.Vo_lp_100W;
            } else if ($scope.currentUrgentColor == 'Pf') {
                $scope.lp_50W = Math.min($scope.Da_lp_50W, $scope.Vo_lp_50W);
                $scope.lp_75W = $scope.Pf_lp_75W;
                $scope.lp_100W = $scope.Pf_lp_100W;
            }

            if (isNumber($scope.lp_50W)) $scope.large_lp = $scope.lp_50W;
            if (isNumber($scope.lp_75W)) $scope.larger_lp = $scope.lp_75W;
            if (isNumber($scope.lp_100W)) $scope.urgent_lp = $scope.lp_100W;
        }

        countLP_W = function(team1, team2, team3, target) {
            console.log(team1, team2, team3, "target: " + target);
            var tmp = parseInt(target / ((team1 + team2 + team3) * 2)) * 3;
            console.log("tmp: " + tmp);
            target = target % ((team1 + team2 + team3) * 2);
            if (team1 >= target) {
                return tmp + 1;
            } else if ((team1 + team2) * 1.5 >= target) {
                return tmp + 2;
            } else if ((team1 + team2 + team3) * 2 >= target) {
                return tmp + 3;
            }
        }

        getDataFromCookie = function() {
            console.log("getDataFromCookie\n" + document.cookie);
            $scope.state = getCookie("state");
            if (!angular.isString($scope.state) || $scope.state == "") {
                $scope.state = "simplify"; //simplify, detail, prepare
            }
            $scope.targetPt = parseInt(getCookie("targetPt"), 10);
            $scope.currentPt = parseInt(getCookie("currentPt"), 10);
            if (!isNumber($scope.currentPt)) {
                $scope.currentPt = 0;
            }
            console.log("get date: " + getCookie("deadlineDate"))
            if (getCookie("deadlineDate") != "")
                $scope.deadlineDate = new Date(getCookie("deadlineDate"));
            console.log("$scope.deadlineDate: " + $scope.deadlineDate);
            if (getCookie("deadlineTime") != "")
                $scope.deadlineTime = new Date(getCookie("deadlineTime"));
            console.log("$scope.deadlineTime: " + $scope.deadlineTime);
            $scope.own_lactate = parseInt(getCookie("own_lactate"), 10);
            if (!isNumber($scope.own_lactate)) {
                $scope.own_lactate = 0;
            }
            $scope.own_drink = parseInt(getCookie("own_drink"), 10);
            if (!isNumber($scope.own_drink)) {
                $scope.own_drink = 0;
            }
            $scope.own_bread = parseInt(getCookie("own_bread"), 10);
            if (!isNumber($scope.own_bread)) {
                $scope.own_bread = 0;
            }
            $scope.urgent_lp = parseInt(getCookie("urgent_lp"), 10);
            $scope.large_lp = parseInt(getCookie("large_lp"), 10);
            $scope.larger_lp = parseInt(getCookie("larger_lp"), 10);
            $scope.night = parseInt(getCookie("night"), 10);
            if (!isNumber($scope.night)) {
                $scope.night = 5;
            }
            $scope.breadAte = parseInt(getCookie("breadAte"), 10);
            $scope.targetPtToPt5();
        }

        //constant
        $scope.typeOfRewards = ['乳酸', '運動飲料', '面包'];
        $scope.remainingTime = 0;
        $scope.max_night = 7;
        $scope.urgent_Pt = 15000;
        $scope.large_Pt = 6000;
        $scope.larger_Pt = 9000;
        lp_price = 10;


        $scope.state = "simplify"; //simplify, detail, prepare
        $scope.currentUrgentColor = 'Da';
        $scope.currentPt = 0;
        $scope.get_lactate = 0;
        $scope.get_drink = 0;
        $scope.get_bread = 0;
        $scope.showCards = false;


        $scope.defaultSetting();
        // console.log("current\n" + new Date().toISOString() + "\n" + new Date().getTime() + "\nISOString: " + new Date().toISOString());
        $scope.deadlineDate = new Date(new Date().setDate(new Date().getDate() + 7));
        $scope.deadlineDate.setHours(0);
        $scope.deadlineDate.setMinutes(0);
        $scope.deadlineDate.setSeconds(0);
        $scope.deadlineDate.setMilliseconds(0);
        // console.log("deadlineDate\n" + $scope.deadlineDate.toISOString() + "\n" + $scope.deadlineDate.getTime());
        $scope.deadlineTime = new Date(22 * 1000 * 60 * 60);

        getDataFromCookie(); //turn on when using localhost/server

        // $scope.test3(); //just for me testing
        $scope.update();


        $scope.scrollToTop = function() {
            $window.scrollTo(0, 0);
            console.log("scrollToTop");
        }
    }]);