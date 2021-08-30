/* NOME DO CACHE, PODE IR MUDANDO NAS VERSOES INSTALADAS */
var cacheName = 'x-avg1';
var OFFLINE_URL = '/willavg/offline.html';

/**
 * EVENTO QUE INSTALA OS ARQUIVOS DO APP NA MAQUINA
 */
self.addEventListener('install', (e) => {

  console.log('==> [SERVICEWORKER.INSTALL]');

  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    if (cache) {

        /**
            NENHUM ARQUIVO NESTA LISTA PODE FALTAR...
            PRECISA EXISTIR NA HOSPEDAGEM!
        */

        console.log('==> [INSTALL.CACHE.ADDALL]');

        /* VAMOS ADICIONAR SOMENTE OS FILES QUE PRECISAMOS PARA CONTROLAR */
        /* O FUNC. OFFLINE E AS LIBS PADRÃO QUE NÃO SE ALTERAM, COMO      */
        /* O BOOTSTRAP E O JQUERY, ALEM DE ALGUMAS IMAGENS                */
        await cache.addAll([
          '/willavg/bootstrap/js/bootstrap.min.js',
          '/willavg/jquery/jquery-1.12.4.min.js',
          '/willavg/bootstrap/css/bootstrap.min.css',
          '/willavg/bootstrap/css/bootstrap.min.css.map',
          '/willavg/bootstrap/fonts/glyphicons-halflings-regular.eot',
          '/willavg/bootstrap/fonts/glyphicons-halflings-regular.svg',
          '/willavg/bootstrap/fonts/glyphicons-halflings-regular.ttf',
          '/willavg/bootstrap/fonts/glyphicons-halflings-regular.woff',
          '/willavg/bootstrap/fonts/glyphicons-halflings-regular.woff2',
          '/willavg/css/segoe.css',
          '/willavg/css/Segoe-UI-Italic.woff',
          '/willavg/css/Segoe-UI.woff',
          '/willavg/css/Segoe-UI-Bold.woff',
          '/willavg/css/Segoe-UI-Bold-Italic.woff',
          '/willavg/img/favicon.ico',
          '/willavg/img/nocloud1.png',
          '/willavg/img/ic_launcher_48x48.png',
          '/willavg/img/ic_launcher_72x72.png',
          '/willavg/img/ic_launcher_96x96.png',
          '/willavg/img/ic_launcher_144x144.png',
          '/willavg/img/ic_launcher_192x192.png',
          '/willavg/img/apple-touch-icon.png',
          '/willavg/img/apple-touch-icon-57x57.png',
          '/willavg/img/apple-touch-icon-72x72.png',
          '/willavg/img/apple-touch-icon-76x76.png',
          '/willavg/img/apple-touch-icon-114x114.png',
          '/willavg/img/apple-touch-icon-120x120.png',
          '/willavg/img/apple-touch-icon-144x144.png',
          '/willavg/img/apple-touch-icon-152x152.png',
          '/willavg/img/apple-touch-icon-180x180.png',
          '/willavg/img/logo1.png',
          '/willavg/img/loading_blue.gif'
        ]);

        /* VAMOS ADICIONAR A OFFLINE PAGE NO MODO RELAD        */
        /* PARA PERMITIR SUA ATUALIZACAO QUANDO ESTIVER ONLINE */
        await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));

        console.log('==> [INSTALL.CACHE.OFFLINEPAGE]');

    } else {
      console.log('==> [INSTALL.CACHE.FAILTOOPEN]');
    }
    
  })());
});

/**
 * EVENTO QUE CARREGA OS ARQUIVOS DO CACHE E/OU
 * DA REDE (INTERNET)
 */
self.addEventListener('fetch', (e) => {

    console.log('==> [SERVICEWORKER.FETCH]');

    /* IGNORAMOS REQUISICOES NAO HTTPS */
    if(!(e.request.url.indexOf('https') === 0)){
        return;
    }

    /* CONTROLAMOS A RESPOSTA DA REQUISICAO */
    /* DEFININDO A RESPOSTA                 */
    e.respondWith((async () => {

        /* SE ESTIVER NAVEGANDO A UMA PAGINA... */
        if (e.request.mode === "navigate") {

            console.log(`==> [FETCH.NAVIGATE TO ${e.request.url}]`);

            /* TENTA BUSCAR NA INTERNET PRIMEIRO... */
            try {
                /* SE CONSEGUIR RETORNA O DADO DA NUVEM */
                const networkResponse = await fetch(e.request);
                return networkResponse;
            } catch(error) {

                console.log(`==> [FETCH.OFFLINE TO ${e.request.url}]`);

                /* NAO ACHOU, ENTAO APELA PARA A PAGINA OFFLINE DO CACHE */
                const cache = await caches.open(cacheName);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
            }

        } else {
            console.log(`==> [FETCH.OTHERS TO ${e.request.url}]`);

            /* OUTRAS REQUISICOES SAO TRATADAS BUSCANDO PRIMEIRO */
            /* O CACHE E DEPOIS A REDE                           */
            const r = await caches.match(e.request);
            if (r) {
                console.log(`==> [FETCH.CACHED ${e.request.url}]`);
                return r;
            }

            /* SE NAO ESTA CACHEADO, BUSCA NA REDE */
            const response = await fetch(e.request);

            /* NAO VAMOS ADD NO CACHE, PARA MANTER ATUALIZANDO */
            /* DA REDE SEMPRE ARQUIVOS NAO MAPEADOS            */
            //const cache = await caches.open(cacheName);
            //if (cache) {
            //    console.log(`==> [FETCH.PUT ${e.request.url}]`);
            //    cache.put(e.request, response.clone());
            //}

            return response;
        }

    })());

});