    <div class="row main-row">
      <div class="col-sm-5 col-md-4 sidebar sidebar-left pull-left">
        <div class="panel-group sidebar-body" id="accordion-left">
          <div class="panel-group" id="leftMenu" role="tablist" aria-multiselectable="true">
            <div class="panel panel-default">
              <div class="panel-heading" role="tab" id="headingLayer">
                <h4 class="panel-title">
                  <a data-toggle="collapse" data-parent="#leftMenu" href="#collapseLayer" aria-expanded="true" aria-controls="collapseLayer">
                    <i class="fa fa-list-alt"></i>
                    ชั้นข้อมูล
                  </a>
                  <span class="pull-right slide-submenu">
                    <i class="fa fa-chevron-left"></i>
                  </span>
                </h4>
              </div>
              <div id="collapseLayer" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingLayer">
                <div class="panel-body" style="height:350px;overflow:auto;padding:1px">
                  <input type="text" class="form-control" placeholder="ค้นหา" id="searchLayerSwitcher">
                  <div id="layerSwitcher"></div>
                </div>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading" role="tab" id="headingSortLayer">
                <h4 class="panel-title">
                  <a class="collapsed" data-toggle="collapse" data-parent="#leftMenu" href="#collapseSortLayer" aria-expanded="false" aria-controls="collapseSortLayer">
                    <i class="fa fa-list-alt"></i>
                    จัดการชั้นข้อมูล
                  </a>
                </h4>
              </div>
              <div id="collapseSortLayer" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSortLayer">
                <div class="panel-body" style="height:450px;overflow:auto;padding:1px">
                  <div class="panel-group" id="layerSortable" role="tablist" aria-multiselectable="true">                  

                  </div>
                </div>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading" role="tab" id="resultHeader">
                <h4 class="panel-title">
                  <a class="collapsed" data-toggle="collapse" data-parent="#leftMenu" href="#collapseResultPanel" aria-expanded="false" aria-controls="collapseResultPanel">
                    <i class="fa fa-list-alt"></i>
                    ผลลัพธ์
                  </a>
                </h4>
              </div>
              <div id="collapseResultPanel" class="panel-collapse collapse" role="tabpanel" aria-labelledby="resultHeader">
                <div class="panel-body" style="height:450px;overflow:auto;padding:1px">
                  <div class="panel-group" id="resultPanel" role="tablist" aria-multiselectable="true">                  

                  </div>
                </div>
              </div>
            </div>
            <div class="panel panel-default">
              <div class="panel-heading" role="tab" id="reprojectionHeader">
                <h4 class="panel-title">
                  <a class="collapsed" data-toggle="collapse" data-parent="#leftMenu" href="#collapseReprojectionPanel" aria-expanded="false" aria-controls="collapseReprojectionPanel">
                    <i class="fa fa-list-alt"></i>
                    แปลงพิกัด
                  </a>
                </h4>
              </div>
              <div id="collapseReprojectionPanel" class="panel-collapse collapse" role="tabpanel" aria-labelledby="reprojectionHeader">
                <div class="panel-body" style="height:260px;overflow:auto;padding:10px">
                  <div class="panel-group" id="reprojectionPanel" role="tablist" aria-multiselectable="true"> 

                      <table class="table table-bordered table-condensed">
                        <thead>
                          <tr>
                            <th></th>
                            <th>ต้นทาง</th>
                            <th>ปลายทาง</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>พิกัด</td>
                            <td>
                              <select id="projection_from" class="form-control">
                                <option value="EPSG:4326">Longitude/Latitude</option>
                                <option value="EPSG:32647">UTM Zone 47</option>
                                <option value="EPSG:32648">UTM Zone 48</option>
                              </select>
                            </td>
                            <td>
                              <select id="projection_to" class="form-control">
                                <option value="EPSG:4326">Longitude/Latitude</option>
                                <option value="EPSG:32647">UTM Zone 47</option>
                                <option value="EPSG:32648">UTM Zone 48</option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td>X</td>
                            <td>
                              <input type="text" id="x_from" class="form-control" number-only>
                            </td>
                            <td>
                              <input type="text" id="x_to" class="form-control" number-only>
                            </td>
                          </tr>
                          <tr>
                            <td>Y</td>
                            <td>
                              <input type="text" id="y_from" class="form-control" number-only>
                            </td>
                            <td>
                              <input type="text" id="y_to" class="form-control" number-only>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <button type="button" id="confirm_reprojection" class="btn btn-default">ยืนยัน</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-submenu mini-submenu-left pull-left">
      <i class="fa fa-list-alt"></i>
    </div>