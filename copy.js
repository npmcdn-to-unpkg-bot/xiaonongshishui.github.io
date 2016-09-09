// 复制标题和链接
var clipBoardContent="";    
var strHref = window.location.href;    
clipBoardContent += strHref;

function copyurl(event){ 
		var clipBoardContent="快来领红包！";    
        var strHref = window.location.href;    
        clipBoardContent += strHref;
        console.log(clipBoardContent);
        $("#share").attr("data-clipboard-text",clipBoardContent);   
        var clipboard = new Clipboard( '#share');
        console.log(clipboard);   
        clipboard.on('success', function(e) { 
        	console.log(1);
        	layer.open({
        		style: 'border:none;border-radius:5px;background-color:#fff; color:#323232;',
        		content:"<p style='margin:0'>链接复制成功！</p><p style='margin:0'>快点发送给好友吧！</p>"
        	});
        	e.clearSelection(); 
        }); 
        clipboard.on('error', function(e) { 
        	console.log(2);
        	layer.open({
        		content:"<p>"+clipBoardContent+"</p>"
        	});
        	console.log(e);
        	console.log('Action:', e.action); 
        	console.error('Trigger:', e.trigger); 
        	console.log(window.getSelection());
        	document.execCommand("Copy");
        });

} 