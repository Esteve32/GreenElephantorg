/** Prepare a print asset only; creates no campaign and makes no network request. */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import QRCode from 'qrcode';
import { BROCHURE_QR, printedQrUrl } from '../shared/qr-campaign';
const output = process.argv[2];
if (!output) throw Error('Provide an output directory. This command writes local PNG/SVG files only.');
const directory = resolve(output), url = printedQrUrl(BROCHURE_QR.slug);
await mkdir(directory, { recursive: true });
await writeFile(join(directory, 'brochure-qr.svg'), await QRCode.toString(url, { type: 'svg', margin: 4, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } }));
await writeFile(join(directory, 'brochure-qr.png'), await QRCode.toBuffer(url, { type: 'png', width: 1200, margin: 4, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } }));
await writeFile(join(directory, 'README.txt'), `REPLACEMENT CANDIDATE — not activated or inserted into the brochure.\nAddress: ${url}\nDestination: homepage /\nCreate/verify the matching active campaign in QR Command Center before release.\nReplace the old QR only after owner review. Test the published route and a real-size print.\nKeep the white border. Counts are link opens, not unique people or proven camera scans.\nExisting printed copies keep their untagged homepage address.\n`);
console.log('Prepared local QR candidate at ' + directory + '; campaign activation and print replacement remain separate.');
