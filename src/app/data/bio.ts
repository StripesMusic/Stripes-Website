// The press bio, for promoters and blogs, in the third person as it was written. The About page
// shows it with a copy button, and the homepage's About section shows it as is.
export const pressBio = [
  "In 2025, Stripes won BUTTER and Andrew A's Ghost Of You remix contest with a DnB spin alongside E2D2, earning Tomorrowland support from Andrew A, with additional DJ support from well-known names like Toxic Wraith.",
  "Stripes is a US-based electronic music producer who draws on his background as an intense drummer since the age of four. Having honed his production skills through classes at Berklee College of Music and drawing inspiration from influential artists such as Brooks and RudeLies, he has been forging an unmistakable creative identity.",
  "On the side, Stripes works for three record labels, managing releases, overseeing A&R, and designing cover artwork. His music has passed 220,000 streams combined, and he has worked with artists from 22 countries. He has another release coming soon and is a promising talent to watch!",
];

const sp = (id: string) => `https://open.spotify.com/artist/${id}`;
// names in the bio that link to the artist, wherever the bio is shown with links
export const bioLinks: Record<string, string> = {
  BUTTER: sp("5SOSqzQyhsHTTuxAMGPkaO"),
  "Andrew A": sp("01BNEFdzawMyAXoHVdtyPx"),
  E2D2: sp("4pYWodVn2BToKzPRDXPxPX"),
  "Toxic Wraith": sp("7IzlaNBh2EWdsR6xIOp9Bb"),
  Brooks: sp("4mHAu7NX2UNsnGXjviBD9e"),
  RudeLies: sp("7hf6L4LN1RTVN66IdBVpPr"),
};
