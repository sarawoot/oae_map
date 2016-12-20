<!-- <option value="shp" <%= (category == "shp") ? 'selected' : '' %>>ชั้นข้อมูลแบบ Shapefile</option> -->
<script type="text/template" id="tmpNewLayer">
  <form id="frmNewLayer" enctype="multipart/form-data">
    <div style="padding:10px">
      <input type="hidden" name="id" value="<%= id %>">
      <input type="hidden" name="layer[parent_id]" value="<%= parent_id %>">
      <input type="hidden" name="layer[layer]" value="1">
      <input type="hidden" name="layer[delete_able]" value="1">
      <input type="hidden" name="layer[add_able]" value="1">
      <input type="hidden" name="layer[edit_able]" value="1">
      
      <div class="form-group">
        <label>ประเภทชั้นข้อมูล</label>
        <select class="form-control" name="layer[category]" id="layer_category">
          <option value="folder" <%= (category == "folder") ? 'selected' : '' %> >โฟลเดอร์</option>
          <option value="wms" <%= (category == "wms") ? 'selected' : '' %>>ชั้นข้อมูลแบบ WMS</option>
          <option value="tile" <%= (category == "tile") ? 'selected' : '' %>>ชั้นข้อมูลแบบ Tile</option>
          <option value="kml" <%= (category == "kml") ? 'selected' : '' %>>ชั้นข้อมูลแบบ KML</option>
          
        </select>
      </div>
      <div class="form-group">
        <label>ชื่อชั้นข้อมูล</label>
        <input type="text" class="form-control" name="layer[name]" value="<%= name %>">
      </div>

      <div class="form-group" id="layer_url">
        <label>ที่อยู่บนเว็บ(Url)</label>
        <input type="text" class="form-control" name="layer[url]" value="<%= url %>">
      </div>
      <div class="form-group" id="layer_opacity">
        <label>ความโปร่งแสง</label>
        <div>
          <input type="text" name="layer[opacity]" id="el_layer_opacity" data-slider-id='layer_opacity_slider'  data-slider-min="0" data-slider-max="1" data-slider-step="0.1" data-slider-value="<%= opacity %>" class="form-control"/>
        </div>
      </div>
      <div class="checkbox" id="layer_visible">
        <label>
          <input type="hidden" name="layer[visible]" value="0">
          <input type="checkbox" name="layer[visible]" value="1" <%= visible ? 'checked' : '' %> >แสดงเมื่อเริ่มต้น
        </label>
      </div>
    </div>
  </form>
  <script>
    $(function(){
      $("#layer_category").unbind().on("change", function(){
        if ($(this).val() == "folder") {
          $("#layer_url").hide();
          $("#layer_opacity").hide();
          $("#layer_visible").hide();
        } else {
          $("#layer_url").show();
          $("#layer_opacity").show();
          $("#layer_visible").show();
        }
        var frm = $("#frmNewLayer");
        if ($(this).val() == "kml") {
          var layer_url = frm.find("input[name='layer[url]']");
          layer_url.attr("type", "file");
          layer_url.attr("accept", ".kml");
          layer_url.attr("name", "layer_url");

        } else if ($(this).val() == "shp") {
          var layer_url = frm.find("input[name='layer[url]']");
          layer_url.attr("type", "file");
          layer_url.attr("accept", ".zip");
          layer_url.attr("name", "layer_url");
        } else {
          var layer_url = frm.find("input[name='layer[url]']");
          if (layer_url.length == 0) {
            layer_url = frm.find("input[name=layer_url]");
          }
          layer_url.attr("type", "text") 
          layer_url.removeAttr("accept") 
          layer_url.attr("name", "layer[url]")
        }
      }).change();
      var slider = new Slider('#el_layer_opacity');
    });
  </script>
</script>
