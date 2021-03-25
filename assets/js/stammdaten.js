//displays input field to add master data
$(".AddRow").click(function () {
    //toggle arrow icon
    $(this).find("i").first().toggleClass("fa-chevron-down fa-chevron-up");

    let label = $(this).closest("form").find("h2").text();
    let inputfieldsAlreadyExist = $(this).parent().siblings().length != 0;
    if (inputfieldsAlreadyExist) {
        $(this).parent().siblings().first().remove();
    } else {
        $(this).parent().after(`
            <tr>
            <td>
                <input maxlength="20" class="StammInput" type="text" placeholder="${label}...">
                <input type="button" value="Speichern" onclick="addMasterdata(this)" class="StammSave" />
            </td>
            </tr>
        `);
        //apply focus
        let input = $(`input[placeholder="${label}..."`).get(0);
        input.focus();
    }
});

$(".AddRow").hover(function () {
    $(this).css("cursor", "pointer");
});

//post masterdata
function addMasterdata(buttonEle) {
    var input = $(".StammInput");
    var placeholder = $(".StammInput").attr("placeholder");
    placeholder = placeholder.slice(0, placeholder.length - 3);

    var text = input.val();
    switch (placeholder) {
        case "Kategorie":
            placeholder = "category";
            break;
        case "Stichwort":
            placeholder = "keyword";
            break;
        case "Einheit":
            placeholder = "unit";
            break;
        default:
            break;
    }
    if (text != "") {
        $(buttonEle).prop("disabled", true);
        $.post(`/stammdaten/${placeholder}`, { value: text }, function (data) {
            location.reload();
        });
    }
}

//displays delete popup when clicking on the "trash" icon
$("table").on("click", ".fa-trash", function () {

    let table = $(this).closest("table").find("th").first().text();
    let val = $(this).parent().text();
    let number = null;

    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'url': `/stammdaten/${table}/${val}`,
        'success': function (data) {
          number = data[0].number;
        }
      });

    let popUpMid = ``;

    if(number == 0){
        popUpMid = `
        <span>Sicher, dass Sie "${val}" <b><u>unwiderruflich</u></b></span>
        <br>
        <span>von den Stammdaten löschen wollen?</span>
        <br>
        <button class="btn btn-danger delete" type="button">Löschen</button>
        <button class="btn btn-secondary cancel" type="button">Abbrechen</button>
        `;
    }else{
        popUpMid = `
        "${val}" Wird aktuell von ${number} Artikeln genutzt <br> und kann daher nicht gelöscht werden.
        <br>
        <button class="btn btn-secondary cancel" type="button">Abbrechen</button>
        `;
    }

    let popUp = `
        <div class="popup">
            <form>
            <div class="popup_top">
                Stammdatum von "${table}" löschen
                <div id="mdiv">
                    <div class="mdiv">
                        <div class="md"></div>
                    </div>
                </div>
            </div>
            <div class="popup_mid">
            `+popUpMid+`
            </div>
            <div class="popup_foot"></div>
            </form>
        </div>
    `;

    let cover = '<div class="cover"></div>';

    $(".Stamm_container").prepend($(cover + popUp).hide().fadeIn());

    $(".popup_mid > .cancel").click(function () {
        $(".cover").fadeOut();
        $(".popup").fadeOut();
    })

    $(".popup_mid > .delete").click(function () {
        switch (table) {
            case "Kategorie":
                table = "category"
                break;
            case "Stichwörter":
                table = "keyword"
                break;
            case "Einheit":
                table = "unit"
                break;
            default:
                break;
        }
        $.ajax({
            url: `/stammdaten/${table}/${val}`,
            type: "DELETE",
            success: function (result) {
                location.reload();
            },
        });
    });


});

$("body").on("click", ".cover, #mdiv", function(){
    $(".cover").fadeOut();
    $(".popup").fadeOut();
})