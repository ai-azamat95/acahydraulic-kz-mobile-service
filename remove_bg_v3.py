from PIL import Image
import os

def remove_background_aggressive(image_path):
    try:
        img = Image.open(image_path).convert("RGBA")
        datas = img.getdata()
        
        # Get corner colors to determine background color
        width, height = img.size
        corners = [
            img.getpixel((0, 0)),
            img.getpixel((width-1, 0)),
            img.getpixel((0, height-1)),
            img.getpixel((width-1, height-1))
        ]
        
        # Assume background is dark if corners are dark
        is_dark_bg = all(sum(c[:3]) < 100 for c in corners)
        
        new_data = []
        for item in datas:
            # If pixel is close to black/dark gray, make it transparent
            # Increased threshold and check all channels
            if item[0] < 40 and item[1] < 40 and item[2] < 40:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append(item)

        img.putdata(new_data)
        
        # Crop to content to remove any edge artifacts
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(image_path, "PNG")
        print(f"Processed aggressively: {image_path}")
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

icon_dir = "/home/ubuntu/aca_hydraulic/client/public/icons"
icons = [
    "excavator.png",
    "bulldozer.png",
    "mining_loader.png",
    "milling.png",
    "hdd.png",
    "piling.png",
    "grader.png",
    "loader.png"
]

for icon in icons:
    remove_background_aggressive(os.path.join(icon_dir, icon))
