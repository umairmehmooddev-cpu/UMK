import JSZip from 'jszip';
import type {DigitalPack} from './packTypes';

export async function downloadPackZip(pack: DigitalPack): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(pack.slug) ?? zip;

  for (const file of pack.files) {
    folder.file(file.name, file.content);
  }

  folder.file(
    'LISTING.txt',
    [
      `Product: ${pack.productName}`,
      `Price: $${pack.price}`,
      '',
      'Etsy title:',
      pack.etsyTitle,
      '',
      'Gumroad title:',
      pack.gumroadTitle,
      '',
      'Tags:',
      pack.tags.join(', '),
      '',
      'Pitch:',
      pack.shortPitch,
    ].join('\n'),
  );

  const blob = await zip.generateAsync({type: 'blob'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pack.slug}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
