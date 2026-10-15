/** Same form and email journey. References identify an order, never a person. */
export type ScanTypeformReference = { field: string; value: string };

export function validScanReferenceField(field: unknown): field is string {
  return typeof field === 'string' && /^[a-z][a-z0-9_]{0,63}$/.test(field)
    && field !== 'language' && field !== 'lang';
}

export function scanTypeformLink(language: 'en' | 'fr', reference?: ScanTypeformReference) {
  if (language !== 'en' && language !== 'fr') throw new Error('invalid_scan_link');
  const parameters = new URLSearchParams({ language });
  if (reference) {
    if (!validScanReferenceField(reference.field) || !/^[A-Za-z0-9_-]{43}$/.test(reference.value)) {
      throw new Error('invalid_scan_link');
    }
    parameters.set(reference.field, reference.value);
  }
  return 'https://greenelephantorg.typeform.com/individualscan#' + parameters;
}
