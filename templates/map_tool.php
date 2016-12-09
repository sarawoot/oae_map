    <!-- Toolbar Map -->
    <div id="mapToolbar" style="z-index:45;position:absolute;top:60px;right:50px">
      <button type="button" class="btn btn-default icon-sm" id="btnHomeMap">
        <span class="glyphicon glyphicon-home" data-type="tooltip" data-placement="bottom" title="Home"></span>
      </button>

      <button type="button" class="btn btn-default icon-sm" id="btnClearMap">
        <span class="glyphicon glyphicon-remove-circle" data-type="tooltip" data-placement="bottom" title="Clear Map"></span>
      </button>

      <button type="button" class="btn btn-default icon-sm active" id="btnPanMap">
        <span class="glyphicon icon-hand" data-type="tooltip" data-placement="bottom" title="Pan Mode"></span>
      </button>
      
      <button type="button" class="btn btn-default icon-sm" aria-haspopup="true" aria-expanded="false" id="btnInfoPOI" data-type="tooltip" data-placement="bottom" title="Info POI">
        <span class="glyphicon glyphicon-info-sign"></span></span>
      </button>

      <div class="btn-group" role="group">
        <button type="button" class="btn btn-default icon-sm" data-group="draw" category="Point" data-type="tooltip" data-placement="bottom" title="Draw Point">
          <span class="glyphicon icon-point"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" data-group="draw" category="LineString" data-type="tooltip" data-placement="bottom" title="Draw Line">
          <span class="glyphicon icon-line"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" data-group="draw" category="Polygon" data-type="tooltip" data-placement="bottom" title="Draw Polygon">
          <span class="glyphicon icon-polygon"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" data-group="draw" category="Circle" data-type="tooltip" data-placement="bottom" title="Draw Circle">
          <span class="glyphicon icon-circle"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" data-group="draw" category="Box" data-type="tooltip" data-placement="bottom" title="Draw Box">
          <span class="glyphicon icon-rectangle"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" data-group="draw" category="Square" data-type="tooltip" data-placement="bottom" title="Draw Square">
          <span class="glyphicon icon-square"></span>
        </button>
      </div>

      <div class="btn-group" role="group">
        <button type="button" class="btn btn-default icon-sm" data-group="measure" category="LineString" data-type="tooltip" data-placement="bottom" title="Measure Distance">
          <span class="glyphicon icon-measure-line"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" data-group="measure" category="Polygon" data-type="tooltip" data-placement="bottom" title="Measure Area">
          <span class="glyphicon icon-measure-area"></span>
        </button>
      </div>

      <div class="btn-group">
        <button type="button" class="btn btn-default dropdown-toggle icon-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="btnExport" data-type="tooltip" data-placement="bottom" title="Export">
          <span class="glyphicon glyphicon-download-alt"></span> <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li><a id="btnExportPNG" download="map.png">PNG</a></li>
          <li><a id="btnExportJPEG" download="map.jpg">JPEG</a></li>
          <li><a id="btnExportPDF" download="map.jpg">PDF</a></li>
        </ul>
      </div>

      <div class="btn-group" role="group">
        <button type="button" class="btn btn-default icon-sm" id="btnRemoveFeature" data-type="tooltip" data-placement="bottom" title="Remove Piece">
          <span class="glyphicon icon-remove"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" id="btnRemoveAllFeature" data-type="tooltip" data-placement="bottom" title="Remove All">
          <span class="glyphicon icon-remove-all"></span>
        </button>
      </div>

      <button type="button" class="btn btn-default icon-sm" id="btnBuffer" data-type="tooltip" data-placement="bottom" title="Buffer">
        <span class="glyphicon icon-buffer"></span>
      </button>

      <!-- id="btnIntersect" -->
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-default icon-sm" data-group="intersect" data-type="tooltip" data-placement="bottom" title="Intersect" category="Polygon">
        <span class="glyphicon icon-polygon2"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" data-group="intersect" category="Box" data-type="tooltip" data-placement="bottom" title="Intersect">
          <span class="glyphicon icon-rectangle"></span>
        </button>
        <button type="button" class="btn btn-default icon-sm" data-group="intersect" category="Square" data-type="tooltip" data-placement="bottom" title="Intersect">
          <span class="glyphicon icon-square"></span>
        </button>
      </div>

      <button type="button" class="btn btn-default icon-sm" id="btnSearch" data-type="tooltip" data-placement="bottom" title="Search">
        <span class="glyphicon glyphicon-search"></span>
      </button>

      <a href="report.php" type="button" class="btn btn-default icon-sm" data-type="tooltip" data-placement="bottom" title="Report">
        <span class="glyphicon glyphicon-list-alt"></span>
      </a>

      <button type="button" class="btn btn-default icon-sm" id="btnCofigDraw" data-type="tooltip" data-placement="bottom" title="Drawing Setting">
        <span class="glyphicon glyphicon-cog"></span>
      </button>

    </div>
    <?php if (!guest()) { ?>

    <div id="poiTool" style="z-index:45;position:absolute;top:120px;right:50px">
      
      <div class="btn-group">
        <button type="button" class="btn btn-default dropdown-toggle icon-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="btnPOI" data-type="tooltip" data-placement="bottom" title="Add POI">
          <span class="glyphicon glyphicon-plus"></span> <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li><a href="javascript:void(0)" id="btnAddPOI">Point</a></li>
          <li><a href="javascript:void(0)" id="btnAddPOIPhoto">รูปถ่าย</a></li>
        </ul>
      </div>


      <br>
      <button type="button" class="btn btn-default icon-sm" id="btnEditPOI" style="padding: 6px 12px;" data-type="tooltip" data-placement="bottom" title="Edit POI">
        <i class="glyphicon glyphicon-pencil"></i>
      </button><br>
      <!-- <button type="button" class="btn btn-default icon-sm" id="btnDeletePOI">
        <i class="glyphicon glyphicon-remove"></i>
      </button><br> -->
      <button type="button" class="btn btn-default icon-sm" id="btnConfirmPOI" style="display:none;padding: 6px 12px;">
        <i class="glyphicon glyphicon-ok"></i>
      </button>
    </div>

    <?php } ?>
    <!-- End Toolbar Map -->