/**
 * Home Page Download Modal Controller (Unpacked)
 * Handles the case study download form and modal popup
 * NOTE: This script references ikenpersonics.com - may need updates for JTNY
 */

var lastScrollPos = 0;

$(document).ready(function() {
    
    /**
     * Submit contact form to server
     * NOTE: This sends data to ikenpersonics.com - this functionality is deprecated
     */
    function submitContactForm(name, organisation, designation, email, comments) {
        var xhr = GetXmlHttpObject();
        var params = "name=" + name + 
                     "&organisation=" + organisation + 
                     "&designation=" + designation + 
                     "&email=" + email + 
                     "&comments=" + comments;
        
        xhr.onreadystatechange = function() {
            if (4 == xhr.readyState) {
                // Disable form fields
                $("input[name=txtName], input[name=txtOrganisation], input[name=txtDesignation], input[name=txtEmail], textarea[name=txtComments]")
                    .attr("disabled", true);
                
                // Show success message
                $("input#btnSubmit")
                    .css({ color: "#F57F3B", cursor: "default" })
                    .val("Thank you!")
                    .attr("disabled", true)
                    .attr("readonly", true);
                
                // Open PDF download
                mdd_popup("/res/doc.Iken_CaseStudy.pdf");
                
                // Auto-close modal after 3 seconds
                setTimeout(function() {
                    $("a#lnkDownload_Close").click();
                }, 3000);
                
                // Clear form fields
                $("input[name=txtName]").val(null);
                $("input[name=txtOrganisation]").val(null);
                $("input[name=txtDesignation]").val(null);
                $("input[name=txtEmail]").val(null);
                $("textarea[name=txtComments]").val(null);
            }
        };
        
        // Send AJAX request (NOTE: URL is deprecated)
        xhr.open("POST", "http://ikenpersonics.com/ajax/register.download.php?do=store_contact", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-length", params.length);
        xhr.setRequestHeader("Connection", "close");
        xhr.send(params);
        
        $("input#btnSubmit").css("color", "red").val("submitting...");
    }
    
    /**
     * Open download modal
     */
    $("a#lnkDownloadPdf, a.lnkDownloadPdf, #pop_maps>area").click(function(e) {
        $("div#fix_haze").fadeIn(0, function() {
            $("div#mdl_Download").fadeIn(TOUT_LOAD, function() {
                // If clicked from image map area, update modal title/content
                if ($(e.target).is("area")) {
                    $("span#mdl_title").text($(e.target).attr("title"));
                    $("td#mdl_content").text($(e.target).attr("data-text"));
                }
            });
            
            // Show modal and blur background
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
     * Close download modal
     */
    $("a#lnkDownload_Close").click(function() {
        $("div#mdl_Download").fadeOut(TOUT_LOAD, function() {
            $("div#fix_haze").fadeOut(0, function() {
                $("div#slides_wrap").removeClass("brisque");
                $("div#content_wrap").removeClass("brisque").scrollTop(lastScrollPos);
            });
        });
    });
    
    /**
     * Form validation and submission
     * NOTE: References deprecated functions fncFrmLoad and fncValidateFrm
     */
    var formElement = document.x;
    try {
        fncFrmLoad(formElement);
        
        var validateForm = function(form) {
            var isValid = fncValidateFrm(form);
            return isValid;
        };
        
        formElement.onsubmit = function() {
            var isValid = validateForm(this);
            if (isValid) {
                submitContactForm(
                    escape($("input[name=txtName]").val()),
                    escape($("input[name=txtOrganisation]").val()),
                    escape($("input[name=txtDesignation]").val()),
                    escape($("input[name=txtEmail]").val()),
                    escape($("textarea[name=txtComments]").val())
                );
            }
            return false;
        };
    } catch (e) {
        // Form functionality not available
    }
});

