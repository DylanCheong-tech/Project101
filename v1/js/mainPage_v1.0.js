// using AJAX techniques to request the local JSON data file 
// the JSON data file is located in the same directory 

var requestData = $.ajax({
		"async": false,
		"url" : "././json/mainPageData_v1.0.json",
		"type" : "get",
		"dataType" : "json",
		"success" : function (data)
		{
			console.log("Data Loaded in successfuelly");
		}
	}).fail (function (error)
	{
		console.log("Failed load in data" , error);	
}).responseJSON;

// functions ::
function displayItems (div_frame, info_src)
{
	for (i = 0 ; i < info_src.length ; i++)
	{
		var newSpan = document.createElement("span");
		newSpan.style.textAlign = "center";
		
		var breakLine = document.createElement("br");
		
		var imgEle = document.createElement("img");
		imgEle.alt = "product_item_image";
		imgEle.src = info_src[i].img;
		imgEle.style.width = "100%";
		imgEle.style.borderRadius = "20px";
		imgEle.addEventListener("click", redirect.bind(event, info_src[i].code));
		imgEle.className = "productImage";
		imgEle.style.cursor = "pointer";
		
		var buttonEle = document.createElement("button");
		buttonEle.addEventListener("click", redirect.bind(event, info_src[i].code));
		buttonEle.id = info_src[i].name;
		buttonEle.innerHTML = info_src[i].name;
		buttonEle.className = "product_button";
			
		var stockEle = document.createElement("div");
		stockEle.innerHTML = "Stock : " + info_src[i].stock;
				
		var detailEle = document.createElement("div");
		detailEle.className = "productDetails";
		detailEle.innerHTML = info_src[i].details;
				
		newSpan.appendChild(imgEle);		
		newSpan.appendChild(breakLine);		
		newSpan.appendChild(buttonEle);		
		newSpan.appendChild(stockEle);
		newSpan.appendChild(detailEle);
						
		div_frame.appendChild(newSpan);
	}
}
	

function redirect (product)
{
	window.localStorage.setItem("product_code",product);
	
	window.location = "./productPage.html";
}

// obtain all the division frame elements 
var div_frames = {
	planterBox : document.getElementById("planterBox"),
	pot : document.getElementById("pot"),
	potFeet : document.getElementById("potFeet"),
	potHanger : document.getElementById("potHanger"),
	saucer : document.getElementById("saucer"),
	fencing : document.getElementById("fencing"),
	seedlingPot : document.getElementById("seedlingPot")
};

for (frame in div_frames)
{
	displayItems(div_frames[frame], requestData[frame]);
}