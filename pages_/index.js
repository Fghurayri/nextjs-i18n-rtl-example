import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import DynamicNamespaces from "next-translate/DynamicNamespaces";
import Link from "next-translate/Link";
import i18nConfig from "../i18n.json";

const { allLanguages } = i18nConfig;

const CMS_URL = "https://graphql.datocms.com/";
const CMS_TOKEN = "e400c291eaf0668f34522553a48eea";
const GENERATE_FETCH_OPTIONS = (lang) => ({
  method: "POST",
  headers: {
    Authorization: `Bearer ${CMS_TOKEN}`,
  },
  body: JSON.stringify({
    query: `
    query Translations {
      cmsCommon(locale: ${lang}) {
        welcome
      }
    }
  `,
  }),
});

export default function Home() {
  const { t, lang } = useTranslation();
  return (
    <DynamicNamespaces
      dynamic={(lang) =>
        fetch(CMS_URL, GENERATE_FETCH_OPTIONS(lang))
          .then((r) => r.json())
          .then((r) => r.data.cmsCommon)
      }
      namespaces={["cms"]}
      fallback="Loading..."
    >
      <div dir="auto">
        <Trans i18nKey="cms:welcome" />
        <p>{t("home:heroText")}</p>
        <Link href="/about">{t(`common:pageTitles.about`)}</Link>
        {allLanguages.map((lng) =>
          lang === lng ? null : (
            <div key={lng}>
              <Link href="/" lang={lng}>
                {t(`common:lang-${lng}`)}
              </Link>
            </div>
          )
        )}
      </div>
    </DynamicNamespaces>
  );
}
