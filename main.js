AppClass = function() {
    this.appData = {
        "records":[]
    };

    this.abreEdicao = function() {
        let viIndex = ($(this).attr("recordid") * 1);
        if ((viIndex >= 0) && (viIndex < appClass.appData.records.length)) {

            $("#edtID2").val(appClass.appData.records[viIndex].coinID);
            $("#edtQtd2").val(appClass.formatWith(appClass.appData.records[viIndex].coinQtd));
            $("#edtUnitC2").val(appClass.formatWith(appClass.appData.records[viIndex].coinUnitC));
            $("#edtTotalC2").val(appClass.formatWith(appClass.appData.records[viIndex].coinTotC));
            if (appClass.appData.records[viIndex].coinUnitV > 0) {
                $("#edtUnitV2").val(appClass.formatWith(appClass.appData.records[viIndex].coinUnitV));
                $("#edtTotalV2").val(appClass.formatWith(appClass.appData.records[viIndex].coinTotV));
                $("#edtRes2").val(appClass.formatWith(appClass.appData.records[viIndex].coinRes));
            } else {
                $("#edtUnitV2").val("");
                $("#edtTotalV2").val("");
                $("#edtRes2").val("");
            }

            $("#mainScreen").slideUp("fast",function(){
                $("#formScreen").slideDown("fast",function(){
                    if (appClass.appData.records[viIndex].coinUnitV > 0)
                        $("#edtID2").focus();
                    else
                        $("#edtUnitV2").focus();
                });
            });

        }
    }

    this.abreNovoRegistro = function() {
        $("#mainScreen").slideUp("fast",function(){
            $("#newScreen").slideDown("fast",function(){
                $("#edtID").focus();
            });
        });
    }

    this.calcEdtTotVenda = function() {
        let coinQtd   = ($("#edtQtd2").val() * 1);
        let coinUnitV = ($("#edtUnitV2").val() * 1);

        if ((coinQtd <= 0) || (coinUnitV <= 0)) {
            $("#edtTotalV2").val("");
            $("#edtRes2").val("");
            return;
        }

        $("#edtTotalV2").val(coinUnitV * coinQtd);
        $("#edtRes2").val($("#edtTotalV2").val() - $("#edtTotalC2").val());
    }

    this.calcNewTotCompra = function() {
        let coinQtd   = ($("#edtQtd").val() * 1);
        let coinUnitC = ($("#edtUnitC").val() * 1);

        if ((coinQtd <= 0) || (coinUnitC <= 0)) {
            $("#edtTotalC").val("");
            return;
        }

        $("#edtTotalC").val(coinUnitC * coinQtd);
    }

    this.cancelaNovoRegistro = function() {
        $("#newScreen").slideUp("fast",function(){
            $("#mainScreen").slideDown("fast");
        });
    }

    this.helloWorld = function() {
        console.log('--> AppClass.helloWorld()');
    }

    this.loadData = function() {
        let data = appPersistent.getStoredJSON("appData");
        if (data)
            appClass.appData = data;

        if (appClass.appData.records.length == 1)
            $("#lblLanctos").html("1 lançamento");
        else if (appClass.appData.records.length > 1)
            $("#lblLanctos").html(appClass.appData.records.length + " lançamentos");
        else
            $("#lblLanctos").html("Nenhum lançamento");

        $("#tableData").html("");
        if (appClass.appData.records.length) {
            for (var x=0; x < appClass.appData.records.length; x++) {
                var rec = appClass.appData.records[x];

                var fontColor = (rec.coinUnitV > 0) ? "#8888ff" : "#ff8888";

                var lineHTML = "<tr id='trRec"+x+"' recordid='"+x+"' style='color:"+fontColor+"'>";
                lineHTML += "<td>"+rec.coinID+"</td>";
                lineHTML += "<td>"+appClass.formatWith(rec.coinQtd)+"</td>";
                lineHTML += "<td>"+appClass.formatWith(rec.coinUnitC)+"</td>";
                lineHTML += "<td>"+appClass.formatWith(rec.coinTotC)+"</td>";
                if (rec.coinUnitV > 0) {
                    lineHTML += "<td>"+appClass.formatWith(rec.coinUnitV)+"</td>";
                    lineHTML += "<td>"+appClass.formatWith(rec.coinTotV)+"</td>";
                    lineHTML += "<td>"+appClass.formatWith(rec.coinRes)+"</td>";
                } else {
                    lineHTML += "<td></td>";
                    lineHTML += "<td></td>";
                    lineHTML += "<td></td>";
                }
                lineHTML += "</tr>";

                $("#tableData").append(lineHTML);
                $("#trRec"+x).click(appClass.abreEdicao);
            }
        }
    }

    this.novoRegistro = function(coinID, coinQtd, coinUnitC, coinTotalC) {
        let d = new Date();

        return {
            "coinYear": d.getFullYear(),
            "coinMonth": (d.getMonth()+1),
            "coinDay": d.getDate(),
            "coinID":coinID,
            "coinQtd":coinQtd,
            "coinUnitC":coinUnitC,
            "coinTotC":coinTotalC,
            "coinUnitV":0,
            "coinTotV":0,
            "coinRes": 0
        };
    }

    this.formatWith = function(viNumber, viPrecision) {
        if (typeof(viPrecision)=="undefined")
            viPrecision = 6;

        var strNumber = viNumber.toString();
        console.log('Str:'+strNumber);
        var vPos = strNumber.indexOf('.');
        console.log('vPos:'+vPos);
        if (vPos)
            return strNumber.substr(0,(vPos+viPrecision+1));
        return strNumber;
    }

    this.salvaNovoRegistro = function() {
        let coinID = $.trim($("#edtID").val());
        if (coinID=="") {
            alert('Informe ID da moeda');
            $("#edtID").focus();
            return;
        }

        let coinQtd   = ($("#edtQtd").val() * 1);
        if (coinQtd <= 0) {
            alert('Informe Quantidade');
            $("#edtQtd").focus();
            return;
        }

        let coinUnitC = ($("#edtUnitC").val() * 1);
        if (coinUnitC <= 0) {
            alert('Informe preço unitário de compra');
            $("#edtUnitC").focus();
            return;
        }

        let totalC   = (coinQtd * coinUnitC);
        let registro = appClass.novoRegistro(coinID, coinQtd, coinUnitC, totalC);

        appClass.appData.records.push(registro);

        appPersistent.storeJSONData("appData", appClass.appData);
        window.location.reload();
    }
}

