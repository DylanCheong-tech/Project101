
var productCode = window.localStorage.getItem("product_code");

// fixed and persistence over the page
var main_image = document.getElementById("main_item_image");

// Vue3 createApp
const portal = Vue.createApp({
	data() {
		return {
			product: {},
			productImgFiles: {},
			colors_dict: {
				"White": "#FFFFFF",
				"Black": "#13190B",
				"Brown": "#DE641B",
				"Cotta": "#E28027",
				"Dark Brown": "#8A6741",
				"Natural": "#C3D8EB",
				"Blue": "#0BA6D6",
				"Green": "#ABDD2A",
				"Pink": "#FE9FBA",
				"Purple": "#C19BCA",
				"Yellow": "#DFC500"
			},
			currentColor: "",
			currentSelectedImgIndex: 0,
			currentSelectedColorIndex: 0
		}
	},

	methods: {
		getImgFiles(color) {
			return_arr = [];

			for (var i = 0; i < this.productImgFiles.length; i++) {
				var filename = this.productImgFiles[i].name;
				filename = filename.substring(filename.indexOf("/") + 1, filename.indexOf("_"));

				if (color != "" && filename == color) {
					return_arr.push(this.productImgFiles[i].url);
				}
			}

			return return_arr;
		},
		// debug here
		changePic(index) {
			var mainPicture = document.getElementById("main_item_image");

			var all_thumbnails = document.querySelectorAll("img.image_items");

			all_thumbnails.forEach((el) => {
				el.style.border = "solid #E9F5DB 3px";
			});

			$(mainPicture).stop(true, true).fadeOut("slow", () => {
				// no lexical scope here, hence can referenc to this of outer scope 
				this.currentSelectedImgIndex = index;
				all_thumbnails[this.currentSelectedImgIndex].style.border = "solid #226D46 3px";
			});

			$(mainPicture).fadeIn("slow");

		},
		changeColor(color, color_circle_id, color_index) {
			allCircle = document.querySelectorAll("span.color_circle");
			allCircle.forEach((current_ele) => {
				current_ele.style.border = "3px solid transparent";
			});

			document.getElementById(color_circle_id).style.border = "3px solid #226D46";

			$("#main_image").stop(true, true).fadeOut("slow", () => {
				// no lexical scope here, hence can referenc to this of outer scope 
				this.currentColor = color;
				this.currentSelectedImgIndex = 0;
				this.currentSelectedColorIndex = color_index;
			});

			$("#main_image").fadeIn("slow");
		}
	},

	computed: {

	},

	created: function () {
		// AJAX to get the product data JSON file 
		var request = $.ajax({
			"async": false,
			"url": "/json_data",
			"type": "get",
			"dataType": "json",
			"success": function (data) {
				console.log("Data loaded in successfully !");
			}
		});

		var productData = request.responseJSON;

		var products = productData.main;

		for (index in products) {
			if (productCode == products[index].code) {
				this.product = products[index];
				break;
			}
		}

		var requestFiles = $.ajax({
			"async": false,
			"url": "/get_files/" + productCode.toUpperCase(),
			"type": "get",
			"dataType": "json"
		});

		this.productImgFiles = requestFiles.responseJSON;

		this.currentColor = this.product.colors[0].name;
	}
});

// mount the Vue instance to the element in HTML
// Vue3
portal.mount("#content");