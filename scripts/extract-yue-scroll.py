"""Extract the reviewed bamboo scroll from the existing Destiny prop atlas.
No generated artwork, no network requests, and no source atlas modification.
"""
from pathlib import Path
from PIL import Image, ImageFilter
from collections import deque
import hashlib, io, json, base64

root = Path(__file__).resolve().parents[1]
source = root / "assets/visual/staging/2026-11-28-consolidated/atlases/destiny-study-props.webp"
raw = source.read_bytes()
assert hashlib.sha256(raw).hexdigest() == "b28a15d8eeb1538527774497f8f7162e59a815ad47980e9b59ebab89b57d7cf5"
im = Image.open(io.BytesIO(raw))
assert im.mode == "RGBA" and im.size == (1448,1086)
# Original reviewed sprite region, leaving the neighbouring brush and chime out.
rect = (388, 420, 843, 706)
crop = im.crop(rect)
alpha = crop.getchannel("A")
w,h = crop.size
pixels = alpha.tobytes()
seen = bytearray(w*h)
largest = []
for i,a in enumerate(pixels):
    if a <= 45 or seen[i]:
        continue
    seen[i] = 1
    queue = deque([i])
    component = []
    while queue:
        j = queue.popleft()
        component.append(j)
        x,y = j%w,j//w
        for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if 0 <= nx < w and 0 <= ny < h:
                k = ny*w+nx
                if not seen[k] and pixels[k] > 45:
                    seen[k] = 1
                    queue.append(k)
    if len(component) > len(largest):
        largest = component
assert len(largest) > 20000
mask = bytearray(w*h)
for i in largest:
    mask[i] = 255
mask = Image.frombytes("L",(w,h),bytes(mask)).filter(ImageFilter.MaxFilter(7))
alpha = Image.frombytes("L",(w,h),bytes(a if b else 0 for a,b in zip(pixels,mask.tobytes())))
crop.putalpha(alpha)
box = alpha.getbbox()
assert box and box[2]-box[0] > 300 and box[3]-box[1] > 170
crop = crop.crop(box)
crop.thumbnail((280,180),Image.Resampling.LANCZOS)
canvas = Image.new("RGBA",(crop.width+8,crop.height+8))
canvas.paste(crop,(4,4))
out = root/"assets/visual/painted/master-yue/folded-scroll.webp"
out.parent.mkdir(parents=True,exist_ok=True)
buf = io.BytesIO()
canvas.save(buf,format="WEBP",quality=87,method=6)
data = buf.getvalue()
assert len(data)<60000
assert Image.open(io.BytesIO(data)).mode=="RGBA"
out.write_bytes(data)
print("YUE_SCROLL_ASSET",json.dumps({"width":canvas.width,"height":canvas.height,"bytes":len(data),"sha256":hashlib.sha256(data).hexdigest(),"source_rect":rect}))
# The bounded base64 record allows the coordinator to commit the reviewed asset
# via the existing branch connector; this job itself cannot write repository refs.
print("YUE_SCROLL_BASE64="+base64.b64encode(data).decode("ascii"))
