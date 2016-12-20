<!-- Template Intersect -->
<script type="text/template" id="tmpIntersect">
  <form id="frmIntersect" action="javascript:void(0)">
    <input type="hidden" name="wkt" value="<%= wkt %>">
    <div class="form-group">
      <label>ปี</label>
      <br>
      <select name="year" class="form-control" id="year_intersect" style="width:100%;">
      </select>
    </div>
    <div class="form-group">
      <label>กลุ่มสินค้า</label>
      <br>
      <select name="type[]" id="intersect_type" class="form-control select2-muti" style="width: 100%" multiple>
      </select>
    </div>
    <div class="form-group">
      <label>สินค้า</label>
      <br>
      <select name="detail[]" id="intersect_detail" class="form-control select2-muti" style="width: 100%" multiple>
      </select>
    </div>
  </form>
</script>  
<!-- End Template Intersect -->