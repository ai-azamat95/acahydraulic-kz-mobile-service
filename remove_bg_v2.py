from PIL import Image
import os

def remove_black_background(image_path):
    try:
        img = Image.open(image_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # Check if the pixel is black (or very close to black)
            # Increased threshold to catch dark gray artifacts
            if item[0] < 50 and item[1] < 50 and item[2] < 50:
                new_data.append((0, 0, 0, 0))  # Make it transparent
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(image_path, "PNG")
        print(f"Processed: {image_path}")
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
    remove_black_background(os.path.join(icon_dir, icon))
