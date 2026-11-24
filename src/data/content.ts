export const BRAND = {
  name: 'the family documentary project',
  tagline: 'An ode to family',
  description: 'Keeping your family stories alive through documentary-style filmmaking.',
  mission: 'COMMITTED TO THE PRESERVATION OF MEMORIES.',
  email: 'info@familydocumentaryproject.com',
  phone: '804-432-4773',
  phoneHref: 'tel:+18044324773',
  contactPerson: 'Victoria',
  instagram: 'https://instagram.com/familydocumentaryproject',
  facebook: 'https://www.facebook.com/profile.php?id=61556057250683',
  tiktok: 'https://www.tiktok.com/@familydocumentaryproject',
  // Teaser page for the app, hosted separately from this site.
  appUrl: 'https://family-documentary.lovable.app/get',
}

export const CLOSING_CTA = `Please don't hesitate to reach out with any questions regarding our process.`

export const HOME_INTRO = `Generational storytelling is the closest thing we have to immortality. Being surrounded by family gives us the strength to move across the timeline of life with confidence. As the conduit for this practice, we are committed to creating an experience that honors your story and reminds us all of just how powerful the gathering of family can be.`

export const WHAT_WE_OFFER = `We come to you, sit down and go through your old photos and old media, then interview you as you take us through the vaults of your memory to piece together a documentary that tells the story of your life. For over a decade we've dug up thousands of memories, creating a visual archive to be enjoyed and preserved for generations to come. The experience we facilitate will leave you not only with a tangible product, but more memories of togetherness to hold onto.`

// Four varieties of the same core offering — a filmed or recorded interview,
// digitized media, or both, delivered as a documentary. videoKey points at a
// short looping example clip in MEDIA; leave that entry blank until a real
// clip is ready and the card will show a placeholder instead.
export const DOCUMENTARY_STYLES = [
  {
    id: 'subject_centered',
    name: 'Subject-Centered Interview',
    copy: "A filmed and edited, in-depth interview with your subject. No additional media, just their story in their own words. Expect a two-camera set up for one subject, and a three-camera set up for two subjects.",
    videoKey: 'styleSubjectCentered',
  },
  {
    id: 'subject_with_media',
    name: 'Subject Interview with Digitized Media',
    copy: "A filmed interview enhanced with your family's photos and videos, digitized and woven throughout. Expect a two-camera set up for one subject, and a three-camera set up for two subjects.",
    videoKey: 'styleWithDigitizedMedia',
  },
  {
    id: 'audio_ken_burns',
    name: 'Audio Interview with Ken Burns-Style Media Overlay',
    copy: 'An audio-only interview paired with panning, animated photos and video clips for a documentary look.',
    videoKey: 'styleAudioKenBurns',
  },
  {
    id: 'audio_transcript',
    name: 'Audio Interview with Transcript',
    copy: 'An audio-only interview delivered with a full written transcript.',
    videoKey: 'styleAudioTranscript',
  },
] as const

export const DOCUMENTARY_PROCESS = [
  {
    step: 'Preliminary Interview',
    copy: "We sit down together, on camera. This one is mostly for our own reference, so we can work out which stories have photographs, film or objects behind them and leave you a list of what to look for. It is also the least guarded conversation anyone has with us, and some of the rawest moments in the finished film come from it.",
  },
  {
    step: 'Research',
    copy: "Then we go and learn about them. We talk to the people around them, and we look at the photographs before we ever ask about them. If he served, we find out where and with whom. A general question gets a general answer. Asking about a particular winter, in the place he actually was, gets you the thing he has not said out loud in forty years.",
  },
  {
    step: 'Digitization',
    copy: "We come and collect your media, anything from 8mm reels to loose prints, and digitize it. Once it is organized in order, it always raises more questions, and those go into the interview too.",
  },
  {
    step: 'Set Design',
    copy: 'Once we know where the interview will happen, we arrive early and rearrange furniture and objects, with your permission, into a comfortable setting with proper light. The room should look like theirs and they should look like themselves.',
  },
  {
    step: 'Production',
    copy: "The crew arrives an hour ahead to set cameras, lights and sound. The interview itself can run upwards of four hours, with breaks whenever they want one. Some people want to sit and talk. Some need to be moving, walking the house, holding things. We follow their lead.",
  },
  {
    step: 'We Follow You',
    copy: "Over the following days we come back. First for the photographs that surfaced overnight, and then for everything the sitting-down part cannot show: the car in the garage, the kitchen, the writing desk, the trail they have walked for thirty years. A person is not only what they say about themselves, and we would rather film the whole of someone than an interview with them.",
  },
  {
    step: 'Editing',
    copy: 'Within three to four weeks we deliver the finished film with its visuals, the entire interview raw, and your digitized media. You will see a cut before it is final. Expect weekly updates from the editing team.',
  },
  {
    step: 'Delivery',
    copy: 'We deliver by hand, on a hard drive, and show the family how to access, share and watch it. A cloud link with casting is available for a year after delivery.',
  },
]

