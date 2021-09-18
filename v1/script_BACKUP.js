// product details provide by client 
// it may be long so i put it in seperate array for easy management and readability 
var potDetailArray = [
	"SIZE DETIALS: <br >->OUTSIDE DIAMETER: 12.3CM<br >->INSIDE DIAMETER: 11.3CM<br >->HEIGHT: 10.2CM<br >->LOWER DIAMETER: 8CM<br ><br >Product Bundle:->CP-01<br >->HANGER",
	
	"SIZE DETAILS:<br >->OUTSIDE DIAMETER: 21 CM<br >->INSIDE DIAMETER: 18 CM<br >->HEIGHT: 13CM<br >->LOWER DIAMETER: 13CM<br ><br >PRODUCT BUNDLE:<br >->SAUCER CP-157<br >->HANGER"
];
	
var potFeetDetailArray = [
			
	"SIZE:<br >->L: 4CM<br >->W: 1 CM<br >->H: 47 CM<br ><br >PRODUCT BUNDLE:<br >->HANGING PLASTIC POT",
			
	"SIZE: D 26CM X W 26CM X H18CM<br >->WITHOUT HOLE & WITH HOLE<br >->WITH THICKNESS<br >->DURABLE<br >->MODERN<br >->SUITABLE FOR GROWING AQUATIC PLANTS"
];

var potHangerDetailArray = [
	"SIZE DETIALS:<br >->OUTSIDE DIAMETER: 12.5CM<br >->INSIDE DIAMETER: 11.5CM<br >->HEIGHT: 10CM<br >->LOWER DIAMETER: 8.5CM<br ><br >PRODUCT BUNDLE:<br >->SAUCER CP-01<br >->HANGER",
			
	"SIZE DETIALS:<br >->OUTSIDE DIAMETER: 14.7CM<br >->INSIDE DIAMETER: 13.3CM<br >->HEIGHT: 12CM<br >->LOWER DIAMETER: 10CM<br ><br >PRODUCT BUNDLE:<br >->SAUCER CP-02<br >->HANGER"
];
			
var saucerDetailArray = [
	"SIZE DETAILS: <br >->OUTSIDE DIAMETER: 17CM<br >->INSIDE DIAMETER: 15.5CM<br >->HEIGHT: 14CM<br >->LOWER DIAMETER: 13CM<br ><br >PRODUCT BUNDLE:<br >->SAUCER CP-157",
			
	"SIZE SELECTION: <br >->CP-470: L 47CM X W 17CM X H16CM<br >->CP-670: L 67CM X W 21CM X H 19 CM<br ><br >->MODERN<br >->DURABLE<br >->WIDE RANGE OF USES<br >->SAVE SPACE SAVE SOIL<br >->REUSABLE"
];
		
var planterBoxDetailArray = [		
	"CP-28 SIZE: L 9CM X W 5CM X H 4.5CM {3PCS}<br >CP-23 SIZE: L 7.5CM X W 3.5CM X H 3.5CM {3 PCS}<br >->PACK OF 3 POT FEET<br >->HARD OF PRODUCT<br >->THIS PRODUCT USE WITH PUT THE FLOWERPOT",
			
	"SIZE SELECTION:<br >->CP-01: 10CM<br >->CP-02: 14CM<br >->CP-157: 15CM<br >->CP-200: 20CM<br >->CP-233: 23CM<br >->CP-295: 29 CM<br ><br >PRODUCT BUNDLE:<br >->CP-01: NP-120/CP-120<br >->CP-02: NP-150/CP-150<br >->CP-157: CP-220/NP-170"
];

// using data structure of array + JSON
// each JSON representing a unique product and store the image path, product name info etc.
var potProductInfo = [
	{img: "abc.png" , name: "CP120" , stock : "Available" , details : potDetailArray[0]} , 
	{img: "abc.png" , name: "CP110" , stock : "Available" , details : potDetailArray[0]} , 
	{img: "abc.png" , name: "CP1120" , stock : "Available" , details : potDetailArray[0]} , 
	{img: "abc.png" , name: "CP12122" , stock : "Available" , details : potDetailArray[0]} , 
	{img: "abc.png" , name: "CP220" , stock : "Available" , details : potDetailArray[1]}
];

var potFeetProductInfo = [
	{img: "abc.png" , name: "CP448" , stock : "Available" , details : potFeetDetailArray[2]} ,
	{img: "abc.png" , name: "CP3535" , stock : "Available" , details : potFeetDetailArray[3]}
];

var potHangerProductInfo = [
	{img: "abc.png" , name: "NP120" , stock : "Available" , details : potHangerDetailArray[4]} ,
	{img: "abc.png" , name: "NP150" , stock : "Available" , details : potHangerDetailArray[5]} 
];

