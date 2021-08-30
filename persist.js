/* 
    Rotinas para persistencia de alguns dados basicos do app 
    => appPersistent.classVersion()
    => appPersistent.getLastError()
    => appPersistent.storeJSONData(vsDataID, voData)
    => appPersistent.storeStringData(vsDataID, vsData)

    === version notes ===
    1.00 -> Método classVersion()
    2.00 -> Criei getLastError, storeJSONData, e storeStringData
*/

AppPersistent = function() {

    this.lastError = "";

    this.classVersion = function() {
        return "2.00";
    }

    this.getLastError = function() {
        return this.lastError;
    }

    /**
     * Obtém um pacote de dados JSON que estava armazenado no local storage
     * @param vsDataID ID do dado no localstorage
     * @return JSON dos dados ou false se falhar ou não existir
     */
    this.getStoredJSON = function(vsDataID) {
        try {
            myData = window.localStorage.getItem(vsDataID);

            if ((typeof(myData)=="string") && (myData!=""))
                return JSON.parse(myData);

            return false;
        } catch(e) {
            return false;
        }
    }

    /**
     * Armazena um JSON em forma de string no LocalStorage do Browser
     * @param {*} vsDataID  ID que identificará a informação para posterior recuperação
     * @param {*} voData Dados a serem salvos
     * @return FALSE se não conseguir gravar ou TRUE se gravou com sucesso
     */
    this.storeJSONData = function(vsDataID, voData) {

        /* Converte em String antes de salvar */
        vsData = JSON.stringify(voData);

        /* Salva a informação */
        return this.storeStringData(vsDataID, vsData);

    }

    /**
     * Armazena uma string no LocalStorage do Browser
     * @param vsDataID ID que identificará a informação para posterior recuperação
     * @param vsData Informação a ser salva
     */
    this.storeStringData = function(vsDataID, vsData) {

        /* Se não tem o localStorage, não tem como gravar... */
        if (!('localStorage' in window)) {
            this.lastError = "localStorage is not present";
            return false;
        }

        try {
            /* tenta gravar a informação */
            window.localStorage.setItem(vsDataID, vsData);
            return true;
        } catch (e) {
            this.lastError = e;
        }

        return false;        
    }

}
appPersistent = new AppPersistent();