// Vue3 createApp
// no longer have Vue constructor 
const portal = Vue.createApp({
    // el: "#content",
    data() {
        return {
            products: [],
            numbering: 1,
            addOperation: false,
            editOperation: false,
            deleteOperation: false,
            productEditStatus: {},
            newProduct: {},
            // refresh : true,
            filterKeyword: "",

            current_edit_obj: { code: "" },

            avia_colors: {
                "White": "#FFFFFF",
                "Black": "#13190B",
                "Brown": "#DE641B",
                "Cotta": "#E28027",
                "Dark Brown": "#8A6741",
                "Transparent": "#C3D8EB",
                "Blue": "#0BA6D6",
                "Green": "#ABDD2A",
                "Pink": "#FE9FBA",
                "Purple": "#C19BCA",
                "Yellow": "#DFC500"
            },

            product_category: [
                "Planter Box",
                "Pot",
                "Pot Feet",
                "Pot Hanger",
                "Saucer",
                "Fencing",
                "Seedling Pot",
                "Florist Pot"
            ],

            edit_img_updated: {},
            imageFiles: []
        }
    },

    methods: {
        addProduct() {
            this.addOperation = this.addOperation ? false : true;
            // this.filterKeyword = "";
        },
        editProduct() {
            this.editOperation = this.editOperation ? false : true;
        },
        deleteProduct() {
            this.deleteOperation = this.deleteOperation ? false : true;
        },

        codeExist(code) {
            var exist = false;
            for (index in this.products) {
                if (this.products[index].code == code.toUpperCase()) {
                    exist = true;
                    break;
                }
            }
            return exist;
        },

        // check the product code only 
        isEmptyCode(code) {
            if (code)
                return false;

            return true;
        },

        isCategoryEmpty(cat_id) {
            if (!document.getElementById(cat_id).value || document.getElementById(cat_id).value == "") {
                return true;
            }

            return false;
        },

        resetAddProduct() {
            this.newProduct = {
                code: "",
                name: "",
                category: "",
                colors: [{ name: "", stock: "Available" }],
                material: "",
                diameters: { inside: 0, outside: 0, lower: 0 },
                dimensions: { length: 0, width: 0, height: 0 },
                whatsmore: [""],
                productBundle: [""]
            };
        },

        // function to capitalize the string
        capitalise_str(input_str) {
            splitted_arr = input_str.trim().split(" ");
            processed_arr = []

            for (i = 0; i < splitted_arr.length; i++) {

                if (splitted_arr[i] != "") {
                    processed_arr.push(splitted_arr[i].substr(0, 1).toUpperCase() + splitted_arr[i].slice(1).trim());
                }
            }

            return processed_arr.join(" ");
        },

        // function to capitalize the array of string
        capitalise_str_arr(str_arr) {
            if (str_arr.length == 1 && str_arr[0] == "")
                return ["None"];

            for (j = 0; j < str_arr.length; j++) {
                str_arr[j] = this.capitalise_str(str_arr[j]);
            }

            return str_arr;
        },

        // bugs here !
        // guard checing for duplications
        addNewProduct() {
            // format the product name 
            this.newProduct.name = this.capitalise_str(this.newProduct.name);

            // format the material 
            this.newProduct.material = this.capitalise_str(this.newProduct.material);

            // format whatsmore and productbundle
            this.newProduct.whatsmore = this.capitalise_str_arr(this.newProduct.whatsmore);
            this.newProduct.productBundle = this.capitalise_str_arr(this.newProduct.productBundle);

            var newObj = {

                "code": this.newProduct.code.toUpperCase(),
                "name": this.newProduct.name,
                "category": this.newProduct.category,
                "colors": this.newProduct.colors,
                "material": this.newProduct.material,
                "diameters": this.newProduct.diameters,
                "dimensions": this.newProduct.dimensions,
                "whatsmore": this.newProduct.whatsmore,
                "productBundle": this.newProduct.productBundle
            };

            // if (!this.codeExist) {
            //     this.products.unshift(JSON.parse(JSON.stringify(newObj)));
            // }

            document.getElementById("add_form").submit();

            $.ajax({
                url: "/adminAddPlastic",
                type: "POST",
                data: newObj,
                dataType: "json"
            });

            this.resetAddProduct();

        },

        productEditFired(code, row_target) {

            document.getElementById(row_target).classList.add("on_edit");

            this.productEditStatus[code] = true;
            for (index in this.products) {
                if (this.products[index].code == code) {
                    // this.current_edit_obj = this.products[index];
                    // this.current_edit_obj = this.products.slice(index, index+1);
                    this.current_edit_obj = JSON.parse(JSON.stringify(this.products[index]));
                }
            }
            this.editOperation = false;


        },
        confirmEdit(code, row_target, form_submit_btn_id, form_id) {
            // $("#" + form_submit_btn_id).trigger("click");
            document.getElementById(form_id).submit();

            this.productEditStatus[code] = false;

            // format the product name 
            this.current_edit_obj.name = this.capitalise_str(this.current_edit_obj.name);

            // format the material 
            this.current_edit_obj.material = this.capitalise_str(this.current_edit_obj.material);

            // format whatsmore and productbundle
            this.current_edit_obj.whatsmore = this.capitalise_str_arr(this.current_edit_obj.whatsmore);
            this.current_edit_obj.productBundle = this.capitalise_str_arr(this.current_edit_obj.productBundle);

            // may not needed
            // for (index in this.products) {
            //     if (this.products[index].code == code) {
            //         // this.products[index] = this.current_edit_obj.slice()[0];
            //         // this.current_edit_obj = this.products.slice(index, index+1);

            //         this.products[index] = JSON.parse(JSON.stringify(this.current_edit_obj));
            //     }
            // }

            console.log(this.current_edit_obj);

            // 'code' is the original code
            if (this.current_edit_obj.code != code) {
                $.ajax({
                    "url": "/deletePlasticFiles/" + code.toUpperCase(),
                    "type": "get",
                    "dataType": "json"
                });
            }

            $.ajax({
                url: "/adminUpdatePlastic",
                type: "POST",
                data: { "code": code, "document": this.current_edit_obj },
                dataType: "json"
            });

            this.current_edit_obj = {};
            this.editOperation = true;

            document.getElementById(row_target).classList.remove("on_edit");
        },

        cancelEdit(code, row_target) {
            this.productEditStatus[code] = false;
            this.editOperation = true;

            this.current_edit_obj = {};

            document.getElementById(row_target).classList.remove("on_edit");
        },

        deleteExistingProduct() {
            var checkboxes = $("input[name='delete']");
            var deleteList = [];

            // since is pass by reference (non-primitive type)
            var this_products_alias = this.products;
            // console.log(this_products_alias);

            for (i = 0; i < checkboxes.length; i++) {
                if (checkboxes.eq(i).prop("checked")) {
                    deleteList.push(checkboxes.eq(i).attr("value"));
                }
            }

            // logical error here - should wait for the user confirmation 
            for (index in deleteList) {
                console.log(deleteList[index]);
                $.ajax({
                    "async": false,
                    "url": "/deletePlasticFiles/" + deleteList[index].toUpperCase(),
                    "type": "get",
                    "dataType": "json",
                    // force not to cache, and re-request again (only for HEAD and GET request)
                    "caches": false
                });
            }

            var deleting_products = deleteList.join("<br />");

            $("#delete_dialog_content").html("You are deleting products : <br />" + deleting_products + "<br />Are you confirm to continue ? ");
            $("#delete_dialog").dialog({
                resizable: false,
                height: "auto",
                width: "auto",
                model: true,
                buttons: {
                    "Yes":
                        function () {
                            $(this).dialog("close");
                            $("input[name='delete']").prop("checked", false);

                            $.ajax({
                                url: "/adminDeletePlastic",
                                type: "POST",
                                data: { "deleteList": deleteList },
                                dataType: "json"
                            });

                            location.reload();
                        },
                    "No": function () {
                        $(this).dialog("close");
                    }
                }
            });
        },

        sortProducts(event) {
            // parseInt ignore the characters in the string 
            var seq = parseInt(event.target.value);

            var mode = event.target.value.substr(-1);

            function sort(mode) {
                return function (a, b) {
                    if (a[mode].toLowerCase() < b[mode].toLowerCase())
                        return -1 * seq;

                    if (a[mode].toLowerCase() > b[mode].toLowerCase())
                        return 1 * seq;

                    return 0;
                }
            }

            switch (mode) {
                case "n": this.products.sort(sort("name")); break;
                case "c": this.products.sort(sort("code")); break;
                default: break; // do nothing 
            }

        },

        // input controls 
        addInput(mode, catg) {

            if (mode == "add") {
                if (catg == "color")
                    this.newProduct.colors.push({ name: "", stock: "" });

                if (catg == "bundle")
                    this.newProduct.productBundle.push("");

                if (catg == "more")
                    this.newProduct.whatsmore.push("");
            }
            else if (mode == "edit") {
                if (catg == "color")
                    this.current_edit_obj.colors.push({ name: "", stock: "" });

                if (catg == "bundle")
                    this.current_edit_obj.productBundle.push("");

                if (catg == "more")
                    this.current_edit_obj.whatsmore.push("");
            }

        },

        deleteContentDisplay(mode, catg) {

            if (mode == "add") {
                if (catg == "color")
                    return this.newProduct.colors.length > 1;

                if (catg == "bundle")
                    return this.newProduct.productBundle.length > 1;

                if (catg == "more")
                    return this.newProduct.whatsmore.length > 1;
            } else if (mode == "edit") {
                if (catg == "color")
                    return this.current_edit_obj.colors.length > 1;

                if (catg == "bundle")
                    return this.current_edit_obj.productBundle.length > 1;

                if (catg == "more")
                    return this.current_edit_obj.whatsmore.length > 1;
            }
        },

        removeInput(mode, index, catg) {
            if (mode == "add") {
                if (catg == "color")
                    this.newProduct.colors.splice(index, 1);

                if (catg == "bundle")
                    this.newProduct.productBundle.splice(index, 1);

                if (catg == "more")
                    this.newProduct.whatsmore.splice(index, 1);
            } else if (mode == "edit") {
                if (catg == "color")
                    this.current_edit_obj.colors.splice(index, 1);

                if (catg == "bundle")
                    this.current_edit_obj.productBundle.splice(index, 1);

                if (catg == "more")
                    this.current_edit_obj.whatsmore.splice(index, 1);
            }
        },

        getString(arr) {
            if (arr.length > 0 && arr[0] !== "")
                return arr.join(", ");

            return "N/A";
        },

        setCurrentEdit(obj) {
            this.current_edit_obj = obj;
        },

        // file (image) input onchange handler
        // distinguish add and edit operation !!!!
        // refactor this for add and edit 
        image_preview(src_id, prev_id, clr_btn_id, mode, color) {
            console.log(color);

            var src_files = document.getElementById(src_id);
            var img_frame = document.getElementById(prev_id);

            // remove all the child node
            this.clear_file_prev_helper(prev_id, clr_btn_id);

            var files = src_files.files;

            if (files.length > 0) {
                document.getElementById(clr_btn_id).disabled = false;
            }

            var renamed_files = []

            for (i = 0; i < files.length; i++) {
                if (files[i]) {
                    newfile = new File([files[i]], color + "_" + (i + 1) + files[i].name.substr(files[i].name.indexOf('.')));
                    renamed_files.push(newfile);

                    var prev_img = document.createElement("img");
                    prev_img.src = URL.createObjectURL(files[i]);
                    prev_img.alt = "preview_image";

                    if (files.length > 2)
                        prev_img.style.width = "24%";
                    else
                        prev_img.style.width = "35%";

                    img_frame.append(prev_img);

                    if (i != 0 && (i + 1) % 3 == 0)
                        img_frame.append(document.createElement("br"));
                }
            }

            function FileListItems(files) {
                var b = new ClipboardEvent("").clipboardData || new DataTransfer()
                for (var i = 0, len = files.length; i < len; i++)
                    b.items.add(files[i])
                return b.files
            }

            src_files.files = new FileListItems(renamed_files);
            console.log(src_files.files)

            // once the [input=file] onchange fired and this function is called
            this.edit_img_updated[prev_id] = true;
        },

        clear_input_img(src_id, prev_id, clr_btn_id, mode, color) {
            var src_files = document.getElementById(src_id);

            this.clear_file_prev_helper(prev_id, clr_btn_id);

            src_files.value = [];
        },

        // helper function 
        clear_file_prev_helper(prev_id, clr_btn_id) {
            var img_frame = document.getElementById(prev_id);

            var child = img_frame.lastElementChild;

            while (child) {
                img_frame.removeChild(child);
                child = img_frame.lastElementChild;
            }

            document.getElementById(clr_btn_id).disabled = true;
        },

        getImgFiles(product_code, color) {
            
            return_arr = [];

            for (var i = 0; i < this.imageFiles.length; i++) {

                if (this.imageFiles[i].name.search(product_code) != -1) {
                    var filename = this.imageFiles[i].name;
                    filename = filename.substring(filename.indexOf("/") + 1, filename.indexOf("_"));

                    if (color != "" && filename == color) {
                        return_arr.push(this.imageFiles[i]);
                    }
                }


            }

            return return_arr;
        },

        changeColor(color_circle_id, color_frame_id, preview_name_id, color_name, file_input_id) {

            // query all the child circle element except the last one 
            allCircle = document.querySelectorAll("#" + color_frame_id + " span.color_circle:not(:last-child)");
            allCircle.forEach((current_ele) => {
                current_ele.style.border = "3px solid transparent";
            });

            document.getElementById(color_circle_id).style.border = "3px solid #226D46";

            document.getElementById(preview_name_id).innerText = color_name;

            src_files = document.getElementById(file_input_id);
            files = src_files.files;
            renamed_files = [];

            if (files.length > 0) {
                for (i = 0; i < files.length; i++) {
                    if (files[i]) {
                        newfile = new File([files[i]], color_name + "_" + (i + 1) + files[i].name.substr(files[i].name.indexOf('.')));
                        renamed_files.push(newfile);
                    }
                }
            }


            function FileListItems(files) {
                var b = new ClipboardEvent("").clipboardData || new DataTransfer()
                for (var i = 0, len = files.length; i < len; i++)
                    b.items.add(files[i])
                return b.files
            }

            src_files.files = new FileListItems(renamed_files);
            console.log(src_files.files)
        }

        // show_selected_color (color_circle_id, circle_color, current_color) {
        //     console.log(color_circle_id)
        //     if (circle_color == current_color)
        //     {
        //         document.getElementById(color_circle_id).style.border = "3px solid #226D46";
        //     }
        // }
    },

    computed: {
        products_arr() {
            if (this.filterKeyword == "")
                return this.products;

            var tempArr = [];
            for (index in this.products) {
                if (this.products[index].name.toLowerCase().includes(this.filterKeyword.toLowerCase())) {
                    tempArr.push(this.products[index]);
                }
            }

            // if nothing on name search the product code 
            if (tempArr.length == 0) {
                for (index in this.products) {
                    if (this.products[index].code.toLowerCase().includes(this.filterKeyword.toLowerCase())) {
                        tempArr.push(this.products[index]);
                    }
                }
            }
            return tempArr;
        },
        noListing() {
            return this.products_arr.length ? false : true;
        }
    },

    created: function () {
        // AJAX to get the product data JSON file 
        var request = $.ajax({
            "async": false,
            "url": "/plastic_json_data",
            // "url" : "../json/productData_v1.0.json",
            "type": "get",
            "dataType": "json",
            "success": function (data) {
                console.log("Data loaded in successfully !");
            }
        });

        var productData = request.responseJSON;

        this.products = productData.main;

        // remove all the '_id' property value, to prevent the _id confiict what update on the database
        for (i = 0; i < this.products.length; i++) {
            delete this.products[i]._id;
        }

        this.resetAddProduct();

        var fileRequest = $.ajax({
            "async": false,
            "url": "/get_plastic_files",
            "type": "get",
            "dataType": "json"
        });

        this.imageFiles = fileRequest.responseJSON;
    }
});

// mount the Vue instance to the element in HTML
// Vue3
portal.mount("#content");