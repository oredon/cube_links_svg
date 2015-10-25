;(function($, window, document, undefined) {
  'use strict';

  // console.logエイリアス設定
  window.isLog = true;
  window.log = (function() {
    if (window.isLog) {
      if ((window.console !== null) && (window.console.log.bind !== null)) {
        return window.console.log.bind(window.console);
      } else {
        return window.alert;
      }
    } else {
      return function() {};
    }
  })();

  // APP
  var APP = function() {};
  var P = APP.prototype;

  // APP suffix string
  P.suf = ".cubeaction";

  // ドラッグ（スワイプ）イベント名判定
  P.isTouch   = "ontouchstart" in window;
  P.isMsTouch = (window.navigator.msMaxTouchPoints && window.navigator.msMaxTouchPoints > 1 ? true : false);
  P.isDrag    = false;
  P.dragstart = (P.isTouch ? "touchstart" : "mousedown") + P.suf;
  P.dragmove  = (P.isTouch ? "touchmove" : "mousemove") + P.suf;
  P.dragend   = (P.isTouch ? "touchend" : "mouseup") + P.suf;
  P.startx    = 0;
  P.starty    = 0;
  P.current_h = 0;
  P.current_v = 0;

  // svgアニメーション進捗状況カウンター
  P.doneSvgAnimCount = 0;

  /**
   * 実行本文 初回起動時に使用
   * @return
   */
  P.init = function() {
    // DOM取得
    var $cube;
    this.$body     = $("body");
    this.$document = $(document);
    this.$wrapper  = $("#wrapper");
    this.$cube     = $cube = $("#cube");
    this.$top      = $cube.find(".top");
    this.$front    = $cube.find(".front");
    this.$right    = $cube.find(".right");
    this.$back     = $cube.find(".back");
    this.$left     = $cube.find(".left");
    this.$bottom   = $cube.find(".bottom");
    this.$svgs     = $cube.find("svg");
    this.$faces    = $cube.find(".face");

    //イベント割り当て
    this.attachCubeAnimend();
    this.attachSvgAnimend();
  };

  /**
   * キューブの面の出現アニメーション終了時に次のアニメーションへ移行
   * @return
   */
  P.attachCubeAnimend = function() {
    var self = this;
    this.$top.on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function(e) {
      self.$faces.addClass("face_execAnim");
    });
  };

  /**
   * SVGアイコンアニメーションコントロール
   * @return
   */
  P.attachSvgAnimend = function() {
    var self = this;
    this.$svgs.eq(0).on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function(e) {
      switch (self.doneSvgAnimCount) {
        case 0:
          self.$faces.addClass("face_execAnim_fill");
          break;
        case 1:
          self.attachPointerAction();
          break;
      }
      self.doneSvgAnimCount++;
    });
  };

  /**
   * キューブをドラッグ（スワイプ）で動かす
   * @return 
   */
  P.attachPointerAction = function() {
    if (!this.$wrapper.hasClass("attachedPointerAction")) {
      this.$wrapper.addClass("attachedPointerAction");
      var self = this;
      var target_yoko = self.$cube.data("rotatey");
      var target_tate = self.$cube.data("rotatex");
      this.$document.on(this.dragstart, function(e) {
        self.isDrag = true;

        self.startx = (self.isTouch ? event.changedTouches[0].clientX : e.clientX);
        self.starty = (self.isTouch ? event.changedTouches[0].clientY : e.clientY);

      });
      this.$document.on(this.dragmove, function(e) {
        if (self.isDrag) {
          e.preventDefault();
          var clientx, clienty;
          clientx = (self.isTouch ? event.changedTouches[0].clientX : e.clientX);
          clienty = (self.isTouch ? event.changedTouches[0].clientY : e.clientY);

          var diffx, diffy;
          diffx = clientx - self.startx;
          diffy = clienty - self.starty;

          var curent_rotate_x = self.$cube.data("rotatex");
          var curent_rotate_y = self.$cube.data("rotatey");

          self.current_h = curent_rotate_x + diffx;
          self.current_v = curent_rotate_y + diffy;

          self.$cube.css("transform", "rotateX(" + self.current_v + "deg) rotateY(" + self.current_h + "deg)");


        }
      });
      this.$document.on(this.dragend, function(e) {
        self.isDrag = false;
        self.$cube.data("rotatex", self.current_h);
        self.$cube.data("rotatey", self.current_v);
      });
    }
  };

  // グローバルへ保存
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = APP; // for node test.
  } else {
    window.APP = new APP(); // for browser.
  }
}(jQuery, this, this.document));

// main routine
;(function($, window, document, undefined) {
  $(function() {
    APP.init();
    log(APP);
  });
}(jQuery, this, this.document));
