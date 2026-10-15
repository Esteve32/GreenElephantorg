# Purple Kauniainen brochure QR

Local candidate under DEC-AIL-097 and its printed-QR follow-up. Estève chose to
keep the existing brochure QR. Do not ask the replacement choice again. No live
campaign, brochure replacement or production tracking change has been performed.

## What was checked

The supplied `flyer-discussion-print-purple.png` QR was decoded locally with macOS
Core Image on 14 October 2026. Its payload is exactly
`https://www.greenelephant.org/`. No campaign marker is present. The visible printed
website text is not the decoding evidence. Existing printed copies cannot yield
a separate brochure-only count; ordinary homepage visits are indistinguishable.

## Selected approach — existing QR

Keep the exact printed address `https://www.greenelephant.org/` and the supplied
brochure image. The admin screen labels its possible measurement as **homepage
visits from mixed sources**, explains the limit and links to analytics setup/status.
No new homepage redirect/campaign, guessing from browser details or extra visitor
question is introduced.

The existing marketing tracker supports `/` page views after acceptance, only
when production collection and a valid measurement ID are enabled. Rejection,
missing consent, disabled configuration and local/private routes do not send events.
The `direct_or_unknown` bucket can include a QR open, typed address, bookmark or
other visit with no usable source. It cannot prove a brochure scan. The printed `www` homepage returns 308 to the bare-domain homepage. Read-only
checks of both public analytics-configuration endpoints returned the expected
schema, `enabled: false` and no exposed measurement ID. Collection is therefore
not active according to public configuration; no event delivery/property counts
were verified. The initial web-tool fetch was inaccessible. Before reporting results,
check the intended live analytics property/collection and use honest homepage labels.
This does not require replacing the brochure QR or changing its printed URL.

The previous candidate `/qr/kauniainen-four-days-purple-2026`, PNG/SVG assets and
`prepare-brochure-qr.ts` are retained as unused review material. No replacement
preset is offered for this brochure. A future separately identified campaign
requires its own explicit selection and active record. Do not present its test
count as traffic from the currently printed QR.

## Measurement and privacy boundaries

A counted GET is a **link open**, not proof of a camera scan, unique person,
location, enquiry or purchase. Repeats, shared URLs and unadvertised bots can count.
HEAD and advertised prefetch/prerender requests do not count. No IP, IP hash,
browser, referrer, device type, location, cookie or consent grant is collected by
the new counter. Each row uses the existing QR reference and database timestamp;
existing row IDs remain technical storage keys. No location-service request is
made. Hosting/security logs and separately consented GA4 are outside this counter.
Historical visitor fields are retained as history until separately reviewed/purged;
this change does not silently delete records or certify GDPR compliance.

The existing admin scan history/count/day views read these rows. Redirects use
302/no-store. Counter-write failure still reaches the validated destination;
read failure for this brochure goes to the homepage without a count. Missing or
inactive campaigns are not counted. The brochure fallback is also the homepage;
other missing/inactive QR slugs retain the portal fallback. All saved and legacy
targets are checked against exact GreenElephant hosts/internal paths, with external,
protocol-relative and recursive QR redirects rejected.

## Separate campaign links — only if selected for future work

1. Keep the current brochure QR. For a different future printed link, obtain the
   owner’s actual selection; the unused replacement draft is not selected.
2. Review the local website changes, privacy notice and retention arrangements.
   Keep provider and deployment gates separate. No new table/migration is needed;
   verify the existing QR tables/storage on the designated deployment target.
3. Use the normal reviewed GitHub/human Replit release process. Create/verify the
   active exact campaign record and `/` destination in the intended environment.
4. Verify the published route reaches the homepage and increments that campaign’s
   count, then test a real-size print before distributing it. A generated PNG
   decoding successfully does not verify production or the final printed brochure.

## Isolated preview

`node --import tsx scripts/preview-privacy-qr.ts 5184`

Loopback only: `/admin/ropa`, `/admin/qr-command-center`, and the local `/qr/…`
route. All owner/session/data/counts are fictional, with in-memory PGlite RoPA
storage and a fictional in-memory QR campaign. The session expires in 30 minutes;
restart to reset. Other API actions return 503. Never deploy this harness or start
the full app/schedulers for review. No provider transport or real account is used.
