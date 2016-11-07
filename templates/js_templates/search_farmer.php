<script type="text/template" id="tmpSearchFarmer">              
  <form id="frmSearchFarmer">
    <div class="form-group">
      <label>ปี</label>
      <br>
      <select name="year" id="search_year" class="form-control select2-muti" style="width: 100%">
      </select>
    </div><div class="form-group">
      <label>กลุ่มสินค้า</label>
      <br>
      <select name="type[]" id="search_type" class="form-control select2-muti" style="width: 100%" multiple>
      </select>
    </div>
    <div class="form-group">
      <label>สินค้า</label>
      <br>
      <select name="detail[]" id="search_detail" class="form-control select2-muti" style="width: 100%" multiple>
      </select>
    </div>
    <div class="form-group">
      <label>จังหวัด</label>
      <br>
      <select name="province[]" id="search_province" class="form-control select2-muti" style="width: 100%" multiple>
      </select>
    </div>
  </form>
</script>