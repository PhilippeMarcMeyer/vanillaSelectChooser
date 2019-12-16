/* 
Copyright (C) Philippe Meyer 2019
Distributed under the MIT License
vanillaSelectChooser.js
Takes a select multiple drop down and transforms it into 2 lists : to choose on the left, chosen on the right
v0.01 : first prototype Work in progress
v0.10 : First fully working version
v0.20 : Use of ctrl and shift keys to mimic a select + button add
v0.25 : Basic touch screen support (no global Add button (">")) and space reduced to 10 px between the columns
v0.26 : Correcting destroy() function + adding nous options + css changes
v0.30 : Sortable by drag and drop (new conception)
v0.35 : Drag and Drop multiple from left to right column
https://github.com/PhilippeMarcMeyer/vanillaSelectChooser
*/

function vanillaSelectChooser(domSelector, options) {
	let factory = this;
	this.domSelector = domSelector;
	this.root = document.querySelector(domSelector)
	this.isTouchScreen = is_touch_device();
	this.rootLength = 0;
	this.options = null;
	this.lastValue = null;
	this.isShiftDown = false;
	this.isCtrlDown = false;
	this.maxIndex = 0;
	this.userOptions = {
		addButtonTitle: "&#x2B86;",
		addButtonWidth: 60,
		minWidth: 200,
		maxHeight: 400,
		gapBeetween: 120,
		translations: { "available": "Availables", "chosen": "Chosen" }
	}

	if (options) {
		if (options.minWidth != undefined) {
			this.userOptions.minWidth = options.minWidth;
		}
		if (options.maxHeight != undefined) {
			this.userOptions.maxHeight = options.maxHeight;
		}
		if (options.gapBeetween != undefined) {
			this.userOptions.gapBeetween = options.gapBeetween;
		}
		if (options.addButtonWidth != undefined) {
			this.userOptions.addButtonWidth = options.addButtonWidth;
		}
		if (options.translations != undefined) {
			this.userOptions.translations = options.translations;
		}
	}

	this.handleCloseClick = function (event) {
		let target = event.target;
		let value = target.parentNode.getAttribute("data-value");
		Array.prototype.slice.call(factory.options).forEach(function (x) {
			if (x.value == value) {
				x.removeAttribute("selected");
			}
		});
		factory.filter();
	}

	this.handleAddClick = function (event) {
		let target = event.target;
		let value = target.parentNode.getAttribute("data-value");
		Array.prototype.slice.call(factory.options).forEach(function (x) {
			if (x.value == value) {
				x.setAttribute("selected", true);
			}
		});
		factory.filter();
	}

	this.handleListDoubleClick = function (event) {
		let target = event.target;
		let value = target.getAttribute("data-value");
		Array.prototype.slice.call(factory.options).forEach(function (x) {
			if (x.value == value) {
				x.setAttribute("selected", true);
			}
		});
		factory.filter();
	}

	this.handleAddBtnClick = function (event) {
		let leftListChosen = factory.listLeft.querySelectorAll("li.chosen");
		let chosenList = [];

		// get sort 
		Array.prototype.slice.call(leftListChosen).forEach(function (x) {
			let value = x.getAttribute("data-value");
			chosenList.push(value);
			x.classList.remove("chosen");
		});
		Array.prototype.slice.call(factory.options).forEach(function (x) {
			if (chosenList.indexOf(x.value) != -1) {
				x.setAttribute("selected", true);
			}
		});
		factory.filter();
		let minWidth = factory.listLeft.style.minWith;
		factory.listLeft.style.minWith = minWidth;
	}

	this.handleSimpleClick = function (event) {
		let target = event.target;
		let valueClicked = target.getAttribute("data-value");
		let valueFrom = null
		let valueTo = null;
		let doErase = true;
		if (factory.isCtrlDown) {
			if (factory.isShiftDown) {
				if (factory.lastValue != null) {
					valueFrom = factory.lastValue;
					valueTo = valueClicked;
				}
			} else {
				doErase = false;
			}
		}
		factory.lastValue = valueClicked;
		let leftList = factory.listLeft.querySelectorAll("li");
		if (valueFrom != null && valueTo != null) {
			let startReached = false;
			let endReached = false;
			let countThatOne = false;
			Array.prototype.slice.call(leftList).forEach(function (x) {
				if (!x.classList.contains("hide")) {
					let value = x.getAttribute("data-value");
					if (!startReached) {
						startReached = value == valueFrom || value == valueTo;
					} else {
						if (startReached && !endReached) {
							endReached = value == valueFrom || value == valueTo;
							if (endReached) {
								countThatOne = true;
								factory.lastValue = value;
							}
						}
					}
					if (!startReached) {
						x.classList.remove("chosen");
					} else if (!endReached || countThatOne) {
						x.classList.add("chosen");
					} else {
						x.classList.remove("chosen");
					}
					countThatOne = false;
				}
			});
		} else {
			Array.prototype.slice.call(leftList).forEach(function (x) {
				let value = x.getAttribute("data-value");
				if (valueClicked == value) {
					if (x.classList.contains("chosen")) {
						x.classList.remove("chosen");
					} else {
						x.classList.add("chosen");
					}
				} else {
					if (doErase) {
						x.classList.remove("chosen");
					}
				}
			});
		}
	}
	
	this.destroy = function () {
		let already = document.getElementById("main-zone-" + factory.domSelector);
		if (already) {
			already.remove();
			this.root.style.display = "inline-block";
		}
	}

	this.init = function () {
		if (!factory.root.hasAttribute("multiple")) {
			factory.root.setAttribute("multiple", "multiple");
		}
		this.root.style.display = "none";
		let already = document.getElementById("main-zone-" + factory.domSelector);
		if (already) {
			already.remove();
		}
		let centerMargins = (factory.userOptions.gapBeetween - factory.userOptions.addButtonWidth) / 2;

		this.main = document.createElement("div");
		this.root.parentNode.insertBefore(this.main, this.root.nextSibling);
		this.main.classList.add("vanilla-main");
		this.main.setAttribute("id", "main-zone-" + this.domSelector);

		this.leftSide = document.createElement("div");
		this.main.appendChild(this.leftSide);
		this.leftSide.classList.add("vanilla-left");
		this.leftSide.setAttribute("style", "display:inline-block;position:relative;float:left;overflow-y:auto;");
		this.leftSide.style.minWidth = factory.userOptions.minWidth + "px";
		this.leftSide.style.maxHeight = factory.userOptions.maxHeight + "px";

		this.titleLeft = document.createElement("div");
		this.leftSide.appendChild(this.titleLeft);
		this.titleLeft.setAttribute("style", "z-index:999;position:absolute;left:0px;width:100%;text-align:center;font-size:14px;font-weight:bold;background-color:#fff;min-height:30px;max-height:30px;padding-top:6px;user-select: none; ")
		this.titleLeft.innerHTML = factory.userOptions.translations.available;

		this.leftSide.addEventListener("scroll", function (e) {
			var y = this.scrollTop;
			factory.titleLeft.style.top = y + "px";
		});
		this.centerSide = document.createElement("div");
		this.main.appendChild(this.centerSide);
		this.centerSide.classList.add("vanilla-center");
		this.centerSide.setAttribute("style", "display:inline-block;position:relative;float:left;overflow-y:hidden;");

		this.addButton = document.createElement("button");
		this.centerSide.appendChild(this.addButton);
		this.addButton.classList.add("vanilla-btn");
		this.addButton.setAttribute("style", "width:" + factory.userOptions.addButtonWidth + "px;margin-left:" + centerMargins + "px;margin-top:35px;");
		let btnSpan = document.createElement("span");
		this.addButton.appendChild(btnSpan);

		btnSpan.setAttribute("class", "arrow right");

		this.rightSide = document.createElement("div");
		this.main.appendChild(this.rightSide);
		this.rightSide.classList.add("vanilla-right");
		this.rightSide.setAttribute("style", "display:inline-block;float:left;overflow-y:auto;margin-top:0;");
		this.rightSide.style.float = "left";
		this.rightSide.style.minWidth = factory.userOptions.minWidth + "px";
		this.rightSide.style.maxHeight = factory.userOptions.maxHeight + "px";
		this.rightSide.style.marginLeft = centerMargins + "px";

		if(window.navigator.userAgent.indexOf("Trident")!=-1){
			this.rightSide.style.position = "absolute";
			this.rightSide.style.left = (factory.userOptions.gapBeetween +factory.userOptions.minWidth) + "px";
			this.centerSide.style.position = "absolute";
		}else{
			this.rightSide.style.position = "relative";
		}
		
		this.titleRight = document.createElement("div");
		this.rightSide.appendChild(this.titleRight);
		this.titleRight.setAttribute("style", "z-index:999;position:absolute;left:0px;width:100%;text-align:center;font-size:14px;font-weight:bold;background-color:#fff;min-height:30px;max-height:30px;padding-top:6px;user-select: none; ")
		let titleText = document.createTextNode(factory.userOptions.translations.chosen);
		this.titleRight.appendChild(titleText);
		this.trashAll = document.createElement("span");
		this.titleRight.appendChild(this.trashAll);

		this.makeTrashAll(this.trashAll, "#666", "#666", "#fff");

		this.trashAll.setAttribute("style", "float:right;");

		this.rightSide.addEventListener("scroll", function (e) {
			var y = this.scrollTop;
			factory.titleRight.style.top = y + "px";
		});

		this.listLeft = document.createElement("ul");
		this.leftSide.appendChild(this.listLeft);
		this.listLeft.setAttribute("style", "margin-top:36px;");

		this.listRight = document.createElement("ul");
		this.rightSide.appendChild(this.listRight);
		this.listRight.setAttribute("style", "margin-top:36px");

		this.options = document.querySelectorAll(this.domSelector + " option");

		this.listRight.addEventListener("exchange", function (e) {
			let message = e.detail;
			let destSort = 0;
			if(message.src.side=="vanilla-left"){
				destSort = parseFloat(message.dest.sort)-0.5;
				let values = message.src.others;
				if(values.indexOf(message.src.value)==-1){
					values.unshift(message.src.value);
				}
				Array.prototype.slice.call(factory.options).forEach(function (x) {
					if(values.indexOf(x.value)!=-1){
						destSort+= 0.01;
						x.setAttribute("sort",destSort) ;
						x.setAttribute("selected",true) ;
						x.classList.remove("chosen");
					}
				});
			}else{
				Array.prototype.slice.call(factory.options).forEach(function (x) {
					if(x.value==message.src.value){
						destSort = message.dest.value - 0.5;
						x.setAttribute("sort",destSort) ;
						x.setAttribute("selected",true) ;
						x.classList.remove("chosen");
					}
				});				
			}
			factory.privateSendChange();
			factory.filter();
		});

		this.trashAll.addEventListener("click", function (e) {
			Array.prototype.slice.call(factory.options).forEach(function (x) {
				x.removeAttribute("selected");
			});
			factory.filter();
		});
		this.rootLength = 0;
		Array.prototype.slice.call(this.options).forEach(function (x) {
			// building the left lesf with each option
			// we'll later hide the selected one (in filter())
			this.rootLength++;
			let text = x.textContent;
			let value = x.value;
			let li = document.createElement("li");
			factory.listLeft.appendChild(li);
			li.setAttribute("data-value", value);
			li.setAttribute("data-text", text);
			li.setAttribute("ondrop","VSC_drop(event)");
			li.setAttribute("ondragover","VSC_allowDrop(event)");
			li.setAttribute("ondragstart","VSC_drag(event)");
			li.setAttribute("draggable","true");
			li.appendChild(document.createTextNode(text));
			let span2 = document.createElement("span");
			span2.setAttribute("class", "arrow-sml right");
			li.appendChild(span2);
			span2.classList.add("vanilla-add");

		});
		factory.filter();
		let leftList = factory.listLeft.querySelectorAll("li");
		Array.prototype.slice.call(leftList).forEach(function (x) {
			x.addEventListener("dblclick", factory.handleListDoubleClick);
			x.addEventListener("click", factory.handleSimpleClick);
		});
		let leftSign = factory.listLeft.querySelectorAll(".vanilla-add");
		Array.prototype.slice.call(leftSign).forEach(function (x) {
			x.addEventListener("click", factory.handleAddClick);
		});

		this.isShiftDown = false;
		this.isCtrlDown = false;

		document.body.onkeydown = function (e) {
			if (e.ctrlKey) {
				factory.isCtrlDown = true;
			}
			if (e.shiftKey) {
				factory.isShiftDown = true;
			}
		}
		document.body.onkeyup = function (e) {
			if (e.ctrlKey) {
				factory.isCtrlDown = false;
				factory.lastValue = null;
			}
			if (e.shiftKey) {
				factory.isShiftDown = false;
			}
		}

		this.addButton.addEventListener("click", factory.handleAddBtnClick)
		if (this.isTouchScreen) {
			this.main.querySelector(".vanilla-center").style.display = "none";
			this.main.querySelector(".vanilla-right").style.marginLeft = "10px";
		}
	}

	this.filter = function (chosenList) {
		this.isShiftDown = false;
		this.isCtrlDown = false;
		factory.lastValue = null;
		if (!chosenList) chosenList = [];
		let selected = [];
		let orders = [];
		let labels = [];
		// empty the right UL
		factory.listRight.innerHTML = "";
		
		Array.prototype.slice.call(this.options).forEach(function (x) {
			let isSelected = x.hasAttribute("selected");
			if (isSelected) {
				selected.push(x.value);
				let sortOrder = x.getAttribute("sort") || "0";
				orders.push(sortOrder);
				labels.push(x.innerHTML);
			}else{
				x.setAttribute("sort","0");
			}
			let leftList = factory.listLeft.querySelectorAll("li");
			Array.prototype.slice.call(leftList).forEach(function (x) {
				let value = x.getAttribute("data-value");
				if (selected.indexOf(value) == -1) {
					x.classList.remove("hide");
				} else {
					x.classList.add("hide");
				}
			});
		});
		if (selected.length == 0) {
			factory.rightSide.style.overflowY = "hidden";
			factory.leftSide.style.overflowY = "auto";
		} else if (selected.length == factory.rootLength) {
			factory.rightSide.style.overflowY = "auto";
			factory.leftSide.style.overflowY = "hidden";
		} else {
			factory.rightSide.style.overflowY = "auto";
			factory.leftSide.style.overflowY = "auto";
		}
		let selectSortedValues = [];
		let newOrder = 1000000;
		selected.forEach(function(x,i){
			
			let order= parseFloat(orders[i]);
			if(order==0) {
				newOrder++;
				order = newOrder;
			}
			selectSortedValues.push({key:x,sort:order,label:labels[i]});
		});
		selectSortedValues = selectSortedValues.sort(function(a,b){
			if (a.sort > b.sort)
				return 1;
				else
				return -1;
		});
		selectSortedValues.forEach(function(x,i){
			x.sort = i+1;
		});
		// report sort attribute in custum sort attribute of the select
		Array.prototype.slice.call(this.options).forEach(function (x) {
			if( x.hasAttribute("selected")){
				let extract = selectSortedValues.filter(function(y){
					return  x.getAttribute("value") == y.key;
				});
				if(extract.length == 1){
					x.setAttribute("sort",extract[0].sort);
				}
			}
		});
	   
	   selectSortedValues.forEach(function(x,i){
		let li2 = document.createElement("li");
			factory.listRight.appendChild(li2);
			li2.setAttribute("data-value", x.key);
			li2.setAttribute("data-text", x.label);
			li2.setAttribute("data-sort", x.sort);
			li2.setAttribute("ondrop","VSC_drop(event)");
			li2.setAttribute("ondragover","VSC_allowDrop(event)");
			li2.setAttribute("ondragstart","VSC_drag(event)");
			li2.setAttribute("draggable","true");

			li2.appendChild(document.createTextNode(x.sort+".  " +x.label));
			let span = document.createElement("span");
			span.innerHTML = "&nbsp;x&nbsp;"
			li2.appendChild(span);
			span.classList.add("vanilla-close");
		});

		let rightSign = factory.listRight.querySelectorAll(".vanilla-close");
		Array.prototype.slice.call(rightSign).forEach(function (x) {
			x.addEventListener("click", factory.handleCloseClick);
		});

		factory.privateSendChange();
	}

	this.makeTrashAll = function (domElement, color, colorLid, colorLine) {
		if (!color) color = "black";
		if (!colorLid) colorLid = "black";
		if (!colorLine) colorLine = "white";
		let html = "<div>";
		html += "<div class='icon-trash' style='float: right'>";
		html += "<div class='trash-lid' style='background-color:" + colorLid +";'></div>";
		html += "<div class='trash-container' style='background-color: " + color +";'></div>";
		html += "<div class='trash-line line-1' style='background-color: " + colorLine +"'></div>";
		html += "<div class='trash-line line-2' style='background-color: " + colorLine +"'></div>";
		html += "<div class='trash-line line-3' style='background-color: " + colorLine +"'></div>";
		html += "</div>";
		domElement.innerHTML = html;
	}


	this.init();
}


