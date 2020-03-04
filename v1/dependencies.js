/*!
 * Author: Abdullah A Almsaeed
 * Date: 4 Jan 2014
 * Description:
 *      This file should be included in all pages
 !**/

/*
 * Global variables. If you change any of these vars, don't forget
 * to change the values in the less files!
 */
var left_side_width = 220; //Sidebar width in pixels

$(function() {
    "use strict";

    //Enable sidebar toggle
    $("[data-toggle='offcanvas']").click(function(e) {
        e.preventDefault();

        //If window is small enough, enable sidebar push menu
        if ($(window).width() <= 992) {
            $('.row-offcanvas').toggleClass('active');
            $('.left-side').removeClass("collapse-left");
            $(".right-side").removeClass("strech");
            $('.row-offcanvas').toggleClass("relative");
        } else {
            //Else, enable content streching
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
        }
    });

    //Add hover support for touch devices
    $('.btn').bind('touchstart', function() {
        $(this).addClass('hover');
    }).bind('touchend', function() {
        $(this).removeClass('hover');
    });

    //Activate tooltips
    $("[data-toggle='tooltip']").tooltip();

    /*
     * Add collapse and remove events to boxes
     */
    $("[data-widget='collapse']").click(function() {
        //Find the box parent
        var box = $(this).parents(".box").first();
        //Find the body and the footer
        var bf = box.find(".box-body, .box-footer");
        if (!box.hasClass("collapsed-box")) {
            box.addClass("collapsed-box");
            //Convert minus into plus
            $(this).children(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
            bf.slideUp();
        } else {
            box.removeClass("collapsed-box");
            //Convert plus into minus
            $(this).children(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
            bf.slideDown();
        }
    });

    /*
     * ADD SLIMSCROLL TO THE TOP NAV DROPDOWNS
     * ---------------------------------------
     */
    $(".navbar .menu").slimscroll({
        height: "200px",
        alwaysVisible: false,
        size: "3px"
    }).css("width", "100%");

    /*
     * INITIALIZE BUTTON TOGGLE
     * ------------------------
     */
    $('.btn-group[data-toggle="btn-toggle"]').each(function() {
        var group = $(this);
        $(this).find(".btn").click(function(e) {
            group.find(".btn.active").removeClass("active");
            $(this).addClass("active");
            e.preventDefault();
        });

    });

    $("[data-widget='remove']").click(function() {
        //Find the box parent
        var box = $(this).parents(".box").first();
        box.slideUp();
    });

    /* Sidebar tree view */
    $(".sidebar .treeview").tree();

    /*
     * Make sure that the sidebar is streched full height
     * ---------------------------------------------
     * We are gonna assign a min-height value every time the
     * wrapper gets resized and upon page load. We will use
     * Ben Alman's method for detecting the resize event.
     *
     **/
    function _fix() {
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height() - ($("body > .footer").outerHeight() || 0);
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
        //If the wrapper height is greater than the window
        if (content > height)
            //then set sidebar height to the wrapper
            $(".left-side, html, body").css("min-height", content + "px");
        else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css("min-height", height + "px");
        }
    }
    //Fire upon load
    _fix();
    //Fire when wrapper is resized
    $(".wrapper").resize(function() {
        _fix();
        fix_sidebar();
    });

    //Fix the fixed layout sidebar scroll bug
    fix_sidebar();

    // /*
    //  * We are gonna initialize all checkbox and radio inputs to
    //  * iCheck plugin in.
    //  * You can find the documentation at http://fronteed.com/iCheck/
    //  */
    // $("input[type='checkbox']:not(.simple), input[type='radio']:not(.simple)").iCheck({
    //     checkboxClass: 'icheckbox_minimal',
    //     radioClass: 'iradio_minimal'
    // });

});
function fix_sidebar() {
    //Make sure the body tag has the .fixed class
    if (!$("body").hasClass("fixed")) {
        return;
    }

    // //Add slimscroll
    // $(".sidebar").slimscroll({
    //     height: ($(window).height() - $(".header").height()) + "px",
    //     color: "rgba(0,0,0,0.2)"
    // });
}

/*END DEMO*/
$(window).load(function() {
    /*! pace 0.4.17 */
    (function() {
        var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V = [].slice, W = {}.hasOwnProperty, X = function(a, b) {
            function c() {
                this.constructor = a
            }
            for (var d in b)
                W.call(b, d) && (a[d] = b[d]);
            return c.prototype = b.prototype, a.prototype = new c, a.__super__ = b.prototype, a
        }, Y = [].indexOf || function(a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (b in this && this[b] === a)
                    return b;
            return-1
        };
        for (t = {catchupTime:500, initialRate:.03, minTime:500, ghostTime:500, maxProgressPerFrame:10, easeFactor:1.25, startOnPageLoad:!0, restartOnPushState:!0, restartOnRequestAfter:500, target:"body", elements:{checkInterval:100, selectors:["body"]}, eventLag:{minSamples:10, sampleCount:3, lagThreshold:3}, ajax:{trackMethods:["GET"], trackWebSockets:!1}}, B = function() {
            var a;
            return null != (a = "undefined" != typeof performance && null !== performance ? "function" == typeof performance.now ? performance.now() : void 0 : void 0) ? a : +new Date
        }, D = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, s = window.cancelAnimationFrame || window.mozCancelAnimationFrame, null == D && (D = function(a) {
            return setTimeout(a, 50)
        }, s = function(a) {
            return clearTimeout(a)
        }), F = function(a) {
            var b, c;
            return b = B(), (c = function() {
                var d;
                return d = B() - b, d >= 33 ? (b = B(), a(d, function() {
                    return D(c)
                })) : setTimeout(c, 33 - d)
            })()
        }, E = function() {
            var a, b, c;
            return c = arguments[0], b = arguments[1], a = 3 <= arguments.length ? V.call(arguments, 2) : [], "function" == typeof c[b] ? c[b].apply(c, a) : c[b]
        }, u = function() {
            var a, b, c, d, e, f, g;
            for (b = arguments[0], d = 2 <= arguments.length?V.call(arguments, 1):[], f = 0, g = d.length; g > f; f++)
                if (c = d[f])
                    for (a in c)
                        W.call(c, a) && (e = c[a], null != b[a] && "object" == typeof b[a] && null != e && "object" == typeof e ? u(b[a], e) : b[a] = e);
            return b
        }, p = function(a) {
            var b, c, d, e, f;
            for (c = b = 0, e = 0, f = a.length; f > e; e++)
                d = a[e], c += Math.abs(d), b++;
            return c / b
        }, w = function(a, b) {
            var c, d, e;
            if (null == a && (a = "options"), null == b && (b = !0), e = document.querySelector("[data-pace-" + a + "]")) {
                if (c = e.getAttribute("data-pace-" + a), !b)
                    return c;
                try {
                    return JSON.parse(c)
                } catch (f) {
                    return d = f, "undefined" != typeof console && null !== console ? console.error("Error parsing inline pace options", d) : void 0
                }
            }
        }, g = function() {
            function a() {
            }
            return a.prototype.on = function(a, b, c, d) {
                var e;
                return null == d && (d = !1), null == this.bindings && (this.bindings = {}), null == (e = this.bindings)[a] && (e[a] = []), this.bindings[a].push({handler: b, ctx: c, once: d})
            }, a.prototype.once = function(a, b, c) {
                return this.on(a, b, c, !0)
            }, a.prototype.off = function(a, b) {
                var c, d, e;
                if (null != (null != (d = this.bindings) ? d[a] : void 0)) {
                    if (null == b)
                        return delete this.bindings[a];
                    for (c = 0, e = []; c < this.bindings[a].length; )
                        this.bindings[a][c].handler === b ? e.push(this.bindings[a].splice(c, 1)) : e.push(c++);
                    return e
                }
            }, a.prototype.trigger = function() {
                var a, b, c, d, e, f, g, h, i;
                if (c = arguments[0], a = 2 <= arguments.length ? V.call(arguments, 1) : [], null != (g = this.bindings) ? g[c] : void 0) {
                    for (e = 0, i = []; e < this.bindings[c].length; )
                        h = this.bindings[c][e], d = h.handler, b = h.ctx, f = h.once, d.apply(null != b ? b : this, a), f ? i.push(this.bindings[c].splice(e, 1)) : i.push(e++);
                    return i
                }
            }, a
        }(), null == window.Pace && (window.Pace = {}), u(Pace, g.prototype), C = Pace.options = u({}, t, window.paceOptions, w()), S = ["ajax", "document", "eventLag", "elements"], O = 0, Q = S.length; Q > O; O++)
            I = S[O], C[I] === !0 && (C[I] = t[I]);
        i = function(a) {
            function b() {
                return T = b.__super__.constructor.apply(this, arguments)
            }
            return X(b, a), b
        }(Error), b = function() {
            function a() {
                this.progress = 0
            }
            return a.prototype.getElement = function() {
                var a;
                if (null == this.el) {
                    if (a = document.querySelector(C.target), !a)
                        throw new i;
                    this.el = document.createElement("div"), this.el.className = "pace pace-active", document.body.className = document.body.className.replace("pace-done", ""), document.body.className += " pace-running", this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>', null != a.firstChild ? a.insertBefore(this.el, a.firstChild) : a.appendChild(this.el)
                }
                return this.el
            }, a.prototype.finish = function() {
                var a;
                return a = this.getElement(), a.className = a.className.replace("pace-active", ""), a.className += " pace-inactive", document.body.className = document.body.className.replace("pace-running", ""), document.body.className += " pace-done"
            }, a.prototype.update = function(a) {
                return this.progress = a, this.render()
            }, a.prototype.destroy = function() {
                try {
                    this.getElement().parentNode.removeChild(this.getElement())
                } catch (a) {
                    i = a
                }
                return this.el = void 0
            }, a.prototype.render = function() {
                var a, b;
                return null == document.querySelector(C.target) ? !1 : (a = this.getElement(), a.children[0].style.width = "" + this.progress + "%", (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (a.children[0].setAttribute("data-progress-text", "" + (0 | this.progress) + "%"), this.progress >= 100 ? b = "99" : (b = this.progress < 10 ? "0" : "", b += 0 | this.progress), a.children[0].setAttribute("data-progress", "" + b)), this.lastRenderedProgress = this.progress)
            }, a.prototype.done = function() {
                return this.progress >= 100
            }, a
        }(), h = function() {
            function a() {
                this.bindings = {}
            }
            return a.prototype.trigger = function(a, b) {
                var c, d, e, f, g;
                if (null != this.bindings[a]) {
                    for (f = this.bindings[a], g = [], d = 0, e = f.length; e > d; d++)
                        c = f[d], g.push(c.call(this, b));
                    return g
                }
            }, a.prototype.on = function(a, b) {
                var c;
                return null == (c = this.bindings)[a] && (c[a] = []), this.bindings[a].push(b)
            }, a
        }(), N = window.XMLHttpRequest, M = window.XDomainRequest, L = window.WebSocket, v = function(a, b) {
            var c, d, e, f;
            f = [];
            for (d in b.prototype)
                try {
                    e = b.prototype[d], null == a[d] && "function" != typeof e ? f.push(a[d] = e) : f.push(void 0)
                } catch (g) {
                    c = g
                }
            return f
        }, z = [], Pace.ignore = function() {
            var a, b, c;
            return b = arguments[0], a = 2 <= arguments.length ? V.call(arguments, 1) : [], z.unshift("ignore"), c = b.apply(null, a), z.shift(), c
        }, Pace.track = function() {
            var a, b, c;
            return b = arguments[0], a = 2 <= arguments.length ? V.call(arguments, 1) : [], z.unshift("track"), c = b.apply(null, a), z.shift(), c
        }, H = function(a) {
            var b;
            if (null == a && (a = "GET"), "track" === z[0])
                return"force";
            if (!z.length && C.ajax) {
                if ("socket" === a && C.ajax.trackWebSockets)
                    return!0;
                if (b = a.toUpperCase(), Y.call(C.ajax.trackMethods, b) >= 0)
                    return!0
            }
            return!1
        }, j = function(a) {
            function b() {
                var a, c = this;
                b.__super__.constructor.apply(this, arguments), a = function(a) {
                    var b;
                    return b = a.open, a.open = function(d, e) {
                        return H(d) && c.trigger("request", {type: d, url: e, request: a}), b.apply(a, arguments)
                    }
                }, window.XMLHttpRequest = function(b) {
                    var c;
                    return c = new N(b), a(c), c
                }, v(window.XMLHttpRequest, N), null != M && (window.XDomainRequest = function() {
                    var b;
                    return b = new M, a(b), b
                }, v(window.XDomainRequest, M)), null != L && C.ajax.trackWebSockets && (window.WebSocket = function(a, b) {
                    var d;
                    return d = new L(a, b), H("socket") && c.trigger("request", {type: "socket", url: a, protocols: b, request: d}), d
                }, v(window.WebSocket, L))
            }
            return X(b, a), b
        }(h), P = null, x = function() {
            return null == P && (P = new j), P
        }, x().on("request", function(b) {
            var c, d, e, f;
            return f = b.type, e = b.request, Pace.running || C.restartOnRequestAfter === !1 && "force" !== H(f) ? void 0 : (d = arguments, c = C.restartOnRequestAfter || 0, "boolean" == typeof c && (c = 0), setTimeout(function() {
                var b, c, g, h, i, j;
                if (b = "socket" === f ? e.readyState < 2 : 0 < (h = e.readyState) && 4 > h) {
                    for (Pace.restart(), i = Pace.sources, j = [], c = 0, g = i.length; g > c; c++) {
                        if (I = i[c], I instanceof a) {
                            I.watch.apply(I, d);
                            break
                        }
                        j.push(void 0)
                    }
                    return j
                }
            }, c))
        }), a = function() {
            function a() {
                var a = this;
                this.elements = [], x().on("request", function() {
                    return a.watch.apply(a, arguments)
                })
            }
            return a.prototype.watch = function(a) {
                var b, c, d;
                return d = a.type, b = a.request, c = "socket" === d ? new m(b) : new n(b), this.elements.push(c)
            }, a
        }(), n = function() {
            function a(a) {
                var b, c, d, e, f, g, h = this;
                if (this.progress = 0, null != window.ProgressEvent)
                    for (c = null, a.addEventListener("progress", function(a) {
                        return h.progress = a.lengthComputable ? 100 * a.loaded / a.total : h.progress + (100 - h.progress) / 2
                    }), g = ["load", "abort", "timeout", "error"], d = 0, e = g.length; e > d; d++)
                        b = g[d], a.addEventListener(b, function() {
                            return h.progress = 100
                        });
                else
                    f = a.onreadystatechange, a.onreadystatechange = function() {
                        var b;
                        return 0 === (b = a.readyState) || 4 === b ? h.progress = 100 : 3 === a.readyState && (h.progress = 50), "function" == typeof f ? f.apply(null, arguments) : void 0
                    }
            }
            return a
        }(), m = function() {
            function a(a) {
                var b, c, d, e, f = this;
                for (this.progress = 0, e = ["error", "open"], c = 0, d = e.length; d > c; c++)
                    b = e[c], a.addEventListener(b, function() {
                        return f.progress = 100
                    })
            }
            return a
        }(), d = function() {
            function a(a) {
                var b, c, d, f;
                for (null == a && (a = {}), this.elements = [], null == a.selectors && (a.selectors = []), f = a.selectors, c = 0, d = f.length; d > c; c++)
                    b = f[c], this.elements.push(new e(b))
            }
            return a
        }(), e = function() {
            function a(a) {
                this.selector = a, this.progress = 0, this.check()
            }
            return a.prototype.check = function() {
                var a = this;
                return document.querySelector(this.selector) ? this.done() : setTimeout(function() {
                    return a.check()
                }, C.elements.checkInterval)
            }, a.prototype.done = function() {
                return this.progress = 100
            }, a
        }(), c = function() {
            function a() {
                var a, b, c = this;
                this.progress = null != (b = this.states[document.readyState]) ? b : 100, a = document.onreadystatechange, document.onreadystatechange = function() {
                    return null != c.states[document.readyState] && (c.progress = c.states[document.readyState]), "function" == typeof a ? a.apply(null, arguments) : void 0
                }
            }
            return a.prototype.states = {loading: 0, interactive: 50, complete: 100}, a
        }(), f = function() {
            function a() {
                var a, b, c, d, e, f = this;
                this.progress = 0, a = 0, e = [], d = 0, c = B(), b = setInterval(function() {
                    var g;
                    return g = B() - c - 50, c = B(), e.push(g), e.length > C.eventLag.sampleCount && e.shift(), a = p(e), ++d >= C.eventLag.minSamples && a < C.eventLag.lagThreshold ? (f.progress = 100, clearInterval(b)) : f.progress = 100 * (3 / (a + 3))
                }, 50)
            }
            return a
        }(), l = function() {
            function a(a) {
                this.source = a, this.last = this.sinceLastUpdate = 0, this.rate = C.initialRate, this.catchup = 0, this.progress = this.lastProgress = 0, null != this.source && (this.progress = E(this.source, "progress"))
            }
            return a.prototype.tick = function(a, b) {
                var c;
                return null == b && (b = E(this.source, "progress")), b >= 100 && (this.done = !0), b === this.last ? this.sinceLastUpdate += a : (this.sinceLastUpdate && (this.rate = (b - this.last) / this.sinceLastUpdate), this.catchup = (b - this.progress) / C.catchupTime, this.sinceLastUpdate = 0, this.last = b), b > this.progress && (this.progress += this.catchup * a), c = 1 - Math.pow(this.progress / 100, C.easeFactor), this.progress += c * this.rate * a, this.progress = Math.min(this.lastProgress + C.maxProgressPerFrame, this.progress), this.progress = Math.max(0, this.progress), this.progress = Math.min(100, this.progress), this.lastProgress = this.progress, this.progress
            }, a
        }(), J = null, G = null, q = null, K = null, o = null, r = null, Pace.running = !1, y = function() {
            return C.restartOnPushState ? Pace.restart() : void 0
        }, null != window.history.pushState && (R = window.history.pushState, window.history.pushState = function() {
            return y(), R.apply(window.history, arguments)
        }), null != window.history.replaceState && (U = window.history.replaceState, window.history.replaceState = function() {
            return y(), U.apply(window.history, arguments)
        }), k = {ajax: a, elements: d, document: c, eventLag: f}, (A = function() {
            var a, c, d, e, f, g, h, i;
            for (Pace.sources = J = [], g = ["ajax", "elements", "document", "eventLag"], c = 0, e = g.length; e > c; c++)
                a = g[c], C[a] !== !1 && J.push(new k[a](C[a]));
            for (i = null != (h = C.extraSources)?h:[], d = 0, f = i.length; f > d; d++)
                I = i[d], J.push(new I(C));
            return Pace.bar = q = new b, G = [], K = new l
        })(), Pace.stop = function() {
            return Pace.trigger("stop"), Pace.running = !1, q.destroy(), r = !0, null != o && ("function" == typeof s && s(o), o = null), A()
        }, Pace.restart = function() {
            return Pace.trigger("restart"), Pace.stop(), Pace.start()
        }, Pace.go = function() {
            return Pace.running = !0, q.render(), r = !1, o = F(function(a, b) {
                var c, d, e, f, g, h, i, j, k, m, n, o, p, s, t, u, v;
                for (j = 100 - q.progress, d = o = 0, e = !0, h = p = 0, t = J.length; t > p; h = ++p)
                    for (I = J[h], m = null != G[h]?G[h]:G[h] = [], g = null != (v = I.elements)?v:[I], i = s = 0, u = g.length; u > s; i = ++s)
                        f = g[i], k = null != m[i] ? m[i] : m[i] = new l(f), e &= k.done, k.done || (d++, o += k.tick(a));
                return c = o / d, q.update(K.tick(a, c)), n = B(), q.done() || e || r ? (q.update(100), Pace.trigger("done"), setTimeout(function() {
                    return q.finish(), Pace.running = !1, Pace.trigger("hide")
                }, Math.max(C.ghostTime, Math.min(C.minTime, B() - n)))) : b()
            })
        }, Pace.start = function(a) {
            u(C, a), Pace.running = !0;
            try {
                q.render()
            } catch (b) {
                i = b
            }
            return document.querySelector(".pace") ? (Pace.trigger("start"), Pace.go()) : setTimeout(Pace.start, 50)
        }, "function" == typeof define && define.amd ? define('theme-app', [], function() {
            return Pace
        }) : "object" == typeof exports ? module.exports = Pace : C.startOnPageLoad && Pace.start()
    }).call(this);
});

/*
 * BOX REFRESH BUTTON
 * ------------------
 * This is a custom plugin to use with the compenet BOX. It allows you to add
 * a refresh button to the box. It converts the box's state to a loading state.
 *
 * USAGE:
 *  $("#box-widget").boxRefresh( options );
 * */
(function($) {
    "use strict";

    $.fn.boxRefresh = function(options) {

        // Render options
        var settings = $.extend({
            //Refressh button selector
            trigger: ".refresh-btn",
            //File source to be loaded (e.g: ajax/src.php)
            source: "",
            //Callbacks
            onLoadStart: function(box) {
            }, //Right after the button has been clicked
            onLoadDone: function(box) {
            } //When the source has been loaded

        }, options);

        //The overlay
        var overlay = $('<div class="overlay"></div><div class="loading-img"></div>');

        return this.each(function() {
            //if a source is specified
            if (settings.source === "") {
                if (console) {
                    console.log("Please specify a source first - boxRefresh()");
                }
                return;
            }
            //the box
            var box = $(this);
            //the button
            var rBtn = box.find(settings.trigger).first();

            //On trigger click
            rBtn.click(function(e) {
                e.preventDefault();
                //Add loading overlay
                start(box);

                //Perform ajax call
                box.find(".box-body").load(settings.source, function() {
                    done(box);
                });


            });

        });

        function start(box) {
            //Add overlay and loading img
            box.append(overlay);

            settings.onLoadStart.call(box);
        }

        function done(box) {
            //Remove overlay and loading img
            box.find(overlay).remove();

            settings.onLoadDone.call(box);
        }

    };

})(jQuery);

/*
 * SIDEBAR MENU
 * ------------
 * This is a custom plugin for the sidebar menu. It provides a tree view.
 *
 * Usage:
 * $(".sidebar).tree();
 *
 * Note: This plugin does not accept any options. Instead, it only requires a class
 *       added to the element that contains a sub-menu.
 *
 * When used with the sidebar, for example, it would look something like this:
 * <ul class='sidebar-menu'>
 *      <li class="treeview active">
 *          <a href="#>Menu</a>
 *          <ul class='treeview-menu'>
 *              <li class='active'><a href=#>Level 1</a></li>
 *          </ul>
 *      </li>
 * </ul>
 *
 * Add .active class to <li> elements if you want the menu to be open automatically
 * on page load. See above for an example.
 */
(function($) {
    "use strict";

    $.fn.tree = function() {

        return this.each(function() {
            var btn = $(this).children("a").first();
            var menu = $(this).children(".treeview-menu").first();
            var isActive = $(this).hasClass('active');

            //initialize already active menus
            if (isActive) {
                menu.show();
                btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
            }
            //Slide open or close the menu on link click
            btn.click(function(e) {
                e.preventDefault();
                if (isActive) {
                    //Slide up to close menu
                    menu.slideUp();
                    isActive = false;
                    btn.children(".fa-angle-down").first().removeClass("fa-angle-down").addClass("fa-angle-left");
                    btn.parent("li").removeClass("active");
                } else {
                    //Slide down to open menu
                    menu.slideDown();
                    isActive = true;
                    btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
                    btn.parent("li").addClass("active");
                }
            });

            /* Add margins to submenu elements to give it a tree look */
            menu.find("li > a").each(function() {
                var pad = parseInt($(this).css("margin-left")) + 10;

                $(this).css({"margin-left": pad + "px"});
            });

        });

    };


}(jQuery));

// /*
//  * TODO LIST CUSTOM PLUGIN
//  * -----------------------
//  * This plugin depends on iCheck plugin for checkbox and radio inputs
//  */
// (function($) {
//     "use strict";
//
//     $.fn.todolist = function(options) {
//         // Render options
//         var settings = $.extend({
//             //When the user checks the input
//             onCheck: function(ele) {
//             },
//             //When the user unchecks the input
//             onUncheck: function(ele) {
//             }
//         }, options);
//
//         return this.each(function() {
//             $('input', this).on('ifChecked', function(event) {
//                 var ele = $(this).parents("li").first();
//                 ele.toggleClass("done");
//                 settings.onCheck.call(ele);
//             });
//
//             $('input', this).on('ifUnchecked', function(event) {
//                 var ele = $(this).parents("li").first();
//                 ele.toggleClass("done");
//                 settings.onUncheck.call(ele);
//             });
//         });
//     };
//
// }(jQuery));

/* CENTER ELEMENTS */
(function($) {
    "use strict";
    jQuery.fn.center = function(parent) {
        if (parent) {
            parent = this.parent();
        } else {
            parent = window;
        }
        this.css({
            "position": "absolute",
            "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
            "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
        });
        return this;
    }
}(jQuery));

/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($, h, c) {
    var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {setup: function() {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {w: l.width(), h: l.height()});
            if (a.length === 1) {
                g();
            }
        }, teardown: function() {
            if (!e[f] && this[k]) {
                return false
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        }, add: function(l) {
            if (!e[f] && this[k]) {
                return false
            }
            var n;
            function m(s, o, p) {
                var q = $(this), r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments)
            }
            if ($.isFunction(l)) {
                n = l;
                return m
            } else {
                n = l.handler;
                l.handler = m
            }
        }};
    function g() {
        i = h[k](function() {
            a.each(function() {
                var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger(j, [o.w = m, o.h = l])
                }
            });
            g()
        }, e[b])
    }}
)(jQuery, this);

