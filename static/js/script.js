document.addEventListener('DOMContentLoaded', function() {

    // Collapse sidebar toggle
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    
    // Custom Scrollbar
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
   });

   $('#sidebarCollapse').on('click', function () {
    // open or close navbar
    $('#sidebar').toggleClass('active');
    // close dropdowns
    $('.collapse.in').toggleClass('in');
    });

   //

});