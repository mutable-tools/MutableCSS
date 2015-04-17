(function($) {
  var $window = $(window);
  var $document = $(document);

 /*
  * Scrollspy.
  */

 $document.on('flatdoc:ready', function() {
    $("h2, h3").scrollagent(function(cid, pid, currentElement, previousElement) {
      if (pid) {
       $("[href='#"+pid+"']").removeClass('active');
      }
      if (cid) {
       $("[href='#"+cid+"']").addClass('active');
      }
    });
  });

 /*
  * Anchor jump links.
  */

 $document.on('flatdoc:ready', function() {
   $('.menu a').anchorjump();
 });

 /*
  * Title card.
  */

  $(function() {

    // particles.js
    zodiac=new Zodiac("zodiac",{
      directionX:0,
      directionY:0,
      velocityX:[.1,.2],
      velocityY:[.2,.5],
      bounceX:!0,
      bounceY:!0,
      parallax:0,
      density:9999,
      dotRadius:[1,2],
      linkColor:"#BDC3C7",
      linkDistance:100,
      linkWidth:1
    });

    var $card = $('.title-card');
    if (!$card.length) return;

    var $header = $('.header');
    var headerHeight = $header.length ? $header.outerHeight() : 0;

    $window
      .on('resize.title-card', function() {
        var windowWidth = $window.width();

        if (windowWidth < 480) {
          $card.css('height', '');
        } else {
          var height = $window.height();
          $card.css('height', height - headerHeight);
        }
      })
      .trigger('resize.title-card');
  });

  /*
   * Sidebar stick.
   */

  $(function() {
    var $sidebar = $('.menubar');
    var elTop;

    $window
      .on('resize.sidestick', function() {
        $sidebar.removeClass('fixed');
        elTop = $sidebar.offset().top;
        $window.trigger('scroll.sidestick');
      })
      .on('scroll.sidestick', function() {
        var scrollY = $window.scrollTop();
        $sidebar.toggleClass('fixed', (scrollY >= elTop));
      })
      .trigger('resize.sidestick');
  });

  /*
  * Sidebar parallax
  */
  $(function(){
    // Parallax background.

    $('.menubar').css('background-position', '0 0, 0 0');
    $window.on('scroll.strata_parallax', function() {
      $('.menubar').css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / 20)) + 'px');
    });

  })

})(jQuery);
/*! jQuery.scrollagent (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/scrollagent */

// Call $(...).scrollagent() with a callback function.
//
// The callback will be called everytime the focus changes.
//
// Example:
//
//      $("h2").scrollagent(function(cid, pid, currentElement, previousElement) {
//        if (pid) {
//          $("[href='#"+pid+"']").removeClass('active');
//        }
//        if (cid) {
//          $("[href='#"+cid+"']").addClass('active');
//        }
//      });

(function($) {

  $.fn.scrollagent = function(options, callback) {
    // Account for $.scrollspy(function)
    if (typeof callback === 'undefined') {
      callback = options;
      options = {};
    }

    var $sections = $(this);
    var $parent = options.parent || $(window);

    // Find the top offsets of each section
    var offsets = [];
    $sections.each(function(i) {
      var offset = $(this).attr('data-anchor-offset') ?
        parseInt($(this).attr('data-anchor-offset'), 10) :
        (options.offset || 0);

      offsets.push({
        id: $(this).attr('id'),
        index: i,
        el: this,
        offset: offset
      });
    });

    // State
    var current = null;
    var height = null;
    var range = null;

    // Save the height. Do this only whenever the window is resized so we don't
    // recalculate often.
    $(window).on('resize', function() {
      height = $parent.height();
      range = $(document).height();
    });

    // Find the current active section every scroll tick.
    $parent.on('scroll', function() {
      var y = $parent.scrollTop();
      y += height * (0.3 + 0.7 * Math.pow(y/range, 2));

      var latest = null;

      for (var i in offsets) {
        if (offsets.hasOwnProperty(i)) {
          var offset = offsets[i];
          if ($(offset.el).offset().top + offset.offset < y) latest = offset;
        }
      }

      if (latest && (!current || (latest.index !== current.index))) {
        callback.call($sections,
          latest ? latest.id : null,
          current ? current.id : null,
          latest ? latest.el : null,
          current ? current.el : null);
        current = latest;
      }
    });

    $(window).trigger('resize');
    $parent.trigger('scroll');

    return this;
  };

})(jQuery);
/*! Anchorjump (c) 2012, Rico Sta. Cruz. MIT License.
 *   http://github.com/rstacruz/jquery-stuff/tree/master/anchorjump */

// Makes anchor jumps happen with smooth scrolling.
//
//    $("#menu a").anchorjump();
//    $("#menu a").anchorjump({ offset: -30 });
//
//    // Via delegate:
//    $("#menu").anchorjump({ for: 'a', offset: -30 });
//
// You may specify a parent. This makes it scroll down to the parent.
// Great for tabbed views.
//
//     $('#menu a').anchorjump({ parent: '.anchor' });
//
// You can jump to a given area.
//
//     $.anchorjump('#bank-deposit', options);

