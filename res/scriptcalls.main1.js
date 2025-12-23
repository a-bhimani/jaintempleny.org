/**
 * Main Navigation & Slideshow Controller (Unpacked)
 * Handles menu, slide transitions, keyboard navigation, and mouse wheel scrolling
 */

var scrollFiredTout = true;

// Remove no-JS class from main wrapper
$("div#wrapper_main").removeClass(CSSS_NOJS);

// Menu open/close handlers
$("div#wrapper_menu.wrap_menu").removeClass(CSSS_NOJS)
    .on("openMenu", function() {
        $("div#wrapper_slides").triggerHandler("closeTray");
        $(this).addClass("active");
        $("div#fix_haze").fadeIn(0, function() {
            $("div#slides_wrap").addClass("brisque");
        });
    })
    .on("closeMenu", function() {
        $(this).removeClass("active");
        setTimeout(function() {
            $("div#fix_haze").fadeOut(TOUT_LOAD, function() {
                $("div#slides_wrap").removeClass("brisque");
            });
        }, TOUT_LOAD);
    });

// Menu toggle button
$("div#menu_toggler").click(function() {
    if ($("div#wrapper_menu.wrap_menu").hasClass("active")) {
        $("div#wrapper_menu.wrap_menu").triggerHandler("closeMenu");
    } else {
        $("div#wrapper_menu.wrap_menu").triggerHandler("openMenu");
    }
});

// Slide content "joust" event - triggered when switching slides
$("ul#slide_contents>li").on("joust", function() {
    var e = $(this);
    
    // Close download modal and menu
    $("a#lnkDownload_Close").triggerHandler("click");
    $("div#wrapper_menu.wrap_menu").triggerHandler("closeMenu");
    
    // Reset iframes (prevents video from playing in background)
    $("iframe").each(function() {
        $(this).attr("data-src", $(this).attr("src"))
               .attr("src", null)
               .attr("src", $(this).attr("data-src"));
    });
    
    // Hide other slides, show this one
    e.siblings("li").removeClass("active").hide(0, function() {
        // Clear background
        $("body").css({ backgroundImage: "none" });
        
        // Load slide background image if specified
        if (e.attr("data-mbg-img")) {
            $("div#fix_haze").show(0, function() {
                var i = document.createElement("img");
                i.src = "res/" + e.attr("data-mbg-img");
                $.get(i.src).done(function() {
                    $("body").css({ "background-image": "url('" + i.src + "')" }, function() {
                        $("div#fix_haze").fadeOut(TOUT_LOAD);
                    });
                }).fail(function() {
                    $("body").css({ backgroundImage: "none" });
                });
            });
        }
        
        // Reset counter animation
        e.find("span.counter>span.ctr_rund").text(0);
        
        // Add underline class to links inside spans
        e.find("a").each(function() {
            if ($(this).parent().is("span")) {
                $(this).parent("span").addClass("underline");
            }
        });
        
        // Animate slide in
        e.slideDown(0, function() {
            // Counter animation (if slide has counters)
            if (e.find("span.counter").length > 0) {
                var interval, steps = 30, currentStep = 0;
                interval = setInterval(function() {
                    var animating = true;
                    e.find("span.counter").each(function() {
                        var targetVal = 0, currentVal = 0, increment = 0;
                        try {
                            targetVal = parseFloat($(this).attr("data-byval"));
                            currentVal = parseFloat($(this).children("span.ctr_rund").text());
                            increment = parseFloat(Math.ceil(targetVal / steps));
                        } catch (a) {}
                        if (targetVal > currentVal) {
                            $(this).children("span.ctr_rund").text(
                                currentVal + increment > targetVal ? targetVal : currentVal + increment
                            );
                        }
                    });
                    if (currentStep == steps) {
                        clearInterval(interval);
                        animating = false;
                    }
                    if (animating) currentStep++;
                }, 80);
            }
            
            // Scroll content to top and update navigation dots
            $("div#content_wrap").animate({ scrollTop: 0 }, TOUT_LOAD, function() {
                $("ul#listed_navli>li.first").addClass("active");
                $('ul#listed_navli>li>a.spread[href="#' + $("ul#slide_contents>li.active").attr("id") + '"]')
                    .parent("li").addClass("active")
                    .siblings("li").removeClass("active");
            });
            
            e.addClass("active");
            
            setTimeout(function() {
                e.find("a").each(function() {
                    $(this).parent().is("span");
                });
            }, 3000);
        });
    });
});

