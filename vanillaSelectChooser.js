/* 
Copyright (C) Philippe Meyer 2019
Distributed under the MIT License
vanillaSelectChooser.js
Takes a select multiple drop down and transforms it into 2 lists : to choose on the left, chosen on the right
v0.01 : first prototype Work in progress
v0.10 : First fully working version
https://github.com/PhilippeMarcMeyer/vanillaSelectChooser
*/
function vanillaSelectChooser(domSelector, options) {
    let factory = this;
    this.domSelector = domSelector;
    this.root = document.querySelector(domSelector)
	this.options = null;
    this.userOptions = {
        minWidth: 80,
        maxHeight: 400,
		gapBeetween :120,
        translations: { "available": "Availables", "chosen": "Chosen" },
    }
	
    if (options) {
        if (options.minWidth != undefined) {
            this.userOptions.minWidth = options.minWidth;
        }
        if (options.maxHeight != undefined) {
            this.userOptions.maxHeight = options.maxHeight;
        }
        if (options.translations != undefined) {
            this.userOptions.translations = options.translations;
        }
    }
	this.handleCloseClick = function(event){
		let target = event.target;
		let value = target.parentNode.getAttribute("data-value");
		Array.prototype.slice.call(factory.options).forEach(function (x) {
			if(x.value == value){
				x.removeAttribute("selected");
			}
		});
		factory.filter();
	}
	
	this.handleAddClick = function(event){
		let target = event.target;
		let value = target.parentNode.getAttribute("data-value");
		Array.prototype.slice.call(factory.options).forEach(function (x) {
			if(x.value == value){
				x.setAttribute("selected", true);
			}
		});
		factory.filter();
	}
	
	this.handleListDoubleClick = function(event){
		let target = event.target;
		let value = target.getAttribute("data-value");
		Array.prototype.slice.call(factory.options).forEach(function (x) {
			if(x.value == value){
				x.setAttribute("selected", true);
			}
		});
		factory.filter();
	}

    this.init();
}

    vanillaSelectChooser.prototype.init = function () {
		let factory = this;
		if(!factory.root.hasAttribute("multiple")){
			factory.root.setAttribute("multiple","multiple");
		}
        this.root.style.display = "none";
        let already = document.getElementById("main-zone-" + factory.domSelector);
        if (already) {
            already.remove();
        }
		
		
        this.main = document.createElement("div");
        this.root.parentNode.insertBefore(this.main, this.root.nextSibling);
        this.main.classList.add("vanilla-main");



        this.main.setAttribute("id", "main-zone-" + this.domSelector);
		
		this.leftSide =  document.createElement("div");
		this.main.appendChild(this.leftSide);
		this.leftSide.classList.add("vanilla-left");
		this.leftSide.setAttribute("style","display:inline-block;position:relative;float:left;overflow-y:auto;");
		this.leftSide.style.minWidth = factory.userOptions.minWidth+"px";
		this.leftSide.style.maxHeight = factory.userOptions.maxHeight+"px";
		
		this.titleLeft = document.createElement("div");
		this.leftSide.appendChild(this.titleLeft);
		this.titleLeft.setAttribute("style","position:absolute;left:0px;width:100%;text-align:center;font-size:16px;font-weight:bold;background-color:#fff;min-height:30px;padding-top:2px;user-select: none;  ")
		this.titleLeft.innerHTML = factory.userOptions.translations.available;
		
		 this.leftSide.addEventListener("scroll", function (e) {
                var y = this.scrollTop;
                factory.titleLeft.style.top = y + "px";
            });
		
		this.rightSide =  document.createElement("div");
		this.main.appendChild(this.rightSide);
		this.rightSide.classList.add("vanilla-right");
		this.rightSide.setAttribute("style","display:inline-block;position:relative;float:left;overflow-y:auto;");
		this.rightSide.style.float = "left";
		this.rightSide.style.minWidth = factory.userOptions.minWidth+"px";
		this.rightSide.style.maxHeight = factory.userOptions.maxHeight+"px";
		this.rightSide.style.marginLeft = factory.userOptions.gapBeetween+"px";
		
		this.titleRight = document.createElement("div");
		this.rightSide.appendChild(this.titleRight);
		this.titleRight.setAttribute("style","position:absolute;left:0px;width:100%;text-align:center;font-size:16px;font-weight:bold;background-color:#fff;min-height:30px;padding-top:2px;user-select: none; ")
		this.titleRight.innerHTML = factory.userOptions.translations.chosen;
		
		 this.rightSide.addEventListener("scroll", function (e) {
                var y = this.scrollTop;
                factory.titleRight.style.top = y + "px";
          });
			
        this.listLeft = document.createElement("ul");
        this.leftSide.appendChild(this.listLeft);
		this.listLeft.setAttribute("style","padding-top:30px;");

        this.listRight = document.createElement("ul");
        this.rightSide.appendChild(this.listRight);

        this.options = document.querySelectorAll(this.domSelector + " option");
        Array.prototype.slice.call(this.options).forEach(function (x) {
            let text = x.textContent;
            let value = x.value;
            let li = document.createElement("li");
            factory.listLeft.appendChild(li);
            li.setAttribute("data-value", value);
            li.setAttribute("data-text", text);
            li.appendChild(document.createTextNode(text));
			
			let li2 = document.createElement("li");
            factory.listRight.appendChild(li2);
            li2.setAttribute("data-value", value);
            li2.setAttribute("data-text", text);
            li2.appendChild(document.createTextNode(text));
			let span = document.createElement("span");
			span.appendChild(document.createTextNode("x"));
			li2.appendChild(span);
			span.classList.add("vanilla-close");
			
			let span2 = document.createElement("span");
			span2.innerHTML = "&#x2BC8;"
			li.appendChild(span2);
			span2.classList.add("vanilla-add");
        });
		factory.filter();
		 let leftList = factory.listLeft.querySelectorAll("li");
		Array.prototype.slice.call(leftList).forEach(function (x) {
		  x.addEventListener("dblclick", factory.handleListDoubleClick);
		});
		 let leftSign = factory.listLeft.querySelectorAll(".vanilla-add");
		 Array.prototype.slice.call(leftSign).forEach(function (x) {
		  x.addEventListener("click", factory.handleAddClick);
		});
		
		 let rightSign = factory.listRight.querySelectorAll(".vanilla-close");
		Array.prototype.slice.call(rightSign).forEach(function (x) {
		  x.addEventListener("click", factory.handleCloseClick);
		});
    }

    vanillaSelectChooser.prototype.filter = function () {
		let factory = this; 
		let selected = [];
		    Array.prototype.slice.call(this.options).forEach(function (x) {
		    let isSelected = x.hasAttribute("selected");
			if(isSelected) {
				selected.push(x.value);
			}
            let leftList = factory.listLeft.querySelectorAll("li");
			 Array.prototype.slice.call(leftList).forEach(function (x) {
				 let value = x.getAttribute("data-value");
				 if(selected.indexOf(value) == -1){
					 x.classList.remove("hide");
				 }else{
					 x.classList.add("hide");
				 }
			 });
			 let rightList = factory.listRight.querySelectorAll("li");
			 Array.prototype.slice.call(rightList).forEach(function (x) {
				 let value = x.getAttribute("data-value");
				 if(selected.indexOf(value) != -1){
					 x.classList.remove("hide");
				 }else{
					 x.classList.add("hide");
				 }
			 });
        });
		factory.privateSendChange();
	}

    vanillaSelectChooser.prototype.privateSendChange = function () {
        let event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, false);
        this.root.dispatchEvent(event);
    
	}

    vanillaSelectChooser.prototype.destroy = function () {
        let already = document.getElementById("main-zone-" + factory.domSelector);
        if (already) {
            already.remove();
			this.root.style.display = "inline-block";
        }

    }


// Polyfills for IE
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
