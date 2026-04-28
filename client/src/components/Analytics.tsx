import { Helmet } from "react-helmet-async";

interface AnalyticsProps {
  googleAnalyticsId?: string;
  yandexMetricaId?: string;
}

export function Analytics({ googleAnalyticsId, yandexMetricaId }: AnalyticsProps) {
  return (
    <Helmet>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
      )}
      {googleAnalyticsId && (
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </script>
      )}

      {/* Yandex Metrica */}
      {yandexMetricaId && (
        <script type="text/javascript">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${yandexMetricaId}, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
            });
          `}
        </script>
      )}
      {yandexMetricaId && (
        <noscript>
          {`<div><img src="https://mc.yandex.ru/watch/${yandexMetricaId}" style="position:absolute; left:-9999px;" alt="" /></div>`}
        </noscript>
      )}
    </Helmet>
  );
}