export const AUDIO_INTRO = `We all know what it is like to wish we could hear their voice one last time, wishing they could tell us their stories again and again. This service makes that a reality. We bring preservation to more families, without the full production of a documentary, so you don't have to wish you'd saved those voicemails.`

export const AUDIO_PROCESS = [
  {
    step: 'Book a Free Consult',
    copy: "Schedule a free phone or video consult, no payment required. We'll talk through your family's story and figure out if it's a good fit.",
  },
  {
    step: 'We Sit Down Together',
    copy: "We visit in person and mic everyone up, then sit with your family as you share stories and pass around photos and videos together.",
  },
  {
    step: 'We Digitize & Edit',
    copy: "Back in the studio, we digitize your media and craft a Ken Burns-style film, with your photos and videos layered over the recording of your loved one telling their story.",
  },
  {
    step: 'Delivery',
    copy: "Your finished keepsake film is delivered to you, ready to share and pass down for generations.",
  },
]

export const DIGITIZING_INTRO = `We help families bring together the cherished pieces that tell the story of their loved ones' lives. Preserving memories is our greatest passion, and one of the ways we do this is by digitizing photos and videos, to create a digital archive of your cherished memories.`

export const DIGITIZING_DIFFERENTIATOR = `We want to make sure your media is treated with the utmost care and respect, so we come directly to you rather than asking you to ship your materials to us.`

export const DIGITIZING_SERVICES = [
  {
    name: 'Organization',
    copy: "We assist you in gathering and organizing both physical and digital photos and videos, ensuring they're securely stored and preserved for a lifetime.",
  },
  {
    name: 'Digitization',
    copy: "Once all your photos, slides, film and home videos are collected, we'll digitize them into high-quality digital files and deliver them in neatly organized folders on a flash drive.",
  },
  {
    name: 'Output',
    copy: "We carefully select your favorite pieces of media and craft them into a meaningful video for you to share with your loved ones. We place the appropriate media overtop of your loved one's audio or video interview to paint the picture of their life.",
  },
]

export const OUR_WHY_TITLE = `I grew up surrounded by people worth listening to`

// First person throughout, on purpose. The rest of the site is "we"; this
// page is Victoria's own story and reads false in the plural.
export const OUR_WHY_BEFORE = [
  `I come from a very large family, which where I am from is not unusual. My father had eleven aunts and uncles, which left me with eleven great aunts and uncles of my own, more grandparents than I could keep straight, and great grandparents who were still around well into my childhood. I did not think of any of that as remarkable at the time. It was just Sunday.`,
  `When I went to college to study film, I made my senior thesis about World War II veterans and called it A Fading Fraternity. My grandfather is the reason. He served in the 82nd Airborne, 517th. I drove all over Virginia looking for men like him, and I asked them about their whole lives rather than only the war: who they were before it, what happened during it, and what they came home to be.`,
]

export const OUR_WHY_AFTER = [
  `Then some of those men started to pass away.`,
  `I had already given each family the finished film. What surprised me was what they asked for next. Several of them came back and said, do you still have the raw interview? The whole thing? Not the edited version. The hours of him just talking. They wanted his voice, uncut, to keep.`,
  `That is when it clicked. If those families needed that, so did mine. So I turned the camera on my own grandparents, my own great aunts and uncles, the people I had grown up around and somehow never thought to ask. Once I had done it for my family, other people started asking me to do it for theirs.`,
  `There is so much in the older generations that simply leaves when they do. I have watched that happen, and I have watched what it means to a family to have caught it in time. That is the whole of it. However grand or however small your story feels to you, it is worth keeping, and I would be glad to help you keep it.`,
]

export const GIVING_BACK_COPY = `Every month we host a free pop-up at a partnering community. Bring three to six photographs and we digitize them on the spot, then sit down and record you telling us the stories behind them. You keep the scans. Your family keeps the recording. There is no cost and nothing to sign up for on the day.`

export const GIVING_BACK_CTA = `If you help run a community that would benefit from this, please reach out and we will bring a pop-up to you.`

