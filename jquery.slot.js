/*jslint white: true, nomen: true, maxlen: 120, plusplus: true, browser:true, */
/*global jQuery:false, $:false, */

/*!
 * jQuery Slot Plugin v0.0.2
 *
 * Copyright 2013 Takashi Maeda <tmaeda1981jp@gmail.com>
 * Released under the MIT license
 *
 * Date: 2013-12-11
 *
 * Usage:
 *
 * DOM
 *   <div class="slot">
 *     <ul>
 *       <li><img src="img/cat01.jpg" /></li>
 *       <li><img src="img/cat02.jpg" /></li>
 *       <li><img src="img/cat03.jpg" /></li>
 *       <li><img src="img/cat04.jpg" /></li>
 *       <li><img src="img/cat05.jpg" /></li>
 *     </ul>
 *   </div>
 *
 * 1) initialize
 *   $('.slot').slot({
 *     speed: 120,
 *     delay: 100
 *   });
 *
 *   or
 *
 *   $('.slot').slot();
 *
 * 2) start
 *  $('.slot').start();
 *
 * 3) stop
 *  $('.slot').stop();
 *
 */

(function($, window, document, undefined) {

  'use strict';

  var pluginName = 'slot',
      defaults = {
        speed: 250,
        delay: 100
      };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
  }

  Plugin.prototype = {
    start: function() {
      var self = this;
      this.$element.children('ul').each(function() {
        var $this = $(this), $li,
            $ulWrapper, listWidth, listHeight, listCount, loopHeight,
            loop = function() {
              $ulWrapper
                .css({top: '0'})
                .stop()
                .animate({
                  top: '-' + loopHeight + 'px'
                }, self.options.speed, 'linear');

              setTimeout(function() {
                loop();
              }, self.options.speed);
            };

        $this.wrap('<div class="slot_wrap"></div>');
        $ulWrapper = $this.parent();
        $li = $ulWrapper.children('ul').children('li');
        listWidth  = $li.width();
        listHeight = $li.height();
        listCount  = $li.length;
        loopHeight = listHeight * listCount;

        $ulWrapper.css({
          height: loopHeight * 2,
          width: listWidth,
          overflow: 'hidden',
          position: 'absolute'
        });

        loop();
        $ulWrapper.children('ul').clone().appendTo($ulWrapper);
      });
    },

    stop: function() {
      this.$element.children('.slot_wrap').each(function() {
        var $this = $(this), $ul = $this.find('ul'),
            listTags, listLength, orderOfTopImage, i;

        $this.stop();
        $ul.unwrap().last().remove();

        listTags   = $ul.first().find('li').toArray();
        listLength = listTags.length;

        // TODO randomで取得しているけれど，現在一番上にある要素の次の要素のindexで取ると，
        // speedを遅くした時によりキレイな動作になりそう.
        orderOfTopImage = Math.floor(Math.random() * listLength);

        for (i = 0; i < orderOfTopImage; i+=1) {
          listTags.push(listTags.shift());
        }
        $ul.first().empty();
        $.each(listTags, function(index, listTag) {
          $ul.append($(listTag));
        });
      });
    }
  };

  $.fn[pluginName] = function(options) {
    var args = arguments,
        result;

    if (options === undefined || typeof options === 'object') {
      result = this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    }
    else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      result = this.each(function(index) {
        var self = this,
            instance = $.data(self, 'plugin_' + pluginName);

        setTimeout(function() {
          if (instance instanceof Plugin && typeof instance[options] === 'function') {
            instance[options].apply(instance, Array.prototype.slice.call(args, 1));
          }
          if (options === 'destroy') {
            $.data(self, 'plugin_' + pluginName, null);
          }
        }, instance.options.delay * index);
      });
    }
    return result;
  };
}(jQuery, this, document));
