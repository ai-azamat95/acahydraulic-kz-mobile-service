import os
from PIL import Image
from pathlib import Path

def convert_to_webp(directory):
    # Walk through all files in directory
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                webp_path = os.path.splitext(file_path)[0] + '.webp'
                
                try:
                    with Image.open(file_path) as img:
                        # Convert to RGB if necessary (e.g. for PNGs with transparency)
                        if img.mode in ('RGBA', 'LA'):
                            # For RGBA, we want to keep transparency
                            img.save(webp_path, 'WEBP', quality=85)
                        else:
                            img.save(webp_path, 'WEBP', quality=85)
                        print(f"Converted: {file} -> {os.path.basename(webp_path)}")
                except Exception as e:
                    print(f"Error converting {file}: {e}")

if __name__ == "__main__":
    target_dir = "/home/ubuntu/aca_hydraulic/client/public/images"
    print(f"Starting conversion in {target_dir}...")
    convert_to_webp(target_dir)
    print("Conversion complete!")
