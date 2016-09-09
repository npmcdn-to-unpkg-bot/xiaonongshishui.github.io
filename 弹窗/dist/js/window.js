// /**
//  * Created by Zzz on 2016/5/9.
//  */
// define(['widget','jquery','jqueryUI'],function(widget,$,$UI){
//     function Window(){
//         this.cfg = {
//             width:500,
//             height:300,
//             content:'',
//             handle4CloseBtn:null,
//             handle4AlertBtn:null,
//             text4AlertBtn:'确定',
//             title:'系统消息',
//             hasCloseBtn:false,
//             skinClassName:null,
//             hasMask:true,
//             isDraggable:true,
//             draggableHandle:null
//         };
//         widget.Widget.apply(this,arguments);
//     }
//     function object(o){
//         function F(){}
//         F.prototype = o;
//         return new F();
//     }
//     Window.prototype = object(widget.Widget.prototype);
//     console.log(new Window());
//     console.log(Window.prototype);
//     Window.prototype.alert=function(cfg){
//         var CFG = $.extend(this.cfg,cfg),
//             boundingBox=$('<div class="window_boundingBox">'+
//             '<div class="window_header">'+CFG.title+'</div>'+
//             '<div class="window_body">'+CFG.content+'</div>'+
//             '<div class="window_footer"><input type="button" value="'+CFG.text4AlertBtn+'"></div>'+
//             '</div>'),
//             mask = null,
//             that = this;
//         if(CFG.hasMask){
//             mask = $('<div class="window_mask"></div>');
//             mask.appendTo('body');
//         }
//         boundingBox.appendTo('body');
//         var btn = boundingBox.find('.window_footer input');
//         btn.click(function(){
//             if(CFG.handle4AlertBtn){
//                 CFG.handle4AlertBtn();
//                 that.fire('alert');
//             }
//             if(mask){
//                 mask.remove();
//             }
//             boundingBox.remove();
//         });
//         boundingBox.css({
//             width:CFG.width + 'px',
//             height:CFG.height + 'px',
//             left:(CFG.x||(window.innerWidth - CFG.width)/2) + 'px',
//             top:(CFG.y||(window.innerHeight - CFG.height)/2) + 'px'
//         });
//         if(CFG.hasCloseBtn){
//             var closeBtn = $('<span class="window_closeBtn">X</span>');
//             closeBtn.appendTo(boundingBox);
//             closeBtn.click(function(){
//                 if(CFG.handle4CloseBtn){
//                     CFG.handle4CloseBtn();
//                     that.fire('close');
//                 }
//                 if(mask){
//                     mask.remove();
//                 }
//                 boundingBox.remove();
//             });
//         }
//         if(CFG.skinClassName){
//             boundingBox.addClass(CFG.skinClassName);
//         }
//         if(CFG.isDraggable){
//             if(CFG.draggableHandle){
//                 boundingBox.draggable({handle:CFG.draggableHandle});
//             }
//             else {
//                 boundingBox.draggable();
//             }
//         }
//         return this;
//     };
//     Window.prototype.confirm=function(){};
//     Window.prototype.prompt=function(){};
//     return{
//         "Window":Window
//     };
// });
/**
 * Created by Zzz on 2016/5/9.
 */
