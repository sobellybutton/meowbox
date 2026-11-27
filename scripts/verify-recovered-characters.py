import hashlib,json
from pathlib import Path
from PIL import Image
p=Path("assets/visual/staging/2026-11-26-recovered-characters/manifest.json")
m=json.loads(p.read_text())
for r in m["assets"]:
 f=Path(r["path"]);b=f.read_bytes();assert len(b)==r["bytes"] and hashlib.sha256(b).hexdigest()==r["sha256"],f
 im=Image.open(f);assert im.mode=="RGBA" and im.size==(r["width"],r["height"]),f
 box=im.getchannel("A").getbbox();assert box and box[0]>0 and box[1]>0 and box[2]<im.width and box[3]<im.height,f
print(f"Verified {len(m['assets'])} staged transparent character assets")
