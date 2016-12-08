  <!-- Template Config Color Draw -->
  <script type="text/template" id="tmpConfigDraw">
    <form id="frmConfigDraw">
      <div class="form-group">
        <label>สี</label>
        <div class="input-group color" id="fColorDraw">
            <input type="text" value="" class="form-control" name="color" />
            <span class="input-group-addon"><i></i></span>
        </div>
      </div>
    </form>
  </script>
  <!-- End Template Config Color Draw -->
  <!-- Template new-edit poi -->
  <script type="text/template" id="tmpPOI">
    <form id="formPOI" enctype="multipart/form-data">
      <input type="hidden" name="id" value="<%= id %>">
      <input type="hidden" name="poi[geom]" value="<%= geom %>">
      <div class="form-group">
        <label>ชื่อ</label>
        <input type="text" class="form-control" name="poi[title]" value="<%= name %>">
      </div>
      <div class="form-group">
        <label>ลิงก์</label>
        <input type="text" class="form-control" name="poi[link]" value="<%= link %>">
      </div>
      <div class="form-group">
        <label>ไฟล์</label>
        <input type="file" class="form-control" name="file">
      </div>
      <div class="form-group">
        <label>รูปภาพ</label>
        <input type="file" class="form-control" name="image">
      </div>
    </form>
  </script>
  <!-- End Template new-edit poi -->
  <!-- Template new-edit poi  photo-->
  <script type="text/template" id="tmpPOIPhoto">
    <form id="formPOIPhoto" enctype="multipart/form-data">
      <input type="hidden" name="id" value="<%= id %>">
      <input type="hidden" name="poi[geom]" value="<%= geom %>">
      <div class="form-group">
        <label>รูปภาพ</label>
        <input type="file" class="form-control" name="image" accept="image/*" id="photoPOI">
      </div>

      <div id="POIPhotoDetail" style="display: none;">
        <div class="form-group">
          <label>ชื่อ</label>
          <input type="text" class="form-control" name="poi[title]" value="<%= name %>">
        </div>
        <div class="form-group">
          <label>ลิงก์</label>
          <input type="text" class="form-control" name="poi[link]" value="<%= link %>">
        </div>
        <div class="form-group">
          <label>ไฟล์</label>
          <input type="file" class="form-control" name="file">
        </div>
      </div>

    </form>
  </script>
  <!-- End Template new-edit poi photo-->
  <!-- Template Buffer -->
  <script type="text/template" id="tmpBuffer">
    <form class="form-inline" id="frmBuffer" action="javascript:void(0)">
      <input type="hidden" name="wkt" value="<%= wkt %>">
      <div class="form-group">
        <label style="width:100px;">ปี</label>
        <select name="year" class="form-control" id="year_buffer" style="width:200px;">
        </select>
      </div>
      <br>
      <br>
      <div class="form-group">
        <label style="width:100px;">ระยะ Buffer</label>
        <input type="number" class="form-control" name="buffer" style="width:200px;"> เมตร
      </div>
    </form>
  </script>  
  <!-- End Template Buffer -->
  <!-- Template Intersect -->
  <script type="text/template" id="tmpIntersect">
    <form class="form-inline" id="frmIntersect" action="javascript:void(0)">
      <input type="hidden" name="wkt" value="<%= wkt %>">
      <div class="form-group">
        <label style="width:100px;">ปี</label>
        <select name="year" class="form-control" id="year_intersect" style="width:200px;">
        </select>
      </div>
    </form>
  </script>  
  <!-- End Template Intersect -->
  <?php require 'add_edit_layer.php'; ?>
  <?php require 'layer_sort.php'; ?>
  <?php require 'search_farmer.php'; ?>