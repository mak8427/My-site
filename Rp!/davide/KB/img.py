import os
import base64
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

def extract_and_save_images(html_file_path, output_dir):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Read the HTML file
    with open(html_file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')

    # Debug: Print out a part of the parsed HTML
    print(soup.prettify()[:1000])  # Print the first 1000 characters of the parsed HTML

    # Find all img elements
    images = soup.find_all('img')

    # Check if images are found
    if not images:
        print("No images found in the HTML file.")
    else:
        print(f"Found {len(images)} images.")

    # Process each image
    for index, img in enumerate(images):
        src = img.get('src')
        if src and src.startswith('data:image'):
            # Extract the content type and image data
            content_type, image_data = src.split(';base64,')
            # Get the image extension (assuming format "data:image/png;base64")
            extension = content_type.split('/')[-1]

            # Decode the image data
            image_data = base64.b64decode(image_data)
            image = Image.open(BytesIO(image_data))

            # Save the image
            image_filename = f'image_{index + 1}.{extension}'
            image.save(os.path.join(output_dir, image_filename))

            print(f'Saved {image_filename}')

if __name__ == '__main__':
    html_file_path = 'index.html'  # Update this path
    output_dir = 'output_images'                    # Folder to save images

    extract_and_save_images(html_file_path, output_dir)

#%%
