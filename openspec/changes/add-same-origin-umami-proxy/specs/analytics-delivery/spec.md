# Spec Delta

## Purpose

Defines how the website loads its analytics scripts and delivers interaction/recorder events to the analytics backend, and how the enforced Content-Security-Policy layers stay consistent with that delivery mode.

## ADDED Requirements

### Requirement: Same-origin analytics delivery
In production deployment mode, every page SHALL reference its analytics scripts (main tracker and session recorder) through same-origin URLs under the configured path prefix, with no absolute analytics origin appearing in the delivered HTML.

#### Scenario: Tracker script tag is same-origin
- **WHEN** a deployed production page is requested
- **THEN** the page HTML includes the tracker script via `<prefix>/script.js` on the site's own origin

#### Scenario: Recorder script is lazily loaded same-origin
- **WHEN** a production page that uses the recorder lazy-loader runs in the browser
- **THEN** the injected recorder script resolves to `<prefix>/recorder.js` on the site's own origin

### Requirement: Analytics upstream pass-through
The deployment edge SHALL forward any request under the analytics path prefix — asset requests and ingest requests (event beaconing and audio recording uploads) — to the configured analytics upstream, stripping only the prefix and preserving method and body.

#### Scenario: Event beacon reaches the backend
- **WHEN** the page posts an event to `<prefix>/api/send`
- **THEN** the request is proxied to the upstream's `/api/send` and the event is received (HTTP 2xx)

#### Scenario: Recorder upload passes through
- **WHEN** a recorded audio blob is uploaded through the recorder ingest endpoint under `<prefix>/`
- **THEN** the upload is forwarded intact to the upstream, including request bodies within the configured size limit

### Requirement: Single build-time analytics base
The analytics base URL SHALL be defined by one build-time configuration value used by both the script tags and the policy generation: an absolute URL selects cross-origin mode, a same-origin path prefix selects same-origin mode; when unset it defaults to cross-origin mode against the hosted cloud service.

#### Scenario: Local development default
- **WHEN** the site is built without the analytics base configured
- **THEN** script tags use the hosted cloud analytics origin (cross-origin mode)

#### Scenario: Production same-origin configuration
- **WHEN** the site is built with the analytics base set to the path prefix `/umami`
- **THEN** script tags and ingest requests use `<prefix>/...` on the site's own origin

### Requirement: CSP consistency across enforcement layers
The system SHALL enforce a Content-Security-Policy that permits analytics script loading and event ingestion for the active delivery mode, consistently in the meta layer and the HTTP header layer. In same-origin mode the analytics-related entries SHALL rely only on `'self'`, and changing the analytics upstream host SHALL require no CSP change in either layer.

#### Scenario: No violations in same-origin mode
- **WHEN** a production page loads with the same-origin prefix configured
- **THEN** neither the tracker script, the recorder script, nor event ingestion produces a CSP violation, in both the meta policy and the header policy

#### Scenario: Upstream host migration without policy edits
- **WHEN** the analytics upstream hostname changes and only the edge proxy configuration is updated
- **THEN** analytics continues to load and ingest without editing the CSP in the layout or the Caddyfile

### Requirement: Event taxonomy stability
Adopting same-origin delivery SHALL NOT change analytics event names, `data-umami-event` attributes, custom payload keys, or website identifiers, which automated tests and dashboard queries depend on.

#### Scenario: Test selectors remain valid
- **WHEN** the end-to-end suite runs against the same-origin delivery build
- **THEN** all `data-umami-event` selectors continue to resolve and recorded events keep the same names and properties
