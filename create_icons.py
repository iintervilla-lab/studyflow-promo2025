from PIL import Image, ImageDraw, ImageFont
import os

# Créer le dossier icons s'il n'existe pas
os.makedirs('icons', exist_ok=True)

# Créer une icône 192x192
img192 = Image.new('RGB', (192, 192), color=(13, 15, 26))  # #0d0f1a
draw192 = ImageDraw.Draw(img192)

# Dégradé orange/jaune
for i in range(192):
    ratio = i / 192
    r = int(245 * (1 - ratio) + 70 * ratio)
    g = int(166 * (1 - ratio) + 130 * ratio)
    b = int(35 * (1 - ratio) + 140 * ratio)
    draw192.rectangle([(0, i), (192, i+1)], fill=(r, g, b))

# Ajouter du texte/symbole (SF pour StudyFlow)
try:
    font = ImageFont.truetype("arial.ttf", 80)
except:
    font = ImageFont.load_default()

draw192.text((96, 96), "🎓", fill=(255, 255, 255), anchor="mm")

img192.save('icons/icon-192x192.png')
print('✅ Icône 192x192 créée')

# Créer une icône 512x512
img512 = Image.new('RGB', (512, 512), color=(13, 15, 26))
draw512 = ImageDraw.Draw(img512)

# Même dégradé
for i in range(512):
    ratio = i / 512
    r = int(245 * (1 - ratio) + 70 * ratio)
    g = int(166 * (1 - ratio) + 130 * ratio)
    b = int(35 * (1 - ratio) + 140 * ratio)
    draw512.rectangle([(0, i), (512, i+1)], fill=(r, g, b))

# Texte pour 512x512
try:
    font_large = ImageFont.truetype("arial.ttf", 220)
except:
    font_large = ImageFont.load_default()

draw512.text((256, 256), "🎓", fill=(255, 255, 255), anchor="mm")

img512.save('icons/icon-512x512.png')
print('✅ Icône 512x512 créée')

print('📦 Icônes prêtes pour PWABuilder !')
