$(document).ready(function () {
  let checkedAmenities = {};

  $(document).on("change", "input[type='checkbox']", function () {
    if (this.checked) {
      checkedAmenities[$(this).data("id")] = $(this).data("name");
    } else {
      delete checkedAmenities[$(this).data("id")];
    }
    let lst = Object.values(checkedAmenities);
    if (lst.length > 0) {
        console.log(lst);
      $("div.amenities > h4").text(lst.join(", "));
    } else {
      $("div.amenities > h4").html("&nbsp;");
    }
  });
});

$.get('https://localhost:5001/api/v1/status', function (data, status) {
    if (status === 'success') {
        if (data.status === 'OK') {
            $('$api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available')
        }
    }
})
