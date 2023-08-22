$(document).ready(function(){
    $.getJSON("/product/fetch_all_category",
    function(response){
           response.data.map((item) => { 
            $('#categoryid').append($('<option>').text(item.categoryname).val(item.categoryid))
           })
    })

    
    $('#categoryid').change(function(){
        $.getJSON("/product/fetch_all_type",{categoryid:$('#categoryid').val()},
    function(response){
        $('#producttypeid').empty()
        $('#producttypeid').append($('<option>').text('-Select Type-'))
        
        response.data.map((item) => { 
            $('#producttypeid').append($('<option>').text(item.producttype).val(item.producttypeid))
           })
        }) 
    })

})