appClass = new AppClass();

window.addEventListener("load", function(event) {

    console.log('==> [WINDOW.LOAD]');

    appClass.helloWorld(); /* Checa se appClass está funcionando... */

    /**
     * Inicialização do service worker (se o browser suportar)
     * e somente após a página estiver devidamente carregada.
     */
     if ('serviceWorker' in navigator) {

        console.log("==> [HAS.SERVICEWORKER]");
        navigator.serviceWorker.register('sw.js').then(() => { 
            console.log("==> [SERVICEWORKER.REGISTERED]");
        });

    } else {
        console.log("==> [NO.SERVICEWORKER]");
    }

    appClass.loadData();

    /* programa mostrar a tela principal depois do lading... */
    setTimeout(function(){

        console.log('==> [MAINSCREEN.SHOW]');
        $("#splashScreen").slideUp("normal",function(){
            $("#mainScreen").fadeIn("normal",function(){

                console.log('==> [MAINSCREEN.SHOWED]');

                $("#btnNovo").click(appClass.abreNovoRegistro);
                $("#btnCancNew").click(appClass.cancelaNovoRegistro);
                $("#btnSalvaNew").click(appClass.salvaNovoRegistro);
                $("#edtQtd").keyup(appClass.calcNewTotCompra);
                $("#edtUnitC").keyup(appClass.calcNewTotCompra);
                $("#edtUnitV2").keyup(appClass.calcEdtTotVenda);

            });
        });

    }, 500);

});