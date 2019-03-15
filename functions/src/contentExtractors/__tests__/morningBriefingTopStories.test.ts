import { Article, ContentError, TopStories } from '../../models/contentModels';

import { Result } from '../../models/capiModels';
import { getTopStoriesFromMorningBriefing } from '../morningBriefingTopStories';

describe('Extract top stories from the Morning Briefing', () => {
  test("If the top story in the Morning Briefing can't be extracted return a ContentError object", () => {
    const input: Result = {
      webPublicationDate: '',
      webUrl: '',
      sectionId: '',
      pillarId: '',
      type: '',
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

    const expectedOutput = new ContentError(
      'Could not build TopStories object for []'
    );

    expect(getTopStoriesFromMorningBriefing(input)).toEqual(expectedOutput);
  });

  test('If three stories cannot be extracted from the Morning Briefing return a ContentError object', () => {
    const input: Result = {
      webPublicationDate: '',
      webUrl: '',
      sectionId: '',
      pillarId: '',
      type: '',
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
                    '<h2>Top story: ‘Long extension if they don’t vote for deal’</h2> \n<p>Hello – Warren Murray presenting the news sifted and unbleached.</p> \n<p>Theresa May’s Brexit strategy may have been accidentally revealed after her chief negotiator, Olly Robbins, was overheard in a Brussels bar suggesting that MPs will be given a last-minute choice between <a href="https://www.theguardian.com/politics/2019/feb/12/theresa-mays-brexit-tactic-my-way-or-a-long-delay">voting for her deal or accepting a long extension to article 50</a>. According to ITV, Robbins said the government had “got to make them believe that the week beginning end of March … extension is possible, but if they don’t vote for the deal then the extension is a long one”.</p> \n<p>The tactic appears to be aimed at the European Research Group (ERG) faction of hard-Brexit Tories, who fear the EU exit could end up being cancelled altogether if MPs accept a delay or extension of the article 50 process. The leader of the House of Commons, Andrea Leadsom, refused to deny on Tuesday morning that the Commons could be denied a “meaningful vote” until after the next scheduled European council meeting, which is due to be held on 21 March. In the Commons, May has appealed to MPs for <a href="https://www.theguardian.com/politics/2019/feb/12/what-next-after-theresa-mays-appeal-for-more-time-on-brexit">more time to sort out the Irish border backstop</a>. If she does seek to delay until late March, May is likely to face a fierce backlash from MPs who believe every day of uncertainty increases the risks to jobs and businesses.</p> \n<h2>* * *</h2> \n<p><strong>Midweek catch-up</strong></p> \n<p>&gt; Britain’s foreign secretary has condemned an <a href="https://www.theguardian.com/us-news/2019/feb/12/jeremy-hunt-condemns-attack-bbc-cameraman-trump-rally">attack on the BBC cameraman </a>Ron Skeans at Donald Trump’s rally in El Paso. Trump was seen asking Skeans “Are you alright?” as the assailant was removed. Trump supporters regularly threaten the media.</p> \n<p>&gt; Trump meanwhile has grumbled that he is not “thrilled” with a deal struck to avoid another government shutdown. It provides $1.4bn for border barriers including <a href="https://www.theguardian.com/us-news/2019/feb/12/donald-trump-border-wall-deal-shutdown">55 miles of fencing</a>, built on existing designs such as metal slats, in the Rio Grande Valley of Texas.</p> \n<p>&gt; Gambling adverts are to be <a href="https://www.theguardian.com/media/2019/feb/13/gambling-adverts-banned-child-friendly-websites-games">banned from websites and computer games</a> that are popular with children. Bookmakers will also be required to stop using celebrities or other people who appear to be under 25 in their promotions.</p> \n<p>&gt; The Mexican cartel boss Joaquín “El Chapo” Guzmán has been found guilty of 10 counts of drug trafficking following a dramatic three-month trial in New York. Guzmán is to be sentenced on 25 June and is <a href="https://www.theguardian.com/world/2019/feb/12/el-chapo-mexican-drug-kingpin-guilty-drug-trafficking">expected to receive life without parole</a>.</p> \n<p>&gt; The Tate Modern has won a court case against residents of neighbouring luxury apartments who didn’t like <a href="https://www.theguardian.com/artanddesign/2019/feb/12/tate-modern-wins-privacy-case-brought-by-owners-of-4m-flats">patrons of the gallery being able to see in their windows</a>.</p> \n<h2>* * *</h2> \n<p><strong>‘It was hell’ – </strong>Thursday will mark one year since <a href="https://www.theguardian.com/us-news/2019/feb/13/parkland-florida-school-shooting-first-anniversary-service-love">17 people were shot and killed at the Marjory Stoneman Douglas high school</a> in Parkland, Florida. Vigils, moments of silence and an interfaith service are among events planned to commemorate the victims of America’s deadliest ever high school shooting. Students and their families will gather in the city’s largest park to remember their friends, and a clean-up will be held on the favourite beach of one of the victims, 14-year-old Alyssa Alhadeff. For Anthony Borges, 15, who survived terrible gunshot injuries but has been left debilitated, the priority is healing, trying to shake off the nightmares and <a href="https://www.theguardian.com/us-news/2019/feb/12/parkland-shooting-survivor-gun-control-activism">maybe one day get back on the soccer pitch</a>. “I feel free, you know? On the pitch all the stress, all the problems. They’re gone.”</p>',
                },
              },
            ],
          },
        ],
      },
    };

    const articlesJson = [
      {
        headline: '‘Long extension if they don’t vote for deal’.',
        standfirst:
          'Theresa May’s Brexit strategy may have been accidentally revealed after her chief negotiator, Olly Robbins, was overheard in a Brussels bar suggesting that MPs will be given a last-minute choice between voting for her deal or accepting a long extension to article 50.',
        source: '',
      },
      {
        headline: '‘It was hell’.',
        standfirst:
          'Thursday will mark one year since 17 people were shot and killed at the Marjory Stoneman Douglas high school in Parkland, Florida.',
        source: '',
      },
    ];

    const expectedOutput = new ContentError(
      `Could not build TopStories object for ${JSON.stringify(articlesJson)}`
    );

    expect(getTopStoriesFromMorningBriefing(input)).toEqual(expectedOutput);
  });

  test('If only the top story can be extracted from the Morning Briefing return a ContentError object', () => {
    const input: Result = {
      webPublicationDate: '',
      webUrl: '',
      sectionId: '',
      pillarId: '',
      type: '',
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
                    '<h2>Top story: ‘Long extension if they don’t vote for deal’</h2> \n<p>Hello – Warren Murray presenting the news sifted and unbleached.</p> \n<p>Theresa May’s Brexit strategy may have been accidentally revealed after her chief negotiator, Olly Robbins, was overheard in a Brussels bar suggesting that MPs will be given a last-minute choice between <a href="https://www.theguardian.com/politics/2019/feb/12/theresa-mays-brexit-tactic-my-way-or-a-long-delay">voting for her deal or accepting a long extension to article 50</a>. According to ITV, Robbins said the government had “got to make them believe that the week beginning end of March … extension is possible, but if they don’t vote for the deal then the extension is a long one”.</p> \n<p>The tactic appears to be aimed at the European Research Group (ERG) faction of hard-Brexit Tories, who fear the EU exit could end up being cancelled altogether if MPs accept a delay or extension of the article 50 process. The leader of the House of Commons, Andrea Leadsom, refused to deny on Tuesday morning that the Commons could be denied a “meaningful vote” until after the next scheduled European council meeting, which is due to be held on 21 March. In the Commons, May has appealed to MPs for <a href="https://www.theguardian.com/politics/2019/feb/12/what-next-after-theresa-mays-appeal-for-more-time-on-brexit">more time to sort out the Irish border backstop</a>. If she does seek to delay until late March, May is likely to face a fierce backlash from MPs who believe every day of uncertainty increases the risks to jobs and businesses.</p>',
                },
              },
            ],
          },
        ],
      },
    };

    const articlesJson = [
      {
        headline: '‘Long extension if they don’t vote for deal’.',
        standfirst:
          'Theresa May’s Brexit strategy may have been accidentally revealed after her chief negotiator, Olly Robbins, was overheard in a Brussels bar suggesting that MPs will be given a last-minute choice between voting for her deal or accepting a long extension to article 50.',
        source: '',
      },
    ];

    const expectedOutput = new ContentError(
      `Could not build TopStories object for ${JSON.stringify(articlesJson)}`
    );

    expect(getTopStoriesFromMorningBriefing(input)).toEqual(expectedOutput);
  });

  test('Midweek catch-up in Morning Briefing should be ignored', () => {
    const input: Result = {
      webPublicationDate: '',
      webUrl: '',
      sectionId: '',
      pillarId: '',
      type: '',
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
                    '<h2>Top story: ‘Long extension if they don’t vote for deal’</h2> \n<p>Hello – Warren Murray presenting the news sifted and unbleached.</p> \n<p>Theresa May’s Brexit strategy may have been accidentally revealed after her chief negotiator, Olly Robbins, was overheard in a Brussels bar suggesting that MPs will be given a last-minute choice between <a href="https://www.theguardian.com/politics/2019/feb/12/theresa-mays-brexit-tactic-my-way-or-a-long-delay">voting for her deal or accepting a long extension to article 50</a>. According to ITV, Robbins said the government had “got to make them believe that the week beginning end of March … extension is possible, but if they don’t vote for the deal then the extension is a long one”.</p> \n<p>The tactic appears to be aimed at the European Research Group (ERG) faction of hard-Brexit Tories, who fear the EU exit could end up being cancelled altogether if MPs accept a delay or extension of the article 50 process. The leader of the House of Commons, Andrea Leadsom, refused to deny on Tuesday morning that the Commons could be denied a “meaningful vote” until after the next scheduled European council meeting, which is due to be held on 21 March. In the Commons, May has appealed to MPs for <a href="https://www.theguardian.com/politics/2019/feb/12/what-next-after-theresa-mays-appeal-for-more-time-on-brexit">more time to sort out the Irish border backstop</a>. If she does seek to delay until late March, May is likely to face a fierce backlash from MPs who believe every day of uncertainty increases the risks to jobs and businesses.</p> \n<h2>* * *</h2> \n<p><strong>Midweek catch-up</strong></p> \n<p>&gt; Britain’s foreign secretary has condemned an <a href="https://www.theguardian.com/us-news/2019/feb/12/jeremy-hunt-condemns-attack-bbc-cameraman-trump-rally">attack on the BBC cameraman </a>Ron Skeans at Donald Trump’s rally in El Paso. Trump was seen asking Skeans “Are you alright?” as the assailant was removed. Trump supporters regularly threaten the media.</p> \n<p>&gt; Trump meanwhile has grumbled that he is not “thrilled” with a deal struck to avoid another government shutdown. It provides $1.4bn for border barriers including <a href="https://www.theguardian.com/us-news/2019/feb/12/donald-trump-border-wall-deal-shutdown">55 miles of fencing</a>, built on existing designs such as metal slats, in the Rio Grande Valley of Texas.</p> \n<p>&gt; Gambling adverts are to be <a href="https://www.theguardian.com/media/2019/feb/13/gambling-adverts-banned-child-friendly-websites-games">banned from websites and computer games</a> that are popular with children. Bookmakers will also be required to stop using celebrities or other people who appear to be under 25 in their promotions.</p> \n<p>&gt; The Mexican cartel boss Joaquín “El Chapo” Guzmán has been found guilty of 10 counts of drug trafficking following a dramatic three-month trial in New York. Guzmán is to be sentenced on 25 June and is <a href="https://www.theguardian.com/world/2019/feb/12/el-chapo-mexican-drug-kingpin-guilty-drug-trafficking">expected to receive life without parole</a>.</p> \n<p>&gt; The Tate Modern has won a court case against residents of neighbouring luxury apartments who didn’t like <a href="https://www.theguardian.com/artanddesign/2019/feb/12/tate-modern-wins-privacy-case-brought-by-owners-of-4m-flats">patrons of the gallery being able to see in their windows</a>.</p> \n<h2>* * *</h2> \n<p><strong>‘It was hell’ – </strong>Thursday will mark one year since <a href="https://www.theguardian.com/us-news/2019/feb/13/parkland-florida-school-shooting-first-anniversary-service-love">17 people were shot and killed at the Marjory Stoneman Douglas high school</a> in Parkland, Florida. Vigils, moments of silence and an interfaith service are among events planned to commemorate the victims of America’s deadliest ever high school shooting. Students and their families will gather in the city’s largest park to remember their friends, and a clean-up will be held on the favourite beach of one of the victims, 14-year-old Alyssa Alhadeff. For Anthony Borges, 15, who survived terrible gunshot injuries but has been left debilitated, the priority is healing, trying to shake off the nightmares and <a href="https://www.theguardian.com/us-news/2019/feb/12/parkland-shooting-survivor-gun-control-activism">maybe one day get back on the soccer pitch</a>. “I feel free, you know? On the pitch all the stress, all the problems. They’re gone.”</p> \n<h2>* * *</h2> \n<p><strong>Trouble for Trudeau – </strong>A minister in Justin Trudeau’s Canadian government has resigned amid allegations the prime minister’s office pressured her to avoid prosecuting a major engineering firm</p>',
                },
              },
              {
                type: 'text',
                textTypeData: {
                  html:
                    '<p>Jody Wilson-Raybould was demoted last month from the office of justice minister. The Globe and Mail reported that people in Trudeau’s office had tried to <a href="https://www.theguardian.com/world/2019/feb/12/canada-veterans-affairs-minister-jody-wilson-raybould-resigns">pressure Wilson-Raybould to help construction company SNC-Lavalin Group Inc avoid a corruption trial</a>. Canada’s independent ethics commissioner is investigating the affair. Opinion polls show Trudeau’s Liberals have a slender lead over the official opposition Conservatives ahead of an election set for this October.</p> \n<h2>* * *</h2> \n<p><strong>Frackers knocked back – </strong>The shale gas firm Cuadrilla has <a href="https://www.theguardian.com/environment/2019/feb/12/fracking-firm-cuadrilla-loses-planning-appeal-for-second-uk-site">lost its bid for approval</a> to frack at a second site in Lancashire. James Brokenshire, the communities secretary, said he turned down the appeal for planning permission in the Fylde area because of traffic impact around the Roseacre Wood site. Cuadrilla recently admitted commercial fracking in the UK is impossible under the government’s seismicity rules, after work was repeatedly paused at its existing Preston New Road site after triggering minor earthquakes. The government has said it has no plans to review the regulations.</p> \n<h2>* * *</h2> \n<p><strong>Drive away a great deal – </strong>The government of Papua New Guinea is <a href="https://www.theguardian.com/world/2019/feb/13/png-police-seek-return-of-almost-300-luxury-cars-missing-after-apec-summit">missing nearly 300 imported cars</a> provided for officials to use during the Apec regional summit. PNG police said nine were stolen, others were damaged or stripped of parts, and some disappeared into the jungle highlands. The government of the impoverished country notoriously imported 40 luxury Maserati Quattroporte sedans and three super-luxury Bentley Flying Spurs for the summit and says it at least knows where they are – “locked away in the old wharf shed down on the main wharf”.</p> \n<h2>Today in Focus podcast: What does Corbyn really think about Brexit?</h2> \n<p>Brexit has become a divisive issue for Jeremy Corbyn and the Labour party.</p>',
                },
              },
            ],
          },
        ],
      },
    };
    const expectedOutput = new TopStories(
      new Article(
        '‘Long extension if they don’t vote for deal’.',
        'Theresa May’s Brexit strategy may have been accidentally revealed after her chief negotiator, Olly Robbins, was overheard in a Brussels bar suggesting that MPs will be given a last-minute choice between voting for her deal or accepting a long extension to article 50.',
        ''
      ),
      new Article(
        '‘It was hell’.',
        'Thursday will mark one year since 17 people were shot and killed at the Marjory Stoneman Douglas high school in Parkland, Florida.',
        ''
      ),
      new Article(
        'Trouble for Trudeau.',
        'A minister in Justin Trudeau’s Canadian government has resigned amid allegations the prime minister’s office pressured her to avoid prosecuting a major engineering firm.',
        ''
      )
    );
    expect(getTopStoriesFromMorningBriefing(input)).toEqual(expectedOutput);
  });

  test('If stories can be extracted return TopStories object', () => {
    const input: Result = {
      webPublicationDate: '',
      webUrl: '',
      sectionId: '',
      pillarId: '',
      type: '',
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
                    '<h2>Top story: ‘Long extension if they don’t vote for deal’</h2> \n<p>Hello – Warren Murray presenting the news sifted and unbleached.</p> \n<p>Theresa May’s Brexit strategy may have been accidentally revealed after her chief negotiator, Olly Robbins, was overheard in a Brussels bar suggesting that MPs will be given a last-minute choice between <a href="https://www.theguardian.com/politics/2019/feb/12/theresa-mays-brexit-tactic-my-way-or-a-long-delay">voting for her deal or accepting a long extension to article 50</a>. According to ITV, Robbins said the government had “got to make them believe that the week beginning end of March … extension is possible, but if they don’t vote for the deal then the extension is a long one”.</p> \n<p>The tactic appears to be aimed at the European Research Group (ERG) faction of hard-Brexit Tories, who fear the EU exit could end up being cancelled altogether if MPs accept a delay or extension of the article 50 process. The leader of the House of Commons, Andrea Leadsom, refused to deny on Tuesday morning that the Commons could be denied a “meaningful vote” until after the next scheduled European council meeting, which is due to be held on 21 March. In the Commons, May has appealed to MPs for <a href="https://www.theguardian.com/politics/2019/feb/12/what-next-after-theresa-mays-appeal-for-more-time-on-brexit">more time to sort out the Irish border backstop</a>. If she does seek to delay until late March, May is likely to face a fierce backlash from MPs who believe every day of uncertainty increases the risks to jobs and businesses.</p> \n<h2>* * *</h2> \n<p><strong>Midweek catch-up</strong></p> \n<p>&gt; Britain’s foreign secretary has condemned an <a href="https://www.theguardian.com/us-news/2019/feb/12/jeremy-hunt-condemns-attack-bbc-cameraman-trump-rally">attack on the BBC cameraman </a>Ron Skeans at Donald Trump’s rally in El Paso. Trump was seen asking Skeans “Are you alright?” as the assailant was removed. Trump supporters regularly threaten the media.</p> \n<p>&gt; Trump meanwhile has grumbled that he is not “thrilled” with a deal struck to avoid another government shutdown. It provides $1.4bn for border barriers including <a href="https://www.theguardian.com/us-news/2019/feb/12/donald-trump-border-wall-deal-shutdown">55 miles of fencing</a>, built on existing designs such as metal slats, in the Rio Grande Valley of Texas.</p> \n<p>&gt; Gambling adverts are to be <a href="https://www.theguardian.com/media/2019/feb/13/gambling-adverts-banned-child-friendly-websites-games">banned from websites and computer games</a> that are popular with children. Bookmakers will also be required to stop using celebrities or other people who appear to be under 25 in their promotions.</p> \n<p>&gt; The Mexican cartel boss Joaquín “El Chapo” Guzmán has been found guilty of 10 counts of drug trafficking following a dramatic three-month trial in New York. Guzmán is to be sentenced on 25 June and is <a href="https://www.theguardian.com/world/2019/feb/12/el-chapo-mexican-drug-kingpin-guilty-drug-trafficking">expected to receive life without parole</a>.</p> \n<p>&gt; The Tate Modern has won a court case against residents of neighbouring luxury apartments who didn’t like <a href="https://www.theguardian.com/artanddesign/2019/feb/12/tate-modern-wins-privacy-case-brought-by-owners-of-4m-flats">patrons of the gallery being able to see in their windows</a>.</p> \n<h2>* * *</h2> \n<p><strong>‘It was hell’ – </strong>Thursday will mark one year since <a href="https://www.theguardian.com/us-news/2019/feb/13/parkland-florida-school-shooting-first-anniversary-service-love">17 people were shot and killed at the Marjory Stoneman Douglas high school</a> in Parkland, Florida. Vigils, moments of silence and an interfaith service are among events planned to commemorate the victims of America’s deadliest ever high school shooting. Students and their families will gather in the city’s largest park to remember their friends, and a clean-up will be held on the favourite beach of one of the victims, 14-year-old Alyssa Alhadeff. For Anthony Borges, 15, who survived terrible gunshot injuries but has been left debilitated, the priority is healing, trying to shake off the nightmares and <a href="https://www.theguardian.com/us-news/2019/feb/12/parkland-shooting-survivor-gun-control-activism">maybe one day get back on the soccer pitch</a>. “I feel free, you know? On the pitch all the stress, all the problems. They’re gone.”</p> \n<h2>* * *</h2> \n<p><strong>Trouble for Trudeau – </strong>A minister in Justin Trudeau’s Canadian government has resigned amid allegations the prime minister’s office pressured her to avoid prosecuting a major engineering firm</p>',
                },
              },
              {
                type: 'text',
                textTypeData: {
                  html:
                    '<p>Jody Wilson-Raybould was demoted last month from the office of justice minister. The Globe and Mail reported that people in Trudeau’s office had tried to <a href="https://www.theguardian.com/world/2019/feb/12/canada-veterans-affairs-minister-jody-wilson-raybould-resigns">pressure Wilson-Raybould to help construction company SNC-Lavalin Group Inc avoid a corruption trial</a>. Canada’s independent ethics commissioner is investigating the affair. Opinion polls show Trudeau’s Liberals have a slender lead over the official opposition Conservatives ahead of an election set for this October.</p> \n<h2>* * *</h2> \n<p><strong>Frackers knocked back – </strong>The shale gas firm Cuadrilla has <a href="https://www.theguardian.com/environment/2019/feb/12/fracking-firm-cuadrilla-loses-planning-appeal-for-second-uk-site">lost its bid for approval</a> to frack at a second site in Lancashire. James Brokenshire, the communities secretary, said he turned down the appeal for planning permission in the Fylde area because of traffic impact around the Roseacre Wood site. Cuadrilla recently admitted commercial fracking in the UK is impossible under the government’s seismicity rules, after work was repeatedly paused at its existing Preston New Road site after triggering minor earthquakes. The government has said it has no plans to review the regulations.</p> \n<h2>* * *</h2> \n<p><strong>Drive away a great deal – </strong>The government of Papua New Guinea is <a href="https://www.theguardian.com/world/2019/feb/13/png-police-seek-return-of-almost-300-luxury-cars-missing-after-apec-summit">missing nearly 300 imported cars</a> provided for officials to use during the Apec regional summit. PNG police said nine were stolen, others were damaged or stripped of parts, and some disappeared into the jungle highlands. The government of the impoverished country notoriously imported 40 luxury Maserati Quattroporte sedans and three super-luxury Bentley Flying Spurs for the summit and says it at least knows where they are – “locked away in the old wharf shed down on the main wharf”.</p> \n<h2>Today in Focus podcast: What does Corbyn really think about Brexit?</h2> \n<p>Brexit has become a divisive issue for Jeremy Corbyn and the Labour party.</p>',
                },
              },
              {
                type: 'text',
                textTypeData: {
                  html:
                    '<p>Heather Stewart charts <a href="https://www.theguardian.com/news/audio/2019/feb/13/what-does-jeremy-corbyn-really-think-about-brexit-podcast">Corbyn’s changing relationship with the EU</a>. And Lois Beckett looks at the March for our Lives movement, a year after the Parkland shootings.</p> \n<h2>Lunchtime read: Dark money and Brexit ads</h2> \n<p>“In Britain, we now know that the EU referendum was won with the help of widespread cheating,” writes George Monbiot today. “And now it’s happening again. Since mid-January an organisation called Britain’s Future has spent £125,000 on Facebook ads demanding a hard or no-deal Brexit. So who or what is Britain’s Future? Sorry, I have no idea – it has no published address and releases no information about who founded it, who controls it and who has been paying for these advertisements.</p>',
                },
              },
              {
                type: 'text',
                textTypeData: {
                  html:
                    '<p>“The anti-Brexit campaigns People’s Vote and Best for Britain have also been spending heavily on Facebook ads. At least we know who is involved in these remain campaigns and where they are based, but both refuse to reveal their full sources of funding. So why won’t the government act? Partly because, regardless of the corrosive impacts on public life, it wants to keep the system as it is. The current rules favour the parties with the most money to spend, which tends to mean the parties that appeal to the rich. But mostly, I think, it’s because, like other governments, it has become institutionally incapable of responding to our emergencies. <a href="https://www.theguardian.com/commentisfree/2019/feb/13/dark-money-hard-brexit-targeted-ads-facebook">It won’t rescue democracy because it can’t</a>. The system in which it is embedded seems destined to escalate rather than dampen disasters.”</p> \n<h2>Sport</h2> \n<p>Ole Gunnar Solskjær said Manchester United <a href="https://www.theguardian.com/football/2019/feb/13/ole-gunnar-solskjaer-manchester-united-pick-up-spirits">cannot afford to feel sorry for themselves</a> after Paris Saint-Germain inflicted a <a href="https://www.theguardian.com/football/2019/feb/12/manchester-united-psg-champions-league-match-report" title="">first defeat </a>of his caretaker tenure on a night when Kylian Mbappé showed off <a href="https://www.theguardian.com/football/blog/2019/feb/12/kylian-mbappe-teleportation-device-manchester-united-floundering">his repertoire of speed and skill</a>. Joe Root says he stands by <a href="https://www.theguardian.com/sport/2019/feb/12/joe-root-praised-response-alleged-homophobic-abuse-england-west-indies-shannon-gabriel">what he said to Shannon Gabriel</a> and felt obliged to uphold his responsibilities after the West Indies fast bowler <a href="https://www.theguardian.com/sport/2019/feb/12/icc-report-joe-root-shannon-gabriel-england-west-indies">was charged for using abusive language</a> following <a href="https://www.theguardian.com/sport/2019/feb/12/england-win-roston-chase-ton-west-indies">England’s consolation win in the third Test</a>. Mako Vunipola has been <a href="https://www.theguardian.com/sport/2019/feb/12/england-mako-vunipola-six-nations-ankle-injury-rugby-union">ruled out of England’s final three Six Nations matches</a> after suffering ankle ligament damage <a href="https://www.theguardian.com/sport/2019/feb/10/england-france-six-nations-2019-match-report-rugby" title="">against France on Sunday</a>.</p> \n<p><a href="https://www.theguardian.com/football/2019/feb/12/gordon-banks-dies-world-cup-winner-england-1966-goalkeeper">Tributes continue to flow</a> for Gordon Banks, <a href="https://www.theguardian.com/football/2019/feb/12/gordon-banks-ideal-goalkeeper-age-died-81">once the best goalkeeper in the world</a>, who has died at the age of 81. And <a href="https://www.theguardian.com/sport/blog/2019/feb/12/grand-national-weights-bristol-de-mai-aintree">Ballyoptic looks the best long-range pick</a> for the Grand National, given stamina is everything in the famous Aintree contest since the fences were softened.</p> \n<h2>Business</h2> \n<p>Asian shares were mostly higher after Donald Trump said he might let a 2 March deadline slide in trade talks with China if the two countries get close to a deal. Sterling has been trading at $1.291 and €1.138 overnight while the FTSE is forecast to open higher.</p> \n<h2>The papers</h2> \n<p>Several newspapers carry pictures of Gordon Banks on their front pages. His death is the lead story for the <strong>Mirror</strong>: “The hero who could fly” and the <strong>Sun:</strong> “He had the whole world in his hands”.</p>',
                },
              },
            ],
          },
        ],
      },
    };
    const expectedOutput = new TopStories(
      new Article(
        '‘Long extension if they don’t vote for deal’.',
        'Theresa May’s Brexit strategy may have been accidentally revealed after her chief negotiator, Olly Robbins, was overheard in a Brussels bar suggesting that MPs will be given a last-minute choice between voting for her deal or accepting a long extension to article 50.',
        ''
      ),
      new Article(
        '‘It was hell’.',
        'Thursday will mark one year since 17 people were shot and killed at the Marjory Stoneman Douglas high school in Parkland, Florida.',
        ''
      ),
      new Article(
        'Trouble for Trudeau.',
        'A minister in Justin Trudeau’s Canadian government has resigned amid allegations the prime minister’s office pressured her to avoid prosecuting a major engineering firm.',
        ''
      )
    );
    expect(getTopStoriesFromMorningBriefing(input)).toEqual(expectedOutput);
  });
});
