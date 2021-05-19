$(function () {
  let stammdaten = function () {
    var location = null;
    var category = null;
    var unit = null;
    var keyword = null;

    $.ajax({
      'async': false,
      'type': "GET",
      'global': false,
      'url': "/lagerorte",
      'success': function (data) {
        location = data;
      }
    });

    $.ajax({
      'async': false,
      'type': "GET",
      'global': false,
      'url': "/stammdaten/category",
      'success': function (data) {
        category = data;
      }
    });

    $.ajax({
      'async': false,
      'type': "GET",
      'global': false,
      'url': "/stammdaten/unit",
      'success': function (data) {
        unit = data;
      }
    });

    $.ajax({
      'async': false,
      'type': "GET",
      'global': false,
      'url': "/stammdaten/keyword",
      'success': function (data) {
          keyword = data;
      }
    });
    return {"category": category.data, "keyword": keyword.data, "unit": unit.data, "storage_location": location};
  }();

  let tpopup = $(`
    <div id="PopUp>
      <form action="/stock">
        <div class="PopUp_topBar">
          Neuen Artikel anlegen
          <div id="mdiv">
            <div class="mdiv">
              <div class="md"></div>
            </div>
          </div>
        </div>
        <div class="PopUp_middle">
          <table>
            <tr>
              <td>Artikel:</td>
              <td>
                <input type="text" id="name" maxlength="20" required autocomplete="off">
              </td>
              <td>Ort:</td>
              <td>
                <ul id="location" class="navbar-nav border">
                  <li class="nav-item dropdown">
                    <span class="nav-link dropdown-toggle" data-toggle="dropdown">
                      Wähle einen Ort aus
                    </span>
                    <ul class="dropdown-menu">
                    </ul>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <td>Anzahl:</td>
              <td style="text-align:center">
                <input type="number" id="number" name="number" min="0" maxLength="10" required>
              </td>
            </tr>
          </table>
        </div>
      </form>
    </div>
  `);
  //create stock Popup
  var popup = $('<div/>', {'id':'PopUp'}).append(
    $('<form/>', {'action': '/stock'}).append(
      $('<div/>', {'class': 'PopUp_topBar'})
    ).append(
      $('<div/>', {'class': 'PopUp_middle'}).append(
        $('<table/>').append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Artikel:'})
          ).append(
            $('<td/>').append(
              $('<input/>', {'type': 'text', 'id': 'name', 'name': 'name', 'maxlength': '20'})
            )
          ).append(
            $('<td/>', {'text': 'Ort:'})
          ).append(
            $('<td/>').append(
              $('<ul/>', {'id': 'location', 'class': 'navbar-nav border'}).append(
                $('<li/>', {'class': 'nav-item dropdown'}).append(
                  $('<span/>', {'class': 'nav-link dropdown-toggle', 'data-toggle': 'dropdown', 'text': 'Wähle einen Ort aus'})
                ).append(
                  $('<ul/>', {'class': 'dropdown-menu'})
                )
              )
            )
          )
        ).append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Anzahl:'})
          ).append(
            $('<td/>', {'style': 'text-align:center'}).append(
              $('<input/>', {'type': 'number', 'id': 'number', 'name': 'number', 'min': '0', 'maxlength': '10'})
            )
          ).append(
            $('<td/>', {'text': 'Mindestanzahl:'})
          ).append(
            $('<td>').append(
              $('<input/>', {'type': 'number', 'id': 'minimum_number', 'name': 'minimum_number', 'min': '0', 'maxlength': '10'})
            )
          )
        ).append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Kategorie:'})
          ).append(
            $('<td/>').append(
              $('<select/>', {'name': 'category', 'id': 'category', 'oninvalid': 'this.setCustomValidity(`Wählen Sie bitte eine Kategorie aus.\n Sie müssen diese vorher in den Stammdaten eintragen`)'})
            )
          ).append(
            $('<td/>', {'text': 'Stichwörter:'})
          ).append(
            $('<td/>').append(
              $('<div/>', {'class': 'select-wrapper'}).append(
                $('<span/>', {'class': 'autocomplete-select'})
              )
            )
          )
        ).append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Einheit:'})
          ).append(
            $('<td/>').append(
              $('<select/>', {'name': 'unit', 'id': 'unit', 'oninvalid': 'this.setCustomValidity(`Wählen Sie bitte eine Einheit aus.\n Sie müssen diese vorher in den Stammdaten eintragen`)'})
            )
          )
        )
      )
    ).append(
      $('<div/>', {'class': 'PopUp_footer'}).append(
        $('<button/>', {'type': 'submit', 'id': 'PopUpSubmit', 'text': 'Speichern'})
      )
    )
  );

  popup.find("#name").prop("required", "true");
  popup.find("#name").attr("autocomplete", "off");
  popup.find("#number").prop("required", "true");
  popup.find("#minimum_number").prop("required", "true");
  popup.find("#category").prop("required", "true");
  popup.find("#unit").prop("required", "true");

  let ul = popup.find("#location").find("ul");

  const emptyPlaceIsZero = (currentValue) => currentValue.empty_places === 0;

  //handles clicks on the location tab in the popup
  $("body").on("click", "#location span", function(){
    //checks if there every 'emptyPlaces' property is 0 
    if(stammdaten.storage_location.every(emptyPlaceIsZero)){
      $("#location").parent().append(
        $("<span/>", {"id": "LocationNotification", "text": "Alle Lagerplätze sind belegt."})
      );
    };
  })

  //displays all root locations in the popup
  $.each(stammdaten.storage_location, function(i, p){
    if(p.parent == 0){
      $(ul).append(
        $('<li/>').append(
          $('<span/>', {'class': 'dropdown-item', 'text': p.name, 'data-id': p.id, 'data-parent': p.parent, 'data-places': p.places, 'data-empty_places': p.empty_places})
        )
      );
      appendChild(p.id);
    }
  });
  
  //apply option tags for selection
  $.each(stammdaten.category, function(i, p) {
    popup.find('#category').append($('<option></option>').val(p.category).html(p.category));
  });

  $.each(stammdaten.unit, function(i, p) {
    popup.find('#unit').append($('<option></option>').val(p.unit).html(p.unit));
  });

  //append children locations in the popup
  function appendChild(parentId){
    $.get(`/lagerorte/parent/${parentId}`, function(data){

      if(data.length > 0){
        let parentSpan = $(ul).find(`*[data-id=${parentId}]`);
        $(parentSpan).addClass("submenuIcon");
        
        $(parentSpan).parent().append(
          $("<ul/>", {'class': 'submenu dropdown-menu'})
        );

        $.each(data, function(i, p){
            $(parentSpan).parent().find(".submenu").append(
              $("<li/>").append(
                $('<span/>', {'class': 'dropdown-item', 'text': p.name, 'data-id': p.id, 'data-parent': p.parent, 'data-places': p.places, 'data-empty_places': p.empty_places})
    
              )
            )
            appendChild(p.id);   
        });
      }else{
        removeEndNode(parentId);
      }
    })
  }

  //remove child nodes without free storage places
  function removeEndNode(nodeDataId){

    let endNode = popup.find(`[data-id='${nodeDataId}']`);
    let endNodeParent = $(endNode).data("parent");
    let parentUl = $(endNode).parent().parent();

    if($(endNode).data("empty_places") == 0){
      $(endNode).parent().remove();

      if(parentUl.children().length == 0){
        $(parentUl).remove();

        let parentNode = popup.find(`[data-id="${endNodeParent}"]`);
        $(parentNode).removeClass("submenuIcon");
        removeEndNode(endNodeParent);
      }
    }
  }

  //apply selected location to popup
  $("body").on("click", "#location ul li span", function(e){
    let locationHasFreeStoragePlaces = $(this).data("empty_places") > 0;
    if(locationHasFreeStoragePlaces){
      let name = $(this).text();
      let dataId = $(this).data("id");
      let dataParent = $(this).data("parent");
      let selectedItem = $("#location li span").first()[0];
  
      $(selectedItem).text(name);
      $(selectedItem).attr("data-id", dataId);
      $(selectedItem).attr("data-parent", dataParent);
    }    
  })

  //check if new Item already exists
  $("body").on("change, keyup", "#name", function () {
    let name = $("#name").val();
    let nameIsNotEmpty = /([^\s])/.test(name);

    let selectedName;
    $("#table tbody tr").each(function () {
      //get selected line
      if ($(this).hasClass("selected")) {
        //get name from selected row
        selectedName = ($(this).children().eq(1).html());
      };
    });

    let nameIsNotEqualToSelectedName = selectedName != name.replace(/\s/g, '');

    //Only check for a match if the input is not empty and not the same as in the selected row
    if (nameIsNotEmpty && nameIsNotEqualToSelectedName) {
      $.get(`/stock/name/${name}`, function (data) {
        if (data) {
          let noErrMsgExists = $("#notification").length == 0;
          if (noErrMsgExists) {
            $("#name")
              .parent()
              .append(
                "<br id='notificationBreak'><span id='notification'>Dieser Artikel extistiert bereits</span>"
              );
          }
          $(".ui-autocomplete").css("z-index", "0");
        }else{
          $("#notificationBreak").remove();
          $("#notification").remove();
        }
      });
    }
  });

  $("body").on("click", ".numberButton", function (e) {
    e.preventDefault();
    var number = $("#number").val();
    var sum = parseInt(number) + parseInt($(this).html());
    if (sum >= 0) {
      $("#number").val(sum);
    } else {
      $("#number").val(0);
    }

  });

  var KeywordsAutocomplete;

  $("#New").click(function () {
    popup = toCreatePopup(popup);
    $(".selected").removeClass('selected');
    $('#tableDiv').after(popup);
    popup.fadeIn();


    //apply multi dropdown field for keywords
    $('.select-pure__select').remove();
    $.ajax({
      url: 'stammdaten/keyword',
      success: function(data) {
          var optionsArr = [];
          for(var i = 0; i < data.data.length; i ++){
            optionsArr.push({"label": data.data[i].keyword, "value": data.data[i].keyword, "data-id": data.data[i].id});
          }
          KeywordsAutocomplete = new SelectPure(".autocomplete-select", {
            options: optionsArr,
            value: "",
            multiple: true,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: value => {
                  var element = $(".select-pure__label");
                  $(element[0]).scrollTop(element[0].scrollHeight);
              },
            classNames: {
              select: "select-pure__select",
              dropdownShown: "select-pure__select--opened",
              multiselect: "select-pure__select--multiple",
              label: "select-pure__label",
              placeholder: "select-pure__placeholder",
              dropdown: "select-pure__options",
              option: "select-pure__option",
              autocompleteInput: "select-pure__autocomplete",
              selectedLabel: "select-pure__selected-label",
              selectedOption: "select-pure__option--selected",
              placeholderHidden: "select-pure__placeholder--hidden",
              optionHidden: "select-pure__option--hidden",
            }
          });
          var resetAutocomplete = function() {
            KeywordsAutocomplete.reset();
          };
        }
    });

    $("#name").focus();
    $("#cover").fadeIn();
  });

  $("#Edit").click(function () {
    
    var id;
    $("#table tbody tr").each(function () {
      if ($(this).hasClass("selected")) {
        //get marked line
        id = $(this).children().eq(1).html(); //get id from line
        id = id.replace(/ /g, ""); //cut spaces
        id = id.replace(/\r?\n|\r/g, "");
      };
    });
    var result = "";
    $.ajax({
      "async": false,
      "type": "GET",
      "global": false,
      "url": `/stock/${id}`,
      "success": function(data){
        result = {
          "name": data.name,
          "storage_location": data.storage_location,
          "storage_place": data.storage_place,
          "storage_parent": data.storage_parent,
          "storage_location_id": data.storage_location_id,
          "number": data.number,
          "minimum_number": data.minimum_number,
          "category": data.category,
          "keywords": data.keyword,
          "unit": data.unit
        };
      }
    })
    popup = toUpdatePopup(popup);
    $('#tableDiv').after(popup);
    popup.fadeIn();

    //apply multi dropdown field for keywords
    $('.select-pure__select').remove();
    $.ajax({
      url: 'stammdaten/keyword',
      success: function(data) {
          var optionsArr = [];
          for(var i = 0; i < data.data.length; i ++){
            optionsArr.push({"label": data.data[i].keyword, "value": data.data[i].keyword});
          }
          KeywordsAutocomplete = new SelectPure(".autocomplete-select", {
            options: optionsArr,
            value: result.keywords ? result.keywords.split(",") : "",
            multiple: true,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: value => {
                  //var element = document.getElementsByClassName('.select-pure__label')[0];
                  //element.scrollTop = element.scrollHeight;
                  var element = $(".select-pure__label");
                  $(element[0]).scrollTop(element[0].scrollHeight);
              },
            classNames: {
              select: "select-pure__select",
              dropdownShown: "select-pure__select--opened",
              multiselect: "select-pure__select--multiple",
              label: "select-pure__label",
              placeholder: "select-pure__placeholder",
              dropdown: "select-pure__options",
              option: "select-pure__option",
              autocompleteInput: "select-pure__autocomplete",
              selectedLabel: "select-pure__selected-label",
              selectedOption: "select-pure__option--selected",
              placeholderHidden: "select-pure__placeholder--hidden",
              optionHidden: "select-pure__option--hidden",
            }
          });
          var resetAutocomplete = function() {
            KeywordsAutocomplete.reset();
          };
        }
    });

    let location = $("#location li span").first()[0];

    $("#name").val(result.name);
    $(location).text(result.storage_location);
    $(location).attr("data-id", result.storage_location_id);
    $(location).attr("data-parent", result.storage_parent);
    $("#number").val(result.number);
    $("#minimum_number").val(result.minimum_number);
    $("#category").val(result.category);
    $("#unit").val(result.unit);

    $("#cover").fadeIn();

  });

  function toCreatePopup(popup){
    popup.find(".PopUp_topBar").text("Neuen Artikel anlegen");
    popup.find(".PopUp_topBar").append('<div id="mdiv"><div class="mdiv"><div class="md"></div></div></div>');
    popup.find("#location span").first().text("Wähle einen Ort aus");
    popup.find("#location span").first().attr("data-id", 0);
    popup.find("#location span").first().data("parent", 0);
    popup.find("form").prop("action", "/stock");
    popup.find(".numberButton").remove();
    $(popup.find("#minimum_number")).css("margin-bottom", "0");
    
    return popup;

  }

  function toUpdatePopup(popup){
    popup.find(".PopUp_topBar").text("Artikel bearbeiten");
    popup.find(".PopUp_topBar").append('<div id="mdiv"><div class="mdiv"><div class="md"></div></div></div>')
    popup.find("form").prop("action", "/entry");

    popup.find(".numberButton").remove();
    $(popup.find("#minimum_number")).css("margin-bottom", "22px");

    popup.find("#number").after('<button class="numberButton">+10</button>');
    popup.find("#number").after('<button class="numberButton">+1</button>');
    popup.find("#number").after('<button class="numberButton">-1</button>');
    popup.find("#number").after('<button class="numberButton">-10</button>');

    return popup;
  }

  $("body").on("click", "#cover, .navbar, #mdiv",function () {
    //when grey background or x button is clicked
    if($(".select-pure__select--opened").length == 0){

      $("#PopUp").fadeOut();
      $("#PopUpUpdate").fadeOut();
      $("#PopUpDelete").fadeOut();
      $(".list_popup").fadeOut();

      $("#cover").fadeOut();
      $("#notification").fadeOut();

      $(".Tags").remove();

      $("#PopUp input").each(function (i) {
        $(this).val("");
      });

      $("#number, #minimum_number").parent().find("span").remove();
      $("#number , #minimum_number").parent().find("br").remove();

      $("#number , #minimum_number").css("border", "none");
      $("#number , #minimum_number").css("border-bottom", "1px solid rgb(0,60,121");

      $("#keywords , #minimum_number").val("");
  }

  });


   //redirect if save icon was clicked
   $("#table").on("click", ".save", function (e) {
    //gets id of clicked row
    let id = $(this).parent().parent().children().eq(1).html().trim();
    let name = $(this).parent().parent().children().eq(2).html().trim();

    let list_popup = $(`
      <div class="list_popup">
        <form data-id="${id}">
          <div class="PopUp_topBar">${name} in Liste speichern<div id="mdiv"><div class="mdiv"><div class="md"></div></div></div></div>
          <div class="PopUp_middle">
            <br/>
            <input type="number" name="value" min="0" value="0"/>
            <br/>
            <div>
              <span>Einlagern</span>
              <label for="ein_auslagern" class="switch_list">
                <input id="ein_auslagern" name="auslagern" unchecked type="checkbox">
                <span class="slider_list round"></span>
              </label>
              <span>Auslagern</span>
            </div>
            <br/>
          </div>
          <div class="PopUp_footer">
            <button type="submit">
              Speichern
            </button>
          </div>
        </form>
      </div>
    `);

    $('#tableDiv').after(list_popup);
    list_popup.fadeIn();
    $("#cover").fadeIn();

  
  });

 
});
