$(document).ready(function() {
  $('.selectpicker').selectpicker();
  load_table();
});

function check() {
  var full_name = $("#full_name").val();
  var username = $("#username").val();
  if(full_name == "" || username == "")
  {
    bootbox.alert({
      size: "small",
      title: "Waring",
      message: "กรุณาเลือกข้อมูลก่อนกด Insert",
    })
    return false;
  }
}

function formatRepo(repo) {
  if (repo.loading) return repo.text;
  var markup = "<div class='select2-result-repository clearfix'>" +
    "<div class='select2-result-repository__avatar'><img src='https://www.gepi.co/assets/img/profile_avatar.jpg' /></div>" +
    "<div class='select2-result-repository__meta'>" +
    "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

  if (repo.samaccountname) {
    markup += "<div class='select2-result-repository__description'>" + repo.samaccountname + "</div>";
  }
  markup += "</div></div>";
  return markup;
}

function formatRepoSelection(repo) {
  $("#full_name").val(repo.full_name);
  $("#username").val(repo.samaccountname);
  return repo.full_name || repo.text;
}

$(".js-data-example-ajax").select2({
  placeholder: "ค้นหารายชื่อ ",
  ajax: {
    method: "GET",
    url: "controllers/user_ad.php",
    dataType: 'json',
    delay: 250,
    data: function (params) {
      return {
        q: params.term, // search term
        page: params.page
      };
    },
    processResults: function (data, params) {
      params.page = params.page || 1;
      return {
        results: data.items,
        pagination: {
          more: (params.page * 30) < data.total_count
        }
      };
    },
    cache: true,
  },
  escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
  minimumInputLength: 1,
  templateResult: formatRepo, // omitted for brevity, see the source of this page
  templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
});

function load_table() {
  $.ajax({
    url: "controllers/all_user.php",
    dataType: "json", 
    success: function(result){
      var html = "";
      var len = result.length;
      var admin;
      var guest;
      html += "<table id='table_user' class='table table-striped table-hover table-bordered'>";
      html += "<thead><tr>";
      html += "<th>ชื่อ - นามสกุล</th><th>ชื่อผู้ใช้งาน</th><th>สิทธิการใช้งาน</th><th>เครื่องมือ</th>";
      html += "</tr></thead>";
      html +=  "<tbody>";
      if(len > 0){
        for(var i=0;i<len;i++){
          html += "<tr><td>"+result[i].full_name+"</td>";
          html += "<td>"+result[i].username+"</td>";
          if(result[i].role == "admin"){
            admin = "selected='true'";
            guest = "";
          } else {
            admin = "";
            guest = "selected='true'";
          }
          html += "<form>";
          html += "<td><select class='selectpicker2' id='edit_per_"+result[i].id+"' disabled><option value='admin' "+admin+">ผู้ดูแลระบบ</option><option value='guest' "+guest+" >ผู้ใช้งานทั่วไป</option>";
          html += "</select></td>"
          html += "<td><button type='button' id='update_"+result[i].id+"' class='btn btn-success' style='display: none;' onclick='button_update("+result[i].id+")'>Update</button> ";
          html += "<button type='button' id='edit_"+result[i].id+"' class='btn btn-info' onclick='button_edit("+result[i].id+")'>Edit</button> ";
          html += "<button type='button' id='del_"+result[i].id+"' class='btn btn-warning' onclick='button_del("+result[i].id+")'>Delete</button></td>";
          html += "</form></tr>";
        }
        if(html != ""){
          html +=  "</tbody></table>";
        }
      }
      $("#dttable").html(html);
      $('.selectpicker2').selectpicker({});
      $('#table_user').DataTable( {
        "order": [] 
      });
    }
  });
}

$( "form" ).on( "submit", function( event ) {
  event.preventDefault();
  var full_name = $("#full_name").val();
  var username = $("#username").val();
  var role = $("#role").val();
  $.ajax({
    url: 'controllers/create_user.php',
    type: 'POST',
    data: {
      full_name : full_name,
      username : username,
      role : role
    },
    dataType: 'json',
    error: function(data) {
      bootbox.alert({
        size: "small",
        title: "Insert Error",
        message: "Can't Insert Data",
      })
      data;
    },
    success: function(data) {
      if(data.success == true){
        bootbox.alert({
          size: "small",
          title: "Insert Success",
          message: "Success",
        })
        $("#full_name").val(" ");
        $("#username").val(" ");
        $('#select2').val('').trigger('change');
        load_table();
        data;
      } else if(data.success == false) {
         bootbox.alert({
          size: "small",
          title: "Insert Error",
          message: "Can't Insert Data",
         })
        data;
      } else {
        bootbox.alert({
          size: "small",
          title: "Warnig",
          message: "มีชื่อนี้ในฐานข้อมูลแล้ว",
        });
      }
    }
  });
});

function button_edit(id) {
  $("#update_"+id).show();
  $("#edit_"+id).hide();
  $("#edit_per_"+id).removeAttr('disabled');
  $('.selectpicker2').selectpicker('refresh');
}

function button_update(id) {
  $.ajax({
    url: "controllers/update_user.php",
    method: "POST",
    dataType: "json",
    data : {"role" : $("#edit_per_"+id).val(),"id" : id},
    success: function(data){
      bootbox.alert({
        size: "small",
        title: "Update Success",
        message: "Success",
      });
    },
    error: function(data) {
      bootbox.alert({
        size: "small",
        title: "Update Error",
        message: "Can't Update Data",
      })
    }
  });

  $("#update_"+id).hide();
  $("#edit_"+id).show();

  $("#edit_per_"+id).attr('disabled',true);
  $('.selectpicker2').selectpicker('refresh');
}

function button_del(id) {
  if (confirm('Do you want to Delete This ?')) {
    $.ajax({
      url: "controllers/delete_user.php",
      method: "POST",
      dataType: "json",
      data : {"id" : id},
      success: function(data){
        bootbox.alert({
          size: "small",
          title: "Delete Success",
          message: "Delete",
        })
        load_table();
      },
      error: function(data) {
        bootbox.alert({
          size: "small",
          title: "Delete Error",
          message: "Can't Delete Data",
        })
      }
    });
  }
}