export const WHAT_TO_EXPECT = [
  {
    q: 'How long does the filming take?',
    a: 'The main interview can run up to four hours, with breaks whenever they want one. We never push someone past the point where they are enjoying it. If they are tired at ninety minutes, we stop at ninety minutes and come back.',
  },
  {
    q: 'How many visits is it?',
    a: 'More than one, and we do not charge by the visit. A sit-down, a follow-up for whatever surfaced overnight, a session to go through the media, and however many days it takes to film them doing the things they actually do.',
  },
  {
    q: 'What do I need to do to get ready?',
    a: 'Nothing, and please do not sort the photographs first. Half of what we find comes out of the boxes nobody organized. Leave them as they are and we will go through them together.',
  },
  {
    q: 'Does the house need to be tidy?',
    a: 'No. We pick the spot and light around whatever is there. A room that looks lived in is usually better than a room that looks staged.',
  },
  {
    q: 'What if they do not want to be on camera?',
    a: 'Then we do not use one. Plenty of people will talk freely into a microphone who freeze in front of a lens. An audio interview, set to their photographs, is every bit as much their story. We all know what it is like to wish we could hear a voice one more time.',
  },
  {
    q: 'What if they get tired, or it is an emotional day?',
    a: 'We stop. This is their afternoon, not our schedule. We have done this with people in hospice and people who cried through most of it, and the answer is always the same. We wait, or we come back.',
  },
  {
    q: 'How long until we see it?',
    a: 'Three to four weeks from the last visit, with weekly updates along the way. You see a cut before it is finished so you can tell us what to change.',
  },
  {
    q: 'What do we get at the end?',
    a: 'The finished film delivered by hand on a hard drive, the entire interview raw, and every photograph and video we scanned, organized, yours to keep. A cloud link with casting stays live for a year.',
  },
]

export const BOOKING_STATUSES = [
  'consult_scheduled',
  'payment_requested',
  'booked',
  'interview_completed',
  'media_received',
  'in_editing',
  'ready_for_review',
  'delivered',
] as const

export const BOOKING_STATUS_LABELS: Record<(typeof BOOKING_STATUSES)[number], string> = {
  consult_scheduled: 'Consult Scheduled',
  payment_requested: 'Payment Requested',
  booked: 'Booked',
  interview_completed: 'Interview Completed',
  media_received: 'Media Received',
  in_editing: 'In Editing',
  ready_for_review: 'Ready for Review',
  delivered: 'Delivered',
}

export const SERVICE_TYPE_LABELS: Record<'documentary' | 'guided_session' | 'audio', string> = {
  documentary: 'The Documentary (In-Person)',
  guided_session: 'Guided Session (Virtual, retired)',
  audio: 'Audio (In-Person)',
}

// YouTube video ids, not full URLs. Empty means "not supplied yet": every
// player falls back to a labelled placeholder, so the site builds and ships
// without them. Paste the id from a watch URL, the part after v=.
//
// These must be UNLISTED on YouTube, not Private. A private video cannot be
// embedded and shows "Video unavailable" to every visitor. Unlisted is
// viewable by anyone with the link, embeddable, and kept out of search and
// off the channel page.
export const YOUTUBE = {
  // Unlisted YouTube ids, not full URLs: the part after v= in a watch link.
  // A PRIVATE video cannot be embedded and shows "Video unavailable" to every
  // visitor. Unlisted is viewable by anyone with the link, embeddable, and
  // kept out of search and off the channel page.
  //
  // Empty renders a labelled placeholder, so the site ships without them.
  splashTeaser: 'iFzWdwkM3fc',      // Rembert, on the splash at /
  homeHero: 'iFzWdwkM3fc',          // Rembert again, top of the home page
  homeFeature: 'qogtFPn1XJo',       // Edward, further down the home page
  ourWhyFeature: 'Cm_YIx2KyQ0',     // Clara, on Our Why
  ourProcessFeature: 'O7-raGu7hvw', // Ola, on Our Process
  fadingFraternity: '',             // the senior thesis, on Our Why
}

