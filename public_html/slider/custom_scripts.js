function tt_init_custom_scripts(){    
    var tt_scripts_srs=new Object();
    jQuery('.tt_custom_js_files').each(function(index){	
	tt_scripts_srs[jQuery(this).attr('jid')]=jQuery(this).attr('jurl');
	jQuery(this).remove();
    });
    yepnope({
	load:tt_scripts_srs,
	callback:function(url, result, key){
	    
	},
	complete:function(){
	    tt_init_script_after();
	}
    });
}
function tt_init_script_after(){    
    //window['my_custom_func']();
    var tt_scripts_func=new Object();
    jQuery('.tt_custom_scipt').each(function(){
	tt_scripts_func[jQuery(this).attr('jid')]=jQuery(this).attr('jcal');
	eval(jQuery(this).attr('jcal')+'()');	
	jQuery(this).remove();
    });
}
