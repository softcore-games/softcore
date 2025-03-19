"use client";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params: { [key: string]: any }
    ) => void;
    dataLayer: any[];
  }
}

const googleAnalyticsId = "G-EWZ87Z62WL";

const AnalyticsContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_search: searchParams?.toString(),
      });
    }
  }, [pathname, searchParams]);

  return null;
};

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsContent />
      </Suspense>
    </>
  );
};

export default GoogleAnalytics;