export const MEDIA = {
  // Baba's teaser, shown on the splash. Drop the files in as
  // public/media/splash.mp4 and public/media/splash-poster.jpg.
  splashVideo: '',
  splashPoster: '/media/splash-poster.jpg',
  homeHeroVideo: '/videos/home-hero.mp4',
  generationalClip: '/videos/grandmama.mp4',
  // Only the Audio page reads this. The clip that used to sit here
  // (Corporal Jimmy Royer) lived on the old WordPress site and wasn't
  // among the recovered files, so it borrows the documentary hero for now.
  audioVideo: '/videos/documentary-hero.mp4',
  // Served from public/videos/ (local files, not hotlinked) — the page hides
  // each video section entirely if its file isn't present.
  documentariesNewHeroVideo: '/videos/documentary-hero.mp4',
  documentariesProcessVideo: '/videos/our-process.mp4',
  digitizingHeroVideo: '/videos/dancing-lessons.mp4',
  memorialVideoExample: '/videos/memorial-teaser.mp4',
  // The silenced 640x360 cut, made when this was a muted page background.
  // Not the version to show anyone: Our Why uses YOUTUBE.fadingFraternity.
  fadingFraternityBackground: '/videos/fading-fraternity.mp4',
  // Short looping example clips for the four "What We Offer" style cards.
  // Dropped into public/videos/ by hand — until a file exists at one of these
  // paths, Home falls back to a placeholder box for that card.
  styleSubjectCentered: '/videos/style-subject-centered.mp4',
  styleWithDigitizedMedia: '/videos/style-digitized-media.mp4',
  styleAudioKenBurns: '/videos/style-ken-burns.mp4',
  styleAudioTranscript: '/videos/style-transcript.mp4',
  // Still photograph, supplied by hand. Empty renders a placeholder.
  processSetupImage: '',
  homeGallery: [
    '/images/fam-memories-brochure-3.jpg',
    '/images/fam-memories-brochure-4.jpg',
    '/images/fam-memories-brochure-6.jpg',
    '/images/tfdp-louise.jpg',
    '/images/tfdp-pop-1.jpg',
    '/images/tfdp-pop.jpg',
    '/images/tfdp-website-image-01.jpg',
    '/images/tfdp-website-image-02.jpg',
    '/images/tfdp-website-image-03.jpg',
    '/images/tfdp-website-image-04.jpg',
    '/images/tfdp-website-image-05.jpg',
  ],
  documentariesGallery: [
    '/images/tfdp-website-image-06.jpg',
    '/images/tfdp-website-image-07.jpg',
    '/images/tfdp-website-image-08.jpg',
    '/images/tfdp-website-image-09.jpg',
    '/images/tfdp-website-image-10.jpg',
    '/images/tfdp-website-image-11.jpg',
    '/images/tfdp-website-image-12.jpg',
  ],
  digitizingGallery: [
    '/images/tfdp-website-image-13.jpg',
    '/images/tfdp-website-image-14.jpg',
    '/images/tfdp-website-image-15.jpg',
    '/images/tfdp-website-image-16.jpg',
    '/images/tfdp-website-image-17.jpg',
    '/images/tfdp-website-image-18.jpg',
    '/images/tfdp-website-image-19.jpg',
    '/images/tfdp-website-image-20.jpg',
    '/images/tfdp-website-image-21.jpg',
    '/images/tfdp-website-image-22.jpg',
    '/images/tfdp-website-image-23.jpg',
    '/images/tfdp-website-image-24.jpg',
    '/images/tfdp-website-image-25.jpg',
    '/images/tfdp-website-image-26.jpg',
  ],
  // Digitized archive pieces, cross-dissolving behind the Giving Back
  // sign-up: veterans, family portraits and documents, all visibly scanned.
  givingBackSlideshow: [
    '/images/tfdp-website-image-25.jpg',
    '/images/tfdp-website-image-21.jpg',
    '/images/tfdp-website-image-22.jpg',
    '/images/tfdp-website-image-20.jpg',
    '/images/tfdp-website-image-18.jpg',
    '/images/tfdp-pop-1.jpg',
    '/images/fam-memories-brochure-6.jpg',
    '/images/tfdp-website-image-04.jpg',
    '/images/tfdp-website-image-03.jpg',
    '/images/tfdp-website-image-11.jpg',
  ],
  givingBackGallery: [
    '/images/tfdp-website-image-27.jpg',
    '/images/tfdp-website-image-28.jpg',
    '/images/tfdp-website-image-29.jpg',
    '/images/tfdp-website-image-30.jpg',
    '/images/tfdp-website-image-31.jpg',
    '/images/tfdp-website-image-32.jpg',
    '/images/tfdp-website-image-33.jpg',
    '/images/tfdp-website-image-34.jpg',
    '/images/tfdp-website-image-35.jpg',
    '/images/tfdp-website-image-36.jpg',
    '/images/tfdp-website-image-37.jpg',
  ],
}
