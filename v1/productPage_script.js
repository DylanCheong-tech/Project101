// AJAX to get the product data JSON file 

var productData = $.ajax({
	"async" : false,
	"url" : "./productData.json",
	"type" : "get",
	"dataType" : "json",
	"success" : function (data) {
		console.log("Data loaded in successfully !");
	}
}).responseJSON;

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

// product information 
var information = document.getElementById("information");
information.innerHTML = productData[productName]["details"];

/*
// size 
if (productData[productName]["size"].length > 0)
{
	console.log("is not null here");
	
	var list = document.createElement("select");
	list.id = "size_list";
	
	var firstOpt = document.createElement("option");
	firstOpt.selected = "selected";
	firstOpt.disabled = true;
	firstOpt.innerHTML = "Size";
	
	
	list.appendChild(firstOpt);
		
	for (i = 0 ; i < productData[productName]["size"].length ; i++)
	{
		var options = document.createElement("option");
		options.innerHTML = productData[productName]["size"][i];
		list.appendChild(options);
	}
	
	list.style.cssText = "font-family: 'Roboto' , sans-serif;font-size:20px;	width:30%;height: auto;background-color: #226D46;color: #E9F5DB;";
	
	colorDiv.after(list);
}
*/

// /*D4340C -- RED*/

// introducing jQuery here
// the reasong writing here is let the DOM creation completed then add the hover effect of the element 
$("#size_list").on("mouseover" , function () {
	$(this).css("cursor" , "pointer");
});

// images 
var currentSelectedColor = document.getElementsByClassName("color_circle")[0];

// need to be change here 
// id of the image tag in the HTML, (it may depeds client provide how many picture for a page)
var imageSelectionIdArray = ["img_1" , "img_2" , "img_3" , "img_4" , "img_5"];
  
function changeColor (currentColor)
{
	// console.log(currentColor.id);
	
	for (i = 0 ; i < 5 ; i++)
	{
		/*
		var imgComponent = document.getElementById(imageSelectionIdArray[i]);
		if (currentColor.id === "yellow")
			imgComponent.src = "./img/" + yellow[i];
				
		else if (currentColor.id === "blue")
			imgComponent.src = "./img/" + blue[i];
		}
		*/
				
		currentSelectedColor.style.border = "solid #E9F5DB 3px";
		currentSelectedColor = currentColor;
		currentSelectedColor.style.border = "solid #226D46 3px";
	}
}

console.log("here");
//////////////
var currentSelectedPic = document.getElementById("img_1");

function changePic (element)
{
var mainPicture = document.getElementById("main_item_image");
mainPicture.src = element.src;
	
currentSelectedPic.style.border = "none";
currentSelectedPic = element;
currentSelectedPic.style.border = "dotted black 3px";
}

//////////
// another part fixed at the last 		  
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
