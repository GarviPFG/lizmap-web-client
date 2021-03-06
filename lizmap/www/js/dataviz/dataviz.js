var lizDataviz = function() {

    var dv = {
        'config' : null,
        'plots': []
    };

    function getPlots(){
        if(!dv.config.layers)
            return false;
        for( var i in dv.config.layers) {
            getPlot(
                dv.config.layers[i]
            );
        }
    }

    function getPlot(plot_config){
        var lparams = {
            'request': 'getPlot',
            'plot_id': plot_config.plot_id
        };
        $.getJSON(datavizConfig.url,
            lparams,
            function(json){
                if( 'errors' in json ){
                    console.log('Dataviz configuration error');
                    console.log(json.errors);
                    return false;
                }
                if( !json.data || json.data.length < 1)
                    return false;
                dv.plots.push(json);

                var html = '<h3><span class="title">';
                html+= '<span class="icon"></span>&nbsp;';
                html+= '<span class="text">'+plot_config.title+'</span>';
                html+= '</span></h3>';
                html+= '<div class="menu-content">';
                html+= '  <p>'+plot_config.abstract+'</p>';
                var dataviz_plot_id = 'dataviz_plot_' + plot_config.plot_id;
                html+= '  <div id="'+dataviz_plot_id+'"></div>';
                html+= '</div>';

                $('#dataviz-content').append(html);
                var plot = buildPlot(dataviz_plot_id, json);

            }
        );
    }

    function buildPlot(id, conf){
        Plotly.newPlot(id, conf.data, conf.layout);
        lizMap.events.on({
            dockopened: function(e) {
                if ( e.id == 'dataviz' ) {
                    resizePlot(id);
                }
            }
        });
        lizMap.events.on({
            rightdockopened: function(e) {
                if ( e.id == 'dataviz' ) {
                    resizePlot(id);
                }
            }
        });
        lizMap.events.on({
            bottomdockopened: function(e) {
                if ( e.id == 'dataviz' ) {
                    resizePlot(id);
                }
            }
        });
        $(window).resize(function() {
            if($('#mapmenu li.dataviz').hasClass('active')){
                resizePlot(id);
            }
        });
        $('#dataviz-waiter').hide();
    }

    function resizePlot(id){
        var d3 = Plotly.d3;
        var gd = d3.select('#'+id)
        .style({
            width: '100%',
            margin: '0px'
        });
        Plotly.Plots.resize(gd.node());
    }

    lizMap.events.on({
        'uicreated':function(evt){

            if( 'datavizLayers' in lizMap.config ){
                // Get config
                dv.config = lizMap.config.datavizLayers;

                // Build all plots
                getPlots();
            }

        }
    });


}();
