#!/usr/bin/env python3
"""Verify the supplied painted archive and install standing art and warm portraits.
Run from the repository root: python3 scripts/import-painted.py /path/to/pack.zip
Action candidates remain outside production pending contact/animation review.
"""
import argparse, hashlib, json, pathlib, re, zipfile

RESIDENTS = ('temple-keeper', 'master-yue', 'fortune-teller', 'auntie-mei', 'wang-laoban', 'grandma')

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('archive', type=pathlib.Path)
    p.add_argument('--root', type=pathlib.Path, default=pathlib.Path('.'))
    p.add_argument('--check-only', action='store_true')
    args = p.parse_args()
    prepared, invalid = {}, []
    runtime = {'version': 1, 'residents': {}}
    with zipfile.ZipFile(args.archive) as z:
        if len(z.namelist()) != len(set(z.namelist())):
            raise ValueError('Duplicate archive member')
        manifest = json.loads(z.read('painted-art-manifest.json'))
        if manifest.get('version') != 1:
            raise ValueError('Unknown archive manifest version')
        records = {}
        def visit(node):
            if not isinstance(node, dict):
                return
            if all(k in node for k in ('path', 'sha256', 'width', 'height')):
                path = node['path']
                if not re.fullmatch(r'assets/visual/painted/[a-z0-9-]+/(?:[a-z0-9-]+/)?[a-z0-9-]+\.webp', path):
                    raise ValueError('Unsafe artwork path: '+path)
                if path in records:
                    raise ValueError('Duplicate artwork: '+path)
                info = z.getinfo(path)
                if info.file_size > 2_000_000:
                    raise ValueError('Artwork too large: '+path)
                raw = z.read(path)
                if raw[:4] != b'RIFF' or raw[8:12] != b'WEBP' or hashlib.sha256(raw).hexdigest() != node['sha256']:
                    if '/poses/' in path:
                        invalid.append(path)
                        return
                    raise ValueError('Invalid artwork or checksum: '+path)
                if not all(type(node[k]) is int and 1 <= node[k] <= 2048 for k in ('width', 'height')):
                    raise ValueError('Invalid dimensions: '+path)
                records[path] = (node, raw)
                return
            for value in node.values():
                visit(value)
        visit(manifest['residents'])
        for key in RESIDENTS:
            resident = manifest['residents'][key]
            selected = {'standing': resident['standing'], 'warm': resident['expressions']['warm']}
            runtime['residents'][key] = {}
            for kind, record in selected.items():
                expected = f'assets/visual/painted/{key}/'+('standing.webp' if kind == 'standing' else 'expressions/warm.webp')
                if record['path'] != expected:
                    raise ValueError('Unexpected identity/path: '+expected)
                runtime['residents'][key][kind] = {k: record[k] for k in ('path', 'width', 'height', 'sha256')}
                prepared[expected] = records[expected][1]
    print(f'Verified {len(records)} archive artwork headers/checksums; {len(prepared)} standing and warm portrait files selected; {len(invalid)} invalid action candidates excluded.')
    for path in invalid:
        print('Excluded: '+path)
    if args.check_only:
        return
    root = args.root.resolve()
    for name, raw in prepared.items():
        path = (root/name).resolve()
        if not path.is_relative_to(root):
            raise ValueError('Artwork output escapes repository')
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(raw)
    output = root/'assets/visual/painted/runtime.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(runtime, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('Installed checked files and runtime manifest. Commit both together after visual review.')

if __name__ == '__main__':
    main()
