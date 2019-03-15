import { ContentError, URL } from '../../models/contentModels';
import {
  getPathFromGuardianURL,
  getReadingMaterialURL,
} from '../morningBriefingReadingMaterial';

import { Result } from '../../models/capiModels';

describe('Extract path from Guardian URL', () => {
  test('getPath should extract a path from a valid URL', () => {
    const result = getPathFromGuardianURL(
      'https://www.theguardian.com/commentisfree/2019/feb/13/dark-money-hard-brexit-targeted-ads-facebook'
    );
    expect(result).toEqual(
      '/commentisfree/2019/feb/13/dark-money-hard-brexit-targeted-ads-facebook'
    );
  });

  test('getPath should extract a path from a valid URL when there are query params', () => {
    const result = getPathFromGuardianURL(
      'https://www.theguardian.com/commentisfree/2019/feb/13/dark-money-hard-brexit-targeted-ads-facebook?param1=a&param2=b'
    );
    expect(result).toEqual(
      '/commentisfree/2019/feb/13/dark-money-hard-brexit-targeted-ads-facebook'
    );
  });

  test('getPath should return an empty string from a valid URL if there is no path', () => {
    const result = getPathFromGuardianURL('https://www.theguardian.com');
    expect(result).toEqual('');
  });
});

describe('Extract reading material URL from the Morning Briefing', () => {
  test('If the lunchtime read header cannot be found return ContentError object', () => {
    const input: Result = {
      webPublicationDate: '',
      type: '',
      sectionId: '',
      pillarId: '',
      webUrl: '',
      fields: {
        headline: '',
        standfirst: '',
        body: '',
        bodyText: '',
        trailText: '',
      },
      tags: [],
      blocks: {
        body: [
          {
            elements: [],
          },
        ],
      },
    };

    const expectedOutput = new ContentError('Could not extract URL');
    expect(getReadingMaterialURL(input)).toEqual(expectedOutput);
  });

  test('If a URL for the lunchtime read cannot be found return a ContentError object', () => {
    const input: Result = {
      webPublicationDate: '',
      type: '',
      sectionId: '',
      pillarId: '',
      webUrl: '',
      fields: {
        headline: '',
        standfirst: '',
        body: '',
        bodyText: '',
        trailText: '',
      },
      tags: [],
      blocks: {
        body: [
          {
            elements: [
              {
                type: 'text',
                textTypeData: {
                  html:
                    '<h2>Lunchtime read: Dark money and Brexit ads</h2> \n<p>“In Britain, we now know that the EU referendum was won with the help of widespread cheating,” writes George Monbiot today. “And now it’s happening again. Since mid-January an organisation called Britain’s Future has spent £125,000 on Facebook ads demanding a hard or no-deal Brexit. So who or what is Britain’s Future? Sorry, I have no idea – it has no published address and releases no information about who founded it, who controls it and who has been paying for these advertisements.</p>',
                },
              },
            ],
          },
        ],
      },
    };

    const expectedOutput = new ContentError('Could not extract URL');
    expect(getReadingMaterialURL(input)).toEqual(expectedOutput);
  });

  test('If the url of the lunchtime read can be found return a URL object.', () => {
    const input: Result = {
      webPublicationDate: '',
      type: '',
      sectionId: '',
      pillarId: '',
      webUrl: '',
      fields: {
        headline: '',
        standfirst: '',
        body: '',
        bodyText: '',
        trailText: '',
      },
      tags: [],
      blocks: {
        body: [
          {
            elements: [
              {
                type: 'text',
                textTypeData: {
                  html:
                    '<h2>Lunchtime read: Dark money and Brexit ads</h2> \n<p>“In Britain, we now know that the EU referendum was won with the help of widespread cheating,” writes George Monbiot today. “And now it’s happening again. Since mid-January an organisation called Britain’s Future has spent £125,000 on Facebook ads demanding a hard or no-deal Brexit. So who or what is Britain’s Future? Sorry, I have no idea – it has no published address and releases no information about who founded it, who controls it and who has been paying for these advertisements.</p><p>“The anti-Brexit campaigns People’s Vote and Best for Britain have also been spending heavily on Facebook ads. At least we know who is involved in these remain campaigns and where they are based, but both refuse to reveal their full sources of funding. So why won’t the government act? Partly because, regardless of the corrosive impacts on public life, it wants to keep the system as it is. The current rules favour the parties with the most money to spend, which tends to mean the parties that appeal to the rich. But mostly, I think, it’s because, like other governments, it has become institutionally incapable of responding to our emergencies. <a href="https://www.theguardian.com/commentisfree/2019/feb/13/dark-money-hard-brexit-targeted-ads-facebook">It won’t rescue democracy because it can’t</a>. The system in which it is embedded seems destined to escalate rather than dampen disasters.”</p>',
                },
              },
            ],
          },
        ],
      },
    };

    const expectedOutput = new URL(
      'https://www.theguardian.com/commentisfree/2019/feb/13/dark-money-hard-brexit-targeted-ads-facebook'
    );
    expect(getReadingMaterialURL(input)).toEqual(expectedOutput);
  });
});
