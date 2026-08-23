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
}

export const CLOSING_CTA = `Please don't hesitate to reach out with any questions regarding our process.`

export const HOME_INTRO = `Generational storytelling is the closest thing we have to immortality. Being surrounded by family gives us the strength to move across the timeline of life with confidence. As the conduit for this practice, we are committed to creating an experience that honors your story and reminds us all of just how powerful the gathering of family can be.`

export const WHAT_WE_OFFER = `For over a decade we've dug up thousands of memories, creating a visual archive to be enjoyed and preserved for generations to come. The experience we facilitate will leave you not only with a tangible product, but more memories of togetherness to hold onto.`

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
    copy: "We'll work together to compile interview questions. This helps us establish which stories have visual aids (photos, videos, objects) so we can leave a list to help you find everything.",
  },
  {
    step: 'Digitization',
    copy: "We'll come collect your media to digitize, anything from 8mm reels to film. After we edit and organize them in chronological order, we'll compile additional questions to work into the interview.",
  },
  {
    step: 'Set Design',
    copy: 'Once the interview location is established, on the day of the interview we will rearrange furniture and objects (if permitted) to make a comfortable setting with optimal lighting for the subject to be interviewed.',
  },
  {
    step: 'Production',
    copy: "Our production crew will arrive one hour before the interview to establish the set, cameras, lights, audio and any other visual aids. The interview itself could take upwards of four hours. Once we've cycled through all the established questions, we'll film additional visual aids at the family's request.",
  },
  {
    step: 'Editing',
    copy: 'Within three to four weeks we will deliver the product with the accompanying visuals, the entire interview raw, and your digitized media. These deliverables vary based upon individual client request. Expect weekly updates on progress from our editing team.',
  },
  {
    step: 'Delivery',
    copy: 'We deliver the final product by hand on a hard drive and show the family how to access, share and view the videos. A cloud link with casting capabilities will also be available for a year after delivery.',
  },
]

export const AUDIO_INTRO = `Their story, in their voice. Audio is a more accessible way to preserve your family's history, recorded, edited, and set to your own photos and videos. We bring this kind of preservation to more families, without the full production of a documentary, so we can pass the savings on to you.`

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

export const GIVING_BACK_COPY = `When we started this project 10 years ago with our own family members we knew we had to share this practice with a broader community. As we continue to produce The Family Documentary Project, we want to ensure we touch as many lives as possible. The easiest way for us to accomplish this is by hosting a free pop-up every month at a partnering retirement community. For every project we book, we are able to host one free event and share this craft with more people every day.`

export const GIVING_BACK_CTA = `If you work at a facility that would benefit from this service, please reach out.`

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

export const MEDIA = {
  logoWide:
    'https://familydocumentaryproject.com/wp-content/uploads/2024/03/LARGE-TFDP-LOGO2-1024x494.png',
  logoLarge: 'https://familydocumentaryproject.com/wp-content/uploads/2024/03/LARGE-TFDP-LOGO.png',
  favicon:
    'https://familydocumentaryproject.com/wp-content/uploads/2024/03/LOGO_TFDP-transblack-300x300.png',
  homeHeroVideo:
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/NEW-NEW-web-SNIPPETS-.mp4',
  generationalClip:
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/GrandmamaShort_2.mp4',
  documentariesHeroVideo:
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/NEW-CORPORAL-JIMMY-ROYER.mp4',
  // Served from public/videos/ (local files, not hotlinked) — the page hides
  // each video section entirely if its file isn't present.
  documentariesNewHeroVideo: '/videos/documentary-hero.mp4',
  documentariesProcessVideo: '/videos/our-process.mp4',
  digitizingHeroVideo:
    'https://familydocumentaryproject.com/wp-content/uploads/2025/02/dancing-lessons.mp4',
  memorialVideoExample:
    'https://familydocumentaryproject.com/wp-content/uploads/2025/07/MEMORIAL-VIDEO-TEASER_SHORT_1.mp4',
  givingBackHeroVideo: '/videos/fading-fraternity.mp4',
  // Short looping example clips for the four "What We Offer" style cards.
  // Dropped into public/videos/ by hand — until a file exists at one of these
  // paths, Home falls back to a placeholder box for that card.
  styleSubjectCentered: '/videos/style-subject-centered.mp4',
  styleWithDigitizedMedia: '/videos/style-digitized-media.mp4',
  styleAudioKenBurns: '/videos/style-ken-burns.mp4',
  styleAudioTranscript: '/videos/style-transcript.mp4',
  homeGallery: [
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/FAM-MEMORIES-BROCHURE-3-1024x573.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-20.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-37-scaled.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-36-scaled.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-35-scaled.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-28.jpg',
  ],
  documentariesGallery: [
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-26.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-23.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-21-e1714508260658.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-22.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-10-scaled.jpg',
  ],
  digitizingGallery: [
    'https://familydocumentaryproject.com/wp-content/uploads/2025/02/JEAN-002.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2025/02/image000001.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2025/02/017.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2025/02/2025-02-08-12-14-0005.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2025/02/RONS_SLIDES-11-scaled.jpg',
  ],
  givingBackGallery: [
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-07-scaled.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-05-scaled-e1714508441910.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/FAM-MEMORIES-BROCHURE-1-scaled.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-18.jpg',
    'https://familydocumentaryproject.com/wp-content/uploads/2024/04/TFDP-WEBSITE-IMAGE-32-scaled.jpg',
  ],
}
