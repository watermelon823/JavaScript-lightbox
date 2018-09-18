 
;(function($){
	var LightBox = function() {
		var self = this;

		//create curtain and popup
		this.popupMask = $('<div id="G-lightbox-mask">');
		this.popupWin = $('<div id ="G-lightbox-popup">');

		//assign BODY to bodyNode
		this.bodyNode = $(document.body);

		//Render remaining Doms and insert them into body
		this.renderDOM();

		this.picViewArea = this.popupWin.find("div.lightbox-pic-view");//picture preview
		this.popupPic = this.popupWin.find("img.lightbox-image");//picture
		this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");//picture description comment
		this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
		this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");

		this.captionText = this.popupWin.find("p.lightbox-pic-desc");//discription
		this.currentIndex  = this.popupWin.find("span.lightbox-of-index");//current index
		this.closeBtn = this.popupWin.find("span.lightbox-close-btn");//close button


		//receive data for group 
		this.groupName = null;
		this.groupData = [];//keep data from the same group here
		this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]",
			"click",function(e){
			e.stopPropagation();
            
            var currentGroupName = $(this).attr("data-group");
            if(currentGroupName != self.groupName){
            	self.groupName = currentGroupName;
            	//get data from the same group according to the group name
            	self.getGroup();
            };

            //Initailize pop-up
            self.initPopup($(this));
        });

            //close popup
            this.popupMask.click(function(){
            	$(this).fadeOut();
            	self.popupWin.fadeOut();
            	self.clear  = false;
            });
            this.closeBtn.click(function(){
            	self.popupMask.fadeOut();
            	self.popupWin.fadeOut();

            });

            //click to change pricture
            this.flag =true;
            this.nextBtn.hover(function(){
            	if(!$(this).hasClass("diabled")&&self.groupData.length>1){
            		 $(this).addClass("lightbox-next-btn-show");
            	};
            },function(){
            	if(!$(this).hasClass("diabled")&&self.groupData.length>1){
            		 $(this).removeClass("lightbox-next-btn-show");
            	};

            }).click(function(e){ 
            	if(!$(this).hasClass("disabled")&&self.flag){
            		self.flag = false;
            		e.stopPropagation();
            		self.goto("next");

            	};
            });

            this.prevBtn.hover(function(){
            	if(!$(this).hasClass("diabled")&&self.groupData.length>1){
            		 $(this).addClass("lightbox-prev-btn-show");
            	};
            },function(){
            	if(!$(this).hasClass("diabled")&&self.groupData.length>1){
            		 $(this).removeClass("lightbox-prev-btn-show");
            	};

            }).click(function(e){
            	if(!$(this).hasClass("disabled")&&self.flag){
            		self.flag = false;
            		e.stopPropagation();
            		self.goto("prev");
            	};
            });

            //window resize
            var timer= null;
            this. clear = false;
            $(window).resize(function(){
            	if(self.clear){
            		window.clearTimeout(timer);
                timer = window.setTimeout(function(){
                  self.loadPicSize(self.groupData[self.index].src);

               },500);
            };

            });




	};
	LightBox.prototype ={
		goto: function(dir){
			if(dir==="next"){
				//this.groupDta
				//this.index
				this.index++;
				if(this.index >=this.groupData.length-1){
					this.nextBtn.addClass("disabled")
					   .removeClass("lightbox-next-btn-show");

				};
				if(this.index != 0 ){
					this.prevBtn.removeClass("disabled");
					    
				};

				var src =this.groupData[this.index].src;
				this.loadPicSize(src);

			}else if(dir==="prev"){
				this.index--;

				if(this.index <= 0 ){
					this.prevBtn.addClass("disabled")
					    .removeClass("lightbox-prev-btn-show");
				};

				if(this.index != this.groupData.length-1){
					this.nextBtn.removeClass("disabled");
				};
				var src =this.groupData[this.index].src;
				this.loadPicSize(src);

			};

		},
		loadPicSize:function(sourceSrc){
			var self = this;
			self.popupPic.css({
				width:"auto",
				height:"auto"
			}).hide();
			this.picCaptionArea.hide();


			this.preLoadImg(sourceSrc,function(){

		        self.popupPic.attr("src",sourceSrc);
				var picWidth = self.popupPic.width(),
			    picHeight = self.popupPic.height();

				console.log(picWidth+":"+picHeight);
				self.changePic(picWidth,picHeight);

			});


		},
		changePic:function(width,height){

			var self =this,
			    winWidth = $(window).width(),
			    winHeight = $(window).height();


			var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);
			width = width*scale;
			height = height*scale;

			this.picViewArea.animate({
				width:width-10,
				height:height-10

			});

			this.popupWin.animate({
				width:width-10,
				height:height-10,
				marginLeft:-(width/2),
				top:(winHeight-height)/2
			},function(){
				self.popupPic.css({
					width:width-10,
					height:height-10
								}).fadeIn();
				 self.picCaptionArea.fadeIn();
				 self.flag= true;
				 self.clear =true;
			});

		//prepate data for text comment and current positio
		this.captionText.text(this.groupData[this.index].caption);
		this.currentIndex.text("Current Position： "+(this.index+1)+ " of " +this.groupData.length);
		//this.captionIndex



		},
		preLoadImg:function(src,callback){

			var img = new Image();
			if(!!window.ActiveXObject){
				img.onreadystatechange = function(){
					if(this.readtState==="complete"){
						callback();					
					};
				};
			}else {
				img.onload = function(){
					callback();
				};
			};
			img.src = src;

		},
		showMaskAndPopup: function(sourceSrc,currentId){
			var self = this;

			this.popupPic.hide();
			this.picCaptionArea.hide();
		
			this.popupMask.fadeIn();

			var winWidth = $(window).width(),
			    winHeight = $(window).height();

			this.picViewArea.css ({
				width:winWidth/2,
				height:winHeight/2
			});

			this.popupWin.fadeIn();

			var viewHeight = winHeight/2+10;

			this.popupWin.css({
				width:winWidth/2+10,
                height:winHeight/2+10,
                marginLeft:-(winWidth/2+10)/2,
                top: -viewHeight
			}).animate({
				         top:(winHeight - viewHeight)/2
				     },function(){
				     	//Load Picture
				     	self.loadPicSize(sourceSrc);

         
			         });

			//get index according to id of the elements

			this.index = this.getIndexOf(currentId);

			var groupDataLength = this.groupData.length;
			if(groupDataLength>1){

				if(this.index ===0){
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if(this.index === groupDataLength-1){
					this.nextBtn.addClass("disabled");
					this.prevBtn.removeClass("disabled");
				}else{
					this.nextBtn.removeClass("disabled");
					this.prevBtn.removeClass("disabled");
				};

			};




		},
		getIndexOf:function(currentId){

			var index = 0;

			$(this.groupData).each(function(i){
				index= i;
				if(this.id===currentId){
					return false;

				};

			});

			return index;

		},

		initPopup:function(currentObj){

			var self = this,
			    sourceSrc = currentObj.attr("data-source"),
			    currentId = currentObj.attr("data-id");

			this.showMaskAndPopup(sourceSrc,currentId);



		},
		getGroup:function() {

			var self= this;

			var groupList = 
			this.bodyNode.find("*[data-group="+this.groupName+"]");
			
			//clear
			self.groupData.length = 0;
			
			groupList.each(function(){

				self.groupData.push({
                            src:$(this).attr("data-source"),
                            id:$(this).attr("data-id"),
                            caption:$(this).attr("data-caption")
				});

			});

			console.log(self.groupData);

		},

		renderDOM:function() {
			var strDom = '<div class="lightbox-pic-view">'+
		              	  ' <span class="lightbox-btn lightbox-prev-btn  disabled"></span>'+
			               '<img class="lightbox-image" src="images/2-2.jpg">'+
			               '<span class="lightbox-btn lightbox-next-btn  disabled"></span>'+
		               '</div>'+
		               '<div class="lightbox-pic-caption">'+
			             '<div class="lightbox-caption-area">'+
				            '<p class="lightbox-pic-desc">hello</p>'+
				            '<span class="lightbox-of-index">Current Position： 0 of 0</span>'+
			             '</div>'+
			             '<span class="lightbox-close-btn"></span>'+
		               '</div>';
		    //insert to this.popupWin
		    this.popupWin.html(strDom);

		    //Insert curtain and popup to body
		    this.bodyNode.append(this.popupMask,this.popupWin);
		}

	}
	window["LightBox"] = LightBox;



})(jQuery);
