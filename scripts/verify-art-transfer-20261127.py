from pathlib import Path
import hashlib,json,sys
root=Path(__file__).resolve().parent.parent
manifest=json.loads((root/'assets/visual/staging/2026-11-27/transfer-manifest.json').read_text())
errors=[]
for a in manifest['assets']:
 p=root/a['path']
 if not p.is_file(): errors.append('MISSING '+a['path']); continue
 if hashlib.sha256(p.read_bytes()).hexdigest()!=a['sha256']: errors.append('HASH MISMATCH '+a['path'])
print('Verified',len(manifest['assets'])-len(errors),'of',len(manifest['assets']),'art files')
for e in errors: print(e)
sys.exit(bool(errors))
