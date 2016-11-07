<script type="text/template" id="tmpLayerSort">
  <div class="panel panel-primary">
    <div class="panel-heading" role="tab" id="heading<%= id %>">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#layerSortable" href="#collapse<%= id %>" aria-expanded="true" aria-controls="collapse<%= id %>">
          <%= title %>
        </a>
      </h4>
    </div>
    <div id="collapse<%= id %>" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading<%= id %>" layer-id="<%= id %>">
      <div class="panel-body">
          
        <div class="form-group">
          <label >ความโปร่งแสง</label>
          <input type="range" id="opacity_<%= id %>" min=0 max=1 step=0.1 value=<%= opacity %> >
        </div>
              
      </div>
    </div>
  </div>
</script>

<script type="text/template" id="tmpLayerSortFarmer">
  <div class="panel panel-primary">
    <div class="panel-heading" role="tab" id="heading<%= id %>">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#layerSortable" href="#collapse<%= id %>" aria-expanded="true" aria-controls="collapse<%= id %>">
          <%= title %>
        </a>
      </h4>
    </div>
    <div id="collapse<%= id %>" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading<%= id %>" layer-id="<%= id %>">
      <div class="panel-body">
        <div>
          <!-- Nav tabs -->
          <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#control<%= id %>" aria-controls="control<%= id %>" role="tab" data-toggle="tab">เครื่องมือ</a></li>
            <li role="presentation"><a href="#search_farmer<%= id %>" aria-controls="search_farmer<%= id %>" role="tab" data-toggle="tab">ค้นหา</a></li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="control<%= id %>">
              <div class="form-group">
                <label >ความโปร่งแสง</label>
                <input type="range" id="opacity_<%= id %>" min=0 max=1 step=0.1 value=<%= opacity %> >
              </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="search_farmer<%= id %>">
              <button type="submit" class="btn btn-primary pull-right">ค้นหา</button>
              <div style="clear:both;"></div>
              <form id="frmSearchFarmerArea">
                <!-- Mockup -->
                <div class="form-group">
                  <label>ชื่อ</label>
                  <br>
                  <input type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>นามสกุล</label>
                  <br>
                  <input type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>ครัวเรือนเกษตรกร</label>
                  <br>
                  <input type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>ชนิดสินค้าเกษตร</label>
                  <br>
                  <input type="text" class="form-control">
                </div>
                <!-- End Mockup -->
                <div class="form-group">
                  <label>สินค้า</label>
                  <br>
                  <select name="detail[]" class="form-control select2-muti" style="width: 100%" multiple>
                    <option value=""></option>
                    <?php
                      while ($row = pg_fetch_assoc($detail)) {
                        echo "<option value='".$row["detail_name"]."'>".$row["detail_name"]."</option>";
                      }
                    ?>
                  </select>
                </div>
                <div class="form-group">
                  <label>จังหวัด</label>
                  <br>
                  <select name="province[]" class="form-control select2-muti" style="width: 100%" multiple>
                    <option value=""></option>
                    <?php                      
                      while ($row = pg_fetch_assoc($province)) {
                        echo "<option value='".$row["province_code"]."'>".$row["province_name"]."</option>";
                      }
                    ?>
                  </select>
                </div>
                <!-- Mockup -->
                <div class="form-group">
                  <label>อำเภอ</label>
                  <br>
                  <input type="text" class="form-control">
                </div>
                <div class="form-group">
                  <label>ตำบล</label>
                  <br>
                  <input type="text" class="form-control">
                </div>
                <!-- End Mockup -->
                <button type="submit" class="btn btn-primary pull-right">ค้นหา</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</script>

        


