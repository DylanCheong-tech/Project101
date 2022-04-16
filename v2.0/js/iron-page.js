// Vue3 createApp
const portal = Vue.createApp({
	data() {
		return {
			products: [],
            imageFiles: []
		}
	},

	methods: {
		
		redirect(product_code) {
			window.localStorage.setItem("product_code", product_code);
			window.location = "./iron-productPage.html";
		},
        getMainImgFile(product_code) {
            return_arr = [];

			for (var i = 0; i < this.imageFiles.length; i++) {
                if (this.imageFiles[i].name.search(product_code) != -1) {
                    var filename = this.imageFiles[i].name;
                    filename = filename.substring(filename.indexOf("/") + 1, filename.indexOf("_"));

                    return_arr.push(this.imageFiles[i]);
                }
            }

			if (return_arr[0])
				return return_arr[0].url;
			else 
				return "";
        }
	},

	computed: {

	},

	created: function () {
        // AJAX to get the product data JSON file 
		var request = $.ajax({
			"async": false,
			"url": "/iron_json_data",
			"type": "get",
			"dataType": "json",
			"success": function (data) {
				console.log("Data loaded in successfully !");
			}
		});

		var productData = request.responseJSON;

		this.products = productData.main;

		var fileRequest = $.ajax({
            "async": false,
            "url": "/get_iron_files",
            "type": "get",
            "dataType": "json"
        });

        this.imageFiles = fileRequest.responseJSON;

	}
});

// mount the Vue instance to the element in HTML
// Vue3
portal.mount("#content");