define(['widget','jquery','jqueryUI'],function(widget,$,$UI){
    function Window(){
        this.cfg = {
            width:500,
            height:300,
            title:'系统消息',
            content:"",
            hasCloseBtn:false,
            hanMask:true,
            isDraggable:true,
            dragHandle:null,
            skinClassName:null,
            text4AlertBtn:'确定',
            text4CancelBtn:'取消',
            handler4AlertBtn:null,
            handler4CloseBtn:null,
            handler4ConfirmBtn:null,
            handler4CancelBtn:null,
            text4PromptBtn:'确定',
            isPromptInputPassword:false,
            defaultValue4PromptInput:false,
            maxlength4PromptInput:10,
            handler4PromptBtn:null
        };
    }

    Window.prototype = $.extend({},new widget.Widget(),{
        renderUI:function(){
            var footerContent='';
            switch(this.cfg.winType){
                case "alert":
                    footerContent='<input type="button" value="'+this.cfg.text4AlertBtn+'" class="window_alertBtn">';
                    break;
                case "confirm":
                    footerContent='<input type="button" value="'+
                    this.cfg.text4ConfirmBtn+'" class="window_confirmBtn"><input type="button" value="'+
                    this.cfg.text4CancelBtn+'" class="window_cancelBtn">';
                    break;
                case "prompt":
                    this.cfg.content+='<p class="window_promptInputWrapper"><input type="'+
                    (this.cfg.isPromptInputPassword?"password":"text")+
                    '" value="'+this.cfg.defaultValue4PromptInput+
                    '" maxlength="'+this.cfg.maxlength4PromptInput+
                    '" class="window_promptInput"></p>';
                    footerContent='<input type="button" value="'+this.cfg.text4PromptBtn+
                    ' " class="window_promptBtn"><input type="button" value="'+
                    this.cfg.text4CancelBtn+'" class="window_cancelBtn">';
                    break;
            }
            this.boudingBox = $(
                    '<div class="window_boundingBox">'+
                        '<div class="window_body">'+this.cfg.content+'</div>'+
                    '</div>'
                );
            if (this.cfg.winType!="common") {
                this.boudingBox.prepend('<div class="window_header">'+this.cfg.title+'</div>');
                this.boudingBox.append('<div class="window_footer">'+footerContent+'</div>');
            }
            /*处理模态*/
            if (this.cfg.hanMask) {
                this._mask = $('<div class="window_mask"></div>');
                this._mask.appendTo("body");
            }

            if(this.cfg.hasCloseBtn){
                this.boudingBox.append('<span class="window_closeBtn">X</span>');
            }
            this.boudingBox.appendTo(document.body);
            this._promptInput = this.boudingBox.find('.window_promptInput');
        },
        bindUI:function(){
            var that = this;
            this.boudingBox.delegate(".window_alertBtn","click",function(){
                that.fire('alert');
                that.destroy();
            }).delegate(".window_closeBtn","click",function(){
                that.fire('close');
                that.destroy();
            }).delegate(".window_confirmBtn","click",function(){
                that.fire('confirm');
                that.destroy();
            }).delegate(".window_cancelBtn","click",function(){
                that.fire('cancel');
                that.destroy();
            }).delegate(".window_promptBtn","click",function(){
                that.fire('prompt',that._promptInput.val());
                that.destroy();
            });
            if (this.cfg.handler4AlertBtn) {
                this.on('alert',this.cfg.handler4AlertBtn);
            }
            if (this.cfg.handler4CloseBtn) {
                this.on('close',this.cfg.handler4CloseBtn);
            }
            if (this.cfg.handler4PromptBtn) {
                this.on("prompt",this.cfg.handler4PromptBtn);
            }
        },
        syncUI:function(){
            this.boudingBox.css({
                width:this.cfg.width + 'px',
                height:this.cfg.height + 'px',
                left:(this.cfg.x||(window.innerWidth-this.cfg.width)/2) + 'px',
                top:(this.cfg.y||(window.innerHeight-this.cfg.height)/2) + 'px'
            });
            if (this.cfg.skinClassName) {
                this.boudingBox.addClass(this.cfg.skinClassName);
            }
            if (this.cfg.isDraggable) {
                if (this.cfg.dragHandle) {
                    this.boudingBox.draggable({handle:this.cfg.dragHandle});
                }else{
                    this.boudingBox.draggable();
                }
            }
        },
        destructor:function(){
            if (this._mask) {
                this._mask.remove();
            }
        },
        alert:function(cfg){
            $.extend(this.cfg,cfg,{winType:'alert'});
            this.render();
            return this;
        },
        confirm:function(cfg){
            $.extend(this.cfg,cfg,{winType:'confirm'});
            this.render();
            return this;
        },
        prompt:function(cfg){
            $.extend(this.cfg,cfg,{winType:'prompt'});
            this.render();
            this._promptInput.focus();
            return this;
        },
        common:function(cfg){
            $.extend(this.cfg,cfg,{winType:'common'});
            this.render();
            return this;
        }
    });

    return{
        "Window" : Window
    };
});