var saucerProductInfo = [
	{img: "abc.png" , name: "NP170" , stock : "Available" , details : saucerDetailArray[6]} ,
	{img: "abc.png" , name: "PLANTER BOX" , stock : "Available" , details : saucerDetailArray[7]} 
];

var planterBoxProductInfo = [
	{img: "abc.png" , name: "POT FEET A" , stock : "Available" , details : planterBoxDetailArray[8]} ,
	{img: "abc.png" , name: "POT FEET B" , stock : "Available" , details : planterBoxDetailArray[8]} ,
	{img: "abc.png" , name: "POT FEET C" , stock : "Available" , details : planterBoxDetailArray[8]} ,
	{img: "abc.png" , name: "POT FEET D" , stock : "Available" , details : planterBoxDetailArray[8]} ,
	{img: "abc.png" , name: "POT FEET E" , stock : "Available" , details : planterBoxDetailArray[8]} ,
	{img: "abc.png" , name: "POT FEET" , stock : "Available" , details : planterBoxDetailArray[8]} ,
	{img: "abc.png" , name: "POT FEET F" , stock : "Available" , details : planterBoxDetailArray[8]} ,
	{img: "abc.png" , name: "SAUCER" , stock : "Available" , details : planterBoxDetailArray[9]}
];
	    	
// get the parent element
var planter_box_frame = document.getElementById("planter_box");
var pot_frame = document.getElementById("pot");
var pot_feet_frame = document.getElementById("pot_feet");
var pot_hanger_frame = document.getElementById("pot_hanger");
var saucer_frame = document.getElementById("saucer");

function displayItems (div_frame, pageNumber, info_src)
{			
	var end = ((pageNumber * 3) + 3 > info_src.length) ? info_src.length : (pageNumber * 3) + 3;
	// console.log(end);
	
	for (i = pageNumber*3 ; i < end ; i++)
	{
		var newSpan = document.createElement("span");
		newSpan.style.textAlign = "center";
		
		var breakLine = document.createElement("br");
		
		var imgEle = document.createElement("img");
		imgEle.alt = "product_item_image";
		imgEle.src = info_src[i].img;
		
		var buttonEle = document.createElement("button");
		// testing event here
		buttonEle.addEventListener("click", redirect.bind(event, info_src[i].name));
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
				
		// console.log(newSpan + i);
		// console.log(divFrame);
				
		div_frame.appendChild(newSpan);
	}
						
	// statusBar.style.display = "none";
}
		
displayItems(planter_box_frame, 0, planterBoxProductInfo);
displayItems(pot_frame, 0, potProductInfo);
displayItems(pot_feet_frame, 0, potFeetProductInfo);
displayItems(pot_hanger_frame, 0, potHangerProductInfo);
displayItems(saucer_frame, 0, saucerProductInfo);


// page object 
var pages = {
	planter_box_page : document.getElementsByClassName("planter_box_page")[0],
	pot_page : document.getElementsByClassName("pot_page")[0],
	pot_feet_page : document.getElementsByClassName("pot_feet_page")[0],
	pot_hanger_page : document.getElementsByClassName("pot_hanger_page")[0],
	saucer_page : document.getElementsByClassName("saucer_page")[0]
};

function changePage (pageNumber, currentPage)
{
	pages[currentPage.className].style.backgroundColor = "transparent";
	pages[currentPage.className].style.color = "#0F370F";
	pages[currentPage.className] = currentPage;
	pages[currentPage.className].style.backgroundColor = "#D43406";
	pages[currentPage.className].style.color = "#E9F5DB";
		
	var id = "#" + currentPage.className.substring(0,currentPage.className.length-5);
	$(id).fadeOut(500, function () {
		var child = planter_box_frame.lastChild;
		while (child)
		{
			planter_box_frame.removeChild(child);
			child = planter_box_frame.lastChild;
		}
		displayItems(planter_box_frame, pageNumber - 1, planterBoxProductInfo);
	});
			
			
	$(id).fadeIn(500);
			
		
	// pageNumber = parseInt(pageNumber.substring(pageNumber.length - 1)) - 1;
	// console.log(pageNumber);
	// console.log(productInfo.length);
}









		
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
		
// testing		
function redirect (product)
{
	window.location = "./Product_page_v1.html";
	// testing 
	
	window.localStorage.setItem("product_name",product);
}

var span1 = document.createElement("span");
span1.innerHTML = "<br ><br ><br ><br ><br ><br ><br ><br ><br ><br ><br >Comming Soon !";
span1.style.backgroundColor = "transparent";
span1.style.textAlign =  "center";
span1.style.border = "dotted 3px grey";

pot_feet_frame.appendChild(span1);