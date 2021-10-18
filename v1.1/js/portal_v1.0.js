var portal = new Vue ({
    el : "#content",
    data : {
        products : {},
        numbering: 1,
        addOperation : false,
        editOperation : false,
        deleteOperation : false,
        productEditStatus : {}
    },

    methods:{
        addProduct () {
            this.addOperation = this.addOperation ? false :  true;
        },
        editProduct () {
            this.editOperation = this.editOperation ? false : true;
        },
        deleteProduct () {
            this.deleteOperation = this.deleteOperation ? false : true;
        },

        productEditFired (code) {
            this.productEditStatus[code] = true;
            this.editOperation = false;
        },
        confirmEdit (code){
            this.productEditStatus[code] = false;
            this.editOperation = true;

            // logic implements here 
        },

        cancelEdit (code) {
            this.productEditStatus[code] = false;
            this.editOperation = true;

            // logic implements here 
        }

    },

    created : function () {
        // AJAX to get the product data JSON file 
        var request = $.ajax({
            "async" : false,
            "url" : "../json/productData_v1.0.json",
            "type" : "get",
            "dataType" : "json",
            "success" : function (data) {
                console.log("Data loaded in successfully !");
            }
        });

        var productData = request.responseJSON;
        this.products = productData;

        for (product in this.products)
        {
            this.products[product].details = this.products[product].details.replace(/<[^>]*>/g, ' ');
            var tempArr = [];
            for (color in this.products[product].color)
            {
                tempArr.push(color);
            }

            this.products[product].color = tempArr.join(", ");

            this.productEditStatus[product] = false;
        }

        console.log(this.products);
    }
});