(function($) {
  var defaults = {
    'speed': 200,
    'offset': 0,
    'for': null,
    'parent': null
  };

  $.fn.anchorjump = function(options) {
    options = $.extend({}, defaults, options);

    if (options['for']) {
      this.on('click', options['for'], onClick);
    } else {
      this.on('click', onClick);
    }

    function onClick(e) {
      var $a = $(e.target).closest('a');
      if (e.ctrlKey || e.metaKey || e.altKey || $a.attr('target')) return;

      e.preventDefault();
      var href = $a.attr('href');

      $.anchorjump(href, options);
    }
  };

  // Jump to a given area.
  $.anchorjump = function(href, options) {
    options = $.extend({}, defaults, options);

    var top = 0;

    if (href != '#') {
      var $area = $(href);
      // Find the parent
      if (options.parent) {
        var $parent = $area.closest(options.parent);
        if ($parent.length) { $area = $parent; }
      }
      if (!$area.length) { return; }

      // Determine the pixel offset; use the default if not available
      var offset =
        $area.attr('data-anchor-offset') ?
        parseInt($area.attr('data-anchor-offset'), 10) :
        options.offset;

      top = Math.max(0, $area.offset().top + offset);
    }

    $('html, body').animate({ scrollTop: top }, options.speed);
    $('body').trigger('anchor', href);

    // Add the location hash via pushState.
    if (window.history.pushState) {
      window.history.pushState({ href: href }, "", href);
    }
  };
})(jQuery);

// particles
/*!
 * Zodiac
 *
 * @author Stefan Keim (indus)
 * @version 0.1.1
 * @description canvas based particle background
 *
 * Inspired by https://github.com/jnicol/particleground
 */
"use static";"use static";var Zodiac=function(){function n(n,t){function l(n){e.x=n.pageX-window.innerWidth/2;e.y=n.pageY-window.innerHeight/2}function a(n){e.x=Math.min(Math.max(-n.gamma,-30),30)*(window.innerWidth/30);e.y=Math.min(Math.max(-n.beta,-30),30)*(window.innerHeight/30)}var h=this,n,o,s;if(t===void 0&&(t={}),this.options={directionX:-1,directionY:-1,velocityX:[.1,.2],velocityY:[.5,1],bounceX:!0,bounceY:!1,parallax:.2,pivot:0,density:6e3,dotRadius:[1,5],linkColor:"rgba(99,99,99,.8)",linkDistance:50,linkWidth:2},n=typeof n=="string"||n instanceof String?document.getElementById(n):n,n.tagName=="CANVAS"){for(o in t)this.options[o]=t[o];t=this.options;var i=this._ctx=n.getContext("2d",{alpha:!t.backgroundColor}),e={x:0,y:0},r,u,f,c=function(){var l,n,o,s,v,a;for(t.backgroundColor?(i.fillStyle=t.backgroundColor,i.fillRect(0,0,u,f),i.fillStyle=t.dotColor):i.clearRect(0,0,u,f),i.beginPath(),l=0;l<r.length;l++)for(n=r[l],n.x+=n.vx,n.y+=n.vy,t.parallax&&(v=n.z*t.parallax,n.dx+=(e.x*v-n.dx)/10,n.dy+=(e.y*v-n.dy)/10),o=n.x+n.dx,s=n.y+n.dy,(o<0||o>u)&&(t.bounceX?n.vx=-n.vx:n.x=(o+u)%u-n.dx),(s<0||s>f)&&(t.bounceY?n.vy=-n.vy:n.y=(s+f)%f-n.dy),i.moveTo(o+n.r,s),i.arc(o,s,n.r,0,Math.PI*2),a=l-1;a>=0;a--){var h=r[a],w=h.x-n.x,b=h.y-n.y,nt=Math.sqrt(w*w+b*b);if(nt<t.linkDistance){var o=n.x+n.dx,s=n.y+n.dy,y=h.x+h.dx,p=h.y+h.dy,k=Math.atan2(p-s,y-o),d=Math.cos(k),g=Math.sin(k);o+=n.r*d;s+=n.r*g;y-=h.r*d;p-=h.r*g;i.moveTo(o,s);i.lineTo(y,p)}}i.stroke();t.dotColor&&i.fill();requestAnimationFrame(c)};s=this._refresh=function(){var e,s,v;r=h._=h._||[];e=[].concat(t.dotRadius);e[0]==e[1]&&(e=e[0]);u=n.width=n.offsetWidth;f=n.height=n.offsetHeight;var c=t.velocityX,l=t.velocityY,o=Math.random,a=Math.ceil(u*f/t.density);for(s=r.length-1;s>=0;s--)(r[s].x>u||r[s].y>f)&&r.splice(s,1);for(a<r.length&&r.splice(a);a>r.length;)v=o(),r.push({z:(v-t.pivot)/4,r:e[1]?v*(e[1]-e[0])+e[0]:e[0],x:Math.ceil(o()*u),y:Math.ceil(o()*f),vx:(t.directionX||(o()>.5?1:-1))*(o()*(c[1]-c[0])+c[0]),vy:(t.directionY||(o()>.5?1:-1))*(o()*(l[1]-l[0])+l[0]),dx:0,dy:0});i.strokeStyle=t.linkColor;i.lineWidth=t.linkWidth;i.fillStyle=t.dotColor};window.addEventListener("resize",s,!1);document.addEventListener("mousemove",l,!1);window.addEventListener("deviceorientation",a,!1);s();c()}}return n}(),Hermes,zodiac;(function(){for(var i=0,t=["ms","moz","webkit","o"],n=0;n<t.length&&!window.requestAnimationFrame;++n)window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(n){var t=(new Date).getTime(),r=Math.max(0,16-(t-i)),u=window.setTimeout(function(){n(t+r)},r);return i=t+r,u});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(n){clearTimeout(n)})})();