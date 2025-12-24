/**
 * Home Page Modal Controller
 * Handles modal popup functionality
 */

var lastScrollPos = 0;

$(document).ready(function() {
    
    /**
     * Open modal (generic handler)
     */
    $("a#lnkDownloadPdf, a.lnkDownloadPdf, #pop_maps>area").click(function(e) {
        $("div#fix_haze").fadeIn(0, function() {
            $("div#mdl_Download").fadeIn(TOUT_LOAD, function() {
                if ($(e.target).is("area")) {
                    $("span#mdl_title").text($(e.target).attr("title"));
                    $("td#mdl_content").text($(e.target).attr("data-text"));
                }
            });
            
            if ($("div#mdl_Download").parent("li")) {
                $("div#mdl_Download").parent("li").show(0, function() {
                    $("div#slides_wrap, div#content_wrap").addClass("brisque");
                    lastScrollPos = $("div#content_wrap").scrollTop();
                });
            }
        });
        
        $("div#content_wrap").scrollTop(0);
    });
    
    /**
     * Close modal
     */
    $("a#lnkDownload_Close").click(function() {
        $("div#mdl_Download").fadeOut(TOUT_LOAD, function() {
            $("div#fix_haze").fadeOut(0, function() {
                $("div#slides_wrap").removeClass("brisque");
                $("div#content_wrap").removeClass("brisque").scrollTop(lastScrollPos);
            });
        });
    });
});
