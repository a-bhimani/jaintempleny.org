
$(document).ready(function(){
	var x=document.x;
		try{fncFrmLoad(x);
				var validate=function(x){
				var ty=false;
				var firstCtrl=null;
				var y=x.txtMobile;
				if(y.value<1000000000 || y.value>9999999999){
					if(firstCtrl==null) firstCtrl=y;
					$('th#td'+ y.id).addClass('red');
					$('div#msgBox').text('Invalid Mobile no.');
					t=false;
				}else $('th#td'+ y.id).removeClass('red');
				var y=x.txtComment;
				if(y.value || y.value.length==0){
					if(firstCtrl==null) firstCtrl=y;
					$('th#td'+ y.id).addClass('red');
					t=false;
				}else $('th#td'+ y.id).removeClass('red');
				ty=fncValidateFrm(x);
				if(ty) firstCtrl.focus();
				firstCtrl=null;
			}
			x.onsubmit=function(){
				var t=validate(this);
				if(t) return t;
				return false;
			}
		}catch(e){alert("There was an error processing your request.");}
	});