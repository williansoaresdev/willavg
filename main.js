AppClass = function() {
    this.appData = [];

    this.abreNovoRegistro = function() {
        $("#mainScreen").slideUp("fast",function(){
            $("#newScreen").slideDown("fast",function(){
                $("#edtID").focus();
            });
        });
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
        
        if (appClass.appData.length == 1)
            $("#lblLanctos").html("1 lançamento");
        else if (appClass.appData.length > 1)
            $("#lblLanctos").html(appClass.appData.length + " lançamentos");
        else
            $("#lblLanctos").html("Nenhum lançamento");
    }

    this.novoRegistro = function(coinID, coinQtd, coinUnitC, coinTotalC) {
        let d = new Date();

        return {
            "coin-year": d.getFullYear(),
            "coin-month": (d.getMonth()+1),
            "coin-day": d.getDate(),
            "coin-id":coinID,
            "coin-qtd":coinQtd,
            "coin-unit-c":coinUnitC,
            "coin-total-c":coinTotalC,
            "coin-unit-v":0,
            "coin-total-v":0
        };
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

        let totalC = (coinQtd * coinUnitC);

        let registro = appClass.novoRegistro(coinID, coinQtd, coinUnitC, totalC);
        alert(JSON.stringify(registro));
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

            });
        });

    }, 2000);

});