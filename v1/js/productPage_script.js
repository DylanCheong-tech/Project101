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
var productName = window.localStorage.getItem("product_name");
console.log (productName);
		
var pageTitle = document.getElementById("title");
pageTitle.innerHTML = productName;

// fill in the content 

// header title
document.getElementById("header_title").innerHTML = productName;

// color options 
var colorDiv = document.getElementById("colors");
var counter = 0;

for (color in productData[productName]["color"])
{
	var temp = productData[productName]["color"][color];
	
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
information.innerHTML = productData[productName]["details"];


// images 
var mainImage = document.getElementById("main_item_image");
var imageSelection = document.getElementById("image_selections")
var currentSelectedPic = undefined;

function updateImages (color)
{
	var colorImgPath = productData[productName]["path"];
	var colorImgArray = productData[productName]["img"][color];

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
		$("#main_item_image, #image_selections").fadeOut(500, function () {
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

console.log(currentSelectedPic);

function changePic (element)
{
	var mainPicture = document.getElementById("main_item_image");
	
	$(mainPicture).fadeOut(500, function () {
		mainPicture.src = element.src;
	});
	
	$(mainPicture).fadeIn(500);
		
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
