import useTranslation from "next-translate/useTranslation";
import Link from "next-translate/Link";
import i18nConfig from "../i18n.json";
import DynamicNamespaces from "next-translate/DynamicNamespaces";

const { allLanguages } = i18nConfig;

const rtlLangs = ["ar"];
const getDirFromLang = (lang) => (rtlLangs.includes(lang) ? "rtl" : "ltr");

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

export default function About({ translations }) {
  const { t, lang } = useTranslation();
  return (
    <DynamicNamespaces dynamic={() => translations} namespaces={["cms"]}>
      <div dir={getDirFromLang(lang)}>
        <p>{t("common:welcome")}</p>
        <p>{t("about:age", { ageValue: 32 })}</p>
        <Link href="/">{t(`common:pageTitles.home`)}</Link>
        {allLanguages.map((lng) =>
          lang === lng ? null : (
            <div key={lng}>
              <Link href="/about" lang={lng}>
                {t(`common:lang-${lng}`)}
              </Link>
            </div>
          )
        )}
      </div>
    </DynamicNamespaces>
  );
}

export async function getServerSideProps({ lang }) {
  const resp = await fetch(CMS_URL, GENERATE_FETCH_OPTIONS(lang));
  const data = await resp.json();

  return {
    props: {
      translations: data.data.cmsCommon,
    },
  };
}