// Slide navigation handlers
$("ul#slide_contents").removeClass(CSSS_NOJS)
    .on("watchNext", function() {
        var e = $(this).children("li.active");
        $("div.slide_btn").show(0);
        if (e.is(":last-child")) {
            $("ul#slide_contents>li").first("li").triggerHandler("joust");
        } else {
            e.next("li").triggerHandler("joust");
        }
    })
    .on("watchPrev", function() {
        var e = $(this).children("li.active");
        $("div.slide_btn").show(0);
        if (e.is(":first-child")) {
            $("ul#slide_contents>li").last("li").triggerHandler("joust");
        } else {
            e.prev("li").triggerHandler("joust");
        }
    })
    .on("watchThis", function(e, i) {
        var n = [];
        
        // Trigger joust for specific slide
        $(this).children('li[id="' + i.split("#")[1] + '"]').triggerHandler("joust");
        
        // Update menu states
        $("ul#slide_contents, ul#pgmenu").removeClass("slong");
        $("ul#menu").find("div.submenu").removeClass("active");
        $("ul#pgmenu>li>div.submenu_items>a.spread").each(function() {
            $(this).css("background-image", "none").text($(this).attr("data-name"));
        });
        $("ul#pgmenu>li, ul#pgmenu>li div.submenu_items").removeClass("active");
        
        // Handle submenu items
        if ($('ul#pgmenu>li>div.submenu_items>a[href="#' + i.split("#")[1] + '"]').parent("div.submenu_items").length > 0) {
            var t = $('ul#pgmenu>li>div.submenu_items>a[href="#' + i.split("#")[1] + '"]');
            $("ul#slide_contents, ul#pgmenu").addClass("slong");
            t.css("background-image", "url('/res/" + t.attr("data-bg-img") + "')").text("");
            i = t.parent("div.submenu_items").parent("li").children("a.spread").attr("href");
        }
        
        // Update main menu active states
        n.push($("ul#menu").find('a[href="' + window.location.pathname + i + '"]'));
        n.push($("ul#menu").find('a[href="' + i + '"]'));
        $.each(n, function() {
            $(this).parent("div.submenu").addClass("active");
        });
        
        // Update page menu and nav dots
        $('ul#pgmenu>li>a[href="#' + i.split("#")[1] + '"]').parent("li").addClass("active");
        $("ul#listed_navli>li.first").addClass("active");
        if (i) {
            $('ul#listed_navli>li>a.spread[href="' + i + '"]')
                .parent("li").addClass("active")
                .siblings("li").removeClass("active");
        }
    })
    .ready(function() {
        // Initialize first slide
        $("ul#slide_contents>li").first("li").removeClass("active").hide(0).triggerHandler("joust");
    });

// Slides wrap navigation buttons
$("div#slides_wrap").removeClass(CSSS_NOJS).ready(function() {
    var scrollInterval;
    
    // Hide slides wrap if only one slide
    if (!$("ul#slide_contents") || $("ul#slide_contents>li").length <= 1) {
        $("div#slides_wrap").hide(0);
    }
    
    // Previous button
    $("div#nav_prev.slide_btn").click(function() {
        var btn = $(this);
        btn.addClass("hover");
        setTimeout(function() {
            btn.removeClass("hover");
            $("ul#slide_contents").triggerHandler("watchPrev");
        }, TMRT_ANIM);
    }).mouseover(function() {
        scrollInterval = setInterval(function() {
            var pos = $("div#content_wrap").scrollTop();
            $("div#content_wrap").scrollTop(pos - 8);
        }, 30);
    }).mouseleave(function() {
        clearInterval(scrollInterval);
    });
    
    // Next button
    $("div#nav_next.slide_btn").click(function() {
        var btn = $(this);
        btn.addClass("hover");
        setTimeout(function() {
            btn.removeClass("hover");
            $("ul#slide_contents").triggerHandler("watchNext");
        }, TMRT_ANIM);
    }).mouseover(function() {
        scrollInterval = setInterval(function() {
            var pos = $("div#content_wrap").scrollTop();
            $("div#content_wrap").scrollTop(pos + 8);
        }, 30);
    }).mouseleave(function() {
        clearInterval(scrollInterval);
    });
    
    // Click handlers for menu links and nav dots
    $("ul#pgmenu li a.spread, ul#menu div.submenu>a.spread, ul#listed_navli>li>a.spread").click(function() {
        $("ul#slide_contents").triggerHandler("watchThis", $(this).attr("href"));
        $(window).width() <= 800;
    });
});

// Document click handler (close menu when clicking haze overlay)
$(document).click(function(e) {
    if ($(e.target).is("div#fix_haze")) {
        if ($("div#wrapper_menu").hasClass("active")) {
            $("div#wrapper_menu.wrap_menu").triggerHandler("closeMenu");
        }
        $("a#lnkDownload_Close").triggerHandler("click");
    }
});

// Keyboard navigation
$(document).keydown(function(e) {
    switch (e.keyCode) {
        case 37: // Left arrow
        case 38: // Up arrow
            $("div#nav_prev.slide_btn").click();
            break;
        case 39: // Right arrow
        case 40: // Down arrow
            $("div#nav_next.slide_btn").click();
            break;
        case 27: // Escape
            if ($("div#wrapper_menu").hasClass("active")) {
                $("div#wrapper_menu.wrap_menu").triggerHandler("closeMenu");
            }
            $("a#lnkDownload_Close").triggerHandler("click");
        default:
            return;
    }
});

// Mouse wheel navigation
$(document).bind(/Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel", function(e) {
    if (scrollFiredTout) {
        var event = window.event || e;
        scrollFiredTout = false;
        event = event.originalEvent ? event.originalEvent : event;
        var delta = event.detail ? -40 * event.detail : event.wheelDelta;
        
        if (delta > 0) {
            $("div#nav_prev.slide_btn").click();
            setTimeout(function() { scrollFiredTout = true; }, 2000);
        } else {
            $("div#nav_next.slide_btn").click();
            setTimeout(function() { scrollFiredTout = true; }, 2000);
        }
    }
});

// Window resize handler
$(window).resize(function() {
    $("div#content_wrap").outerHeight(
        $(window).outerHeight() - (
            $("div#wrapper_head").outerHeight() + 
            $("div#wrapper_foot").outerHeight() + 
            ($("div#content_wrap").outerHeight() - $("div#content_wrap").innerHeight())
        )
    );
}).load(function() {
    $(this).resize();
});

// Handle URL hash on page load
window.addLoadEvent(function() {
    if (window.location.hash) {
        $("ul#slide_contents").triggerHandler("watchThis", window.location.hash);
    }
}, null, true);

