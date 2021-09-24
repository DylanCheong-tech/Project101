// AJAX to get the product data JSON file 
var request = $.ajax({
	"async" : false,
	"url" : "././json/productData.json",
	"type" : "get",
	"dataType" : "json",
	"success" : function (data) {
		console.log("Data loaded in successfully !");
	}
});

console.log(request);

var productData = request.responseJSON;

console.log(productData);
		
// get the product name from the previous page 
// window.localStorage
var productCode = window.localStorage.getItem("product_code");
console.log (productCode);
		
var pageTitle = document.getElementById("title");
pageTitle.innerHTML = productData[productCode]["name"];

// fill in the content 

// header title
document.getElementById("product_name").innerHTML = productData[productCode]["name"];
document.getElementById("product_code").innerHTML = productCode;
console.log(productData[productCode][name]);

// color options 
var colorDiv = document.getElementById("colors");
var counter = 0;

console.log(productData[productCode]);

for (color in productData[productCode]["color"])
{
	var temp = productData[productCode]["color"][color];
	
	var span = document.createElement("span");
	span.className = "color_circle";
	span.id = color;
	span.onclick = function () {changeColor (this)};
	span.style.backgroundColor = temp;
	
	colorDiv.appendChild(span);
	counter++;
	
	if (counter % 5 === 0)
	{
		colorDiv.appendChild(document.createElement("br"));
	}
}

var currentSelectedColor = document.getElementsByClassName("color_circle")[0];

// product information 
var information = document.getElementById("information");
information.innerHTML = productData[productCode]["details"];


// images 
var mainImage = document.getElementById("main_item_image");
var imageSelection = document.getElementById("image_selections")
var currentSelectedPic = undefined;

function updateImages (color)
{
	var colorImgPath = productData[productCode]["path"];
	var colorImgArray = productData[productCode]["img"][color];

	mainImage.src = colorImgPath + colorImgArray[0];

	for (i = 0; i < colorImgArray.length ; i++)
	{
		var img = document.createElement("img");
		img.alt = "product_image";
		img.src = colorImgPath + colorImgArray[i];
		img.className = "image_items";
		img.id = "img_" + (i+1);
		img.onclick = function () {changePic (this)};
		img.style.cursor = "pointer";
		
		imageSelection.appendChild(img);
	}

	currentSelectedPic = document.getElementsByClassName("image_items")[0];	
}

updateImages(currentSelectedColor.id);

function changeColor (currentColor)
{		
		$("#main_item_image, #image_selections").stop(true, true).fadeOut(1000, function () {
			var child = imageSelection.lastChild;
			while (child)
			{
				imageSelection.removeChild(child);
				child = imageSelection.lastChild;
			}
			
			updateImages(currentColor.id);
		});
		
		$("#main_item_image, #image_selections").fadeIn(1000);
		
		currentSelectedColor.style.border = "solid #E9F5DB 3px";
		currentSelectedColor = currentColor;
		currentSelectedColor.style.border = "solid #226D46 3px";
	
}

function changePic (element)
{
	var mainPicture = document.getElementById("main_item_image");
	
	$(mainPicture).stop(true, true).fadeOut(1000, function () {
		mainPicture.src = element.src;
	});
	
	$(mainPicture).fadeIn(1000);
		
	currentSelectedPic.style.border = "solid #E9F5DB 3px";
	currentSelectedPic = element;
	currentSelectedPic.style.border = "solid #226D46 3px";
}
console.log("here");


//////////////
//////////	  
var globalEmailStorage = [];
var storageIndex = 0;

function subscribe ()
{
	var emailAddress = document.getElementById("userEmail").value;
	  
	// if empty dont add it into the storage
	if (emailAddress !== "")
		{
		globalEmailStorage[storageIndex++] = emailAddress;
		var userReply = document.getElementById("userNotify");
		userReply.style.display = "block";
		userReply.innerHTML = "Subscribe Successfully !";
		}
	console.log(globalEmailStorage);
}