/*!
 * SlimScroll https://github.com/rochal/jQuery-slimScroll
 * =======================================================
 *
 * Copyright (c) 2011 Piotr Rochala (http://rocha.la) Dual licensed under the MIT
 */
(function(f) {
    jQuery.fn.extend({slimScroll: function(h) {
            var a = f.extend({width: "auto", height: "250px", size: "7px", color: "#000", position: "right", distance: "1px", start: "top", opacity: 0.4, alwaysVisible: !1, disableFadeOut: !1, railVisible: !1, railColor: "#333", railOpacity: 0.2, railDraggable: !0, railClass: "slimScrollRail", barClass: "slimScrollBar", wrapperClass: "slimScrollDiv", allowPageScroll: !1, wheelStep: 20, touchScrollStep: 200, borderRadius: "0px", railBorderRadius: "0px"}, h);
            this.each(function() {
                function r(d) {
                    if (s) {
                        d = d ||
                                window.event;
                        var c = 0;
                        d.wheelDelta && (c = -d.wheelDelta / 120);
                        d.detail && (c = d.detail / 3);
                        f(d.target || d.srcTarget || d.srcElement).closest("." + a.wrapperClass).is(b.parent()) && m(c, !0);
                        d.preventDefault && !k && d.preventDefault();
                        k || (d.returnValue = !1)
                    }
                }
                function m(d, f, h) {
                    k = !1;
                    var e = d, g = b.outerHeight() - c.outerHeight();
                    f && (e = parseInt(c.css("top")) + d * parseInt(a.wheelStep) / 100 * c.outerHeight(), e = Math.min(Math.max(e, 0), g), e = 0 < d ? Math.ceil(e) : Math.floor(e), c.css({top: e + "px"}));
                    l = parseInt(c.css("top")) / (b.outerHeight() - c.outerHeight());
                    e = l * (b[0].scrollHeight - b.outerHeight());
                    h && (e = d, d = e / b[0].scrollHeight * b.outerHeight(), d = Math.min(Math.max(d, 0), g), c.css({top: d + "px"}));
                    b.scrollTop(e);
                    b.trigger("slimscrolling", ~~e);
                    v();
                    p()
                }
                function C() {
                    window.addEventListener ? (this.addEventListener("DOMMouseScroll", r, !1), this.addEventListener("mousewheel", r, !1), this.addEventListener("MozMousePixelScroll", r, !1)) : document.attachEvent("onmousewheel", r)
                }
                function w() {
                    u = Math.max(b.outerHeight() / b[0].scrollHeight * b.outerHeight(), D);
                    c.css({height: u + "px"});
                    var a = u == b.outerHeight() ? "none" : "block";
                    c.css({display: a})
                }
                function v() {
                    w();
                    clearTimeout(A);
                    l == ~~l ? (k = a.allowPageScroll, B != l && b.trigger("slimscroll", 0 == ~~l ? "top" : "bottom")) : k = !1;
                    B = l;
                    u >= b.outerHeight() ? k = !0 : (c.stop(!0, !0).fadeIn("fast"), a.railVisible && g.stop(!0, !0).fadeIn("fast"))
                }
                function p() {
                    a.alwaysVisible || (A = setTimeout(function() {
                        a.disableFadeOut && s || (x || y) || (c.fadeOut("slow"), g.fadeOut("slow"))
                    }, 1E3))
                }
                var s, x, y, A, z, u, l, B, D = 30, k = !1, b = f(this);
                if (b.parent().hasClass(a.wrapperClass)) {
                    var n = b.scrollTop(),
                            c = b.parent().find("." + a.barClass), g = b.parent().find("." + a.railClass);
                    w();
                    if (f.isPlainObject(h)) {
                        if ("height"in h && "auto" == h.height) {
                            b.parent().css("height", "auto");
                            b.css("height", "auto");
                            var q = b.parent().parent().height();
                            b.parent().css("height", q);
                            b.css("height", q)
                        }
                        if ("scrollTo"in h)
                            n = parseInt(a.scrollTo);
                        else if ("scrollBy"in h)
                            n += parseInt(a.scrollBy);
                        else if ("destroy"in h) {
                            c.remove();
                            g.remove();
                            b.unwrap();
                            return
                        }
                        m(n, !1, !0)
                    }
                } else {
                    a.height = "auto" == a.height ? b.parent().height() : a.height;
                    n = f("<div></div>").addClass(a.wrapperClass).css({position: "relative",
                        overflow: "hidden", width: a.width, height: a.height});
                    b.css({overflow: "hidden", width: a.width, height: a.height});
                    var g = f("<div></div>").addClass(a.railClass).css({width: a.size, height: "100%", position: "absolute", top: 0, display: a.alwaysVisible && a.railVisible ? "block" : "none", "border-radius": a.railBorderRadius, background: a.railColor, opacity: a.railOpacity, zIndex: 90}), c = f("<div></div>").addClass(a.barClass).css({background: a.color, width: a.size, position: "absolute", top: 0, opacity: a.opacity, display: a.alwaysVisible ?
                                "block" : "none", "border-radius": a.borderRadius, BorderRadius: a.borderRadius, MozBorderRadius: a.borderRadius, WebkitBorderRadius: a.borderRadius, zIndex: 99}), q = "right" == a.position ? {right: a.distance} : {left: a.distance};
                    g.css(q);
                    c.css(q);
                    b.wrap(n);
                    b.parent().append(c);
                    b.parent().append(g);
                    a.railDraggable && c.bind("mousedown", function(a) {
                        var b = f(document);
                        y = !0;
                        t = parseFloat(c.css("top"));
                        pageY = a.pageY;
                        b.bind("mousemove.slimscroll", function(a) {
                            currTop = t + a.pageY - pageY;
                            c.css("top", currTop);
                            m(0, c.position().top, !1)
                        });
                        b.bind("mouseup.slimscroll", function(a) {
                            y = !1;
                            p();
                            b.unbind(".slimscroll")
                        });
                        return!1
                    }).bind("selectstart.slimscroll", function(a) {
                        a.stopPropagation();
                        a.preventDefault();
                        return!1
                    });
                    g.hover(function() {
                        v()
                    }, function() {
                        p()
                    });
                    c.hover(function() {
                        x = !0
                    }, function() {
                        x = !1
                    });
                    b.hover(function() {
                        s = !0;
                        v();
                        p()
                    }, function() {
                        s = !1;
                        p()
                    });
                    b.bind("touchstart", function(a, b) {
                        a.originalEvent.touches.length && (z = a.originalEvent.touches[0].pageY)
                    });
                    b.bind("touchmove", function(b) {
                        k || b.originalEvent.preventDefault();
                        b.originalEvent.touches.length &&
                                (m((z - b.originalEvent.touches[0].pageY) / a.touchScrollStep, !0), z = b.originalEvent.touches[0].pageY)
                    });
                    w();
                    "bottom" === a.start ? (c.css({top: b.outerHeight() - c.outerHeight()}), m(0, !0)) : "top" !== a.start && (m(f(a.start).position().top, null, !0), a.alwaysVisible || c.hide());
                    C()
                }
            });
            return this
        }});
    jQuery.fn.extend({slimscroll: jQuery.fn.slimScroll})
})(jQuery);
//
// /*! iCheck v1.0.1 by Damir Sultanov, http://git.io/arlzeA, MIT Licensed */
// (function(h) {
//     function F(a, b, d) {
//         var c = a[0], e = /er/.test(d) ? m : /bl/.test(d) ? s : l, f = d == H ? {checked: c[l], disabled: c[s], indeterminate: "true" == a.attr(m) || "false" == a.attr(w)} : c[e];
//         if (/^(ch|di|in)/.test(d) && !f)
//             D(a, e);
//         else if (/^(un|en|de)/.test(d) && f)
//             t(a, e);
//         else if (d == H)
//             for (e in f)
//                 f[e] ? D(a, e, !0) : t(a, e, !0);
//         else if (!b || "toggle" == d) {
//             if (!b)
//                 a[p]("ifClicked");
//             f ? c[n] !== u && t(a, e) : D(a, e)
//         }
//     }
//     function D(a, b, d) {
//         var c = a[0], e = a.parent(), f = b == l, A = b == m, B = b == s, K = A ? w : f ? E : "enabled", p = k(a, K + x(c[n])), N = k(a, b + x(c[n]));
//         if (!0 !== c[b]) {
//             if (!d &&
//                     b == l && c[n] == u && c.name) {
//                 var C = a.closest("form"), r = 'input[name="' + c.name + '"]', r = C.length ? C.find(r) : h(r);
//                 r.each(function() {
//                     this !== c && h(this).data(q) && t(h(this), b)
//                 })
//             }
//             A ? (c[b] = !0, c[l] && t(a, l, "force")) : (d || (c[b] = !0), f && c[m] && t(a, m, !1));
//             L(a, f, b, d)
//         }
//         c[s] && k(a, y, !0) && e.find("." + I).css(y, "default");
//         e[v](N || k(a, b) || "");
//         B ? e.attr("aria-disabled", "true") : e.attr("aria-checked", A ? "mixed" : "true");
//         e[z](p || k(a, K) || "")
//     }
//     function t(a, b, d) {
//         var c = a[0], e = a.parent(), f = b == l, h = b == m, q = b == s, p = h ? w : f ? E : "enabled", t = k(a, p + x(c[n])),
//                 u = k(a, b + x(c[n]));
//         if (!1 !== c[b]) {
//             if (h || !d || "force" == d)
//                 c[b] = !1;
//             L(a, f, p, d)
//         }
//         !c[s] && k(a, y, !0) && e.find("." + I).css(y, "pointer");
//         e[z](u || k(a, b) || "");
//         q ? e.attr("aria-disabled", "false") : e.attr("aria-checked", "false");
//         e[v](t || k(a, p) || "")
//     }
//     function M(a, b) {
//         if (a.data(q)) {
//             a.parent().html(a.attr("style", a.data(q).s || ""));
//             if (b)
//                 a[p](b);
//             a.off(".i").unwrap();
//             h(G + '[for="' + a[0].id + '"]').add(a.closest(G)).off(".i")
//         }
//     }
//     function k(a, b, d) {
//         if (a.data(q))
//             return a.data(q).o[b + (d ? "" : "Class")]
//     }
//     function x(a) {
//         return a.charAt(0).toUpperCase() +
//                 a.slice(1)
//     }
//     function L(a, b, d, c) {
//         if (!c) {
//             if (b)
//                 a[p]("ifToggled");
//             a[p]("ifChanged")[p]("if" + x(d))
//         }
//     }
//     var q = "iCheck", I = q + "-helper", u = "radio", l = "checked", E = "un" + l, s = "disabled", w = "determinate", m = "in" + w, H = "update", n = "type", v = "addClass", z = "removeClass", p = "trigger", G = "label", y = "cursor", J = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);
//     h.fn[q] = function(a, b) {
//         var d = 'input[type="checkbox"], input[type="' + u + '"]', c = h(), e = function(a) {
//             a.each(function() {
//                 var a = h(this);
//                 c = a.is(d) ?
//                         c.add(a) : c.add(a.find(d))
//             })
//         };
//         if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(a))
//             return a = a.toLowerCase(), e(this), c.each(function() {
//                 var c = h(this);
//                 "destroy" == a ? M(c, "ifDestroyed") : F(c, !0, a);
//                 h.isFunction(b) && b()
//             });
//         if ("object" != typeof a && a)
//             return this;
//         var f = h.extend({checkedClass: l, disabledClass: s, indeterminateClass: m, labelHover: !0, aria: !1}, a), k = f.handle, B = f.hoverClass || "hover", x = f.focusClass || "focus", w = f.activeClass || "active", y = !!f.labelHover, C = f.labelHoverClass ||
//                 "hover", r = ("" + f.increaseArea).replace("%", "") | 0;
//         if ("checkbox" == k || k == u)
//             d = 'input[type="' + k + '"]';
//         -50 > r && (r = -50);
//         e(this);
//         return c.each(function() {
//             var a = h(this);
//             M(a);
//             var c = this, b = c.id, e = -r + "%", d = 100 + 2 * r + "%", d = {position: "absolute", top: e, left: e, display: "block", width: d, height: d, margin: 0, padding: 0, background: "#fff", border: 0, opacity: 0}, e = J ? {position: "absolute", visibility: "hidden"} : r ? d : {position: "absolute", opacity: 0}, k = "checkbox" == c[n] ? f.checkboxClass || "icheckbox" : f.radioClass || "i" + u, m = h(G + '[for="' + b + '"]').add(a.closest(G)),
//                     A = !!f.aria, E = q + "-" + Math.random().toString(36).replace("0.", ""), g = '<div class="' + k + '" ' + (A ? 'role="' + c[n] + '" ' : "");
//             m.length && A && m.each(function() {
//                 g += 'aria-labelledby="';
//                 this.id ? g += this.id : (this.id = E, g += E);
//                 g += '"'
//             });
//             g = a.wrap(g + "/>")[p]("ifCreated").parent().append(f.insert);
//             d = h('<ins class="' + I + '"/>').css(d).appendTo(g);
//             a.data(q, {o: f, s: a.attr("style")}).css(e);
//             f.inheritClass && g[v](c.className || "");
//             f.inheritID && b && g.attr("id", q + "-" + b);
//             "static" == g.css("position") && g.css("position", "relative");
//             F(a, !0, H);
//             if (m.length)
//                 m.on("click.i mouseover.i mouseout.i touchbegin.i touchend.i", function(b) {
//                     var d = b[n], e = h(this);
//                     if (!c[s]) {
//                         if ("click" == d) {
//                             if (h(b.target).is("a"))
//                                 return;
//                             F(a, !1, !0)
//                         } else
//                             y && (/ut|nd/.test(d) ? (g[z](B), e[z](C)) : (g[v](B), e[v](C)));
//                         if (J)
//                             b.stopPropagation();
//                         else
//                             return!1
//                     }
//                 });
//             a.on("click.i focus.i blur.i keyup.i keydown.i keypress.i", function(b) {
//                 var d = b[n];
//                 b = b.keyCode;
//                 if ("click" == d)
//                     return!1;
//                 if ("keydown" == d && 32 == b)
//                     return c[n] == u && c[l] || (c[l] ? t(a, l) : D(a, l)), !1;
//                 if ("keyup" == d && c[n] == u)
//                     !c[l] && D(a, l);
//                 else if (/us|ur/.test(d))
//                     g["blur" ==
//                             d ? z : v](x)
//             });
//             d.on("click mousedown mouseup mouseover mouseout touchbegin.i touchend.i", function(b) {
//                 var d = b[n], e = /wn|up/.test(d) ? w : B;
//                 if (!c[s]) {
//                     if ("click" == d)
//                         F(a, !1, !0);
//                     else {
//                         if (/wn|er|in/.test(d))
//                             g[v](e);
//                         else
//                             g[z](e + " " + w);
//                         if (m.length && y && e == B)
//                             m[/ut|nd/.test(d) ? z : v](C)
//                     }
//                     if (J)
//                         b.stopPropagation();
//                     else
//                         return!1
//                 }
//             })
//         })
//     }
// })(window.jQuery || window.Zepto);

