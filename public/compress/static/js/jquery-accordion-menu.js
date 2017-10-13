;(function($, undefined) {
    var pluginName = "jqueryAccordionMenu";
    var defaults = {
        speed: 300,
        showDelay: 10,
        hideDelay: 10,
        singleOpen: false,
        clickEffect: false
    };
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({},
        defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init()
    };
    $.extend(Plugin.prototype, {
        init: function() {
            this.openSubmenu();
            this.submenuIndicators();
        },
        openSubmenu: function() {
            $(this.element).children("ul").find("li:not(.default) > a").off("click").on("click",
            function(e) {
                e.stopPropagation();
                e.preventDefault();
                var $this = $(this).closest("li"),
                    $submenu = $this.children(".submenu"),
                    $a = $submenu.siblings("a");
                if ($submenu.length > 0) {
                    if ($submenu.css("display") == "none") {
                        $submenu.stop(true,true).delay(defaults.showDelay).slideDown(defaults.speed);
                        $a.addClass("submenu-indicator-minus");
                        $(".scllorBar_app").mCustomScrollbar("update");
                        if (defaults.singleOpen) {
                            $this.siblings(":not(.default)").children(".submenu").stop(true,true).slideUp(defaults.speed);
                            $this.siblings(":not(.default)").children(".submenu").siblings("a").removeClass("submenu-indicator-minus")
                        }
                        return false
                    } else {
		                $submenu.stop(true,true).delay(defaults.hideDelay).slideUp(defaults.speed)
                    }
                    if ($a.hasClass("submenu-indicator-minus")) {
                        $a.removeClass("submenu-indicator-minus")
                    }
                }
            });
        },
        submenuIndicators: function() {
        	var elem = $(this.element).children("ul").find("li:not(.default)");
            if (elem.length > 0) {
                elem.find(".submenu").siblings("a").append("<span class='submenu-indicator'>+</span>")
            }
        }
    });
    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options))
            }
        });
        return this
    }
})(jQuery);