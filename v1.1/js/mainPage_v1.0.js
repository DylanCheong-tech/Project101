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
function displayItems (div_frame, pageNumber, info_src)
{			
	var end = ((pageNumber * 3) + 3 > info_src.length) ? info_src.length : (pageNumber * 3) + 3;
		
	for (i = pageNumber*3 ; i < end ; i++)
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
	
// testing		
function redirect (product)
{
	window.localStorage.setItem("product_code",product);
	
	window.location = "./productPage.html";
	// testing 
}

// running thread -- 

// obtain all the division frame elements 
var div_frames = {
	planterBox : document.getElementById("planterBox"),
	pot : document.getElementById("pot"),
	potFeet : document.getElementById("potFeet"),
	potHanger : document.getElementById("potHanger"),
	saucer : document.getElementById("saucer")
};

// page setting
var paginations = document.getElementsByClassName("page_tr");
var index = 0;

for (item in requestData)
{
	for (i = 0 ; i < requestData[item].length / 3 ; i++)
	{
		var td = document.createElement("td");
		td.className = item + "_page";
		td.innerHTML = i + 1;
		td.onclick = function () {changePage(this)};
		paginations[index].appendChild(td);
	}
	index++ ;
}

// page object 
var pages = {
	planterBox : document.getElementsByClassName("planterBox_page")[0],
	pot : document.getElementsByClassName("pot_page")[0],
	potFeet : document.getElementsByClassName("potFeet_page")[0],
	potHanger : document.getElementsByClassName("potHanger_page")[0],
	saucer : document.getElementsByClassName("saucer_page")[0]
};

function changePage (currentPage)
{
	var name = currentPage.className;
	name = name.substring(0, name.length - 5);
	var pageNumber = parseInt(currentPage.innerText);
	
	pages[name].style.backgroundColor = "transparent";
	pages[name].style.color = "#0F370F";
	pages[name] = currentPage;
	pages[name].style.backgroundColor = "#D43406";
	pages[name].style.color = "#E9F5DB";
	
	var id = "#" + name;
	
	$(id).stop(true, true).fadeOut(500, function () {
		var child = div_frames[name].lastChild;
		while (child)
		{
			div_frames[name].removeChild(child);
			child = div_frames[name].lastChild;
		}
		displayItems(div_frames[name], pageNumber - 1, requestData[name]);
		
	});
	
	$(id).fadeIn(500);
}

//displays items when the page is onLoaded
displayItems(div_frames["planterBox"], 0, requestData["planterBox"]);
displayItems(div_frames["pot"], 0, requestData["pot"]);
displayItems(div_frames["potFeet"], 0, requestData["potFeet"]);
displayItems(div_frames["potHanger"], 0, requestData["potHanger"]);
displayItems(div_frames["saucer"], 0, requestData["saucer"]);	