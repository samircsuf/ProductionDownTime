var $ = window.jQuery;
$(document).ready(function(result, status){
        $.jqplot.config.enablePlugins = true;
        //var s1 = [2, 6, 7, 10];
        //var ticks = ['a', 'b', 'c', 'd'];
        var pdLine = [], dtCode = [], dtDuration = [], pdShift =[];

        for(var i = 0; i < result.length; i++) {
            if (i === 0){
                pdLine = result[i];
            }
            else if(i === 1){
                dtCode = result[i];
            }
            else if(i === 2){
                dtDuration = result[i];
            }
            else if(i === 3){
                pdShift = result[i];
            }
            else
                alert('Data pivots not defined yet');
        }

        plot1 = $.jqplot('myChart', [dtDuration], {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            animate: !$.jqplot.use_excanvas,
            seriesDefaults:{
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    dtCode: dtCode
                }
            },
            highlighter: { show: false }
        });

        $('#myChart').bind('jqplotDataClick',
            function (ev, seriesIndex, pointIndex, data) {
                $('#info1').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
            }
        );
    });
