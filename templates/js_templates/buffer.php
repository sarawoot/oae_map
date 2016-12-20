<!-- Template Buffer -->
<script type="text/template" id="tmpBuffer">
  <form id="frmBuffer" action="javascript:void(0)">
    <input type="hidden" name="wkt" value="<%= wkt %>">
    <div class="form-group">
      <label style="width:100px;">ปี</label>
      <br>
      <select name="year" class="form-control" id="year_buffer" style="width:100%;">
      </select>
    </div>
    <div class="form-group">
      <label>กลุ่มสินค้า</label>
      <br>
      <select name="type[]" id="buffer_type" class="form-control select2-muti" style="width: 100%" multiple>
      </select>
    </div>
    <div class="form-group">
      <label>สินค้า</label>
      <br>
      <select name="detail[]" id="buffer_detail" class="form-control select2-muti" style="width: 100%" multiple>
      </select>
    </div>
    <div class="form-group">
      <label>ระยะ Buffer (กิโลเมตร)</label>
      <br>
      <input type="number" class="form-control" name="buffer" style="width:100%;"> 
    </div>
  </form>
</script>  
<!-- End Template Buffer -->