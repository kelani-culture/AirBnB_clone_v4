/** @format */

$(document).ready(function () {
  let checkedAmenities = {};
  let checkedStates = {};
  let checkedCities = {};

  const populateCheckedAmenities = (evt) => {
    let this_ = evt.target;
    if (evt.target.checked) {
      checkedAmenities[$(this_).data("id")] = $(this_).data("name");
    } else {
      delete checkedAmenities[$(this_).data("id")];
    }
    let checkedList = Object.values(checkedAmenities);
    if (checkedList.length) {
      $("div.amenities > h4").text(Object.values(checkedAmenities).join(", "));
    } else {
      $("div.amenities > h4").html("&nbsp;");
    }
  };

  const populateCheckedLocations = (evt) => {
    let this_ = evt.target;
    // console.log("populating checked locations");
    if (this_.checked) {
      if (!checkedStates.hasOwnProperty(`${$(this_).data("state_id")}`))
        checkedStates[$(this_).data("state_id")] = $(this_).data("state");
    } else {
      delete checkedStates[$(this_).data("state_id")];
    }
  };

  const populateCheckedCities = (evt) => {
    let this_ = evt.target;
    if (this_.checked) {
      checkedCities[$(this_).data("id")] = $(this_).data("name");
    } else {
      delete checkedCities[$(this_).data("id")];
    }
    let checkedList = Object.values(checkedCities);
    if (checkedList.length) {
      $("div.locations > h4").text(checkedList.join(", "));
    } else {
      $("div.locations > h4").html("&nbsp;");
    }
  };

  $(document).on(
    "change",
    ".amenities>.popover li>input[type='checkbox']",
    populateCheckedAmenities
  );
  $(document).on(
    "change",
    ".locations>.popover li>input[type='checkbox']",
    populateCheckedLocations
  );
  $(document).on(
    "change",
    ".locations>.popover li>ul>li>input[type='checkbox']",
    populateCheckedCities
  );

  $.get("http://localhost:5001/api/v1/status/", function (data, statusText) {
    if (statusText !== "success") return;
    if (data.status === "OK") $("#api_status").addClass("available");
    else $("#api_status").removeClass("available");
  });

  $.ajax({
    type: "POST",
    url: "http://localhost:5001/api/v1/places_search",
    data: "{}",
    dataType: "json",
    contentType: "application/json",
    success: function (data) {
      for (const place_entry of data) {
        $(".places ").append(
          "<article><h2>" +
            place_entry.name +
            '</h2><div class="price_by_night"><p>$' +
            place_entry.price_by_night +
            '</p></div><div class="information"><div class="max_guest"><div class="guest_image"></div><p>' +
            place_entry.max_guest +
            '</p></div><div class="number_rooms"><div class="bed_image"></div><p>' +
            place_entry.number_rooms +
            '</p></div><div class="number_bathrooms"><div class="bath_image"></div><p>' +
            place_entry.number_bathrooms +
            '</p></div></div><div class="description"><p>' +
            place_entry.description +
            "</p></div></article>"
        );
      }
    },
  });

  $(".filters > button").click(function () {
    console.log(
      "checked cities\n",
      checkedCities,
      "\nchecked amenities\n",
      checkedAmenities,
      "\nchecked states\n",
      checkedStates
    );
    $(".places > article").remove();
    $.ajax({
      type: "POST",
      url: "http://localhost:5001/api/v1/places_search",
      data: JSON.stringify({
        amenities: Object.keys(checkedAmenities),
        states: Object.keys(checkedStates),
        cities: Object.keys(checkedCities),
      }),
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        for (const place_entry of data) {
          $(".places ").append(
            "<article><h2>" +
              place_entry.name +
              '</h2><div class="price_by_night"><p>$' +
              place_entry.price_by_night +
              '</p></div><div class="information"><div class="max_guest"><div class="guest_image"></div><p>' +
              place_entry.max_guest +
              '</p></div><div class="number_rooms"><div class="bed_image"></div><p>' +
              place_entry.number_rooms +
              '</p></div><div class="number_bathrooms"><div class="bath_image"></div><p>' +
              place_entry.number_bathrooms +
              '</p></div></div><div class="description"><p>' +
              place_entry.description +
              "</p></div></article>"
          );
        }
      },
    });
  });
});
