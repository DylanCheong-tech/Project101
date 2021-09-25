$("#contactDialog").dialog({
    autoOpen : false,
    show : {
        effect : "blind",
        duration : 1000
    },
    hide: {
        effect : "drop",
        duration : 1000
    }
})

$("#whatapps_icon").on("click", function () {
    $("#contactDialog").dialog("option" , "width", 350);
    $("#contactDialog").dialog("open");
});