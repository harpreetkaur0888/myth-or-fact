import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const fontPath = join(
  process.cwd(),
  'scripts',
  'fonts',
  'Fraunces-SemiBold.ttf',
);
const fontBuffer = readFileSync(fontPath);

const svg = await satori(
  {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7F1E5',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Fraunces',
              fontWeight: 600,
              fontSize: 140,
              color: '#0F172A',
              lineHeight: 1,
            },
            children: 'Myth or Fact',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              width: 120,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#E76F51',
              marginTop: 48,
            },
          },
        },
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Fraunces',
        data: fontBuffer,
        weight: 600,
        style: 'normal',
      },
    ],
  },
);

const png = new Resvg(svg).render().asPng();
const out = join(process.cwd(), 'public', 'og-image.png');
writeFileSync(out, png);
console.log(`Wrote ${out} — ${png.length} bytes`);