$(window).resize(function() {
    $('#content-table-main').height($(window).height() - '100px');
});

$(window).trigger('resize');

(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function(angular) {
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc module
 * @name ngTable
 * @description ngTable: Table + Angular JS
 * @example
   <doc:example>
     <doc:source>
        <script>
        var app = angular.module('myApp', ['ngTable']);
        app.controller('MyCtrl', function($scope) {
            $scope.users = [
                {name: "Moroni", age: 50},
                {name: "Tiancum", age: 43},
                {name: "Jacob", age: 27},
                {name: "Nephi", age: 29},
                {name: "Enos", age: 34}
            ];
        });
        </script>
        <table ng-table class="table">
        <tr ng-repeat="user in users">
            <td data-title="'Name'">{{user.name}}</td>
            <td data-title="'Age'">{{user.age}}</td>
        </tr>
        </table>
     </doc:source>
   </doc:example>
 */
var app = angular.module('ngTable', []);
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc service
 * @name ngTable.factory:ngTableParams
 * @description Parameters manager for ngTable
 */
app.factory('ngTableParams', ['$q', '$log', function ($q, $log) {
    var isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    var ngTableParams = function (baseParameters, baseSettings) {
        var self = this;

        this.data = [];

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#parameters
         * @methodOf ngTable.factory:ngTableParams
         * @description Set new parameters or get current parameters
         *
         * @param {string} newParameters      New parameters
         * @param {string} parseParamsFromUrl Flag if parse parameters like in url
         * @returns {Object} Current parameters or `this`
         */
        this.parameters = function (newParameters, parseParamsFromUrl) {
            parseParamsFromUrl = parseParamsFromUrl || false;
            if (angular.isDefined(newParameters)) {
                for (var key in newParameters) {
                    var value = newParameters[key];
                    if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                        var keys = key.split(/\[(.*)\]/).reverse()
                        var lastKey = '';
                        for (var i = 0, len = keys.length; i < len; i++) {
                            var name = keys[i];
                            if (name !== '') {
                                var v = value;
                                value = {};
                                value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                            }
                        }
                        if (lastKey === 'sorting') {
                            params[lastKey] = {};
                        }
                        params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                    } else {
                        params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                    }
                }
                // $log.debug && $log.debug('ngTable: set parameters', params);
                return this;
            }
            return params;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#settings
         * @methodOf ngTable.factory:ngTableParams
         * @description Set new settings for table
         *
         * @param {string} newSettings New settings or undefined
         * @returns {Object} Current settings or `this`
         */
        this.settings = function (newSettings) {
            if (angular.isDefined(newSettings)) {
                settings = angular.extend(settings, newSettings);
                // $log.debug && $log.debug('ngTable: set settings', params);
                return this;
            }
            return settings;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#page
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current page else set current page
         *
         * @param {string} page Page number
         * @returns {Object|Number} Current page or `this`
         */
        this.page = function (page) {
            return angular.isDefined(page) ? this.parameters({'page': page}) : params.page;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#total
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter total not set return current quantity else set quantity
         *
         * @param {string} total Total quantity of items
         * @returns {Object|Number} Current page or `this`
         */
        this.total = function (total) {
            return angular.isDefined(total) ? this.settings({'total': total}) : settings.total;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#count
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter count not set return current count per page else set count per page
         *
         * @param {string} count Count per number
         * @returns {Object|Number} Count per page or `this`
         */
        this.count = function (count) {
            // reset to first page because can be blank page
            return angular.isDefined(count) ? this.parameters({'count': count, 'page': 1}) : params.count;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#filter
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current filter else set current filter
         *
         * @param {string} filter New filter
         * @returns {Object} Current filter or `this`
         */
        this.filter = function (filter) {
            return angular.isDefined(filter) ? this.parameters({'filter': filter}) : params.filter;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#sorting
         * @methodOf ngTable.factory:ngTableParams
         * @description If parameter page not set return current sorting else set current sorting
         *
         * @param {string} sorting New sorting
         * @returns {Object} Current sorting or `this`
         */
        this.sorting = function (sorting) {
            if (arguments.length == 2){
                var sortArray = {};
                sortArray[sorting] = arguments[1];
                this.parameters({'sorting': sortArray});
                return this;
            }
            return angular.isDefined(sorting) ? this.parameters({'sorting': sorting}) : params.sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#isSortBy
         * @methodOf ngTable.factory:ngTableParams
         * @description Checks sort field
         *
         * @param {string} field     Field name
         * @param {string} direction Direction of sorting 'asc' or 'desc'
         * @returns {Array} Return true if field sorted by direction
         */
        this.isSortBy = function (field, direction) {
            return angular.isDefined(params.sorting[field]) && params.sorting[field] == direction;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#orderBy
         * @methodOf ngTable.factory:ngTableParams
         * @description Return object of sorting parameters for angular filter
         *
         * @returns {Array} Array like: [ '-name', '+age' ]
         */
        this.orderBy = function () {
            var sorting = [];
            for (var column in params.sorting) {
                sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
            }
            return sorting;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#getData
         * @methodOf ngTable.factory:ngTableParams
         * @description Called when updated some of parameters for get new data
         *
         * @param {Object} $defer promise object
         * @param {Object} params New parameters
         */
        this.getData = function ($defer, params) {
            $defer.resolve([]);
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#getGroups
         * @methodOf ngTable.factory:ngTableParams
         * @description Return groups for table grouping
         */
        this.getGroups = function ($defer, column) {
            var defer = $q.defer();

            defer.promise.then(function(data) {
                var groups = {};
                for (var k in data) {
                    var item = data[k],
                        groupName = angular.isFunction(column) ? column(item) : item[column];

                    groups[groupName] = groups[groupName] || {
                        data: []
                    };
                    groups[groupName]['value'] = groupName;
                    groups[groupName].data.push(item);
                }
                var result = [];
                for (var i in groups) {
                    result.push(groups[i]);
                }
                // $log.debug && $log.debug('ngTable: refresh groups', result);
                $defer.resolve(result);
            });
            this.getData(defer, self);
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#generatePagesArray
         * @methodOf ngTable.factory:ngTableParams
         * @description Generate array of pages
         *
         * @param {boolean} currentPage which page must be active
         * @param {boolean} totalItems  Total quantity of items
         * @param {boolean} pageSize    Quantity of items on page
         * @returns {Array} Array of pages
         */
        this.generatePagesArray = function (currentPage, totalItems, pageSize) {
            var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
            maxBlocks = 8;
            pages = [];
            numPages = Math.ceil(totalItems / pageSize);
            if (numPages > 1) {
                pages.push({
                    type: 'prev',
                    number: Math.max(1, currentPage - 1),
                    active: currentPage > 1
                });
                pages.push({
                    type: 'first',
                    number: 1,
                    active: currentPage > 1
                });
                maxPivotPages = Math.round((maxBlocks - 5) / 2);
                minPage = Math.max(2, currentPage - maxPivotPages);
                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                i = minPage;
                while (i <= maxPage) {
                    if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                        pages.push({
                            type: 'more',
                            active: false
                        });
                    } else {
                        pages.push({
                            type: 'page',
                            number: i,
                            active: currentPage !== i
                        });
                    }
                    i++;
                }
                pages.push({
                    type: 'last',
                    number: numPages,
                    active: currentPage !== numPages
                });
                pages.push({
                    type: 'next',
                    number: Math.min(numPages, currentPage + 1),
                    active: currentPage < numPages
                });
            }
            this.pagesArray = pages
            return pages;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#url
         * @methodOf ngTable.factory:ngTableParams
         * @description Return groups for table grouping
         *
         * @param {boolean} asString flag indicates return array of string or object
         * @returns {Array} If asString = true will be return array of url string parameters else key-value object
         */
        this.url = function (asString) {
            asString = asString || false;
            var pairs = (asString ? [] : {});
            for (key in params) {
                if (params.hasOwnProperty(key)) {
                    var item = params[key],
                        name = encodeURIComponent(key);
                    if (typeof item === "object") {
                        for (var subkey in item) {
                            if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                if (asString) {
                                    pairs.push(pname + "=" + encodeURIComponent(item[subkey]));
                                } else {
                                    pairs[pname] = encodeURIComponent(item[subkey]);
                                }
                            }
                        }
                    } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                        if (asString) {
                            pairs.push(name + "=" + encodeURIComponent(item));
                        } else {
                            pairs[name] = encodeURIComponent(item);
                        }
                    }
                }
            }
            return pairs;
        };

        /**
         * @ngdoc method
         * @name ngTable.factory:ngTableParams#reload
         * @methodOf ngTable.factory:ngTableParams
         * @description Reload table data
         */
        this.reload = function() {
            var $defer = $q.defer(),
                self = this;

            settings.$loading = true;
            if (settings.groupBy) {
                settings.getGroups($defer, settings.groupBy, this);
            } else {
                settings.getData($defer, this);
            }
            // $log.debug && $log.debug('ngTable: reload data');
            return $defer.promise.then(function(data) {
                settings.$loading = false;
                // $log.debug && $log.debug('ngTable: current scope', settings.$scope);
                if (settings.groupBy) {
                    self.data = settings.$scope.$groups = data;
                } else {
                    self.data = settings.$scope.$data = data;
                }
                settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
            });
        };

        this.reloadPages = function () {
            var self = this;
            settings.$scope.pages = self.generatePagesArray(self.page(), self.total(), self.count());
        };

        var params = this.$params = {
            page: 1,
            count: 1,
            filter: {},
            sorting: {},
            group: {},
            groupBy: null
        };
        var settings = {
            $scope: null, // set by ngTable controller
            $loading: false,
            total: 0,
            counts: [10, 25, 50, 100],
            getGroups: this.getGroups,
            getData: this.getData
        };

        this.settings(baseSettings);
        this.parameters(baseParameters, true);
        return this;
    };
    return ngTableParams;
}]);

/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc object
 * @name ngTable.directive:ngTable.ngTableController
 *
 * @description
 * Each {@link ngTable.directive:ngTable ngTable} directive creates an instance of `ngTableController`
 */
var ngTableController = ['$scope', 'ngTableParams', '$q', function($scope, ngTableParams, $q) {
    $scope.$loading = false;

    if (!$scope.params) {
        $scope.params = new ngTableParams();
    }
    $scope.params.settings().$scope = $scope;

    $scope.$watch('params.$params', function(params) {
        $scope.params.settings().$scope = $scope;
        $scope.params.reload();
    }, true);

    $scope.sortBy = function (column) {
        var parsedSortable = $scope.parse(column.sortable);
        if (!parsedSortable) {
            return;
        }
        var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === "desc");
        var sortingParams = {};
        sortingParams[parsedSortable] = (sorting ? 'asc' : 'desc');
        $scope.params.parameters({
            sorting: sortingParams
        });
    };
}];
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * @ngdoc directive
 * @name ngTable.directive:ngTable
 * @restrict A
 *
 * @description
 * Directive that instantiates {@link ngTable.directive:ngTable.ngTableController ngTableController}.
 */
app.directive('ngTable', ['$compile', '$q', '$parse',
    function ($compile, $q, $parse) {
        'use strict';

        return {
            restrict: 'A',
            priority: 1001,
            scope: true,
            controller: ngTableController,
            compile: function (element) {
                var columns = [], i = 0, row = null;

                // custom header
                var thead = element.find('thead');

                // IE 8 fix :not(.ng-table-group) selector
                angular.forEach(angular.element(element.find('tr')), function(tr) {
                    tr = angular.element(tr);
                    if (!tr.hasClass('ng-table-group') && !row) {
                        row = tr;
                    }
                });
                if (!row) {
                    return;
                }
                angular.forEach(row.find('td'), function (item) {
                    var el = angular.element(item);
                    if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                        return;
                    }
                    var parsedAttribute = function(attr, defaultValue) {
                        return function(scope) {
                            return $parse(el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr))(scope, {
                                $columns: columns
                            }) || defaultValue;
                        };
                    };

                    var parsedTitle = parsedAttribute('title', ' '),
                        headerTemplateURL = parsedAttribute('header', false),
                        filter = parsedAttribute('filter', false)(),
                        filterTemplateURL = false;

                    if (filter && filter.templateURL) {
                        filterTemplateURL = filter.templateURL;
                        delete filter.templateURL;
                    }

                    el.attr('data-title-text', parsedTitle()); // this used in responsive table
                    columns.push({
                        id: i++,
                        title: parsedTitle,
                        sortable: parsedAttribute('sortable', false),
                        class: el.attr('x-data-header-class') || el.attr('data-header-class') || el.attr("header-class"),
                        filter: filter,
                        filterTemplateURL: filterTemplateURL,
                        headerTemplateURL: headerTemplateURL,
                        filterData: (el.attr("filter-data") ? el.attr("filter-data") : null),
                        show: (el.attr("ng-show") ? function (scope) {
                            return $parse(el.attr("ng-show"))(scope);
                        } : function () {
                            return true;
                        })
                    });
                });
                return function (scope, element, attrs) {
                    scope.$loading = false;
                    scope.$columns = columns;

                    scope.$watch(attrs.ngTable, (function (params) {
                        if (angular.isUndefined(params)) {
                            return;
                        }
                        scope.paramsModel = $parse(attrs.ngTable);
                        scope.params = params;
                    }), true);
                    scope.parse = function (text) {
                        return angular.isDefined(text) ? text(scope) : '';
                    };
                    if (attrs.showFilter) {
                        scope.$parent.$watch(attrs.showFilter, function (value) {
                            scope.show_filter = value;
                        });
                    }
                    angular.forEach(columns, function (column) {
                        var def;
                        if (!column.filterData) {
                            return;
                        }
                        def = $parse(column.filterData)(scope, {
                            $column: column
                        });
                        if (!(angular.isObject(def) && angular.isObject(def.promise))) {
                            throw new Error('Function ' + column.filterData + ' must be instance of $q.defer()');
                        }
                        delete column['filterData'];
                        return def.promise.then(function (data) {
                            if (!angular.isArray(data)) {
                                data = [];
                            }
                            data.unshift({
                                title: '-',
                                id: ''
                            });
                            column.data = data;
                        });
                    });
                    if (!element.hasClass('ng-table')) {
                        scope.templates = {
                            header: (attrs.templateHeader ? attrs.templateHeader : 'ng-table/header.html'),
                            pagination: (attrs.templatePagination ? attrs.templatePagination : 'ng-table/pager.html')
                        };
                        var headerTemplate = thead.length > 0 ? thead : angular.element(document.createElement('thead')).attr('ng-include', 'templates.header');
                        var paginationTemplate = angular.element(document.createElement('div')).attr('ng-include', 'templates.pagination');
                        element.find('thead').remove();
                        var tbody = element.find('tbody');
                        element.prepend(headerTemplate);
                        $compile(headerTemplate)(scope);
                        $compile(paginationTemplate)(scope);
                        element.addClass('ng-table');
                        return element.after(paginationTemplate);
                    }
                };
            }
        }
    }
]);

angular.module('ngTable').run(['$templateCache', function ($templateCache) {
	$templateCache.put('ng-table/filters/select.html', '<select ng-options="data.id as data.title for data in column.data" ng-model="params.filter()[name]" ng-show="filter==\'select\'" class="filter filter-select form-control"> </select>');
	$templateCache.put('ng-table/filters/text.html', '<input type="text" ng-model="params.filter()[name]" ng-if="filter==\'text\'" class="input-filter form-control"/>');
	$templateCache.put('ng-table/header.html', '<tr> <th ng-repeat="column in $columns" ng-class="{ \'sortable\': parse(column.sortable), \'sort-asc\': params.sorting()[parse(column.sortable)]==\'asc\', \'sort-desc\': params.sorting()[parse(column.sortable)]==\'desc\' }" ng-click="sortBy(column)" ng-show="column.show(this)" ng-init="template=column.headerTemplateURL(this)" class="header {{column.class}}"> <div ng-if="!template" ng-show="!template" ng-bind="parse(column.title)"></div> <div ng-if="template" ng-show="template"><div ng-include="template"></div></div> </th> </tr> <tr ng-show="show_filter" class="ng-table-filters"> <th ng-repeat="column in $columns" ng-show="column.show(this)" class="filter"> <div ng-repeat="(name, filter) in column.filter"> <div ng-if="column.filterTemplateURL" ng-show="column.filterTemplateURL"> <div ng-include="column.filterTemplateURL"></div> </div> <div ng-if="!column.filterTemplateURL" ng-show="!column.filterTemplateURL"> <div ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div> </div> </div> </th> </tr>');
	$templateCache.put('ng-table/pager.html', '<div class="ng-cloak"> <div ng-if="params.settings().counts.length && false" class="btn-group pull-right"> <button ng-repeat="count in params.settings().counts" type="button" ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)" class="btn btn-default"> <span ng-bind="count"></span> </button> </div> <ul class="pagination" ng-show="false"> <li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo;</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">&raquo;</a> </li> </ul> </div>');
}]);
    return app;
}));

/*
 * ngDialog - easy modals and popup windows
 * http://github.com/likeastore/ngDialog
 * (c) 2013-2015 MIT License, https://likeastore.com
 */

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS
        if (typeof angular === 'undefined') {
            module.exports = factory(require('angular'));
        } else {
            module.exports = factory(angular);
        }
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['ng-dialog'], function () {
          factory(root.angular);
        });
    } else {
        // Global Variables
        factory(root.angular);
    }
}(this, function (angular) {
    'use strict';

    var m = angular.module('ngDialog', []);

    var $el = angular.element;
    var isDef = angular.isDefined;
    var style = (document.body || document.documentElement).style;
    var animationEndSupport = isDef(style.animation) || isDef(style.WebkitAnimation) || isDef(style.MozAnimation) || isDef(style.MsAnimation) || isDef(style.OAnimation);
    var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';
    var focusableElementSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    var disabledAnimationClass = 'ngdialog-disabled-animation';
    var forceElementsReload = { html: false, body: false };
    var scopes = {};
    var openIdStack = [];
    var keydownIsBound = false;

    m.provider('ngDialog', function () {
        var defaults = this.defaults = {
            className: 'ngdialog-theme-default',
            disableAnimation: false,
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            closeByNavigation: false,
            appendTo: false,
            preCloseCallback: false,
            overlay: true,
            cache: true,
            trapFocus: true,
            preserveFocus: true,
            ariaAuto: true,
            ariaRole: null,
            ariaLabelledById: null,
            ariaLabelledBySelector: null,
            ariaDescribedById: null,
            ariaDescribedBySelector: null
        };

        this.setForceHtmlReload = function (_useIt) {
            forceElementsReload.html = _useIt || false;
        };

        this.setForceBodyReload = function (_useIt) {
            forceElementsReload.body = _useIt || false;
        };

        this.setDefaults = function (newDefaults) {
            angular.extend(defaults, newDefaults);
        };

        var globalID = 0, dialogsCount = 0, closeByDocumentHandler, defers = {};

        this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller', '$injector',
            function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $injector) {
                var $elements = [];

                var privateMethods = {
                    onDocumentKeydown: function (event) {
                        if (event.keyCode === 27) {
                            publicMethods.close('$escape');
                        }
                    },

                    activate: function($dialog) {
                        var options = $dialog.data('$ngDialogOptions');

                        if (options.trapFocus) {
                            $dialog.on('keydown', privateMethods.onTrapFocusKeydown);

                            // Catch rogue changes (eg. after unfocusing everything by clicking a non-focusable element)
                            $elements.body.on('keydown', privateMethods.onTrapFocusKeydown);
                        }
                    },

                    deactivate: function ($dialog) {
                        $dialog.off('keydown', privateMethods.onTrapFocusKeydown);
                        $elements.body.off('keydown', privateMethods.onTrapFocusKeydown);
                    },

                    deactivateAll: function (els) {
                        angular.forEach(els,function(el) {
                            var $dialog = angular.element(el);
                            privateMethods.deactivate($dialog);
                        });
                    },

                    setBodyPadding: function (width) {
                        var originalBodyPadding = parseInt(($elements.body.css('padding-right') || 0), 10);
                        $elements.body.css('padding-right', (originalBodyPadding + width) + 'px');
                        $elements.body.data('ng-dialog-original-padding', originalBodyPadding);
                        $rootScope.$broadcast('ngDialog.setPadding', width);
                    },

                    resetBodyPadding: function () {
                        var originalBodyPadding = $elements.body.data('ng-dialog-original-padding');
                        if (originalBodyPadding) {
                            $elements.body.css('padding-right', originalBodyPadding + 'px');
                        } else {
                            $elements.body.css('padding-right', '');
                        }
                        $rootScope.$broadcast('ngDialog.setPadding', 0);
                    },

                    performCloseDialog: function ($dialog, value) {
                        var options = $dialog.data('$ngDialogOptions');
                        var id = $dialog.attr('id');
                        var scope = scopes[id];

                        if (!scope) {
                            // Already closed
                            return;
                        }

                        if (typeof $window.Hammer !== 'undefined') {
                            var hammerTime = scope.hammerTime;
                            hammerTime.off('tap', closeByDocumentHandler);
                            hammerTime.destroy && hammerTime.destroy();
                            delete scope.hammerTime;
                        } else {
                            $dialog.unbind('click');
                        }

                        if (dialogsCount === 1) {
                            $elements.body.unbind('keydown', privateMethods.onDocumentKeydown);
                        }

                        if (!$dialog.hasClass('ngdialog-closing')){
                            dialogsCount -= 1;
                        }

                        var previousFocus = $dialog.data('$ngDialogPreviousFocus');
                        if (previousFocus && previousFocus.focus) {
                            previousFocus.focus();
                        }

                        $rootScope.$broadcast('ngDialog.closing', $dialog, value);
                        dialogsCount = dialogsCount < 0 ? 0 : dialogsCount;
                        if (animationEndSupport && !options.disableAnimation) {
                            scope.$destroy();
                            $dialog.unbind(animationEndEvent).bind(animationEndEvent, function () {
                                privateMethods.closeDialogElement($dialog, value);
                            }).addClass('ngdialog-closing');
                        } else {
                            scope.$destroy();
                            privateMethods.closeDialogElement($dialog, value);
                        }
                        if (defers[id]) {
                            defers[id].resolve({
                                id: id,
                                value: value,
                                $dialog: $dialog,
                                remainingDialogs: dialogsCount
                            });
                            delete defers[id];
                        }
                        if (scopes[id]) {
                            delete scopes[id];
                        }
                        openIdStack.splice(openIdStack.indexOf(id), 1);
                        if (!openIdStack.length) {
                            $elements.body.unbind('keydown', privateMethods.onDocumentKeydown);
                            keydownIsBound = false;
                        }
                    },

                    closeDialogElement: function($dialog, value) {
                        $dialog.remove();
                        if (dialogsCount === 0) {
                            $elements.html.removeClass('ngdialog-open');
                            $elements.body.removeClass('ngdialog-open');
                            privateMethods.resetBodyPadding();
                        }
                        $rootScope.$broadcast('ngDialog.closed', $dialog, value);
                    },

                    closeDialog: function ($dialog, value) {
                        var preCloseCallback = $dialog.data('$ngDialogPreCloseCallback');

                        if (preCloseCallback && angular.isFunction(preCloseCallback)) {

                            var preCloseCallbackResult = preCloseCallback.call($dialog, value);

                            if (angular.isObject(preCloseCallbackResult)) {
                                if (preCloseCallbackResult.closePromise) {
                                    preCloseCallbackResult.closePromise.then(function () {
                                        privateMethods.performCloseDialog($dialog, value);
                                    });
                                } else {
                                    preCloseCallbackResult.then(function () {
                                        privateMethods.performCloseDialog($dialog, value);
                                    }, function () {
                                        return;
                                    });
                                }
                            } else if (preCloseCallbackResult !== false) {
                                privateMethods.performCloseDialog($dialog, value);
                            }
                        } else {
                            privateMethods.performCloseDialog($dialog, value);
                        }
                    },

                    onTrapFocusKeydown: function(ev) {
                        var el = angular.element(ev.currentTarget);
                        var $dialog;

                        if (el.hasClass('ngdialog')) {
                            $dialog = el;
                        } else {
                            $dialog = privateMethods.getActiveDialog();

                            if ($dialog === null) {
                                return;
                            }
                        }

                        var isTab = (ev.keyCode === 9);
                        var backward = (ev.shiftKey === true);

                        if (isTab) {
                            privateMethods.handleTab($dialog, ev, backward);
                        }
                    },

                    handleTab: function($dialog, ev, backward) {
                        var focusableElements = privateMethods.getFocusableElements($dialog);

                        if (focusableElements.length === 0) {
                            if (document.activeElement) {
                                document.activeElement.blur();
                            }
                            return;
                        }

                        var currentFocus = document.activeElement;
                        var focusIndex = Array.prototype.indexOf.call(focusableElements, currentFocus);

                        var isFocusIndexUnknown = (focusIndex === -1);
                        var isFirstElementFocused = (focusIndex === 0);
                        var isLastElementFocused = (focusIndex === focusableElements.length - 1);

                        var cancelEvent = false;

                        if (backward) {
                            if (isFocusIndexUnknown || isFirstElementFocused) {
                                focusableElements[focusableElements.length - 1].focus();
                                cancelEvent = true;
                            }
                        } else {
                            if (isFocusIndexUnknown || isLastElementFocused) {
                                focusableElements[0].focus();
                                cancelEvent = true;
                            }
                        }

                        if (cancelEvent) {
                            ev.preventDefault();
                            ev.stopPropagation();
                        }
                    },

                    autoFocus: function($dialog) {
                        var dialogEl = $dialog[0];

                        // Browser's (Chrome 40, Forefix 37, IE 11) don't appear to honor autofocus on the dialog, but we should
                        var autoFocusEl = dialogEl.querySelector('*[autofocus]');
                        if (autoFocusEl !== null) {
                            autoFocusEl.focus();

                            if (document.activeElement === autoFocusEl) {
                                return;
                            }

                            // Autofocus element might was display: none, so let's continue
                        }

                        var focusableElements = privateMethods.getFocusableElements($dialog);

                        if (focusableElements.length > 0) {
                            focusableElements[0].focus();
                            return;
                        }

                        // We need to focus something for the screen readers to notice the dialog
                        var contentElements = privateMethods.filterVisibleElements(dialogEl.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span'));

                        if (contentElements.length > 0) {
                            var contentElement = contentElements[0];
                            $el(contentElement).attr('tabindex', '-1').css('outline', '0');
                            contentElement.focus();
                        }
                    },

                    getFocusableElements: function ($dialog) {
                        var dialogEl = $dialog[0];

                        var rawElements = dialogEl.querySelectorAll(focusableElementSelector);

                        // Ignore untabbable elements, ie. those with tabindex = -1
                        var tabbableElements = privateMethods.filterTabbableElements(rawElements);

                        return privateMethods.filterVisibleElements(tabbableElements);
                    },

                    filterTabbableElements: function (els) {
                        var tabbableFocusableElements = [];

                        for (var i = 0; i < els.length; i++) {
                            var el = els[i];

                            if ($el(el).attr('tabindex') !== '-1') {
                                tabbableFocusableElements.push(el);
                            }
                        }

                        return tabbableFocusableElements;
                    },

                    filterVisibleElements: function (els) {
                        var visibleFocusableElements = [];

                        for (var i = 0; i < els.length; i++) {
                            var el = els[i];

                            if (el.offsetWidth > 0 || el.offsetHeight > 0) {
                                visibleFocusableElements.push(el);
                            }
                        }

                        return visibleFocusableElements;
                    },

                    getActiveDialog: function () {
                        var dialogs = document.querySelectorAll('.ngdialog');

                        if (dialogs.length === 0) {
                            return null;
                        }

                        // TODO: This might be incorrect if there are a mix of open dialogs with different 'appendTo' values
                        return $el(dialogs[dialogs.length - 1]);
                    },

                    applyAriaAttributes: function ($dialog, options) {
                        if (options.ariaAuto) {
                            if (!options.ariaRole) {
                                var detectedRole = (privateMethods.getFocusableElements($dialog).length > 0) ?
                                    'dialog' :
                                    'alertdialog';

                                options.ariaRole = detectedRole;
                            }

                            if (!options.ariaLabelledBySelector) {
                                options.ariaLabelledBySelector = 'h1,h2,h3,h4,h5,h6';
                            }

                            if (!options.ariaDescribedBySelector) {
                                options.ariaDescribedBySelector = 'article,section,p';
                            }
                        }

                        if (options.ariaRole) {
                            $dialog.attr('role', options.ariaRole);
                        }

                        privateMethods.applyAriaAttribute(
                            $dialog, 'aria-labelledby', options.ariaLabelledById, options.ariaLabelledBySelector);

                        privateMethods.applyAriaAttribute(
                            $dialog, 'aria-describedby', options.ariaDescribedById, options.ariaDescribedBySelector);
                    },

                    applyAriaAttribute: function($dialog, attr, id, selector) {
                        if (id) {
                            $dialog.attr(attr, id);
                        }

                        if (selector) {
                            var dialogId = $dialog.attr('id');

                            var firstMatch = $dialog[0].querySelector(selector);

                            if (!firstMatch) {
                                return;
                            }

                            var generatedId = dialogId + '-' + attr;

                            $el(firstMatch).attr('id', generatedId);

                            $dialog.attr(attr, generatedId);

                            return generatedId;
                        }
                    },

                    detectUIRouter: function() {
                        //Detect if ui-router module is installed if not return false
                        try {
                            angular.module('ui.router');
                            return true;
                        } catch(err) {
                            return false;
                        }
                    },

                    getRouterLocationEventName: function() {
                        if(privateMethods.detectUIRouter()) {
                            return '$stateChangeSuccess';
                        }
                        return '$locationChangeSuccess';
                    }
                };

                var publicMethods = {

                    /*
                     * @param {Object} options:
                     * - template {String} - id of ng-template, url for partial, plain string (if enabled)
                     * - plain {Boolean} - enable plain string templates, default false
                     * - scope {Object}
                     * - controller {String}
                     * - controllerAs {String}
                     * - className {String} - dialog theme class
                     * - disableAnimation {Boolean} - set to true to disable animation
                     * - showClose {Boolean} - show close button, default true
                     * - closeByEscape {Boolean} - default true
                     * - closeByDocument {Boolean} - default true
                     * - preCloseCallback {String|Function} - user supplied function name/function called before closing dialog (if set)
                     *
                     * @return {Object} dialog
                     */
                    open: function (opts) {
                        var options = angular.copy(defaults);
                        var localID = ++globalID;
                        var dialogID = 'ngdialog' + localID;
                        openIdStack.push(dialogID);

                        opts = opts || {};
                        angular.extend(options, opts);

                        var defer;
                        defers[dialogID] = defer = $q.defer();

                        var scope;
                        scopes[dialogID] = scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();

                        var $dialog, $dialogParent;

                        var resolve = angular.extend({}, options.resolve);

                        angular.forEach(resolve, function (value, key) {
                            resolve[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
                        });

                        $q.all({
                            template: loadTemplate(options.template || options.templateUrl),
                            locals: $q.all(resolve)
                        }).then(function (setup) {
                            var template = setup.template,
                                locals = setup.locals;

                            if (options.showClose) {
                                template += '<div class="ngdialog-close"></div>';
                            }

                            var hasOverlayClass = options.overlay ? '' : ' ngdialog-no-overlay';
                            $dialog = $el('<div id="ngdialog' + localID + '" class="ngdialog' + hasOverlayClass + '"></div>');
                            $dialog.html((options.overlay ?
                                '<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">' + template + '</div>' :
                                '<div class="ngdialog-content" role="document">' + template + '</div>'));

                            $dialog.data('$ngDialogOptions', options);

                            scope.ngDialogId = dialogID;

                            if (options.data && angular.isString(options.data)) {
                                var firstLetter = options.data.replace(/^\s*/, '')[0];
                                scope.ngDialogData = (firstLetter === '{' || firstLetter === '[') ? angular.fromJson(options.data) : options.data;
                                scope.ngDialogData.ngDialogId = dialogID;
                            } else if (options.data && angular.isObject(options.data)) {
                                scope.ngDialogData = options.data;
                                scope.ngDialogData.ngDialogId = dialogID;
                            }

                            if (options.className) {
                                $dialog.addClass(options.className);
                            }

                            if (options.disableAnimation) {
                                $dialog.addClass(disabledAnimationClass);
                            }

                            if (options.appendTo && angular.isString(options.appendTo)) {
                                $dialogParent = angular.element(document.querySelector(options.appendTo));
                            } else {
                                $dialogParent = $elements.body;
                            }

                            privateMethods.applyAriaAttributes($dialog, options);

                            if (options.preCloseCallback) {
                                var preCloseCallback;

                                if (angular.isFunction(options.preCloseCallback)) {
                                    preCloseCallback = options.preCloseCallback;
                                } else if (angular.isString(options.preCloseCallback)) {
                                    if (scope) {
                                        if (angular.isFunction(scope[options.preCloseCallback])) {
                                            preCloseCallback = scope[options.preCloseCallback];
                                        } else if (scope.$parent && angular.isFunction(scope.$parent[options.preCloseCallback])) {
                                            preCloseCallback = scope.$parent[options.preCloseCallback];
                                        } else if ($rootScope && angular.isFunction($rootScope[options.preCloseCallback])) {
                                            preCloseCallback = $rootScope[options.preCloseCallback];
                                        }
                                    }
                                }

                                if (preCloseCallback) {
                                    $dialog.data('$ngDialogPreCloseCallback', preCloseCallback);
                                }
                            }

                            scope.closeThisDialog = function (value) {
                                privateMethods.closeDialog($dialog, value);
                            };

                            if (options.controller && (angular.isString(options.controller) || angular.isArray(options.controller) || angular.isFunction(options.controller))) {

                                var label;

                                if (options.controllerAs && angular.isString(options.controllerAs)) {
                                    label = options.controllerAs;
                                }

                                var controllerInstance = $controller(options.controller, angular.extend(
                                    locals,
                                    {
                                        $scope: scope,
                                        $element: $dialog
                                    }),
                                    null,
                                    label
                                );
                                $dialog.data('$ngDialogControllerController', controllerInstance);
                            }

                            $timeout(function () {
                                var $activeDialogs = document.querySelectorAll('.ngdialog');
                                privateMethods.deactivateAll($activeDialogs);

                                $compile($dialog)(scope);
                                var widthDiffs = $window.innerWidth - $elements.body.prop('clientWidth');
                                $elements.html.addClass('ngdialog-open');
                                $elements.body.addClass('ngdialog-open');
                                var scrollBarWidth = widthDiffs - ($window.innerWidth - $elements.body.prop('clientWidth'));
                                if (scrollBarWidth > 0) {
                                    privateMethods.setBodyPadding(scrollBarWidth);
                                }
                                $dialogParent.append($dialog);

                                privateMethods.activate($dialog);

                                if (options.trapFocus) {
                                    privateMethods.autoFocus($dialog);
                                }

                                if (options.name) {
                                    $rootScope.$broadcast('ngDialog.opened', {dialog: $dialog, name: options.name});
                                } else {
                                    $rootScope.$broadcast('ngDialog.opened', $dialog);
                                }
                            });

                            if (!keydownIsBound) {
                                $elements.body.bind('keydown', privateMethods.onDocumentKeydown);
                                keydownIsBound = true;
                            }

                            if (options.closeByNavigation) {
                                var eventName = privateMethods.getRouterLocationEventName();
                                $rootScope.$on(eventName, function () {
                                    privateMethods.closeDialog($dialog);
                                });
                            }

                            if (options.preserveFocus) {
                                $dialog.data('$ngDialogPreviousFocus', document.activeElement);
                            }

                            closeByDocumentHandler = function (event) {
                                var isOverlay = options.closeByDocument ? $el(event.target).hasClass('ngdialog-overlay') : false;
                                var isCloseBtn = $el(event.target).hasClass('ngdialog-close');

                                if (isOverlay || isCloseBtn) {
                                    publicMethods.close($dialog.attr('id'), isCloseBtn ? '$closeButton' : '$document');
                                }
                            };

                            if (typeof $window.Hammer !== 'undefined') {
                                var hammerTime = scope.hammerTime = $window.Hammer($dialog[0]);
                                hammerTime.on('tap', closeByDocumentHandler);
                            } else {
                                $dialog.bind('click', closeByDocumentHandler);
                            }

                            dialogsCount += 1;

                            return publicMethods;
                        });

                        return {
                            id: dialogID,
                            closePromise: defer.promise,
                            close: function (value) {
                                privateMethods.closeDialog($dialog, value);
                            }
                        };

                        function loadTemplateUrl (tmpl, config) {
                            $rootScope.$broadcast('ngDialog.templateLoading', tmpl);
                            return $http.get(tmpl, (config || {})).then(function(res) {
                                $rootScope.$broadcast('ngDialog.templateLoaded', tmpl);
                                return res.data || '';
                            });
                        }

                        function loadTemplate (tmpl) {
                            if (!tmpl) {
                                return 'Empty template';
                            }

                            if (angular.isString(tmpl) && options.plain) {
                                return tmpl;
                            }

                            if (typeof options.cache === 'boolean' && !options.cache) {
                                return loadTemplateUrl(tmpl, {cache: false});
                            }

                            return loadTemplateUrl(tmpl, {cache: $templateCache});
                        }
                    },

                    /*
                     * @param {Object} options:
                     * - template {String} - id of ng-template, url for partial, plain string (if enabled)
                     * - plain {Boolean} - enable plain string templates, default false
                     * - name {String}
                     * - scope {Object}
                     * - controller {String}
                     * - controllerAs {String}
                     * - className {String} - dialog theme class
                     * - showClose {Boolean} - show close button, default true
                     * - closeByEscape {Boolean} - default false
                     * - closeByDocument {Boolean} - default false
                     * - preCloseCallback {String|Function} - user supplied function name/function called before closing dialog (if set); not called on confirm
                     *
                     * @return {Object} dialog
                     */
                    openConfirm: function (opts) {
                        var defer = $q.defer();

                        var options = {
                            closeByEscape: false,
                            closeByDocument: false
                        };
                        angular.extend(options, opts);

                        options.scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
                        options.scope.confirm = function (value) {
                            defer.resolve(value);
                            var $dialog = $el(document.getElementById(openResult.id));
                            privateMethods.performCloseDialog($dialog, value);
                        };

                        var openResult = publicMethods.open(options);
                        openResult.closePromise.then(function (data) {
                            if (data) {
                                return defer.reject(data.value);
                            }
                            return defer.reject();
                        });

                        return defer.promise;
                    },

                    isOpen: function(id) {
                        var $dialog = $el(document.getElementById(id));
                        return $dialog.length > 0;
                    },

                    /*
                     * @param {String} id
                     * @return {Object} dialog
                     */
                    close: function (id, value) {
                        var $dialog = $el(document.getElementById(id));

                        if ($dialog.length) {
                            privateMethods.closeDialog($dialog, value);
                        } else {
                            if (id === '$escape') {
                                var topDialogId = openIdStack[openIdStack.length - 1];
                                $dialog = $el(document.getElementById(topDialogId));
                                if ($dialog.data('$ngDialogOptions').closeByEscape) {
                                    privateMethods.closeDialog($dialog, '$escape');
                                }
                            } else {
                                publicMethods.closeAll(value);
                            }
                        }

                        return publicMethods;
                    },

                    closeAll: function (value) {
                        var $all = document.querySelectorAll('.ngdialog');

                        // Reverse order to ensure focus restoration works as expected
                        for (var i = $all.length - 1; i >= 0; i--) {
                            var dialog = $all[i];
                            privateMethods.closeDialog($el(dialog), value);
                        }
                    },

                    getOpenDialogs: function() {
                        return openIdStack;
                    },

                    getDefaults: function () {
                        return defaults;
                    }
                };

                angular.forEach(
                    ['html', 'body'],
                    function(elementName) {
                        $elements[elementName] = $document.find(elementName);
                        if (forceElementsReload[elementName]) {
                            var eventName = privateMethods.getRouterLocationEventName();
                            $rootScope.$on(eventName, function () {
                                $elements[elementName] = $document.find(elementName);
                            });
                        }
                    }
                );

                return publicMethods;
            }];
    });

    m.directive('ngDialog', ['ngDialog', function (ngDialog) {
        return {
            restrict: 'A',
            scope: {
                ngDialogScope: '='
            },
            link: function (scope, elem, attrs) {
                elem.on('click', function (e) {
                    e.preventDefault();

                    var ngDialogScope = angular.isDefined(scope.ngDialogScope) ? scope.ngDialogScope : 'noScope';
                    angular.isDefined(attrs.ngDialogClosePrevious) && ngDialog.close(attrs.ngDialogClosePrevious);

                    var defaults = ngDialog.getDefaults();

                    ngDialog.open({
                        template: attrs.ngDialog,
                        className: attrs.ngDialogClass || defaults.className,
                        controller: attrs.ngDialogController,
                        controllerAs: attrs.ngDialogControllerAs,
                        bindToController: attrs.ngDialogBindToController,
                        scope: ngDialogScope,
                        data: attrs.ngDialogData,
                        showClose: attrs.ngDialogShowClose === 'false' ? false : (attrs.ngDialogShowClose === 'true' ? true : defaults.showClose),
                        closeByDocument: attrs.ngDialogCloseByDocument === 'false' ? false : (attrs.ngDialogCloseByDocument === 'true' ? true : defaults.closeByDocument),
                        closeByEscape: attrs.ngDialogCloseByEscape === 'false' ? false : (attrs.ngDialogCloseByEscape === 'true' ? true : defaults.closeByEscape),
                        overlay: attrs.ngDialogOverlay === 'false' ? false : (attrs.ngDialogOverlay === 'true' ? true : defaults.overlay),
                        preCloseCallback: attrs.ngDialogPreCloseCallback || defaults.preCloseCallback
                    });
                });
            }
        };
    }]);

    return m;
}));

angular.module('truncate', [])
    .filter('characters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }else{
                    while(input.charAt(input.length-1) === ' '){
                        input = input.substr(0, input.length -1);
                    }
                }
                return input + '…';
            }
            return input;
        };
    })
    .filter('splitcharacters', function() {
        return function (input, chars) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                var prefix = input.substring(0, chars/2);
                var postfix = input.substring(input.length-chars/2, input.length);
                return prefix + '...' + postfix;
            }
            return input;
        };
    })
    .filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '…';
                }
            }
            return input;
        };
    });
