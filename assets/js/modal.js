/* ===== Zeste de Savoir ====================================================
   Manage modals boxes
   ========================================================================== */

(function(document, $, undefined) {
    "use strict";

    var Modal = function(options) {
        this.options = $.extend({
            titleIcon: "",
            closeText: "Annuler"
        }, options);
        if(!Modal._initialized) this.firstRun();
        this.init();
    };

    Modal.closeCurrent = function() {
        Modal.current.modal.removeClass("open");
        Modal.container.removeClass("open");
        $("html").removeClass("dropdown-active");
        Modal.current = null;
    };

    Modal.openModal = function(id) {
        if(Modal.list[id]) {
            Modal.list[id].open();
        }
    };

    Modal.prototype = {
        firstRun: function() {
            Modal.container = $("<div>", { class: "modals-container" });
            Modal.wrapper = $("<div>", { class: "modals-wrapper" });
            Modal.overlay = $("<div>", { class: "modals-overlay" });
            Modal.container.append(Modal.wrapper).append(Modal.overlay).appendTo($("body"));
            Modal.list = [];
            Modal._initialized = true;
            Modal.nextId = 0;

            Modal.overlay.on("click", Modal.closeCurrent);

            $("body").on("click", ".open-modal", function(e) {
                Modal.openModal($(this).attr("href").substring(1));

                e.preventDefault();
                e.stopPropagation();
            }).on("keydown", function(e) {
                // Escape close modal
                if(Modal.current && e.which === 27){
                    Modal.closeCurrent();
                    e.stopPropagation();
                } else if(Modal.current && e.which === 13) {
                    if(document.activeElement.tagName !== "TEXTAREA" || e.ctrlKey) {
                        var elem = Modal.current.footer.find(".btn-submit").get(0);
                        if(elem) elem.click();
                    }
                }
            });
        },

        init: function() {
            this.modal = this.options.modal || $("<div>", { class: "modal modal-flex" });
            this.id = this.modal.attr("id") || "noid-" + (Modal.nextId++);
            this.title = $("<div>", {
                class: "modal-title",
                text: this.options.title
            });

            if(this.options.titleIcon) {
                this.title.addClass(this.options.titleIcon + " ico-after");
            }

            this.body = $("<div>", {
                class: "modal-body"
            }).append(this.options.body);

            this.footer = $("<div>", {
                class: "modal-footer"
            }).append(this.options.footer).append($("<a>", {
                class: "btn btn-cancel",
                href: "#close-modal",
                text: this.options.closeText,
                click: function(e){
                    Modal.closeCurrent();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }));

            this.modal.addClass("tab-modalize").append(this.title, this.body, this.footer).appendTo(Modal.wrapper);

            Modal.list[this.id] = this;
        },

        open: function() {
            if(Modal.current) Modal.closeCurrent();
            this.modal.addClass("open");
            Modal.container.addClass("open");

            Modal.current = this;

            this.body.find("input:visible, select, textarea").first().focus();
            if(!$("html").hasClass("enable-mobile-menu"))
                $("html").addClass("dropdown-active");
        },

        close: function() {
            Modal.closeCurrent();
        }
    };

    function buildModals($elems){
        $elems.each(function(){
            var $link = $("[href=#"+$(this).attr("id")+"]:first");

            var linkIco = "";
            if($link.hasClass("ico-after")) {
                linkIco = $link.attr("class").split(" ").concat(["light"]).filter(function(c) {
                    return ["", "ico-after", "open-modal", "blue"].indexOf(c) === -1 && c.indexOf("btn-") === -1;
                }).join(" ");
            }

            new Modal({
                title: $link.text(),
                footer: $(this).find(".btn, [type=submit]").filter(":not(.modal-inner)").detach(),
                body: $(this).children(),
                modal: $(this),
                closeText: $(this).is("[data-modal-close]") ? $(this).attr("data-modal-close") : "Annuler",
                titleIcon: linkIco
            });
        });
    }

    window.Modal = Modal;

    $(document).ready(function(){
        buildModals($(".modal"));
        $("#content").on("DOMNodeInserted", ".modal", function(e){
            buildModals($(e.target));
        });
    });
})(document, jQuery);
