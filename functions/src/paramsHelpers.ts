import { Locale } from './models/paramModels';

const getBooleanParam = (param: any): boolean => {
  if (typeof param === 'string') {
    return param.toLowerCase() === 'true' ? true : false;
  } else {
    return false;
  }
};

const getLocaleParam = (param: any): Locale => {
  const supportedLocales: { [key: string]: Locale } = {
    'en-AU': Locale.AU,
    'en-CA': Locale.US,
    'en-GB': Locale.GB,
    'en-IN': Locale.GB,
    'en-SG': Locale.GB,
    'en-US': Locale.US,
  };

  const locale: Locale = supportedLocales[param];
  return typeof locale === 'undefined' ? Locale.GB : locale;
};

export { getBooleanParam, getLocaleParam };
