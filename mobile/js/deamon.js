function initDeamon() {
  var rightPanel = '<ul data-role="listview" class="ui-icon-alt">';
  rightPanel += '<li><a id="bt_refreshDeamon" href="#"><i class="fa fa-refresh"></i> {{Rafraichir}}</a></li>';
    rightPanel += '<li><a class="ui-bottom-sheet-link ui-btn ui-btn-inline waves-effect waves-button" href="index.php?v=d"><i class="fa fa-desktop"></i> {{Version desktop}}</a></li>';
  rightPanel += '<li><a class="link ui-bottom-sheet-link ui-btn ui-btn-inline waves-effect waves-button" data-page="cron" data-title="{{Crons}}"><i class="fa fa-cogs" ></i> {{Crons}}</a></li>';
  rightPanel += '<li><a class="link ui-bottom-sheet-link ui-btn ui-btn-inline waves-effect waves-button" data-page="health" data-title="{{Santé}}"><i class="icon divers-caduceus3" ></i> {{Santé}}</a></li>';
  rightPanel += '<li><a class="link ui-bottom-sheet-link ui-btn ui-btn-inline waves-effect waves-button" data-page="alert" data-title="{{Alertes}}"><i class="icon nextdom-alerte" ></i> {{Alertes}}</a></li>';
  rightPanel += '</ul>';
  panel(rightPanel);
  getDeamonState();

  $('#bt_refreshDeamon').on('click',function(){
    getDeamonState();
  });

  function getDeamonState(){
    $('#table_deamon tbody').empty();
    nextdom.plugin.all({
      error: function (error) {
        notify("Erreur", error.message, 'error');
      },
      success: function (plugins) {
        for (var i in plugins) {
         if(plugins[i].hasOwnDeamon == 0){
          continue;
        }
        nextdom.plugin.getDeamonInfo({
          id : plugins[i].id,
          async:false,
          error: function (error) {
            notify("Erreur", error.message, 'error');
          },
          success: function (deamonInfo) {
            var html = '<tr>';
            html += '<td>';
            html += deamonInfo.plugin.name;
            html += '</td>';
            html += '<td>';
            html += deamonInfo.state;
            html += '</td>';
            html += '<td>';
            html += deamonInfo.last_launch;
            html += '</td>';
            html += '<td>';
            html += '<a class="bt_deamonAction ui-btn ui-mini ui-btn-inline ui-btn-raised clr-primary" data-action="start" data-plugin="'+deamonInfo.plugin.id+'"><i class="fa fa-play"></i></a> ';
            if(deamonInfo.auto == 0){
              html += '<a class="bt_deamonAction ui-btn ui-mini ui-btn-inline ui-btn-raised clr-warning" data-action="stop" data-plugin="'+deamonInfo.plugin.id+'"><i class="fa fa-stop"></i></a> ';
              html += '<a class="bt_deamonAction ui-btn ui-mini ui-btn-inline ui-btn-raised clr-primary" data-action="enableAuto" data-plugin="'+deamonInfo.plugin.id+'"><i class="fa fa-magic"></i></a> ';
            }else{
              html += '<a class="bt_deamonAction ui-btn ui-mini ui-btn-inline ui-btn-raised clr-warning" data-action="disableAuto" data-plugin="'+deamonInfo.plugin.id+'"><i class="fa fa-times"></i></a> ';
            }
            html += '</td>';
            html += '</tr>';
            $('#table_deamon tbody').append(html);
          }
        });
      }
    }
  });
  }

  $('#table_deamon tbody').on('click','.bt_deamonAction',function(){
    var plugin = $(this).data('plugin');
    var action = $(this).data('action');
    if(action == 'start'){
      nextdom.plugin.deamonStart({
        id : plugin,
        forceRestart : 1,
        error: function (error) {
          notify("Erreur", error.message, 'error');
        },
        success: function () {
         getDeamonState();
       }
     })
    }else if(action == 'stop'){
      nextdom.plugin.deamonStop({
        id : plugin,
        error: function (error) {
          notify("Erreur", error.message, 'error');
        },
        success: function () {
         getDeamonState();
       }
     })
    }else if(action == 'enableAuto'){
      nextdom.plugin.deamonChangeAutoMode({
        id : plugin,
        mode:1,
        error: function (error) {
          notify("Erreur", error.message, 'error');
        },
        success: function () {
         getDeamonState();
       }
     })
    }else if(action == 'disableAuto'){
      nextdom.plugin.deamonChangeAutoMode({
        id : plugin,
        mode:0,
        error: function (error) {
          notify("Erreur", error.message, 'error');
        },
        success: function () {
         getDeamonState();
       }
     })
    }
  });

}