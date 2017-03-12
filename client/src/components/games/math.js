import { inject, bindable } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { BattleService } from 'services/battle';
import { NavBar } from './../nav-bar';
import { EventAggregator } from 'aurelia-event-aggregator';
import io from 'socket.io-client';
import $ from 'jquery';

@inject(Router, BattleService, NavBar, EventAggregator)

export class Mathematic {
    @bindable username = '';

    constructor(router, battleService, navBar, eventAggregator) {
        this.router = router;
        this.srvBattle = battleService;
        this.navBar = navBar;
        this.eventAggregator = eventAggregator;
        this.socket = io('http://localhost:9000');
    }

    activate() {
        this.paneltype = 'default';
        this.allequations = [];
        this.equations = [];
        this.progress = 0;
        this.score = {
            positiv: 0,
            negative: 0
        };
        this.sphero = {
            pos: 0,
            steps: 0
        };

        this.username = localStorage.getItem('game-user');

        if (!this.username) {
            this.router.navigate("home");
        }

        this.socket.emit('getusers');
        this.socket.emit('adduser', this.username);

        this.guest = '';
    }

    attached() {
        let _this = this;

        this._socketsOn();
        this._initMath();
        this._getMeasures();
        this._setSpheroPosition();

        $(window).resize(function() {
            _this._getMeasures();
            _this._setSpheroPosition();
        });
    }

    submit() {
        $( "#formresult" ).focus();

        this.solution = this.numberone * this.numbertwo;

        if (this.solution == this.result) {
            this._answer_good();
        } else {
            this._answer_bad();
        }

        this._progress();
        this._saveEquation();
        this._initMath();
    }

    /**
     *  path = 100%
     *  middle = 50%
     *  forword = 10%
     *  backword = 10%
     */
    _getMeasures() {
        this.sphero_img = 155;
        this.sphero_path = $('.sphero-path').width() - this.sphero_img;
        this.middle = this.sphero_path / 2;
        this.forword = 10 * this.sphero_path / 100;
        this.backword = 10 * this.sphero_path / 100;
    }

    _setSpheroPosition() {
        var position = 0;

        if (this.sphero.steps !== 0) {
            position = this.forword * this.sphero.steps;
        }
        this.sphero.pos = this.middle + position;
    }

    _answer_bad() {
        this.score.negative += 2;
        this.paneltype = 'danger';
    }

    _answer_good() {
        this.score.positiv += 1;
        this.paneltype = 'success';
    }

    _progress() {
        this.pos_progress = 10 * this.score.positiv;
        this.neg_progress = 10 * this.score.negative;
    }

    _saveEquation() {
        var direction;

        this.equation = {
            numberone: this.numberone,
            numbertwo: this.numbertwo,
            result: this.result,
            solution: this.solution,
            type: this.paneltype
        };

        // If one of two progress have finished
        if (this.neg_progress == 100 || this.pos_progress == 100) {
            // save in all equations
            this.allequations = this.allequations.concat(this.equations);

            if (this.neg_progress == 100) {
                direction = 'backword';
            } else {
                direction = 'forword';
            }

            this.socket.emit('movesphero', {player: this.username, direction: direction});

            this._moveSphero({direction: direction});
            this._initEquation();
        } else {
            this.equations.push(this.equation);
        }
    }

    _initSphero() {
        this.srvBattle.init()
            .then(data => {
                $('body').removeClass('loading');
                console.log(data);
                this.devices = data;
            })
            .catch(error => {
                $('body').removeClass('loading');
                console.warn(error);
            });
    }

    _moveSphero(data) {

        this.srvBattle.move({direction: data.direction, player: this.username})
            .then(data => {
                console.log(data);
                this.devices = data;

            })
            .catch(error => {
                console.warn(error);
            });

        if (data.direction === 'forword') {
            this.sphero.pos += Number(this.forword);
            this.sphero.steps += 1;

        } else {
            this.sphero.pos -= Number(this.backword);
            this.sphero.steps -= 1;
        }
    }

    _initEquation() {
        this.equations = [];
        this.score = {
            positiv: 0,
            negative: 0
        };
        this.neg_progress = 0;
        this.pos_progress = 0;
    }

    _initMath() {
        var _this = this,
            myTime = '';

        this.result = '';
        console.log(Math.random());
        this.numberone = Math.floor(Math.random()*10)+1;
        this.numbertwo = Math.floor(Math.random()*10)+1;

        myTime = setTimeout(function(){
            _this.paneltype = 'default';
            clearTimeout(myTime);
        }, 3000);
    }

    _socketsOn() {
        let _this = this;

        this.socket.on('updatuser', function(user) {
            _this.guest = user;
            if (user) {
                _this._initSphero();
            }
        });

        this.socket.on('spheromoved', function(data) {
            _this._moveSphero(data);
        });

        // Set logged user / guest
        this.socket.on('setusers', function(data) {
            $('body').addClass('loading');

            if (!jQuery.isEmptyObject(data)) {
                let keys = Object.keys(data);
                _this.guest = data[keys[0]].username;
                $('body').removeClass('loading');
            }
        });
    }
}