vanillaSelectChooser.prototype.privateSendChange = function () {

	let event = document.createEvent('HTMLEvents');
	event.initEvent('change', true, false);
	this.root.dispatchEvent(event);

}

// Polyfills for IE
if (!('remove' in Element.prototype)) {
	Element.prototype.remove = function () {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};
}

function is_touch_device() { // from bolmaster2 - stackoverflow
	var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
	var mq = function (query) {
		return window.matchMedia(query).matches;
	};

	if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
		return true;
	}

	// include the 'heartz' as a way to have a non matching MQ to help terminate the join
	// https://git.io/vznFH
	var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
	return mq(query);
}

	function VSC_allowDrop(ev) {
		ev.preventDefault();
	}

	function VSC_drag(ev) {
		let target = ev.target;
		let whichSide = target.parentNode.parentNode.className;
		//let select = target.closest(".vanilla-main");
		//let arr = select.getAttribute('id').split("-#");
		//let VSCId = arr[1];
		let data = {};
		data.value = target.getAttribute('data-value');
		data.text = target.getAttribute('data-text');
		data.sort = target.getAttribute('data-sort');
		data.side = whichSide;
		data.others = [];
		if(whichSide=="vanilla-left"){
		//	let selectDOM = document.getElementById(VSCId)
			let leftList = target.parentNode.querySelectorAll("li.chosen");
			if(leftList.length != 0){
				Array.prototype.slice.call(leftList).forEach(function (x) {
						data.others.push(x.getAttribute('data-value'));
				});
			}
		}
		console.log(data);
		ev.dataTransfer.setData('text/plain', JSON.stringify({
			'data': data
		}));
	}

	function VSC_drop(ev) {
		ev.preventDefault();
		let src = JSON.parse(ev.dataTransfer.getData('text'));
		if (src) {
			src = src.data;
		}
		let target = ev.target;
		let dest = {};
		dest.value = target.getAttribute('data-value');
		dest.text = target.getAttribute('data-text');
		dest.sort = target.getAttribute('data-sort');
		let ul = target.parentNode;
		if (src.value != dest.value) {
			let event = new CustomEvent('exchange', { detail: {src:src,dest:dest} });
			ul.dispatchEvent(event);
		}
	}

	if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;

if (!Element.prototype.closest)
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType == 1); 
        return null;
    };
