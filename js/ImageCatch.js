// 2017-03-09, bruce

var imageCatch = new ImageCatch();

// 定义类
function ImageCatch() {
	// 创建类的属性
	this.arrImage = new Array(); // 图片对象
	this.arrImageUrl = new Array(); // 图片地址
	this.arrImageStatus = new Array(); // 缓存状态

	// 创建类的方法
	this.showInfo = function() {
		return JSON.stringify(this);
	}

	this.addImage = function(imgUrl) {
		var index = imageCatch.getImageIndex(imgUrl);
		if(index < 0) {
			imageCatch.arrImageUrl.push(imgUrl);
			index = imageCatch.arrImageUrl.length - 1;
			var img = new Image();
			imageCatch.arrImage.push(img);
			imageCatch.downloadImage(index);
			//console.log("Add Image catch " + imgUrl);
		} else {
			//console.log("Image added " + imgUrl);
		}
	}
	//加载单个图片
	this.downloadImage = function(index) {
		var src = imageCatch.arrImageUrl[index];
		var img = imageCatch.arrImage[index];
		//console.log("downloadImage " + src);
		img.src = src;
		img.onLoad = imageCatch.validateImages(index);
	}
	//验证是否成功加载完成，如不成功则重新加载
	this.validateImages = function(index) {
		var img = imageCatch.arrImage[index];
		if(!img.complete) {
			//setTimeout('imageCatch.downloadImage(' + index + ')', 1000 * 2);
		} else if(typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
			//setTimeout('imageCatch.downloadImage(' + index + ')', 1000 * 2);
		} else {
			console.log("download Image " + img.complete + " " + img.src);
		}
	}

	this.getImageIndex = function(imgUrl) {
		for(var i = 0; i < imageCatch.arrImageUrl.length; i++) {
			if(imgUrl == imageCatch.arrImageUrl[i]) {
				return i;
			}
		}
		return -1;
	}
	this.getImage = function(imgUrl) {
		var index = imageCatch.getImageIndex(imgUrl);
		if(index > -1) {
			return imageCatch.arrImage[index];
		}
		return null;
	}

	this.showImage = function(imgId, img) {
		if(img != null) {
			document.getElementById(imgId).src = img.src;
		}
	}
	this.loadImage = function(imgId, url, callback) {
		var img = imageCatch.getImage(url);
		if(img == null) {
			imageCatch.addImage(url);
		}

		img = imageCatch.getImage(url);
		if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
			console.log("load Image from catch " + url);
			callback(imgId, img);
			return; // 直接返回，不用再处理onload事件 
		}

		img.src = url;
		img.onload = function() { //图片下载完毕时异步调用callback函数。 
			//console.log("loadImage " + url);
			callback(imgId, img); //将回调函数的this替换为Image对象 
		};
	}

	this.test = function() {
		var index = 0;
		setInterval(function() {
			index++;
			if (index > 4){
				index = 1;
			}
			imageCatch.loadImage("preview", "img/" + index + ".jpg", imageCatch.showImage);
		}, 5 * 1000);
	}
}

// 经常用的是通过遍历,重构数组.
Array.prototype.remove = function(dx) {
	if(isNaN(dx) || dx > this.length) {
		return false;
	}
	for(var i = 0, n = 0; i < this.length; i++) {
		if(this[i] != this[dx]) {
			this[n++] = this[i]
		}
	}
	this.length -= 1
}