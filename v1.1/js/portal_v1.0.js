var portal = new Vue ({
    el : "#content",
    data : {
        products : [],
        numbering: 1,
        addOperation : false,
        editOperation : false,
        deleteOperation : false,
        productEditStatus : {},
        newProduct : {
            code : "",
            name : "",
            colors : "",
            descriptions : "",
            details : ""
        },
        // refresh : true,
        filterKeyword : ""
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

        addNewProduct () {
            var newObj = {
                "data" : {
                    "color" : this.newProduct.colors,
                    "details" : this.newProduct.details,
                    "name" : this.newProduct.name,
                    "code" : this.newProduct.code.toUpperCase()
                }
                
            };

            if (!this.codeExist)
            {
                this.products.unshift(newObj);
            }

            for (property in this.newProduct){
                this.newProduct[property] = "";
            }

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
        },

        deleteExistingProduct () {
            var checkboxes = $("input[name='delete']");
            var deleteList = [];
            
            for (i = 0 ; i < checkboxes.length; i ++){
                if (checkboxes.eq(i).prop("checked"))
                {
                    deleteList.push(checkboxes.eq(i).attr("value"));
                }
            }

            function findIndex (code, products) {
                for (index in products){
                    if (products[index].data.code == code)
                    {
                        return index;
                    }
                }
            }

            alert("You are deleting : \n" + deleteList.join(", "));

            // remove from the products array 
            for (index in deleteList)
            {
                var removeIndex = findIndex(deleteList[index], this.products);
                this.products.splice(removeIndex, 1);
            }
            
            // unchecked the previous operation 
            $("input[name='delete']").prop("checked", false);
        },

        // triggerRefresh () {
        //     this.refresh = false;
        //     setInterval(() => {
        //         this.refresh = true;
        //     }, 3000);
        // },

        sortProducts (event) {
            // parseInt ignore the characters in the string 
            var seq = parseInt(event.target.value);
            
            var mode = event.target.value.substr(-1);

            function sort (mode) {
                return function (a, b){
                    if (a.data[mode].toLowerCase() < b.data[mode].toLowerCase())
                    return -1 * seq;
                
                if (a.data[mode].toLowerCase() > b.data[mode].toLowerCase())
                    return 1 * seq;

                return 0;
                }
            }

            switch (mode){
                case "n" : this.products.sort(sort("name")); break;
                case "c" : this.products.sort(sort("code")); break;
                default : mode; // do nothing 
            }
            
        },
    },

    computed : {
        isEmpty () {
            for (property in this.newProduct){
                if (this.newProduct[property])
                {
                    return false;
                }
            }
            return true;
        },
        products_arr () {
            if (this.filterKeyword == "")
                return this.products;

            var tempArr = [];
            for (index in this.products){
                if (this.products[index].data.name.toLowerCase().includes(this.filterKeyword.toLowerCase())){
                    tempArr.push(this.products[index]);
                }
            }
            return tempArr;
        },
        noListing () {
            return this.products_arr.length ? false : true;
        },
         
        codeExist () {
            var exist = false;
            for (index in this.products)
            {
                if (this.products[index].data.code == this.newProduct.code.toUpperCase()){
                    exist = true;
                    break;
                }
            }
            return exist;
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

            this.products[product].code = product;

            this.productEditStatus[product] = false;
        }

        this.products = Object.entries(this.products).map((e) => ( { "data": e[1] } ));

        console.log(this.products);
    }
});